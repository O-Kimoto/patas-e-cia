export type StatusAgendamento = 'Agendado' | 'Confirmado' | 'Concluído' | 'Cancelado';

// Agendamento liga tutor, pet e serviço; os campos *_nome vêm do JOIN feito na API - [Otávio Michels]
export interface Agendamento {
    id?: number;
    tutor_id?: number;
    pet_id?: number;
    servico_id?: number;
    data_hora?: string;
    status?: StatusAgendamento;
    observacoes?: string;
    tutor_nome?: string;
    pet_nome?: string;
    pet_especie?: string;
    servico_nome?: string;
    servico_preco?: number;
}
