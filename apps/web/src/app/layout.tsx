import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FosholHaat',
  description: 'Bangladesh agricultural supply-chain platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
