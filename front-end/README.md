# Holiday App

O **Holiday App** é uma aplicação construída com **React.js** que permite pesquisar feriados públicos em diferentes países, com filtros de ano e país. Ela utiliza a API pública [Date Nager](https://date.nager.at/) para obter os dados de feriados.

## Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para construir a interface de usuário.
- **Material-UI**: Biblioteca de componentes de interface para React.
- **Styled-components**: Biblioteca para estilização de componentes.
- **Day.js**: Biblioteca para manipulação de datas.

## Funcionalidades

- Visualização de feriados a partir de uma lista.
- Filtros de pesquisa:
  - Filtro por **mês** (número de 1 a 12).
  - Filtro por **tipo de feriado** (como Público, Bancário, Escolar, Opcional).
- Exibição de uma lista de feriados com base nos filtros selecionados.

## Pré-requisitos

Antes de começar, verifique se você tem o **Node.js** e **npm** instalados. Você pode baixar e instalar o Node.js [aqui](https://nodejs.org/).

## Instruções de Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Alessandro-Marcondes/Holiday-app
   cd holiday-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   Isso irá iniciar a aplicação em `http://localhost:3000` no seu navegador.


## APIs Utilizada

### [Date Nager API](https://date.nager.at/)
### [Flags API](https://flagcdn.com) 

Este aplicativo utiliza a API **Date Nager** para buscar feriados públicos de diversos países, como também utiliza a API **Flags API** para exibir as bandeiras dos países. A aplicação permite:

1. Selecionar o **país** com sua respectiva **bandeira**.
2. Escolher o **ano** para o qual os feriados serão consultados.
3. A API retorna os feriados públicos para o país e ano selecionados.


### Endpoints da API:


- **Feriados Públicos:**

   Endpoint: `https://date.nager.at/api/v3/PublicHolidays/{ano}/{país}`  
   Substitua `{ano}` pelo ano e `{país}` pelo código do país (exemplo: `BR` para Brasil).

-   **Bandeira dos países:**

    A API **Flags API** retorna bandeiras dos países que são carregadas dinamicamente utilizando o padrão de URL:  
    `https://flagcdn.com/w40/{countryCode}.png`

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Roda o aplicativo no modo de desenvolvimento.  
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador.

A página será recarregada sempre que você fizer alterações.  


### `npm run build`

Cria o aplicativo para produção na pasta `build`.  
Isso corretamente empacota o React no modo de produção e otimiza o build para o melhor desempenho.

**Este projeto é implantado automaticamente com GitHub Actions.**
