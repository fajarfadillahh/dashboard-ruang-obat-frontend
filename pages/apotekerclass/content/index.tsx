import SectionCategory from "@/components/section/SectionCategory";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { InferGetServerSidePropsType } from "next";

export default function ContentPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Konten - Masuk Apoteker" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Konten - Masuk Apoteker 📝"
          text="Konten yang tersedia pada kelas masuk apoteker."
        />

        <SectionCategory token={token} path="/apotekerclass/content" />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
