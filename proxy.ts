import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret:
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    "dev-nextauth-secret-change-me",
});

export const config = {
  matcher: ["/", "/pull-requests/:path*"],
};
