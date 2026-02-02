import type { Metadata } from "next";
import { Noto_Sans_KR, VT323 } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/state/AppContext";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin", "korean"],
  weight: ["400", "500", "700"],
});

const vt323 = VT323({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400"],
});

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
      <body className={`${notoSansKr.variable} ${vt323.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
