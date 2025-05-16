import ButtonBack from "@/components/button/ButtonBack";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react";

export default function AILimitsPage() {
  return (
    <Layout title="Daftar Limitasi Pengguna AI">
      <Container>
        <section className="grid gap-8">
          <ButtonBack href="/ai" />

          <TitleText
            title="Daftar Limitasi Pengguna AI 📋"
            text="Semua data limitasi pengguna akan muncul di sini."
          />

          <div className="grid">
            <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
              <SearchInput placeholder="Cari Pengguna..." />

              <Button
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                className="font-bold"
              >
                Tambah Limit
              </Button>
            </div>

            <div>table here</div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
