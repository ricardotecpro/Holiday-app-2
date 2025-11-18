# Estratégia de Teste Automatizado - Holiday App

Este documento detalha a estratégia de teste adotada para o projeto "Holiday App", um aplicativo React que consome uma API de feriados. O objetivo foi implementar uma abordagem de teste automatizado para garantir a qualidade e a estabilidade de um módulo específico e integrar sua execução ao pipeline de CI/CD (Integração e Entrega Contínua) no GitHub Actions.

---

### 1. Definição da Estratégia de Teste: Teste de Unidade (Unit Testing)

Para este projeto, determinamos que a estratégia mais eficaz e apropriada seria o **Teste de Unidade**.

-   **O que é?** O Teste de Unidade foca em verificar a menor parte testável de uma aplicação, um "módulo" ou "unidade", de forma isolada do restante do sistema. No contexto de um projeto React, uma unidade é frequentemente um componente.

-   **Por que foi escolhida?**
    1.  **Isolamento e Precisão:** Permite testar a lógica de um componente (`HolidayCard.jsx`, no nosso caso) de forma isolada, garantindo que ele se comporte como esperado dadas certas entradas (props), sem a interferência de outros componentes ou serviços externos (como chamadas de API).
    2.  **Velocidade e Eficiência:** Testes de unidade são extremamente rápidos de executar. Essa velocidade é crucial para um pipeline de CI/CD, onde os testes são rodados a cada `push` no repositório.
    3.  **Manutenção:** Como testam a menor unidade lógica, são mais fáceis de escrever, entender e manter quando a aplicação cresce.

O módulo escolhido para a aplicação desta estratégia foi o componente **`HolidayCard.jsx`**, por ser uma peça fundamental da interface, responsável por exibir as informações de um feriado para o usuário.

---

### 2. Elaboração dos Testes: Abordagem Funcional com Uso de Mocks

Ao elaborar os testes para o componente `HolidayCard`, adotamos as seguintes abordagens:

-   **Abordagem Funcional:** Em vez de testar a lógica interna do componente (uma abordagem estrutural), focamos em seu comportamento do ponto de vista do usuário. A pergunta que guiou o teste foi: "Se o componente `HolidayCard` receber os dados de um feriado, ele renderiza corretamente o nome e o nome local desse feriado na tela?". Essa abordagem é a filosofia central da **React Testing Library**, que utilizamos no projeto.

-   **Uso de Mocks (Objetos Simulados):** Para garantir o isolamento do teste, utilizamos um **"mock"**. Criamos um objeto JavaScript que simula a `prop` `holiday` que o componente `HolidayCard` receberia em um cenário real.

    ```javascript
    const mockHoliday = {
      localName: 'Ano Novo',
      name: 'New Year\'s Day',
      date: '2024-01-01T00:00:00.000Z',
      types: ['Public'],
    };
    ```

    O uso do mock nos trouxe dois benefícios principais:
    1.  **Previsibilidade:** O teste sempre roda com os mesmos dados, tornando o resultado consistente e previsível.
    2.  **Independência:** O teste não depende de uma chamada de API real, o que o torna mais rápido e imune a falhas de rede ou instabilidades do serviço externo.

---

### 3. Análise do Código de Teste

O teste implementado em `src/components/HolidayCard.test.js` segue o padrão "Arrange-Act-Assert" (Organizar-Agir-Afirmar):

```javascript
test('renders holiday names correctly', () => {
  // 1. Arrange (Organizar)
  // Renderiza o componente em um ambiente de teste virtual,
  // passando o objeto mock como sua propriedade.
  render(<HolidayCard holiday={mockHoliday} total={1} index={1} />);

  // 2. Act (Agir)
  // Procura na tela pelos elementos que contêm os textos esperados.
  // Esta ação simula um usuário procurando pelas informações.
  const localNameElement = screen.getByText(/Ano Novo/i);
  const nameElement = screen.getByText(/New Year's Day/i);

  // 3. Assert (Afirmar)
  // Verifica se os elementos procurados foram de fato encontrados na tela.
  // Se não forem encontrados, o teste falha.
  expect(localNameElement).toBeInTheDocument();
  expect(nameElement).toBeInTheDocument();
});
```

---

### 4. Inclusão da Execução dos Testes no Pipeline (Esteira)

A etapa final foi garantir que esses testes fossem executados automaticamente a cada alteração no código, antes do deploy. Para isso, modificamos o arquivo de workflow do GitHub Actions (`.github/workflows/deploy.yml`).

Adicionamos uma nova tarefa (`Run tests`) ao pipeline, que executa o comando `npm test`:

```yaml
      - name: Run tests
        working-directory: ./front-end
        run: npm test
```

Esta tarefa atua como um **portão de qualidade (quality gate)**. Ela foi posicionada estrategicamente **antes** das tarefas de `build` e `deploy`. Se qualquer um dos testes falhar, o comando `npm test` falhará, o que interrompe a execução do pipeline, impedindo que código com defeito seja publicado.

A execução bem-sucedida desta etapa no pipeline do GitHub Actions valida a correção da nossa estratégia de teste e sua integração ao processo de desenvolvimento.

---

### 5. Links de Referência

-   **Repositório do Projeto:** [https://github.com/ricardotecpro/Holiday-app-2](https://github.com/ricardotecpro/Holiday-app-2)
-   **Pipeline de CI/CD (GitHub Actions):** [https://github.com/ricardotecpro/Holiday-app-2/actions](https://github.com/ricardotecpro/Holiday-app-2/actions)
