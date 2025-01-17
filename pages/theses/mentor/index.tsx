import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";

export default function ThesesMentorsPage() {
  return (
    <Layout
      title="Daftar Mentor Kelas Skripsi Farmasi"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Mentor Kelas Skripsi Farmasi 📢"
            text="Semua mentor yang bertugas akan muncul semuanya disini"
          />
        </section>
      </Container>
    </Layout>
  );
}
