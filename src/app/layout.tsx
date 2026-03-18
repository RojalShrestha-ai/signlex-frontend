import type { Metadata } from "next";
import "./globals.css";
import { bodyFont, displayFont, monoFont } from "@/components/common/typography";
import { LayoutShell } from "@/components/common/layout-shell";
import { AppProviders } from "@/lib/providers";
import { getServerSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "SignLex - Learn Sign Language Alphabets with AI",
  description:
    "SignLex is an innovative web application designed to help users learn sign language alphabets using cutting-edge AI technology. With interactive lessons, real-time feedback, and a user-friendly interface, SignLex makes mastering sign language accessible and enjoyable for everyone.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, token } = await getServerSession();

  return (
    <html
      lang="en"
      className={`${monoFont.variable} ${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="SignLex" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProviders initialUser={user} initialToken={token}>
          <LayoutShell initialUser={user}>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
