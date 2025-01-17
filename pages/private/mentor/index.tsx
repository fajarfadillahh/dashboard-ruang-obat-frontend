import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";

export default function PrivateMentorsPage() {
  return (
    <Layout
      title="Daftar Mentor Kelas Private Farmasi"
      className="scrollbar-hide"
    >
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Daftar Mentor Kelas Private Farmasi 📢"
            text="Semua mentor yang bertugas akan muncul semuanya disini"
          />
        </section>
      </Container>
    </Layout>
  );
}
