import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Quiz Game",
  description: "An quiz game app as an extension of Therapy Training.",
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
