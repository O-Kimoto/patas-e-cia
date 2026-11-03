// Campos do pet; tutor_nome vem do JOIN feito na API - [Otávio Michels]
export interface Pet {
    id?: number;
    nome?: string;
    especie?: string;
    raca?: string;
    sexo?: 'M' | 'F';
    tutor_id?: number;
    tutor_nome?: string;
}
