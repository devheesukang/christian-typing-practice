import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/state/AppContext";
import BgmController from "@/components/BgmController";

export const metadata: Metadata = {
  title: "주기도문 타자연습",
  description: "한컴 타자연습 감성의 주기도문 협업 타자 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AppProvider>
          <BgmController />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
