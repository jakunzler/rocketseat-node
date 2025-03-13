# Configuurações básicas para projeto Node

## 1. Iniciar o projeto

Primeiro, crie e entre na pasta do seu projeto e inicie o **npm**:

```bash
mkdir meu-projeto
cd meu-projeto
npm init -y
```

Isso criará um arquivo `package.json` básico com as informações do projeto.

---

## 2. Instalar dependências do TypeScript

1. **TypeScript**: Ferramenta para compilar/validar código TS.
2. **ts-node**: Para rodar os arquivos TypeScript diretamente (útil em ambiente de desenvolvimento).
3. **@types/node**: Tipos para o Node.js.

```bash
npm install --save-dev typescript ts-node @types/node
```

---

## 3. Configurar o `tsconfig.json`

Crie o arquivo de configuração do TypeScript. Você pode gerar um esqueleto usando:

```bash
npx tsc --init
```

Isso gerará um `tsconfig.json`. Abra esse arquivo e ajuste as opções que julgar necessárias. Um exemplo básico:

```jsonc
{
  "compilerOptions": {
    // Diretório de saída para arquivos compilados
    "outDir": "dist",
    // Diretório raiz do código-fonte TS
    "rootDir": "src",

    // Target JS que será gerado
    "target": "ES2020",
    // Como os módulos serão resolvidos
    "module": "CommonJS",

    // Emitir arquivos .d.ts (geralmente em libs públicas)
    "declaration": false,

    // Ativar checagens mais estritas
    "strict": true,

    // Permitir import de módulos sem extensões
    "moduleResolution": "node",

    // Não gerar comentários no JS compilado
    "removeComments": true,

    // Permitir Decorators, etc
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/*.test.ts"],
}
```

Com isso, o TypeScript vai procurar os arquivos `.ts` dentro de `src/` e gerar os compilados em `dist/`.

---

## 4. Configurar scripts no `package.json`

Para facilitar, vamos adicionar scripts úteis no `package.json`. Exemplo:

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write ."
  }
  // ...
}
```

- **build**: Compila o projeto para a pasta `dist/`.
- **start**: Executa o JS compilado (útil em produção).
- **dev**: Roda o código diretamente via `ts-node`, sem precisar compilar para `dist/`.
- **lint** e **lint:fix**: Executa o ESLint e, opcionalmente, corrige problemas formatáveis.
- **format**: Aplica o Prettier em todo o projeto.

> Você pode adaptar paths conforme a estrutura do seu projeto.

---

## 5. Instalar e Configurar ESLint + @typescript-eslint

1. **ESLint**: Ferramenta de lint principal.
2. **@typescript-eslint/parser** e **@typescript-eslint/eslint-plugin**: Integração do TypeScript com o ESLint.

Instale:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Em seguida, inicialize o ESLint (vai criar um arquivo de config interativo ou você pode criar manualmente):

```bash
npx eslint --init
```

> Se preferir criar manualmente, você pode gerar um `.eslintrc.json` ou `.eslintrc.js` semelhante ao exemplo abaixo.

### Exemplo de `.eslintrc.json` básico

```jsonc
{
  "env": {
    "es2021": true,
    "node": true,
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json",
  },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    // Aqui você pode sobrescrever regras específicas
    // Exemplo: não permitir "any" explícito
    "@typescript-eslint/no-explicit-any": "error",
  },
}
```

Isso diz ao ESLint:

- Usar o parser do TypeScript (`@typescript-eslint/parser`).
- Aplicar as regras recomendadas tanto do ESLint quanto do plugin TS (`@typescript-eslint/recommended`).
- Utilizar o `tsconfig.json` como base de análise.

Crie também um arquivo `.eslintignore` para ignorar pastas geradas durante build e outras que não deseja validar:

```.ignore
dist
node_modules
```

---

## 6. Instalar e Configurar o Prettier

Para formatação de código:

```bash
npm install --save-dev prettier
```

Crie um arquivo de configuração `.prettierrc` (pode ser JSON, YAML, etc.). Exemplo:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

Esses são apenas valores comuns. Ajuste conforme preferir.

> **Dica**: Para prevenir conflitos entre ESLint e Prettier (que também formata código), existe o plugin `eslint-config-prettier`:

```bash
npm install --save-dev eslint-config-prettier
```

Então, em seu `.eslintrc.json`, adicione `eslint-config-prettier` como o último no array de `extends`:

```jsonc
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
}
```

Isso faz com que o ESLint ignore regras de formatação onde o Prettier estiver atuando, evitando conflitos de estilo.

Também crie `.prettierignore` para ignorar arquivos/pastas em que não quer rodar o Prettier:

```.ignore
dist
node_modules
```

---

## 7. Estrutura de pastas

Organize seu projeto mais ou menos assim:

```md
meu-projeto/
  ├─ src/
  │   └─ index.ts
  ├─ dist/        # Gerado pelo build do TS (após rodar "npm run build")
  ├─ .eslintrc.json
  ├─ .eslintignore
  ├─ .prettierrc
  ├─ .prettierignore
  ├─ package.json
  └─ tsconfig.json
```

No arquivo `src/index.ts`, coloque algo de exemplo:

```ts
function hello(name: string): string {
  return `Olá, ${name}!`
}

console.log(hello('Mundo'))
```

---

## 8. Testando tudo

1. **Rodar o ESLint**:

```bash
npm run lint
```

2. **Formatar com Prettier**:

```bash
npm run format
```

3. **Compilar o projeto**:

```bash
npm run build
```

4. **Executar o projeto**:

- Modo compilado:

  ```bash
  npm run start
  ```

- Modo desenvolvimento (sem compilar para `dist`):

  ```bash
  npm run dev
  ```

Se tudo estiver certo, você verá o console log do `index.ts` (“Olá, Mundo!”) e o código formatado e lintado corretamente.

---

## Conclusão

Este é um **setup completo** de um projeto Node.js com **TypeScript**, **ESLint** e **Prettier** funcionando em harmonia. Essa estrutura inicial ajuda a manter alta qualidade de código e produtividade desde o início do desenvolvimento.

**Boas práticas** adicionais:

- Sempre criar **scripts** no `package.json` para simplificar fluxos de trabalho (lint, build, test, etc.).
- **Integração ao seu editor/IDE** (por exemplo, VSCode) para rodar ESLint e Prettier automaticamente ao salvar, facilitando ainda mais o processo de desenvolvimento.
- Mantendo dependências atualizadas e revisando regras de lint/format conforme o projeto cresce, você garante um código bem estruturado a longo prazo.
