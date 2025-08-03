import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { VideoContent } from "@/types/content/video.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input } from "@nextui-org/react";
import { ArrowRight, Database, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreateApotekerClassPage({
  token,
  params,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();

  const initialContents: VideoContent[] = [];
  const [contents, setContents] = useState<VideoContent[]>(initialContents);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  function handleAddContent() {
    setContents([
      ...contents,
      {
        title: "",
        video_url: "",
        video_note: "",
        video_note_url: "",
        content_type: "video",
        by: `${session.data?.user.fullname}`,
      },
    ]);
    localStorage.setItem(
      "content_video_apotekerclass",
      JSON.stringify([...contents]),
    );
  }

  function handleChangeContent(
    index: number,
    field: keyof VideoContent,
    value: string,
  ) {
    const updated = [...contents];
    updated[index][field] = value;
    setContents(updated);

    localStorage.setItem(
      "content_video_apotekerclass",
      JSON.stringify([...contents]),
    );
  }

  function handleRemoveContent(index: number) {
    const updatedContents = contents.filter((_, i) => i !== index);

    if (updatedContents.length === 0) {
      localStorage.removeItem("content_video_apotekerclass");
    } else {
      localStorage.setItem(
        "content_video_apotekerclass",
        JSON.stringify(updatedContents),
      );
    }

    setContents(updatedContents);
  }

  async function handleSubmitContent() {
    setLoading(true);

    try {
      const payload = {
        segment_id: query.segment_id,
        contents: contents.map((content) => {
          const data: {
            title: string;
            video_url: string;
            video_note_url?: string;
            video_note?: string;
            content_type: string;
            by: string;
          } = {
            title: content.title,
            video_url: content.video_url,
            content_type: content.content_type,
            by: content.by,
          };

          if (content.video_note_url) {
            data.video_note_url = content.video_note_url;
          }

          if (content.video_note) {
            data.video_note = content.video_note;
          }

          return data;
        }),
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/courses/videos",
        method: "POST",
        data: payload,
        token,
      });

      router.push({
        pathname: `/apotekerclass/content/${params.id}/posttest`,
        query: { ...query },
      });

      toast.success("Konten video berhasil ditambahkan!");
      localStorage.removeItem("content_video_apotekerclass");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const atLeastOneValid = contents.some(
      (item) => item.title.trim() !== "" && item.video_url.trim() !== "",
    );

    setIsButtonDisabled(!atLeastOneValid);
  }, [contents]);

  useEffect(() => {
    const storedContents = localStorage.getItem("content_video_apotekerclass");
    if (storedContents) setContents(JSON.parse(storedContents));
  }, []);

  return (
    <Layout title="Buat Konten Video" className="scrollbar-hide">
      <Container className="divide-gray/10gap-8 divide-y-2 divide-dashed">
        <div className="flex items-end justify-between gap-4 pb-8">
          <TitleText
            title={`Buat Konten Video ${query.segment_title} 🎞`}
            text={`Saatnya buat konten video ${query.segment_title} sekarang`}
          />

          {query.from === "edit" ? (
            <Button
              variant="light"
              color="secondary"
              endContent={<ArrowRight weight="bold" size={18} />}
              onClick={() => {
                router.push({
                  pathname: `/apotekerclass/content/${params.id}/posttest`,
                  query: { ...query },
                });
              }}
              className="font-semibold"
            >
              Lewati Konten Video
            </Button>
          ) : null}
        </div>

        <div className="grid pt-8">
          <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white py-4">
            <h5 className="text-xl font-bold text-black">Daftar Video</h5>

            <div className="inline-flex items-center gap-4">
              <Button
                variant="light"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={handleAddContent}
                className="font-semibold"
              >
                Tambah Video
              </Button>

              <ModalConfirm
                trigger={
                  <Button
                    isDisabled={isButtonDisabled}
                    color="secondary"
                    startContent={
                      loading ? null : <Database weight="duotone" size={18} />
                    }
                    className="font-semibold"
                  >
                    Simpan Database
                  </Button>
                }
                header={<h1 className="font-bold text-black">Perhatian!</h1>}
                body={
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menyimpan konten video ini ke dalam
                    database?
                  </p>
                }
                footer={(onClose: any) => (
                  <>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      className="font-semibold"
                    >
                      Tutup
                    </Button>

                    <Button
                      isLoading={loading}
                      isDisabled={loading}
                      color="secondary"
                      onClick={handleSubmitContent}
                      className="font-semibold"
                    >
                      Ya, Simpan
                    </Button>
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid gap-2">
            {contents.map((content, index) => (
              <div
                key={index}
                className="grid grid-cols-[max-content_1fr_max-content] items-start gap-8 rounded-xl border-2 border-gray/20 p-8"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple/10 p-4 font-bold text-purple">
                  {index + 1}
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 items-end gap-4">
                    <Input
                      isRequired
                      type="text"
                      variant="flat"
                      label="Judul Video"
                      labelPlacement="outside"
                      placeholder="Contoh: Apa itu Farmakoterapi?"
                      name="title"
                      value={content.title}
                      onChange={(e) =>
                        handleChangeContent(index, "title", e.target.value)
                      }
                      classNames={customStyleInput}
                    />

                    <Input
                      isRequired
                      type="text"
                      variant="flat"
                      label="Link Video"
                      labelPlacement="outside"
                      placeholder="Contoh: https://youtube.com/watch?v=xxxxxx"
                      name="video_url"
                      value={content.video_url}
                      onChange={(e) =>
                        handleChangeContent(index, "video_url", e.target.value)
                      }
                      classNames={customStyleInput}
                    />
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold text-black">
                      Catatan Video{" "}
                      <span className="text-xs font-medium text-gray">
                        (Opsional)
                      </span>
                    </h3>

                    <div className="grid grid-cols-2 items-end gap-4">
                      <Input
                        type="text"
                        variant="flat"
                        label="Nama Catatan"
                        labelPlacement="outside"
                        placeholder="Contoh: Penjelasan Farmakoterapi"
                        name="video_note"
                        value={content.video_note}
                        onChange={(e) =>
                          handleChangeContent(
                            index,
                            "video_note",
                            e.target.value,
                          )
                        }
                        classNames={customStyleInput}
                      />

                      <Input
                        type="text"
                        variant="flat"
                        label="Link Catatan"
                        labelPlacement="outside"
                        placeholder="Contoh: https://medium.com/xxxxxx"
                        name="video_note_url"
                        value={content.video_note_url}
                        onChange={(e) =>
                          handleChangeContent(
                            index,
                            "video_note_url",
                            e.target.value,
                          )
                        }
                        classNames={customStyleInput}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onClick={() => handleRemoveContent(index)}
                >
                  <Trash weight="duotone" size={18} className="text-danger" />
                </Button>
              </div>
            ))}
          </div>
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
