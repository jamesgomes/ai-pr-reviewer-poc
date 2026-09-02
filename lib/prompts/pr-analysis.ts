import type { PullRequestAnalysisContext } from "@/types/pr-analysis";

const MAX_FILES_IN_PROMPT = 60;
const MAX_PATCH_CHARS = 6000;

type PromptFileContext = {
  filePath: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
  patchTruncated: boolean;
};

function toPromptFileContext(
  context: PullRequestAnalysisContext
): PromptFileContext[] {
  return context.files.slice(0, MAX_FILES_IN_PROMPT).map((file) => {
    const wasTruncated = typeof file.patch === "string" && file.patch.length > MAX_PATCH_CHARS;

    return {
      filePath: file.filePath,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch?.slice(0, MAX_PATCH_CHARS) ?? null,
      patchTruncated: wasTruncated,
    };
  });
}

export function buildPullRequestAnalysisPrompt(
  context: PullRequestAnalysisContext
): string {
  const files = toPromptFileContext(context);
  const omittedFilesCount = Math.max(context.files.length - files.length, 0);

  const promptContext = {
    repository: `${context.repositoryOwner}/${context.repositoryName}`,
    pullRequest: {
      number: context.pullRequestNumber,
      title: context.pullRequestTitle,
      body: context.pullRequestBody,
      author: context.pullRequestAuthor,
      url: context.pullRequestUrl,
    },
    files,
    omittedFilesCount,
  };

  return [
    "Atue como uma engenheira ou engenheiro de software senior fazendo code review de um Pull Request de um colega, seguindo os padroes de engenharia da Minu.",
    "Analise tecnicamente este pull request com foco apenas no que foi alterado no diff. Nao invente arquivos, linhas ou problemas sem evidencia no contexto.",
    "",
    "Percorra o diff aplicando este checklist e pule os pontos que nao se aplicarem a esta mudanca:",
    "- Seguranca: validacao/sanitizacao de entrada, autenticacao/autorizacao, segredos hardcoded (chaves, tokens, senhas), riscos de injecao (SQL, comando, XSS).",
    "- Testes: existem testes cobrindo a regra de negocio alterada? Casos de borda relevantes estao cobertos? Mocks/stubs mascaram um bug real?",
    "- Estilo: camelCase, const/let (nunca var), async/await em vez de .then()/callbacks, sem console.log esquecido, conformidade com convencoes do projeto.",
    "- Logging: nivel de log adequado, mensagens em ingles, presenca de identificadores rastreaveis, ausencia de PII ou dado sensivel no log.",
    "- Dependencias: pacotes novos sao justificados e mantidos ativamente? Ha alternativa mais simples ja usada no projeto?",
    "- Performance: loops em caminhos quentes, crescimento de memoria nao limitado, trabalho sincrono pesado bloqueando o event loop.",
    "- Observabilidade: eventos/metricas emitidos onde fizer sentido para o negocio, identificadores rastreaveis nos logs e traces.",
    "",
    "Para cada achado, explique o porque (qual bug, incidente ou regra de negocio a sugestao evita), nao so o que.",
    "Nunca reproduza segredos, chaves, tokens ou PII encontrados no diff nas sugestoes — sinalize a existencia do problema sem colar o valor sensivel.",
    "Ordene as sugestoes da mais critica para a menos critica.",
    "Retorne apenas sugestoes acionaveis e objetivas. Se nao houver achados relevantes, retorne suggestions vazio e explique no summary por que a mudanca esta segura para aprovar.",
    "",
    "Contexto estruturado do PR:",
    JSON.stringify(promptContext, null, 2),
  ].join("\n");
}
