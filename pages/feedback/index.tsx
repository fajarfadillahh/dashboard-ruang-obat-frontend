import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";

export default function FeedbackPage() {
  return (
    <Layout title="Daftar Masukan dan Saran" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Masukan dan Saran ⭐
            </h1>
            <p className="font-medium text-gray">
              Semua masukan dan saran akan tampil disini
            </p>
          </div>

          <div>feedback here</div>
        </section>
      </Container>
    </Layout>
  );
}
