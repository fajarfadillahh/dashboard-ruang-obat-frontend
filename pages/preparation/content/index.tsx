import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";

export default function PreparationContentsPage() {
  return (
    <Layout
      title="Daftar Konten Kelas Persiapan UTS/UAS"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Konten Kelas Persiapan UTS/UAS 📚"
            text="Semua konten/data kelas akan muncul semuanya disini"
          />
        </section>
      </Container>
    </Layout>
  );
}
