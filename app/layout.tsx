import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-quill/dist/quill.snow.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentalinAja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <AntdRegistry> {children}</AntdRegistry>
      </body>
    </html>
  );
}
