import SectionSubCategory from "@/components/section/SectionSubCategory";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { InferGetServerSidePropsType } from "next";

export default function FlascardPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Flashcard - Video Pembelajaran" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Flashcard - Video Pembelajaran 📚"
          text="Flashcard yang tersedia pada kelas video pembelajaran."
        />

        <SectionSubCategory token={token} path="/videocourse/flashcard" />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
