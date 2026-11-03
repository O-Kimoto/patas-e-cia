// Desenvolvimento: front no "ng serve" (porta 4200) e API rodando separada na porta 3000 - [Otávio Michels]
export const environment = {
  production: false,
  baseUrl: 'http://localhost:3000/api',
  docsUrl: 'http://localhost:3000/api-docs',
  viaCepUrl: 'https://viacep.com.br/ws',
  ibgeUrl: 'https://servicodados.ibge.gov.br/api/v1/localidades'
};
