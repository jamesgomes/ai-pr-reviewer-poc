import { getAuthenticatedAppUser } from "@/lib/auth";

const USER_ATTACHMENTS_PATH_PREFIX = "/user-attachments/assets/";

function buildErrorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function isSupportedGitHubAttachmentUrl(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    url.hostname === "github.com" &&
    url.pathname.startsWith(USER_ATTACHMENTS_PATH_PREFIX)
  );
}

export async function GET(request: Request) {
  const authenticatedUser = await getAuthenticatedAppUser();

  if (!authenticatedUser) {
    return buildErrorResponse("Sessão inválida. Faça login novamente.", 401);
  }

  const requestUrl = new URL(request.url);
  const encodedTargetUrl = requestUrl.searchParams.get("url");

  if (!encodedTargetUrl) {
    return buildErrorResponse("Parâmetro 'url' não informado.", 400);
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(encodedTargetUrl);
  } catch {
    return buildErrorResponse("URL de imagem inválida.", 400);
  }

  if (!isSupportedGitHubAttachmentUrl(targetUrl)) {
    return buildErrorResponse("URL de imagem não suportada.", 400);
  }

  const upstreamResponse = await fetch(targetUrl.toString(), {
    headers: {
      Authorization: `Bearer ${authenticatedUser.accessToken}`,
      "User-Agent": "ai-pr-reviewer-poc",
    },
    redirect: "follow",
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return buildErrorResponse("Não foi possível carregar a imagem do GitHub.", 404);
  }

  const contentType = upstreamResponse.headers.get("content-type") ?? "application/octet-stream";

  return new Response(upstreamResponse.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
    },
  });
}
