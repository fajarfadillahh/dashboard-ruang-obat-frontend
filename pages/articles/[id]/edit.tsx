import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { DetailsArticleResponse } from "@/types/articles/article.type";
import { SuccessResponse } from "@/types/global.type";
import { Topic, TopicsResponse } from "@/types/topics/topic.type";
import getCroppedImg from "@/utils/cropImage";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { onCropComplete } from "@/utils/onCropComplete";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { Key, useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const ArticleEditor = dynamic(
  () => import("@/components/editor/ArticleEditor"),
  {
    ssr: false,
  },
);

type InputType = {
  title: string;
  description: string;
  topic?: string;
  content: string;
};

export default function EditArticlePage({
  token,
  article,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [input, setInput] = useState<InputType>({
    title: article.title,
    description: article.description,
    topic: article.topic.name,
    content: article.content,
  });
  const [file, setFile] = useState<string | ArrayBuffer | null>(
    article.img_url,
  );
  const [filename, setFilename] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<number>(1);
  const [cropImage, setCropImage] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useQueryState("q", {
    defaultValue: article.topic.name,
  });
  const [searchValue] = useDebounce(search, 800);
  const { data: topics, isLoading } = useSWR<SuccessResponse<TopicsResponse>>({
    url: getUrl("/topics", { q: searchValue }),
    method: "GET",
    token,
  });

  const handleTopicSelection = useCallback(
    (selectedKey: Key | null) => {
      if (selectedKey) {
        const selectedTopic = topics?.data.topics.find(
          (t) => t.topic_id === selectedKey,
        );

        if (selectedTopic) {
          setInput((prev) => ({
            ...prev,
            topic: selectedTopic.topic_id,
          }));
          setSearch(selectedTopic.name);
        }
      }
    },
    [topics],
  );

  async function handleEditArticle() {
    setLoading(true);

    try {
      const formData = new FormData();

      if (filename) {
        const croppedImage = await getCroppedImg(file, croppedAreaPixels);
        const response = await fetch(croppedImage as string);
        const blob = await response.blob();
        const fileConvert = new File([blob], `${filename}`, {
          type,
        });

        formData.append("articles", fileConvert);
      }

      formData.append("article_id", router.query.id as string);
      formData.append(
        "topic_id",
        topics
          ? (topics.data.topics.find((topic) => topic.name === input.topic)
              ?.topic_id as string)
          : "",
      );
      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("content", input.content);

      await fetcher({
        url: "/articles",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      toast.success("Artikel berhasil diedit!");
      router.back();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Edit Artikel">
      <Container>
        <ButtonBack />

        <TitleText
          title="Edit Artikel ✏️"
          text="Edit artikel agar lebih menarik untuk dibaca"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid grid-cols-[450px_1fr] items-start gap-16 pt-8">
          <div className="grid gap-6">
            <div className="grid gap-1.5">
              <p className="text-center text-sm font-medium text-gray">
                <strong className="mr-1 text-danger">*</strong>ratio gambar 16:9
              </p>

              <div className="aspect-video h-full w-full rounded-xl border-2 border-dashed border-gray/20 p-1">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray/20">
                  <Cropper
                    image={file as string}
                    crop={cropImage}
                    zoom={zoomImage}
                    aspect={16 / 9}
                    onCropChange={setCropImage}
                    onCropComplete={onCropComplete({
                      setCroppedAreaPixels,
                    })}
                    onZoomChange={setZoomImage}
                  />
                </div>
              </div>
            </div>

            <Input
              isRequired
              type="file"
              accept="image/jpg, image/png"
              variant="flat"
              label="Gambar Artikel"
              labelPlacement="outside"
              classNames={{
                input:
                  "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
              }}
              onChange={(e) => {
                if (!e.target.files?.length) {
                  setFile(null);
                  setFilename("");
                  setType("");
                  return;
                }

                const validTypes = ["image/png", "image/jpg"];

                if (!validTypes.includes(e.target.files[0].type)) {
                  toast.error("Ekstensi file harus png atau jpg");
                  setFile(null);
                  setFilename("");
                  setType("");
                  return;
                }

                setType(e.target.files[0].type);
                setFilename(e.target.files[0].name);
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);

                reader.onload = function () {
                  setFile(reader.result);
                };

                reader.onerror = function (error) {
                  setFile(null);
                  setFilename("");
                  setType("");

                  toast.error("Terjadi kesalahan saat meload gambar");

                  console.log(error);
                };
              }}
            />
          </div>

          <div className="grid gap-6">
            <Input
              isRequired
              type="text"
              variant="flat"
              label={
                <>
                  Judul Artikel{" "}
                  <span className="font-bold text-purple">
                    (sisa: {Math.max(0, 190 - input.title.length)} karakter)
                  </span>
                </>
              }
              labelPlacement="outside"
              placeholder="Contoh: Ruang Masuk Apoteker"
              name="title"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              classNames={customStyleInput}
            />

            <Input
              isRequired
              type="text"
              variant="flat"
              label={
                <>
                  Deskripsi Singkat{" "}
                  <span className="font-bold text-purple">
                    (sisa: {Math.max(0, 190 - input.description.length)}{" "}
                    karakter)
                  </span>
                </>
              }
              labelPlacement="outside"
              placeholder="Contoh: Artikel ini membahas tentang..."
              name="link"
              value={input.description}
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
              classNames={customStyleInput}
            />

            <Autocomplete
              isRequired
              isLoading={isLoading}
              variant="flat"
              label="Topik Artikel"
              labelPlacement="outside"
              placeholder="Ketik Topik Artikel"
              inputValue={search}
              onInputChange={setSearch}
              onSelectionChange={handleTopicSelection}
              inputProps={{
                classNames: {
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                },
              }}
              classNames={{
                listboxWrapper: "max-h-60",
              }}
              onFocus={() => {
                if (input.topic && search === input.topic) {
                  setSearch("");
                }
              }}
            >
              {(topics?.data.topics ?? []).map((topic: Topic) => (
                <AutocompleteItem
                  key={topic.topic_id}
                  value={topic.topic_id}
                  textValue={topic.name}
                >
                  {topic.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <div className="grid gap-2">
              <p className="text-sm text-foreground after:ml-0.5 after:text-danger after:content-['*']">
                Konten
              </p>

              <ArticleEditor
                value={input.content}
                onChange={(text) => {
                  setInput({ ...input, content: text });
                }}
                token={token}
              />
            </div>

            <Button
              isLoading={loading}
              isDisabled={
                loading ||
                !file ||
                !input.title.trim() ||
                !input.description.trim() ||
                !input.topic?.trim() ||
                !input.content.trim()
              }
              color="secondary"
              startContent={
                !loading && <FloppyDisk weight="duotone" size={18} />
              }
              onClick={handleEditArticle}
              className="mt-12 justify-self-end font-semibold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Artikel"}
            </Button>
          </div>
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
