import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Toaster
        toastOptions={{
          style: {
            fontFamily: "Mulish, sans-serif",
            fontWeight: 600,
            color: "#171717",
          },
        }}
      />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
