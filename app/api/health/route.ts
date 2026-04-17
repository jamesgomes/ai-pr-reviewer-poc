export async function GET() {
  return Response.json({
    ok: true,
    app: process.env.NEXT_PUBLIC_APP_NAME || "AI PR Reviewer POC",
  });
}
