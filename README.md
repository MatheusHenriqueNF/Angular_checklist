# Checklist de QA — Angular + TypeScript

Aplicação didática para organizar a validação de campanhas de comunicação antes de sua publicação. O projeto transforma uma lista de conferências em um formulário interativo que calcula o progresso e gera um **relatório textual de pendências**.

O tema foi escolhido por sua relação com processos de QA em CRM, mas este repositório é **um projeto educacional independente**, sem dados de clientes, sem conexão com Salesforce e sem representar uma ferramenta corporativa oficial.

## Objetivo do projeto

Praticar `ReactiveFormsModule`, `FormBuilder`, validadores, estado com Signals e renderização condicional, aplicando regras simples de um fluxo de negócio.

## Funcionalidades implementadas

- Informar nome da campanha, canal de comunicação e responsável.
- Selecionar canal entre **Email**, **WhatsApp** e **Push**.
- Validar campanha obrigatória com no mínimo três caracteres e responsável obrigatório.
- Exibir mensagens de erro para os campos mencionados após interação/tentativa de envio.
- Conferir seis itens organizados em **Conteúdo**, **Dados** e **Links**.
- Calcular a porcentagem de itens marcados em tempo real.
- Gerar um resumo textual com campanha, canal, responsável, porcentagem de conclusão e pendências.
- Exibir “Nenhuma pendência” quando todos os itens forem marcados.
- Limpar formulário, seleções, progresso e relatório com o botão **Limpar**.

**Importante:** gerar o relatório não significa aprovar automaticamente uma campanha. O projeto não implementa workflow de aprovação nem impede a geração do relatório quando há itens pendentes.

## Itens da verificação

| Área | Itens |
|---|---|
| Conteúdo | Assunto e pré-header; campos dinâmicos e personalização |
| Dados | Público e segmentação; duplicidades e exclusões |
| Links | Links e UTMs; revisão em dispositivo móvel |

São seis perguntas fixas no código. O usuário pode marcar ou desmarcar qualquer item.

## Como usar

1. Informe o nome de uma campanha com pelo menos três caracteres.
2. Escolha o canal e preencha o nome do responsável.
3. Marque os itens já conferidos.
4. Acompanhe o indicador de conclusão — por exemplo, três itens marcados representam **50%**.
5. Clique em **Gerar relatório** para visualizar as pendências restantes.
6. Se necessário, revise a conferência, altere os itens e gere o relatório novamente.
7. Clique em **Limpar** para começar um novo checklist.

## Detalhes técnicos

### Tipagem dos itens

```ts
interface Question {
  id: string;
  text: string;
  area: 'Conteúdo' | 'Dados' | 'Links';
}
```

A lista está armazenada na constante `QUESTIONS` em `app.component.ts`. O campo `area` tem um tipo união que limita as categorias permitidas.

### Formulários reativos

O formulário é criado com `new FormBuilder().nonNullable.group(...)`, contendo:

- `campaign`: obrigatória e com `Validators.minLength(3)`.
- `channel`: obrigatório e inicializado com `Email`.
- `owner`: obrigatório.

O método `generate()` verifica `form.invalid` e utiliza `markAllAsTouched()` para exibir a necessidade de correção antes de produzir o texto do relatório.

### Signals e progresso

- `checked = signal<string[]>([])`: guarda IDs dos itens marcados.
- `progress = computed(...)`: calcula `Math.round(checked().length / QUESTIONS.length * 100)`.
- `report = signal('')`: guarda o relatório gerado.

O método `setChecked()` atualiza a seleção sem duplicar IDs e limpa um relatório anterior, evitando exibir um resumo desatualizado após mudança de respostas.

### Template Angular

A interface usa `[formGroup]`, `formControlName`, `@for` e `@if`. O relatório aparece somente se existir um texto em `report()`. Os botões usam `(ngSubmit)` e `(click)`.

### Dados e privacidade

