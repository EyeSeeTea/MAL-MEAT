export interface ImportInput {
    programId: string;
    elements: ImportElement[];
}

export interface ImportElement {
    id: string;
    constantCode: string;
    options: ImportElementOption[];
}

export interface ImportElementOption {
    definition: string;
    score: number;
    nonConformity: string;
}
