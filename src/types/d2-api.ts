import { D2Api } from "@eyeseetea/d2-api/2.41";
import { getMockApiFromClass } from "@eyeseetea/d2-api";

export { CancelableResponse } from "@eyeseetea/d2-api";
export { D2Api } from "@eyeseetea/d2-api/2.41";
export type {
    MetadataPick,
    SelectedPick,
    D2ProgramSchema,
    D2ConstantSchema,
} from "@eyeseetea/d2-api/2.41";
export const getMockApi = getMockApiFromClass(D2Api);
