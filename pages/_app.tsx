import SessionWatcher from "@/components/SessionWatcher";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
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
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <SessionWatcher />
        <Component {...pageProps} />
      </SessionProvider>
    </NextUIProvider>
  );
}
