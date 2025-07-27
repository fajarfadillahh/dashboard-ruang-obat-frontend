import SectionSubCategory from "@/components/section/SectionSubCategory";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { InferGetServerSidePropsType } from "next";

export default function ContentPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Konten - Video Pembelajaran" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Konten - Video Pembelajaran 🎬"
          text="Konten yang tersedia pada kelas video pembelajaran."
        />

        <SectionSubCategory token={token} path="/videocourse/content" />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
