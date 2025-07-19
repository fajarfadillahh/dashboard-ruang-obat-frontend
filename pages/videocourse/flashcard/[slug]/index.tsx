import ButtonBack from "@/components/button/ButtonBack";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import TitleTextImage from "@/components/title/TitleTextImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";

export interface CardsResponse {
  name: string;
  slug: string;
  img_url: string;
  type: string;
  cards: {
    card_id: string;
    text?: string;
    type: string;
    url?: string;
    is_active: boolean;
  }[];
}

export default function DetailSubCategoryFlashcardPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading } = useSWR<SuccessResponse<CardsResponse>>({
    url: `/cards/${encodeURIComponent(params?.slug as string)}/videocourse`,
    method: "GET",
    token,
  });

  return (
    <Layout title={data?.data.name} className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <TitleTextImage
            src={data?.data.img_url as string}
            name={data?.data.name as string}
            description="Flashcard yang tersedia pada"
          />
        )}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
