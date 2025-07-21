import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleTextImage from "@/components/title/TitleTextImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import {
  FileText,
  IconContext,
  ImageSquare,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { PencilLine } from "@phosphor-icons/react/dist/ssr";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
const CKEditor = dynamic(() => import("@/components/editor/CKEditor"), {
  ssr: false,
});

interface CardsResponse {
  sub_category_id?: string;
  name: string;
  slug: string;
  img_url: string;
  type: string;
  cards: Card[];
}

interface Card {
  card_id: string;
  text?: string | null;
  type: "text" | "image" | "document";
  url?: string | null;
  is_active: boolean;
}

export default function DetailSubCategoryFlashcardPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const { data, isLoading, mutate } = useSWR<SuccessResponse<CardsResponse>>({
    url: `/cards/${encodeURIComponent(params?.slug as string)}/videocourse`,
    method: "GET",
    token,
  });
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [typeCard, setTypeCard] = useState<"image" | "document" | "text">(
    "image",
  );
  const [typeModal, setTypeModal] = useState<"create" | "edit">("create");
  const [cardId, setCardId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAddFlashcard() {
    setLoading(true);

    try {
      const formData = new FormData();
      const by = session.data?.user.fullname;

      formData.append("type", typeCard);
      formData.append("by", by as string);
      formData.append("sub_category_id", data?.data.sub_category_id as string);

      if (typeCard === "text") {
        formData.append("text", text);
      } else {
        if (!file) {
          toast.error("File harus diisi untuk image, document atau text!");
          return;
        }

        formData.append("files", file);
      }

      await fetcher({
        url: "/cards",
        method: "POST",
        data: formData,
        file: true,
        token,
      });

      setFile(null);
      setText("");

      mutate();
      onClose();

      toast.success("Flashcard berhasil di buat!");
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleEditFlashcard() {
    setLoading(true);

    try {
      const formData = new FormData();
      const by = session.data?.user.fullname;

      formData.append("card_id", cardId);
      formData.append("type", typeCard);
      formData.append("by", by as string);
      formData.append("sub_category_id", data?.data.sub_category_id as string);

      if (typeCard === "text") {
        formData.append("text", text);
      } else {
        if (!file) {
          toast.error("File harus diisi untuk image, document atau text!");
          return;
        }

        formData.append("file", file);
      }

      await fetcher({
        url: "/cards",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      setFile(null);
      setText("");

      mutate();
      onClose();

      toast.success("Flashcard berhasil di ubah!");
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }

  // async function handleDeleteFlashcard(card_id: string) {
  //   try {
  //     await fetcher({
  //       url: `/cards/${card_id}`,
  //       method: "DELETE",
  //       file: true,
  //       token,
  //     });

  //     mutate();
  //     toast.success("Flashcard berhasil di hapus!");
  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(getError(error));
  //   }
  // }

  return (
    <Layout title={data?.data.name} className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <div className="flex items-end justify-between gap-4">
            <TitleTextImage
              src={data?.data.img_url as string}
              name={data?.data.name as string}
              description="Flashcard yang tersedia pada"
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => {
                onOpen();
                setTypeModal("create");
              }}
              className="font-semibold"
            >
              Tambah Flashcard
            </Button>

            <Modal
              isDismissable={false}
              placement="center"
              size="xl"
              scrollBehavior="inside"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClose={() => {
                onClose();

                setFile(null);
                setText("");
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-extrabold text-black">
                      {typeModal == "create" ? "Tambah" : "Edit"} Flashcard
                    </ModalHeader>

                    <ModalBody>
                      <div className="grid gap-8">
                        <RadioGroup
                          isRequired
                          aria-label="select type"
                          label="Tipe Flashcard"
                          color="secondary"
                          orientation="horizontal"
                          value={typeCard}
                          onValueChange={(value) => {
                            setTypeCard(value as "image" | "document" | "text");
                            setFile(null);
                            setText("");
                          }}
                          classNames={{
                            base: "font-semibold text-black",
                            label: "text-sm font-medium text-black",
                          }}
                        >
                          <Radio value="image">Gambar</Radio>
                          <Radio value="document">Dokumen</Radio>
                          <Radio value="text">Text</Radio>
                        </RadioGroup>

                        {(typeCard === "image" || typeCard === "document") && (
                          <div className="grid w-full gap-4 rounded-xl border border-dashed border-gray/30 bg-gray/5 py-8">
                            <IconContext.Provider
                              value={{
                                weight: "duotone",
                                size: 42,
                                className: "justify-self-center text-purple",
                              }}
                            >
                              {typeCard === "image" ? (
                                <ImageSquare />
                              ) : (
                                <FileText />
                              )}
                            </IconContext.Provider>

                            <label className="flex items-center justify-center">
                              <input
                                hidden
                                accept={
                                  typeCard === "image"
                                    ? ".jpg, .jpeg, .png"
                                    : ".ppt, .pptx, .doc, .docx, .pdf"
                                }
                                type="file"
                                onChange={(e) => {
                                  if (!e.target.files?.length) return;
                                  setFile(e.target.files[0]);
                                }}
                              />

                              <div className="flex h-9 w-28 cursor-pointer flex-col items-center justify-center rounded-full bg-purple px-2 text-xs font-semibold leading-4 text-white shadow focus:outline-none">
                                {file ? file.name : "Import Data"}
                              </div>
                            </label>
                          </div>
                        )}

                        {typeCard === "text" && (
                          <CKEditor
                            value={text}
                            onChange={setText}
                            token={`${token}`}
                          />
                        )}

                        {typeModal == "edit" && (
                          <p className="-mt-6 text-sm font-medium text-gray">
                            Flashcard ID:{" "}
                            <strong className="text-purple">{cardId}</strong>
                          </p>
                        )}
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <div className="inline-flex items-center gap-2">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={() => {
                            onClose();
                            setFile(null);
                            setText("");
                          }}
                          className="px-6 font-bold"
                        >
                          Tutup
                        </Button>

                        <Button
                          isLoading={loading}
                          isDisabled={!typeCard || loading}
                          color="secondary"
                          onPress={() =>
                            typeModal == "create"
                              ? handleAddFlashcard()
                              : handleEditFlashcard()
                          }
                          className="px-6 font-semibold"
                        >
                          Simpan {typeModal == "edit" && "Perubahan"}
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: data?.data.cards.length || 9 }).map(
              (_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-xl" />
              ),
            )
          ) : data?.data.cards.length ? (
            data?.data.cards.map((card) => {
              const isText = card.type === "text";
              const isDoc = card.type === "document";

              const Icon = isText ? PencilLine : isDoc ? FileText : null;

              return (
                <div
                  key={card.card_id}
                  className="flex items-center gap-4 rounded-xl border-2 border-gray/10 p-4 hover:cursor-pointer hover:bg-purple/10"
                >
                  <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-xl bg-purple/10">
                    {Icon ? (
                      <Icon weight="fill" size={40} className="text-purple" />
                    ) : (
                      <Image
                        src={card.url as string}
                        alt="flashcard image"
                        width={500}
                        height={500}
                        className="size-full object-cover object-center"
                        priority
                      />
                    )}
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="grid gap-2">
                      <Chip
                        variant="flat"
                        size="sm"
                        classNames={{
                          base: "px-2 gap-1",
                          content: "font-bold capitalize",
                        }}
                      >
                        {card.type}
                      </Chip>

                      {isText ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: card.text as string,
                          }}
                          className="line-clamp-1 text-sm font-medium text-gray"
                        />
                      ) : (
                        <Link
                          href={card.url as string}
                          target="_blank"
                          className="line-clamp-1 text-sm font-medium text-gray hover:text-purple hover:underline"
                        >
                          {card.url}
                        </Link>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="secondary"
                        onClick={() => {
                          onOpen();
                          setTypeModal("edit");

                          setTypeCard(card.type);
                          setCardId(card.card_id);

                          if (card.type == "text") {
                            setText(card.text as string);
                          }
                        }}
                      >
                        <CustomTooltip content="Edit Flashcard">
                          <PencilLine weight="duotone" size={18} />
                        </CustomTooltip>
                      </Button>

                      <ModalConfirm
                        trigger={
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            size="sm"
                          >
                            <CustomTooltip content="Hapus Flashcard">
                              <Trash
                                weight="duotone"
                                size={18}
                                className="text-danger"
                              />
                            </CustomTooltip>
                          </Button>
                        }
                        header={
                          <h1 className="font-bold text-black">
                            Hapus Flashcard
                          </h1>
                        }
                        body={
                          <p className="leading-[170%] text-gray">
                            Apakah anda ingin menghapus flashcard ini?
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
                              color="danger"
                              className="font-semibold"
                              // onClick={() =>
                              //   handleDeleteFlashcard(card.card_id)
                              // }
                            >
                              Ya, Hapus
                            </Button>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20">
              <EmptyData text="Flashcard Belum Tersedia!" />
            </div>
          )}
        </div>
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
