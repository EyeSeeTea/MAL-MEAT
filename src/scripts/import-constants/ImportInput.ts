export interface ImportInput {
    programId: string;
    elements: ImportElement[];
}

export interface ImportElement {
    constantCode: string;
    options: ImportElementOption[];
}

export interface ImportElementOption {
    definition: string;
    score: number;
    nonConformity: string;
}
