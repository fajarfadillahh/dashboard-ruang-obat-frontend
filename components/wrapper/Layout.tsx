import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export default function Layout({ title, className, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Ruangobat.id`}</title>
      </Head>

      <main className="flex h-screen">
        <Sidebar />

        <div className="grid w-full">
          <Navbar />

          <div className={`overflow-y-scroll ${className}`}>
            <div className="mx-auto w-full max-w-[1200px] p-[1.5rem_1.5rem_6rem]">
              {children}
            </div>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
