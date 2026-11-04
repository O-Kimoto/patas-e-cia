// Usuário que entra no sistema; a senha só vai para a API no cadastro ou na troca, nunca volta - [Otávio Michels]
export interface Usuario {
    id?: number;
    nome?: string;
    username?: string;
    password?: string;
    criado_em?: string;
}
