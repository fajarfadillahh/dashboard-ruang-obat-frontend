import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import {
  CheckCircle,
  Eye,
  FileText,
  Gear,
  PencilLine,
  Plus,
  Trash,
  Video,
  XCircle,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type DetailCourse = {
  course_id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  preview_url: string;
  description: string;
  is_active: boolean;
  segments: Segment[];
};

type Segment = {
  segment_id: string;
  title: string;
  number: number;
  is_active: boolean;
  contents: Content[];
};

type Content = {
  content_id: string;
  content_type: "video" | "test";
  title: string;
  video_url: string;
  video_note_url: string;
  video_note: string;
  test_type: "pre" | "post";
};

export default function DetailApotekerClassCourse({
  params,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { data, isLoading, mutate } = useSWR<SuccessResponse<DetailCourse>>({
    method: "GET",
    url: `/courses/${params.id}/detail`,
    token,
  });
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [editSegment, setEditSegment] = useState<Segment | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  const {
    isOpen: isOpenVideo,
    onOpen: onOpenVideo,
    onClose: onCloseVideo,
  } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false);

  const {
    isOpen: isOpenCourse,
    onOpen: onOpenCourse,
    onClose: onCloseCourse,
  } = useDisclosure();
  const [editCourse, setEditCourse] = useState<DetailCourse | null>(null);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false);

  async function handleUpdateSegment() {
    if (!editSegment) return;
    setLoadingEdit(true);

    try {
      await fetcher({
        url: `/courses/segments`,
        method: "PATCH",
        data: {
          title: editSegment.title,
          segment_id: editSegment.segment_id,
          by: session.data?.user.fullname,
        },
        token,
      });

      toast.success("Segmen berhasil diperbarui!");
      setSelectedSegment(null);
      setEditSegment(null);
      onCloseEdit();
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    } finally {
      setLoadingEdit(false);
    }
  }

  async function handleUpdateVideo() {
    if (!selectedVideo) return;
    setLoadingVideo(true);

    const data: any = {
      content_id: selectedVideo.content_id,
      title: selectedVideo.title,
      by: session.data?.user.fullname,
    };

    if (selectedVideo.video_url) {
      data.video_url = selectedVideo.video_url;
    }

    if (selectedVideo.video_note) {
      data.video_note = selectedVideo.video_note;
    }

    if (selectedVideo.video_note_url) {
      data.video_note_url = selectedVideo.video_note_url;
    }

    try {
      await fetcher({
        url: `/courses/videos`,
        method: "PATCH",
        data,
        token,
      });

      toast.success("Konten video berhasil diperbarui!");
      setSelectedVideo(null);
      onCloseVideo();
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    } finally {
      setLoadingVideo(false);
    }
  }

  async function handleUpdateCourse() {
    if (!editCourse) return;
    setLoadingCourse(true);

    const data: any = {
      course_id: editCourse.course_id,
      title: editCourse.title,
      description: editCourse.description,
      type: "apotekerclass",
      by: session.data?.user.fullname,
    };

    if (editCourse.preview_url) {
      data.preview_url = editCourse.preview_url;
    }

    try {
      await fetcher({
        url: `/courses`,
        method: "PATCH",
        data,
        token,
      });

      toast.success("Playlist berhasil diperbarui!");
      setEditCourse(null);
      onCloseCourse();
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    } finally {
      setLoadingCourse(false);
    }
  }

  async function handleGetVideoUrl(video_url: string) {
    const url = new URL(video_url);
    const key = url.pathname.slice(1);

    try {
      const response: SuccessResponse<{ url: string }> = await toast.promise(
        fetcher({
          url: `/storage/signed?key=${key}`,
          method: "POST",
          token,
        }),
        {
          loading: "Getting signed URL...",
          success: "Signed URL retrieved successfully",
          error: "Failed to get signed URL",
        },
      );

      window.open(response.data.url, "_blank");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteSegment(segment_id: string) {
    try {
      await fetcher({
        url: `/courses/segments/${segment_id}`,
        method: "DELETE",
        token,
      });

      toast.success("Segmen berhasil dihapus!");
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  async function handleDeleteContent(content_id: string) {
    try {
      await fetcher({
        url: `/courses/contents/${content_id}`,
        method: "DELETE",
        token,
      });

      toast.success("Konten berhasil dihapus!");
      mutate();
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  return (
    <Layout title="Detail" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <Modal
          isOpen={isOpenCourse}
          onClose={() => {
            setEditCourse(null);
            onCloseCourse();
          }}
        >
          <ModalContent>
            <ModalHeader className="font-semibold text-black">
              Edit Playlist
            </ModalHeader>

            <ModalBody className="grid gap-4">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Playlist"
                labelPlacement="outside"
                placeholder="Contoh: Farmakoterapi Dasar"
                name="title"
                value={editCourse?.title ?? ""}
                onChange={(e) =>
                  setEditCourse((prev) =>
                    prev ? { ...prev, title: e.target.value } : prev,
                  )
                }
                classNames={customStyleInput}
              />

              <Textarea
                isRequired
                minRows={4}
                type="text"
                variant="flat"
                label="Deskripsi Kursus/Playlist"
                labelPlacement="outside"
                placeholder="Contoh: Farmakoterapi Dasar adalah disiplin ilmu di dunia farmasi..."
                name="description"
                value={editCourse?.description ?? ""}
                onChange={(e) =>
                  setEditCourse((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
                classNames={customStyleInput}
              />

              <Input
                type="text"
                variant="flat"
                label="Preview URL"
                labelPlacement="outside"
                placeholder="Contoh: https://youtube.com/watch?v=xxxxxx"
                name="preview_url"
                value={editCourse?.preview_url ?? ""}
                onChange={(e) =>
                  setEditCourse((prev) =>
                    prev ? { ...prev, preview_url: e.target.value } : prev,
                  )
                }
                classNames={customStyleInput}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  setEditCourse(null);
                  onCloseCourse();
                }}
              >
                Batal
              </Button>
              <Button
                color="secondary"
                isLoading={loadingCourse}
                onClick={handleUpdateCourse}
                isDisabled={!editCourse || loadingCourse}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isOpenEdit}
          onClose={() => {
            setSelectedSegment(null);
            setEditSegment(null);
            onCloseEdit();
          }}
        >
          <ModalContent>
            <ModalHeader className="font-semibold text-black">
              Edit Segmen
            </ModalHeader>

            <ModalBody>
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Segmen"
                labelPlacement="outside"
                placeholder="Contoh: Pemahaman Dasar"
                name="title"
                defaultValue={editSegment?.title}
                onChange={(e) => {
                  if (editSegment) {
                    setEditSegment({
                      ...editSegment,
                      title: e.target.value,
                    });
                  }
                }}
                classNames={customStyleInput}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  setSelectedSegment(null);
                  setEditSegment(null);
                  onCloseEdit();
                }}
              >
                Batal
              </Button>
              <Button
                color="secondary"
                onClick={handleUpdateSegment}
                isLoading={loadingEdit}
                isDisabled={!editSegment?.title || loadingEdit}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isOpenVideo}
          onClose={() => {
            setSelectedVideo(null);
            onCloseVideo();
          }}
        >
          <ModalContent>
            <ModalHeader className="font-semibold text-black">
              Edit Konten Video
            </ModalHeader>

            <ModalBody className="grid gap-8">
              <div className="grid gap-4">
                <Input
                  isRequired
                  type="text"
                  variant="flat"
                  label="Judul Video"
                  labelPlacement="outside"
                  placeholder="Contoh: Apa itu Farmakoterapi?"
                  name="title"
                  value={selectedVideo?.title ?? ""}
                  onChange={(e) =>
                    setSelectedVideo((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev,
                    )
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
                  value={selectedVideo?.video_url ?? ""}
                  onChange={(e) =>
                    setSelectedVideo((prev) =>
                      prev ? { ...prev, video_url: e.target.value } : prev,
                    )
                  }
                  classNames={customStyleInput}
                />
              </div>

              <div className="grid gap-4">
                <Input
                  type="text"
                  variant="flat"
                  label="Nama Catatan"
                  labelPlacement="outside"
                  placeholder="Contoh: Penjelasan Farmakoterapi"
                  name="video_note"
                  value={selectedVideo?.video_note ?? ""}
                  onChange={(e) =>
                    setSelectedVideo((prev) =>
                      prev ? { ...prev, video_note: e.target.value } : prev,
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
                  value={selectedVideo?.video_note_url ?? ""}
                  onChange={(e) =>
                    setSelectedVideo((prev) =>
                      prev ? { ...prev, video_note_url: e.target.value } : prev,
                    )
                  }
                  classNames={customStyleInput}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  setSelectedVideo(null);
                  onCloseVideo();
                }}
              >
                Batal
              </Button>
              <Button
                color="secondary"
                onClick={handleUpdateVideo}
                isLoading={loadingVideo}
                isDisabled={!selectedVideo || loadingVideo}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-8">
            <Image
              src={data?.data.thumbnail_url as string}
              alt={data?.data.title as string}
              width={1000}
              height={1000}
              className="size-[180px] rounded-xl object-cover object-center"
            />

            <div className="grid gap-1">
              <Chip
                size="sm"
                variant="flat"
                color={data?.data.is_active ? "success" : "danger"}
                startContent={
                  data?.data.is_active ? (
                    <CheckCircle weight="duotone" size={18} />
                  ) : (
                    <XCircle weight="duotone" size={18} />
                  )
                }
                classNames={{
                  base: "px-2 gap-1 mb-2",
                  content: "font-bold",
                }}
              >
                {data?.data.is_active
                  ? "Kursus/Playlist Aktif"
                  : "Kursus/Playlist Tidak Aktif"}
              </Chip>

              <h1 className="text-3xl font-bold -tracking-wide text-black">
                {data?.data.title}
              </h1>

              <p className="font-medium leading-[170%] text-gray">
                {data?.data.description}
              </p>
            </div>

            <Button
              variant="light"
              color="secondary"
              startContent={<PencilLine weight="duotone" size={18} />}
              onClick={() => {
                onOpenCourse();
                setEditCourse(data?.data ?? null);
              }}
              className="font-semibold"
            >
              Edit Playlist
            </Button>
          </div>
        )}

        <div className="mt-4 grid">
          <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
            <h4 className="text-xl font-bold -tracking-wide text-black">
              Daftar Segmen 🎬
            </h4>

            <Button
              variant="solid"
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => {
                router.push({
                  pathname: `/apotekerclass/content/${params.id}/segment`,
                  query: {
                    course_id: data?.data.course_id,
                    course_title: data?.data.title,
                  },
                });
              }}
              className="font-semibold"
            >
              Tambah Segmen Baru
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <Accordion selectionMode="multiple">
              {(data?.data.segments ?? []).map((segment) => (
                <AccordionItem
                  key={segment.segment_id}
                  title={`${segment.number}. ${segment.title}`}
                  startContent={
                    <Dropdown
                      isOpen={selectedSegment === segment.segment_id}
                      onOpenChange={(open) => {
                        setSelectedSegment(open ? segment.segment_id : null);
                      }}
                    >
                      <DropdownTrigger
                        onClick={() => setSelectedSegment(segment.segment_id)}
                      >
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          color="secondary"
                        >
                          <CustomTooltip content="Aksi">
                            <Gear weight="bold" size={18} />
                          </CustomTooltip>
                        </Button>
                      </DropdownTrigger>

                      <DropdownMenu
                        aria-label="Static Actions"
                        itemClasses={{
                          title: "font-semibold",
                        }}
                      >
                        <DropdownItem
                          key="edit_segment"
                          onClick={() => {
                            if (selectedSegment === segment.segment_id) {
                              setEditSegment(segment);
                              onOpenEdit();
                            }
                          }}
                        >
                          Edit Segmen
                        </DropdownItem>

                        <DropdownItem
                          key="delete_segment"
                          onClick={() => {
                            if (selectedSegment === segment.segment_id) {
                              if (
                                confirm(
                                  "Apakah anda yakin menghapus segmen ini?",
                                )
                              ) {
                                handleDeleteSegment(segment.segment_id);
                              }
                            }
                          }}
                        >
                          Hapus Segmen
                        </DropdownItem>

                        <DropdownItem
                          key="new_pre_test"
                          onClick={() => {
                            router.push({
                              pathname: `/apotekerclass/content/${params.id}/pretest`,
                              query: {
                                course_id: data?.data.course_id,
                                course_title: data?.data.title,
                                segment_id: segment.segment_id,
                                segment_title: segment.title,
                              },
                            });
                          }}
                        >
                          Tambah Pre-Test Baru
                        </DropdownItem>

                        <DropdownItem
                          key="new_video"
                          onClick={() => {
                            router.push({
                              pathname: `/apotekerclass/content/${params.id}/video`,
                              query: {
                                course_id: data?.data.course_id,
                                course_title: data?.data.title,
                                segment_id: segment.segment_id,
                                segment_title: segment.title,
                              },
                            });
                          }}
                        >
                          Tambah Video Baru
                        </DropdownItem>

                        <DropdownItem
                          key="new_post_test"
                          onClick={() => {
                            router.push({
                              pathname: `/apotekerclass/content/${params.id}/posttest`,
                              query: {
                                course_id: data?.data.course_id,
                                course_title: data?.data.title,
                                segment_id: segment.segment_id,
                                segment_title: segment.title,
                              },
                            });
                          }}
                        >
                          Tambah Post-Test Baru
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  }
                  classNames={{
                    title: "text-black font-bold",
                    indicator: "text-black",
                    content: "grid gap-1 left-8",
                  }}
                >
                  {segment.contents?.map((content) => (
                    <div
                      key={content.content_id}
                      className="ml-10 flex items-center justify-between rounded-xl [padding:0.5rem_1rem] hover:bg-purple/10"
                    >
                      <div className="flex items-center gap-2">
                        {content.content_type === "video" && (
                          <Video
                            weight="duotone"
                            size={18}
                            className="text-purple"
                          />
                        )}

                        {content.content_type === "test" && (
                          <FileText
                            weight="duotone"
                            size={18}
                            className="text-purple"
                          />
                        )}

                        <h4 className="font-bold text-black">
                          {content.title}{" "}
                          {content.content_type == "test" && (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="success"
                              classNames={{
                                base: "px-2 gap-1 ml-2",
                                content: "font-bold",
                              }}
                            >
                              Kuis Segmen
                            </Chip>
                          )}
                        </h4>
                      </div>

                      <div className="inline-flex items-center gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          color="secondary"
                          onClick={() => {
                            if (content.content_type === "video") {
                              handleGetVideoUrl(content.video_url);
                            } else {
                              window.open(
                                `/apotekerclass/content/${content.content_id}/detail/test`,
                                "_blank",
                              );
                            }
                          }}
                        >
                          <CustomTooltip
                            content={`Detail ${content.content_type === "test" ? "Test" : "Video"}`}
                          >
                            <Eye weight="duotone" size={18} />
                          </CustomTooltip>
                        </Button>

                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          color="secondary"
                          onClick={() => {
                            if (content.content_type === "video") {
                              setSelectedVideo(content);
                              onOpenVideo();
                            } else {
                              window.open(
                                `/apotekerclass/content/${content.content_id}/detail/test`,
                                "_blank",
                              );
                            }
                          }}
                        >
                          <CustomTooltip
                            content={`Edit ${content.content_type === "test" ? "Test" : "Video"}`}
                          >
                            <PencilLine weight="duotone" size={18} />
                          </CustomTooltip>
                        </Button>

                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          color="secondary"
                          onClick={() => {
                            if (
                              confirm("Apakah anda yakin menghapus konten ini?")
                            ) {
                              handleDeleteContent(content.content_id);
                            }
                          }}
                        >
                          <CustomTooltip
                            content={`Hapus ${content.content_type === "test" ? "Test" : "Video"}`}
                          >
                            <Trash weight="duotone" size={18} />
                          </CustomTooltip>
                        </Button>
                      </div>
                    </div>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
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
