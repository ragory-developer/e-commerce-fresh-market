import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { API_URL } from "@/lib/config";
import parse, { attributesToProps, Element, Text } from "html-react-parser";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  preload: true 
});
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: "FreshCart - Your Daily Groceries",
  description: "Fresh groceries delivered to your doorstep.",
};

import SettingsProvider from "@/components/providers/SettingsProvider";
import { AuthProvider } from "@/context/AuthContext";
import Tracking from "@/components/Tracking";
import { Suspense } from "react";

import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headerCode = "";
  let bodyCode = "";
  let footerCode = "";
  
  try {
    const res = await fetch(`${API_URL}/api/global-settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        headerCode = json.data.header_code || "";
        bodyCode = json.data.body_code || "";
        footerCode = json.data.footer_code || "";
      }
    }
  } catch (err) {
    console.error("Failed to fetch global settings in layout:", err);
  }

  const getParseOptions = (isHead: boolean = false) => ({
    replace: (domNode: any) => {
      // Discard pure text nodes in the <head> to prevent the browser from closing it prematurely
      if (isHead && domNode.type === 'text') {
        const text = (domNode as Text).data?.trim();
        if (text) return <></>; 
      }

      if (domNode instanceof Element && domNode.name === 'script') {
        const props = attributesToProps(domNode.attribs);
        const scriptContent = domNode.children?.[0]?.type === 'text' 
           ? (domNode.children[0] as Text).data 
           : '';
        if (scriptContent) {
          return <script {...props} dangerouslySetInnerHTML={{ __html: scriptContent }} />;
        }
        return <script {...props} />;
      }

      if (domNode instanceof Element && domNode.name === 'style') {
        const props = attributesToProps(domNode.attribs);
        const styleContent = domNode.children?.[0]?.type === 'text' 
           ? (domNode.children[0] as Text).data 
           : '';
        if (styleContent) {
          return <style {...props} dangerouslySetInnerHTML={{ __html: styleContent }} />;
        }
        return <style {...props} />;
      }
    }
  });

  return (
    <html lang="en">
      <head>
        {headerCode ? parse(headerCode, getParseOptions(true)) : null}
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {bodyCode ? parse(bodyCode, getParseOptions()) : null}
        <AuthProvider>
          <SettingsProvider>
            <Suspense fallback={null}>
              <Tracking />
            </Suspense>
            {children}
            <Toaster richColors position="top-center" />
          </SettingsProvider>
        </AuthProvider>
        {footerCode ? parse(footerCode, getParseOptions()) : null}
      </body>
    </html>
  );
}
