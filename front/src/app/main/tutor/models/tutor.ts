// Campos do tutor, iguais aos da tabela "tutores" da API - [Otávio Michels]
export interface Tutor {
    id?: number;
    nome?: string;
    email?: string;
    telefone?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    total_pets?: number;
}
