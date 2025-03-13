# Implementando testes automatizados no Node

1. Utilize TypeScript para escrever o código-fonte e testes.
2. Tenha qualidade de código garantida via ESLint e Prettier.
3. Possua uma configuração de testes simples e eficaz.

Neste exemplo, usaremos o **Jest**, um dos frameworks de teste mais populares para Node.js. A **integração com TypeScript** ocorrerá através do pacote **ts-jest**.

---

## 1. Instale as dependências de teste

1. **Jest**
2. **@types/jest**: Tipos TypeScript para o Jest.
3. **ts-jest**: Faz a ponte entre o Jest e o compilador TypeScript para que possamos escrever testes em TS sem precisar compilar previamente.

```bash
npm install --save-dev jest @types/jest ts-jest
```

---

## 2. Inicializar configuração do Jest

Após instalar as bibliotecas acima, podemos gerar um arquivo de configuração:

```bash
npx ts-jest config:init
```

Isso criará o arquivo `jest.config.js` (ou `jest.config.ts`) na raiz do projeto, com definições básicas como:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```

Se preferir, você pode criar manualmente o arquivo de configuração para customizar mais opções. Exemplos de customização:

- **Cobertura de testes** (`collectCoverage`, `coverageDirectory`)
- **Mapa de paths** (se usar paths customizados no tsconfig)
- **Glob patterns** para localizar testes (`testMatch`, `testRegex`)

---

## 3. Definir o script de teste no `package.json`

Abra seu `package.json` e adicione (ou atualize) o script de teste:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write ."
  }
}
```

- **test**: Roda os testes uma única vez.
- **test:watch**: Roda os testes em modo de observação (útil em desenvolvimento para disparar testes sempre que há uma mudança).

---

## 4. Estrutura de pastas para testes

Existem diversos padrões. Você pode:

- Colocar os testes na mesma pasta do código, usando `__tests__` ou `*.test.ts`.
- Separar em uma pasta `tests/` na raiz do projeto.

Um padrão comum para Jest é criar arquivos `nomeDoArquivo.test.ts` próximos ao arquivo que está sendo testado, ou em uma pasta `__tests__`.

Exemplo de estrutura:

```md
meu-projeto/
  ├─ src/
  │   ├─ index.ts
  │   ├─ utils/
  │   │   ├─ math.ts
  │   │   └─ __tests__/
  │   │       └─ math.test.ts
  │   └─ ...
  ├─ dist/
  ├─ tests/              # opcional, se quiser centralizar todos os testes
  ├─ jest.config.js
  ├─ tsconfig.json
  ├─ package.json
  ├─ .eslintrc.json
  └─ .prettierrc
```

---

## 5. Criar um teste de exemplo

Suponha que você tenha um arquivo `src/utils/math.ts` com uma função:

```ts
export function soma(a: number, b: number): number {
  return a + b
}
```

Então crie um arquivo de teste `src/utils/__tests__/math.test.ts`:

```ts
import { soma } from '../math'

describe('Função soma', () => {
  it('deve retornar a soma de dois números', () => {
    expect(soma(2, 3)).toBe(5)
  })
})
```

Agora, rode:

```bash
npm test
```

Você deve ver a saída do Jest indicando que encontrou e passou no teste.

---

## 6. Integração com ESLint e Prettier

Se você quer que ESLint e Prettier também inspecionem seus arquivos de teste:

1. **Extensões**: Já adicionamos a extensão `.ts` no script ESLint (`"--ext .ts"`).
2. **.eslintignore** e `.prettierignore**: Se você estiver ignorando alguma pasta, certifique-se de**não\*\* ignorar a pasta de testes.

Adicionalmente, se desejar regras específicas para arquivos de teste, pode configurar overrides no `.eslintrc.json`:

```jsonc
{
  "overrides": [
    {
      "files": ["**/__tests__/**/*", "**/*.test.ts"],
      "env": {
        "jest": true, // Permite uso de describe, it, expect etc.
      },
      "rules": {
        // Pode desativar ou customizar regras específicas para testes
      },
    },
  ],
}
```

Isso garante que, em arquivos de teste, variáveis globais do Jest (como `describe`, `it`, `expect`) sejam reconhecidas.

---

## 7. Relatórios de Cobertura (Coverage)

Para gerar relatórios de cobertura, basta habilitar a opção `collectCoverage` no arquivo `jest.config.js`:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
}
```

Assim, ao rodar `npm test`, o Jest também exibirá os índices de cobertura. Os arquivos de relatório serão gerados na pasta `coverage/`.

Se preferir rodar cobertura só em determinados cenários, use:

```bash
jest --coverage
```

---

## 8. Resumo do Fluxo de Desenvolvimento

1. **Escreva seu código** em TypeScript na pasta `src/`.
2. **Crie arquivos de teste** ou pastas `__tests__` correspondentes.
3. **Formate** (`npm run format`) e **lint** (`npm run lint`) seu projeto para manter a qualidade de código.
4. **Rode os testes** (`npm test`). Caso desenvolva TDD, use `npm run test:watch` para feedback imediato.
5. **Compile** (`npm run build`) e **inicie** (`npm run start`) em produção, se necessário.

---

## Conclusão

Com esses passos, você terá:

- **TypeScript**: Desenvolvimento tipado.
- **Prettier**: Formatação consistente do código.
- **ESLint**: Análise de padrões e boas práticas.
- **Jest (ts-jest)**: Testes unitários e/ou de integração em TypeScript.