O formulário e as marcações ficam **apenas em memória durante a sessão da página**; nesta versão não existe `localStorage`, exportação de arquivo, download, backend ou salvamento permanente de relatórios. Atualizar a página reinicia os dados.

## Validação manual sugerida

- [ ] Tentar gerar relatório com campanha vazia
- [ ] Tentar gerar relatório com menos de três caracteres no nome da campanha
- [ ] Tentar gerar relatório sem responsável
- [ ] Alterar o canal e conferir o valor no resumo
- [ ] Marcar três dos seis itens e verificar 50%
- [ ] Marcar todos os itens e verificar 100% e “Nenhuma pendência”
- [ ] Desmarcar um item após gerar um relatório e confirmar que o resumo anterior some
- [ ] Gerar novamente e conferir os itens pendentes
- [ ] Clicar em Limpar e conferir retorno ao estado inicial

## Limitações e melhorias futuras

- Perguntas fixas, sem configuração por tipo de campanha ou canal.
- Sem armazenamento, exportação em PDF/CSV ou integração com sistemas de CRM.
- Sem login, aprovação, histórico, workflow de revisão ou testes automatizados.
- Futuras melhorias: componentes reutilizáveis por área, checklist configurável, serviço de dados, exportação de relatório, testes unitários e E2E.

## Tecnologias

- Angular 20 (componentes standalone e sintaxe de controle de fluxo `@for`/`@if`)
- TypeScript 5.9
- HTML5 e CSS3
- Angular CLI para desenvolvimento e build
- Sem API externa ou banco de dados no estágio atual

## Pré-requisitos

- Node.js e npm instalados (use uma versão de Node.js compatível com Angular 20)
- Editor como Visual Studio Code
- Navegador moderno

Confira as versões locais:

```bash
node --version
npm --version
```

## Instalação e execução

Clone o repositório (substitua a URL por aquela publicada no seu perfil) e acesse a pasta do projeto:

```bash
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
cd NOME-DO-REPOSITORIO
npm install
npm start
```

Abra **http://localhost:4200**. Alternativamente, use `npx ng serve`.

Para gerar a compilação de produção:

```bash
npm run build
```

A saída é criada dentro da pasta `dist/` (conforme `angular.json`). O código-fonte fica em `src/`. Se a porta 4200 já estiver ocupada, use `npx ng serve --port 4201`.

## Organização dos arquivos

```text
.
├── src/
│   ├── app/
│   │   ├── app.component.ts     # Estado, lógica e ações da interface
│   │   └── app.component.html   # Template e interações Angular
│   ├── index.html               # Documento base
│   ├── main.ts                  # Bootstrap da aplicação
│   └── styles.css               # Estilos globais
├── angular.json                 # Configuração Angular CLI
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configurações TypeScript
└── README.md                    # Documentação
```

> Este é um exemplo deliberadamente compacto: a lógica está concentrada no componente raiz. Ainda não há módulos de domínio, roteamento entre telas nem integração com backend.

## Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `npm install` | Instala as dependências |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run test` | Script declarado em `package.json`, **sem suíte/configuração de testes incluída nesta entrega**; não considere testes automatizados implementados |

## Status e limitações

- Projeto de **estudo e portfólio**, não uma solução de produção.
- Ainda **não foram executados `npm install`, build e testes neste ambiente**; valide tudo localmente antes de publicar.
- Não há autenticação, banco de dados, API externa, pipeline de CI/CD ou suíte automatizada de testes.
- Não há imagens reais da aplicação no repositório. Se quiser, adicione capturas próprias após executar o projeto, em uma pasta `docs/`, e referencie-as neste README.

## Publicação no GitHub

Na raiz deste projeto, depois de testar localmente:

```bash
git init
git add .
git commit -m "feat: adiciona projeto Angular inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

Crie primeiro um repositório vazio no GitHub. **Não envie a pasta `node_modules/`**, que já está ignorada no `.gitignore`. Se o projeto for parte de um repositório único com os três aplicativos, rode os comandos Git na raiz do portfólio, e não dentro de cada subpasta.
