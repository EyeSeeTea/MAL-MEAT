import { ImportInput } from "./ImportInput";
import { D2Api } from "$/types/d2-api";

export function buildConstantCode(constantPrefix: string, score: number): string {
    return `${constantPrefix}_${score}`;
}

export function buildShortName(constantCode: string, score: number): string {
    return `${constantCode.split("_").join(" - ")} (${score})`;
}

export type Constant = {
    name: string;
    shortName: string;
    code: string;
    description: string;
    value: 0 | 1;
    // Not typing sharingSettings because we are just passing it through to DHIS
    // If something is wrong, import should reject it
    sharing?: object;
};

export function buildConstants(
    importInput: ImportInput[],
    sharing: object | undefined
): Constant[] {
    const constantsToCreate: Constant[] = [];
    for (const input of importInput) {
        for (const element of input.elements) {
            for (const option of element.options) {
                const code = buildConstantCode(element.constantCode, option.score);
                const shortName = buildShortName(element.constantCode, option.score);
                constantsToCreate.push({
                    code: code,
                    name: shortName,
                    shortName: shortName,
                    description: option.definition,
                    value: option.nonConformity.toUpperCase() === "YES" ? 1 : 0,
                    ...(sharing ? { sharing: sharing } : {}),
                });
            }
        }
    }
    return constantsToCreate;
}

export async function importConstants(api: D2Api, constants: Constant[]): Promise<Constant[]> {
    if (constants.length === 0) {
        return [];
    }

    // need to pass the constants with the ids of existing ones to update them
    // otherwise the import fails with "Code already exists"
    const constantCodes = constants.map(c => c.code);
    const existingConstantsResponse = await api.models.constants
        .get({
            fields: { id: true, code: true },
            filter: { code: { in: constantCodes } },
            paging: false,
        })
        .getData();
    const existingConstantsMap = new Map(
        existingConstantsResponse.objects.map(c => [c.code, c.id])
    );
    const constantsWithIds = constants.map(constant => {
        const existingId = existingConstantsMap.get(constant.code);
        if (existingId) {
            return { ...constant, id: existingId };
        }
        return constant;
    });

    const result = await api.metadata
        .post(
            {
                constants: constantsWithIds,
            },
            {
                importStrategy: "CREATE_AND_UPDATE",
            }
        )
        .getData();

    if (result.status !== "OK") {
        throw new Error(`Failed to create/update constants: ${JSON.stringify(result)}`);
    }

    return constants;
}
