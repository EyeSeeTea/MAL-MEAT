/* eslint-disable no-console */
import { command, run, string, option } from "cmd-ts";
import path from "path";
import fs from "fs";
import { D2Api } from "$/types/d2-api";
import readline from "readline";

interface ProgramRuleVariable {
    id: string;
    name: string;
    translations: unknown[];
    program: { id: string };
    dataElement: { id: string };
    useCodeForOptionSet: boolean;
    programRuleVariableSourceType: "DATAELEMENT_CURRENT_EVENT";
    valueType: string;
}

interface ProgramRuleAction {
    id: string;
    programRuleActionType: "SETMANDATORYFIELD";
    dataElement: { id: string };
    programRule: { id: string };
}

interface ProgramRule {
    id: string;
    name: string;
    description: string;
    condition: string;
    program: { id: string };
    programRuleActions: { id: string }[];
}

interface Metadata {
    programRuleVariables: ProgramRuleVariable[];
    programRuleActions: ProgramRuleAction[];
    programRules: ProgramRule[];
}

async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

async function selectFromList<T extends { id: string; displayName?: string; name?: string }>(
    rl: readline.Interface,
    items: T[],
    itemType: string
): Promise<T> {
    console.log(`\nAvailable ${itemType}:`);
    items.forEach((item, index) => {
        const name = item.displayName || item.name || item.id;
        console.log(`${index + 1}. ${name} (${item.id})`);
    });

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const answer = await askQuestion(rl, `\nSelect ${itemType} (enter number): `);
        const index = parseInt(answer) - 1;

        if (index >= 0 && index < items.length) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return items[index]!;
        }
        console.log("Invalid selection. Please try again.");
    }
}

function generateId(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = chars[Math.floor(Math.random() * 52)]; // First char must be a letter
    for (let i = 1; i < 11; i++) {
        // @ts-ignore
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result ?? "";
}

function sanitizeVariableName(name: string): string {
    return name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "")
        .replace(/_+/g, "_")
        .substring(0, 60)
        .replace(/_$/, "");
}

function getAllPrograms(api: D2Api) {
    return api.models.programs
        .get({
            fields: {
                id: true,
                displayName: true,
                name: true,
                programStages: {
                    id: true,
                    displayName: true,
                    name: true,
                },
            },
            paging: false,
        })
        .getData();
}

