import { D2Api } from "$/types/d2-api";
import { ImportInput } from "./ImportInput";

export async function getAndUpdateDataElements(api: D2Api, importData: ImportInput[]) {
    const idToCodeMap = new Map<string, string>();
    for (const element of importData) {
        for (const question of element.elements) {
            idToCodeMap.set(question.id, question.constantCode);
        }
    }
    const dataElementsResponse = await api.models.dataElements
        .get({
            fields: { $all: true },
            paging: false,
            filter: { id: { in: Array.from(idToCodeMap.keys()) } },
        })
        .getData();
    const dataElements = dataElementsResponse.objects;

    const dataElementsNotFound = Array.from(idToCodeMap.keys()).filter(
        id => !dataElements.some(de => de.id === id)
    );
    if (dataElementsNotFound.length > 0) {
        console.warn(
            `⚠️  Warning: The following data element IDs were not found in DHIS2: ${dataElementsNotFound.join(
                ", "
            )}`
        );
    }
    return dataElements.map(de => {
        const constantCode = idToCodeMap.get(de.id);
        if (!constantCode) {
            console.debug(`⚠️ No constant code found in import data for data element ID: ${de.id}`);
            return de;
        }
        return {
            ...de,
            code: constantCode,
        };
    });
}

export async function importDataElements(api: D2Api, dataElements: any[]): Promise<any[]> {
    if (dataElements.length === 0) {
        return [];
    }

    const result = await api.metadata
        .post(
            {
                dataElements: dataElements,
            },
            {
                importStrategy: "CREATE_AND_UPDATE",
            }
        )
        .getData();

    if (result.status !== "OK") {
        throw new Error(`Failed to create/update dataElements: ${JSON.stringify(result)}`);
    }

    return dataElements;
}
