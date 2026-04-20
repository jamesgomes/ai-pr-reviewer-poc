import "./globals.css";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
            <AppHeader />
            <div className="flex-1">{children}</div>
            <AppFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