function getProgramStageById(api: D2Api, programStageId: string) {
    return api.models.programStages
        .get({
            fields: {
                id: true,
                displayName: true,
                name: true,
                programStageSections: {
                    id: true,
                    displayName: true,
                    name: true,
                    dataElements: {
                        id: true,
                        displayName: true,
                        name: true,
                    },
                },
            },
            filter: { id: { eq: programStageId } },
        })
        .getData();
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Create program rules to make data elements in a section required",
        args: {
            url: option({
                type: string,
                long: "dhis2-url",
                short: "u",
                description: "DHIS2 base URL. Example: http://localhost:8080",
            }),
            auth: option({
                type: string,
                long: "dhis2-auth",
                short: "a",
                description: "DHIS2 Auth. USERNAME:PASSWORD",
            }),
            output: option({
                type: string,
                long: "output",
                short: "o",
                description: "Output JSON file path. Default: program-rules-metadata.json",
                defaultValue: () => "program-rules-metadata.json",
            }),
        },
        handler: async args => {
            const [username = "", password = ""] = (args.auth || "").split(":");
            const auth = { username, password };
            const api = new D2Api({ baseUrl: args.url, auth: auth, backend: "xhr" });

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            try {
                console.log("Fetching programs...");
                const programsResponse = await getAllPrograms(api);

                if (programsResponse.objects.length === 0) {
                    console.log("No programs found.");
                    rl.close();
                    return;
                }

                const selectedProgram = await selectFromList(
                    rl,
                    programsResponse.objects,
                    "program"
                );
                console.log(
                    `\nSelected program: ${selectedProgram.displayName || selectedProgram.name}`
                );

                if (!selectedProgram.programStages || selectedProgram.programStages.length === 0) {
                    console.log("No program stages found for this program.");
                    rl.close();
                    return;
                }

                const selectedStage = await selectFromList(
                    rl,
                    selectedProgram.programStages,
                    "program stage"
                );
                console.log(`Selected stage: ${selectedStage.displayName || selectedStage.name}`);

                console.log("\nFetching program stage sections...");
                const stageDetailsResponse = await getProgramStageById(api, selectedStage.id);
                const stageDetails = stageDetailsResponse.objects[0];

                if (
                    !stageDetails ||
                    !stageDetails.programStageSections ||
                    stageDetails.programStageSections.length === 0
                ) {
                    console.log("No program stage sections found for this stage.");
                    rl.close();
                    return;
                }

                const selectedSection = await selectFromList(
                    rl,
                    stageDetails.programStageSections,
                    "program stage section"
                );
                console.log(
                    `Selected section: ${selectedSection.displayName || selectedSection.name}`
                );

                if (!selectedSection.dataElements || selectedSection.dataElements.length === 0) {
                    console.log("No data elements found in this section.");
                    rl.close();
                    return;
                }

                console.log(
                    `\nFound ${selectedSection.dataElements.length} data elements in the section:`
                );
                selectedSection.dataElements.forEach(de => {
                    console.log(`  - ${de.displayName || de.name} (${de.id})`);
                });

                const metadata: Metadata = {
                    programRuleVariables: [],
                    programRuleActions: [],
                    programRules: [],
                };

                // Create program rule variables for each data element
                const variableConditions: string[] = [];

                selectedSection.dataElements.forEach(dataElement => {
                    const variableId = generateId();
                    const rawName = dataElement.name || dataElement.id;
                    const variableName = sanitizeVariableName(rawName);

                    const programRuleVariable: ProgramRuleVariable = {
                        id: variableId,
                        name: variableName,
                        translations: [],
                        program: { id: selectedProgram.id },
                        dataElement: { id: dataElement.id },
                        useCodeForOptionSet: true,
                        programRuleVariableSourceType: "DATAELEMENT_CURRENT_EVENT",
                        valueType: "TEXT",
                    };

                    metadata.programRuleVariables.push(programRuleVariable);

                    // Add to condition: check if variable is not null/empty
                    variableConditions.push(`!d2:hasValue(#{${variableName}})`);
                });

                // Create the program rule with condition "if any of the variables is set"
                // Logic: If NOT all variables are empty, then the section has started being filled
                // Condition: NOT (all variables are empty) = at least one variable has value
                const condition = `!(${variableConditions.join(" && ")})`;

                const programRuleId = generateId();

                const programRuleActions: ProgramRuleAction[] = selectedSection.dataElements.map(
                    dataElement => ({
                        id: generateId(),
                        programRuleActionType: "SETMANDATORYFIELD",
                        dataElement: { id: dataElement.id },
                        programRule: { id: programRuleId },
                    })
                );

                metadata.programRuleActions.push(...programRuleActions);

                const sectionName = selectedSection.displayName || selectedSection.name;
                const programRule: ProgramRule = {
                    id: programRuleId,
                    name: `Make ${sectionName} required`,
                    description: `Make all fields in ${sectionName} required when at least one question is answered`,
                    condition: condition,
                    program: { id: selectedProgram.id },
                    programRuleActions: programRuleActions.map(action => ({ id: action.id })),
                };

                metadata.programRules.push(programRule);

                const outputPath = path.resolve(args.output);
                fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), "utf-8");

                console.log("\n✓ Metadata generated successfully!");
                console.log(`✓ Output file: ${outputPath}`);
                console.log(`\nGenerated:`);
                console.log(`  - ${metadata.programRuleVariables.length} program rule variables`);
                console.log(`  - 1 program rule with ${programRuleActions.length} actions`);
                console.log(`\nCondition: ${condition}`);
                console.log(
                    `\nTo import this metadata into DHIS2, use the Import/Export app or the API:`
                );
                console.log(`  POST ${args.url}/api/metadata`);
                console.log(`  Content-Type: application/json`);
                console.log(`  Body: @${outputPath}`);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                rl.close();
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
