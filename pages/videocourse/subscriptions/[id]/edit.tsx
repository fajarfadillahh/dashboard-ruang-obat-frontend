import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";

export default function EditPackagePage() {
  return (
    <Layout title="Edit Paket" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Edit Paket 📋"
          text="Edit data paket yang sudah ditambahkan"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[700px] gap-8 pt-8">
          data show & data input
        </div>
      </Container>
    </Layout>
  );
}
