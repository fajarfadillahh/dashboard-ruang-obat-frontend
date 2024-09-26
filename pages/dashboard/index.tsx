import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Selamat Datang, Admin 👋
            </h1>
            <p className="font-medium text-gray">
              Berikut rangkuman aplikasi ruangobat.id{" "}
              <span className="font-bold text-black">
                Rabu, 18 September 2024
              </span>
            </p>
          </div>

          <div className="grid gap-6 rounded-xl border-[2px] border-gray/20 px-16 py-8">
            <h4 className="font-bold text-black">Ringkasan Aplikasi CBT</h4>

            <div className="grid grid-cols-3 divide-x-2 divide-gray/20">
              <div className="grid pr-12">
                <p className="text-sm font-medium text-gray">Total Pengguna</p>
                <h6 className="text-[32px] font-extrabold text-black">1471</h6>
                <Link
                  href="/users"
                  className="mt-2 inline-flex w-max items-center gap-2 text-sm font-semibold text-purple hover:text-purple/80"
                >
                  Lihat Detail
                  <ArrowRight weight="bold" size={16} />
                </Link>
              </div>

              <div className="grid px-12">
                <p className="text-sm font-medium text-gray">Total Program</p>
                <h6 className="text-[32px] font-extrabold text-black">24</h6>
                <Link
                  href="/programs"
                  className="mt-2 inline-flex w-max items-center gap-2 text-sm font-semibold text-purple hover:text-purple/80"
                >
                  Lihat Detail
                  <ArrowRight weight="bold" size={16} />
                </Link>
              </div>

              <div className="grid pl-12">
                <p className="text-sm font-medium text-gray">Total Ujian</p>
                <h6 className="text-[32px] font-extrabold text-black">254</h6>
                <Link
                  href="/tests"
                  className="mt-2 inline-flex w-max items-center gap-2 text-sm font-semibold text-purple hover:text-purple/80"
                >
                  Lihat Detail
                  <ArrowRight weight="bold" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
