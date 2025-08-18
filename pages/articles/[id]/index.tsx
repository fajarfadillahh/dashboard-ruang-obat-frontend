import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { DetailsArticleResponse } from "@/types/articles/article.type";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDateWithoutTime } from "@/utils/formatDate";
import { Button } from "@nextui-org/react";
import { PencilLine } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailsArticlePage({
  article,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [client, setClient] = useState<boolean>(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) return;

  return (
    <Layout title={`${article.title}`}>
      <Container className="gap-8">
        <div className="flex items-center justify-between gap-4">
          <ButtonBack href="/articles" />

          <Button
            color="secondary"
            variant="light"
            startContent={<PencilLine weight="duotone" size={18} />}
            onClick={() => router.push(`/articles/${article.article_id}/edit`)}
            className="font-semibold"
          >
            Edit Artikel
          </Button>
        </div>

        <div className="grid max-w-[800px] gap-8 justify-self-center">
          <div className="grid gap-2">
            <h1 className="text-4xl font-black leading-[120%] text-black">
              {article.title}
            </h1>

            <p className="text-lg font-medium leading-[160%] text-gray">
              {article.description}
            </p>
          </div>

          <Image
            src={article.img_url}
            alt={`Image ${article.title}`}
            width={1000}
            height={600}
            className="aspect-video rounded-xl"
            priority
          />

          <div className="grid grid-cols-[1fr_max-content] items-start gap-8">
            <p className="text-lg font-medium leading-[160%] text-purple">
              {article.topic.name}
            </p>

            <p className="text-lg font-medium leading-[160%] text-gray">
              {formatDateWithoutTime(article.created_at)}
            </p>
          </div>

          <p
            className="ck-content preventif-overlaps-text preventive-list preventive-table mt-8 text-lg font-medium leading-[160%] text-black"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx, token) => {
  const { params } = ctx;

  const response: SuccessResponse<DetailsArticleResponse> = await fetcher({
    url: `/articles/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });

  return {
    props: {
      article: response.data,
    },
  };
});
