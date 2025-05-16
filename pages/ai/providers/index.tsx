import ButtonBack from "@/components/button/ButtonBack";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";

export default function AIProvidersPage() {
  return (
    <Layout title="Daftar Layanan AI" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack href="/ai" />

          <TitleText
            title="Daftar Layanan AI 📋"
            text="Semua layanan AI yang tersedia akan muncul di sini."
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput placeholder="Cari Layanan..." />

              <Button
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                className="font-bold"
              >
                Tambah Layanan
              </Button>
            </div>

            <div>table here</div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
