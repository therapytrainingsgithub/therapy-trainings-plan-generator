import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Treatment Plan Generator",
  description:
    "A Plan Generator App which is an extension of Therapy Training.",
};
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon link */}
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body className="flex min-h-screen w-full flex-col">
        {children}
        <Toaster />{" "}
        {/* Add the Toaster here to ensure toast notifications are displayed */}
      </body>
    </html>
  );
}
