import "./globals.css";
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
          <div className="min-h-screen bg-white dark:bg-zinc-950">
            <AppHeader />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
