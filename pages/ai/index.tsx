import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button } from "@nextui-org/react";
import {
  ArrowRight,
  Database,
  GearSix,
  IconContext,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function RosaAIPage() {
  const router = useRouter();

  return (
    <Layout title="ROSA (AI)" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="ROSA (Ruang Obat Smart Assistant) 🤖"
            text="Atur semua kebutuhan AI di sini."
          />

          <div className="grid grid-cols-2 gap-4">
            {[
              [
                "Layanan AI",
                "Tambahkan atau hapus layanan untuk mengatur model AI yang tersedia bagi pengguna.",
                "/ai/providers",
                <GearSix />,
              ],
              [
                "Konteks AI",
                "Latih dan sesuaikan konteks AI agar dapat memberikan respons yang relevan dan sesuai kebutuhan.",
                "/ai/contexts",
                <Database />,
              ],
              [
                "Limit Pengguna",
                "Tetapkan limit harian penggunaan AI untuk menjaga efisiensi dan kontrol sistem.",
                "/ai/limits",
                <ShieldCheck />,
              ],
            ].map(([title, desc, route, icon], index) => (
              <IconContext.Provider
                value={{
                  weight: "duotone",
                  size: 64,
                  className: "text-purple",
                }}
              >
                <div
                  key={index}
                  className="flex items-start gap-6 rounded-xl border-2 border-purple/10 p-6 hover:border-purple hover:bg-purple/10"
                >
                  {icon}

                  <div className="grid flex-1 gap-6">
                    <div className="grid gap-2">
                      <h1 className="text-xl font-extrabold text-black">
                        {title}
                      </h1>

                      <p className="font-medium text-gray">{desc}</p>
                    </div>

                    <Button
                      color="secondary"
                      endContent={
                        <ArrowRight
                          weight="bold"
                          size={18}
                          className="text-white"
                        />
                      }
                      onClick={() => router.push(route as string)}
                      className="font-bold"
                    >
                      Selengkapnya
                    </Button>
                  </div>
                </div>
              </IconContext.Provider>
            ))}
          </div>
        </section>
      </Container>
    </Layout>
  );
}
