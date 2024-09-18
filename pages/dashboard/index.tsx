import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Layout title="Dashboard Page">
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

            <div className="grid grid-cols-2 divide-x-2 divide-gray/20">
              <div className="grid divide-y-2 divide-gray/20 pr-24">
                <div className="grid pb-8">
                  <p className="text-sm font-medium text-gray">
                    Total Pengguna
                  </p>
                  <h6 className="text-[32px] font-extrabold text-black">
                    1200
                  </h6>
                </div>

                <div className="grid pt-8">
                  <p className="text-sm font-medium text-gray">
                    Total Program Ruangobat
                  </p>
                  <h6 className="text-[32px] font-extrabold text-black">24</h6>
                  <Link
                    href="#"
                    className="mt-2 inline-flex w-max items-center gap-2 text-sm font-bold text-purple hover:text-purple/80"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("dalam proses pengembangan");
                    }}
                  >
                    Lihat Detail
                    <ArrowRight weight="bold" size={16} />
                  </Link>
                </div>
              </div>

              <div className="grid divide-y-2 divide-gray/20 pl-24">
                <div className="grid pb-8">
                  <p className="text-sm font-medium text-gray">
                    Total Pengguna Aktif
                  </p>
                  <h6 className="text-[32px] font-extrabold text-black">800</h6>
                </div>

                <div className="grid pt-8">
                  <p className="text-sm font-medium text-gray">
                    Total Ujian Ruangobat
                  </p>
                  <h6 className="text-[32px] font-extrabold text-black">254</h6>
                  <Link
                    href="#"
                    className="mt-2 inline-flex w-max items-center gap-2 text-sm font-bold text-purple hover:text-purple/80"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("dalam proses pengembangan");
                    }}
                  >
                    Lihat Detail
                    <ArrowRight weight="bold" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
