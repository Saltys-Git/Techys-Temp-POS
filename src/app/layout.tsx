import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils"
import {Providers} from "@/components/Providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata: Metadata = {
    title: "Techy's POS",
    description: "This webapp is for Techy's POS.",
    metadataBase: new URL("https://pos.mytechys.co.uk"),
    keywords: ["Techy's POS"],
    openGraph: {
        description: "This webapp is for Techy's POS.",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
