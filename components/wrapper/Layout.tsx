import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Ruangobat.id`}</title>
      </Head>

      <main className="flex h-screen">
        <Sidebar />

        <div className="grid w-full">
          <Navbar />

          <div className="overflow-y-scroll scrollbar-hide">
            <div className="mx-auto w-full max-w-[1200px] p-6">{children}</div>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
