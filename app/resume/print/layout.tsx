import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "简历 | 陈子龙",
  robots: { index: false, follow: false },
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
