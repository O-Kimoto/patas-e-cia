// Produção: o Express serve o front e a API no mesmo endereço, então os caminhos são relativos - [Otávio Michels]
export const environment = {
  production: true,
  baseUrl: '/api',
  docsUrl: '/api-docs',
  viaCepUrl: 'https://viacep.com.br/ws',
  ibgeUrl: 'https://servicodados.ibge.gov.br/api/v1/localidades'
};
