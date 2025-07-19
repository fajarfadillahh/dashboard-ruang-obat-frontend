import SectionCategory from "@/components/section/SectionCategory";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { InferGetServerSidePropsType } from "next";

export default function FlascardPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title="Flashcard" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Flashcard 📚"
          text="Flashcard yang tersedia pada kelas video pembelajaran."
        />

        <SectionCategory token={token} />
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
