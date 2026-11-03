// Formata o telefone enquanto digita: (81) 3333-4444 ou (81) 99999-1234 - [Otávio Michels]
export function formatarTelefone(valor: string): string {
    const d = (valor || '').replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const doisDigitos = (n: number) => String(n).padStart(2, '0');

// Converte o Date do calendário para o texto que a API guarda (AAAA-MM-DDTHH:MM, horário local) - [Otávio Michels]
export function dataHoraParaApi(data: Date): string {
    return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}` +
        `T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

// Faz o caminho inverso: texto da API para Date local, para preencher o calendário - [Otávio Michels]
export function dataHoraDaApi(texto: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(texto || '');
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
}

// Data de hoje no fuso do navegador, no formato AAAA-MM-DD - [Otávio Michels]
export function dataParaApi(data: Date = new Date()): string {
    return dataHoraParaApi(data).slice(0, 10);
}
