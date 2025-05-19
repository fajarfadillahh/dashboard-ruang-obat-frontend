import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button } from "@nextui-org/react";
import {
  ArrowRight,
  Database,
  GearSix,
  Icon,
  IconContext,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type DataRequirementsType = {
  id: number;
  title: string;
  description: string;
  path: string;
  icon: Icon;
};

const dataRequirements: DataRequirementsType[] = [
  {
    id: 1,
    title: "Layanan AI",
    description:
      "Tambahkan atau hapus layanan untuk mengatur model AI yang tersedia bagi pengguna.",
    path: "/ai/providers",
    icon: GearSix,
  },
  {
    id: 2,
    title: "Konteks AI",
    description:
      "Latih dan sesuaikan konteks AI agar dapat memberikan respons yang relevan dan sesuai kebutuhan.",
    path: "/ai/contexts",
    icon: Database,
  },
  {
    id: 3,
    title: "Limitasi Penggunaan AI",
    description:
      "Tetapkan limitasi harian penggunaan AI untuk menjaga efisiensi dan kontrol sistem.",
    path: "/ai/limits",
    icon: ShieldCheck,
  },
];

export default function RosaAIPage() {
  const router = useRouter();
  const { data } = useSession();

  const filteredDataRequirements = dataRequirements.filter((item) => {
    if (item.id === 1) {
      return data?.user?.admin_id === "ROSA1";
    }
    return true;
  });

  return (
    <Layout title="ROSA (AI)" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="ROSA (Ruang Obat Smart Assistant) 🤖"
          text="Atur semua kebutuhan AI di sini"
        />

        <div className="grid grid-cols-2 gap-4">
          {filteredDataRequirements.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-6 rounded-xl border-2 border-purple/10 p-6 hover:border-purple hover:bg-purple/10"
            >
              <IconContext.Provider
                value={{
                  weight: "duotone",
                  size: 64,
                  className: "text-purple",
                }}
              >
                <item.icon />

                <div className="grid flex-1 gap-6">
                  <div className="grid gap-2">
                    <h1 className="text-xl font-extrabold text-black">
                      {item.title}
                    </h1>

                    <p className="font-medium text-gray">{item.description}</p>
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
                    onClick={() => router.push(item.path as string)}
                    className="font-semibold"
                  >
                    Atur Selengkapnya
                  </Button>
                </div>
              </IconContext.Provider>
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
}
