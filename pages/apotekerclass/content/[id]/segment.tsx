import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input } from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateSegmentCoursePage({
  token,
  query,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [titleSegment, setTitleSegment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleCreateSegment() {
    setLoading(true);

    try {
      const responseSegment: SuccessResponse<{ segment_id: string }> =
        await fetcher({
          url: "/courses/segments",
          method: "POST",
          data: {
            course_id: query.course_id,
            title: titleSegment,
            by: session.data?.user.fullname,
          },
          token,
        });

      toast.success("Segmen berhasil ditambahkan!");

      delete query.id;

      router.push({
        pathname: `/apotekerclass/content/${params.id}/pretest`,
        query: {
          ...query,
          segment_id: responseSegment.data.segment_id,
          segment_title: titleSegment,
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Buat Segmen" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title={`Buat Segmen ${query.course_title} 🎬`}
          text={`Saatnya buat segmen ${query.course_title} sekarang`}
        />

        <div className="grid max-w-[500px] gap-4">
          <Input
            isRequired
            type="text"
            variant="flat"
            label="Judul Segmen"
            labelPlacement="outside"
            placeholder="Contoh: Pemahaman Dasar"
            name="title"
            value={titleSegment}
            onChange={(e) => setTitleSegment(e.target.value)}
            classNames={customStyleInput}
          />

          <Button
            isLoading={loading}
            isDisabled={!titleSegment || loading}
            color="secondary"
            startContent={
              loading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleCreateSegment}
            className="justify-self-end font-semibold"
          >
            Simpan Segmen
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { query, params } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
      params: params as ParsedUrlQuery,
    },
  };
});
