import { command, run, string, option, flag, boolean, positional } from "cmd-ts";
import path from "path";
import { D2Api } from "$/types/d2-api";
import { parseExcelFile } from "./import-constants/parseExcelFile";
import { buildConstants, importConstants } from "./import-constants/constants";
import { getAndUpdateDataElements, importDataElements } from "./import-constants/dataElements";

// This script is based in the import script from https://github.com/EyeSeeTea/extra-texts-for-options-capture-plugin/

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Create the constants required by MAL-MEAT from Excel file",
        args: {
            inputFile: positional({
                type: string,
                displayName: "input-file",
                description: "Path to the input Excel file",
            }),
            url: option({
                type: string,
                long: "dhis2-url",
                short: "u",
                description: "DHIS2 base URL. Example: http://localhost:8080",
                env: "DHIS2_URL",
            }),
            auth: option({
                type: string,
                long: "dhis2-auth",
                short: "a",
                description: "DHIS2 Auth. USERNAME:PASSWORD",
                env: "DHIS2_AUTH",
            }),
            push: flag({
                type: boolean,
                long: "push",
                short: "p",
                description:
                    "Actually push changes to DHIS2. Without this flag, it only simulates the process.",
                defaultValue: () => false,
            }),
            outputFile: option({
                type: string,
                long: "output",
                short: "o",
                description: "Output for generated metadata file, ready to be imported into DHIS2.",
                defaultValue: () => "",
            }),
            sharingSettingsFile: option({
                type: string,
                long: "sharing",
                short: "s",
                description:
                    "Path to a JSON file containing sharing settings to apply to created constants.",
                defaultValue: () => "",
            }),
        },
        handler: async args => {
            const [username = "", password = ""] = (args.auth || "").split(":");
            const auth = { username, password };
            const api = new D2Api({ baseUrl: args.url, auth: auth, backend: "xhr" });
            const info = await api.system.info.getData();
            console.debug(`✅ Connected to DHIS2: ${info.contextPath} (v${info.version})`);
            const excelData = await parseExcelFile(args.inputFile);
            const sharingSettings = await getSharingSettingsFromFile(args.sharingSettingsFile);
            const constants = buildConstants(excelData, sharingSettings);
            console.debug(`🔧 Built ${constants.length} constants`);
            if (args.outputFile) {
                await saveJsonToFile({ constants }, args.outputFile);
            }
            if (args.push) {
                console.debug(`⬆️  Importing ${constants.length} constants to DHIS2...`);
                await importConstants(api, constants);
                console.debug("   ✓ Constants imported successfully");
            }
            const dataElements = await getAndUpdateDataElements(api, excelData);
            console.debug(`🔧 Built ${dataElements.length} data elements with constant codes`);
            if (args.outputFile) {
                await saveJsonToFile({ constants, dataElements }, args.outputFile);
            }
            if (args.push) {
                console.debug(`⬆️  Importing ${dataElements.length} dataElements to DHIS2...`);
                await importDataElements(api, dataElements);
                console.debug("   ✓ DataElements imported successfully");
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

async function saveJsonToFile(data: any, outputFilePath: string) {
    const fs = await import("fs/promises");
    const path = await import("path");
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.debug(`💾 Saved file: ${outputFilePath}`);
}

async function parseJsonObjectFromFile(filePath: string): Promise<object> {
    const fs = await import("fs/promises");
    const data = await fs.readFile(filePath, "utf-8");
    const result = JSON.parse(data);
    if (typeof result !== "object" || result === null) {
        throw new Error(`JSON is not an object: ${filePath}`);
    }
    return result;
}

async function getSharingSettingsFromFile(filePath: string): Promise<object | undefined> {
    if (!filePath) {
        console.debug(
            "⚠️  No sharing settings file provided. Constants will have default sharing settings."
        );
        return undefined;
    }
    try {
        const sharingSettings = await parseJsonObjectFromFile(filePath);
        return sharingSettings;
    } catch (error) {
        console.debug(
            `❌ Error reading sharing settings file: ${
                error instanceof Error ? error.message : String(error)
            }`
        );
        throw error;
    }
}

main();
