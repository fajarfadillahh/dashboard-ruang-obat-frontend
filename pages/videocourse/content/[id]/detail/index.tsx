import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
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
  Eye,
  FileText,
  Gear,
  PencilLine,
  Plus,
  Video,
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

export default function DetailVideoCourse({
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
      type: "videocourse",
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
            <ModalHeader>Edit Playlist</ModalHeader>
            <ModalBody>
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
            <ModalHeader>Edit Segmen</ModalHeader>
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
            <ModalHeader>Edit Konten Video</ModalHeader>
            <ModalBody>
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

        <div className="grid grid-cols-[180px_1fr]">
          <div className="relative h-[150px] w-[150px] rounded-xl">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <Image
                src={data?.data.thumbnail_url as string}
                alt={data?.data.title as string}
                layout="fill"
                objectFit="cover"
                className="rounded-xl object-cover object-center"
              />
            )}
          </div>

          <div className="grid w-full gap-2">
            {isLoading ? (
              <Skeleton className="h-12 w-full rounded-xl" />
            ) : (
              <h1 className="text-4xl font-black capitalize -tracking-wide text-black xl:text-5xl">
                {data?.data.title}
              </h1>
            )}

            {isLoading ? (
              <Skeleton className="h-12 w-full rounded-xl" />
            ) : (
              <p className="font-medium leading-[170%] text-gray">
                {data?.data.description}
              </p>
            )}
          </div>

          {!isLoading ? (
            <div className="absolute right-16">
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
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button
            variant="solid"
            color="secondary"
            startContent={<Plus weight="bold" size={18} />}
            onClick={() => {
              router.push({
                pathname: `/videocourse/content/${params.id}/segment`,
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
        <div className="w-full">
          <Accordion variant="splitted">
            {isLoading ? (
              <AccordionItem>
                <Skeleton className="h-8 w-full rounded-xl" />
              </AccordionItem>
            ) : (
              (data?.data.segments ?? []).map((segment) => (
                <AccordionItem
                  key={segment.segment_id}
                  title={`${segment.number}. ${segment.title}`}
                  className="!border-b-0"
                  startContent={
                    <>
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
                        <DropdownMenu aria-label="Static Actions">
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
                            key="new_pre_test"
                            onClick={() => {
                              router.push({
                                pathname: `/videocourse/content/${params.id}/pretest`,
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
                                pathname: `/videocourse/content/${params.id}/video`,
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
                                pathname: `/videocourse/content/${params.id}posttest`,
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
                    </>
                  }
                >
                  {segment.contents?.map((content) => (
                    <div
                      key={content.content_id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="flex items-center gap-2">
                        {content.content_type === "video" && (
                          <Video size={18} className="text-purple-500" />
                        )}
                        {content.content_type === "test" && (
                          <FileText size={18} className="text-purple-500" />
                        )}
                        {content.title}
                      </span>
                      <div>
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
                                `/videocourse/content/${content.content_id}/detail/test`,
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
                                `/videocourse/content/${content.content_id}/detail/test`,
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
                      </div>
                    </div>
                  ))}
                </AccordionItem>
              ))
            )}
          </Accordion>
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
