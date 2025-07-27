import SessionWatcher from "@/components/SessionWatcher";
import { fontMono, fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import { fetcher } from "@/utils/fetcher";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <NextUIProvider>
      <Toaster
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            color: "#171717",
          },
        }}
      />
      <NextNProgress
        color="#6238C3"
        options={{ showSpinner: false }}
        showOnShallow={false}
      />
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <SessionWatcher />
        <SWRConfig
          value={{
            fetcher,
            revalidateOnFocus: true,
          }}
        >
          <NuqsAdapter>
            <Component {...pageProps} />
          </NuqsAdapter>
        </SWRConfig>
      </SessionProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
