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
      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[var(--app-canvas)]">
            <AppHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <AppFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
