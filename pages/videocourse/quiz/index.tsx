import SectionSubCategory from "@/components/section/SectionSubCategory";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { InferGetServerSidePropsType } from "next";

export default function QuizPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Kuis - Video Pembelajaran" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Kuis - Video Pembelajaran 📝"
          text="Kuis yang tersedia pada kelas video pembelajaran."
        />

        <SectionSubCategory token={token} path="/videocourse/quiz" />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
