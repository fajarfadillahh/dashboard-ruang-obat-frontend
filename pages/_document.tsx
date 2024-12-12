import { fontSans } from "@/config/fonts";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/img/favicon.ico" />
      </Head>
      <body className={`font-sans antialiased ${fontSans.variable}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
