import ButtonBack from "@/components/button/ButtonBack";
import EmptyData from "@/components/EmptyData";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { products } from "@/lib/products";
import { SuccessResponse } from "@/types/global.type";
import { TestimonialResponse } from "@/types/testimonial.type";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Skeleton,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { ImageSquare, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function TestimonialListPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { onOpen, onOpenChange, isOpen, onClose } = useDisclosure();
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });

  const { data, isLoading, mutate } = useSWR<
    SuccessResponse<TestimonialResponse>
  >({
    url: `/testimonials?type=${params.type}&page=${page}`,
    method: "GET",
    token,
  });
  const divRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const product = products.find((item) => item.code === router.query.type);

  async function handleAddTestimonial(local_files: File[]) {
    setLoading(true);
    try {
      const response: SuccessResponse<{ key: string; url: string }[]> =
        await fetcher({
          url: "/storage/presigned",
          method: "POST",
          data: {
            files: local_files.map((file) => ({
              filename: file.name,
              type: file.type,
            })),
            folder: "testimonials/",
            by: session.data?.user.fullname,
          },
          token,
        });

      const newRequests: XMLHttpRequest[] = [];

      local_files.forEach((file, i) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", response.data[i].url);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.onload = () => {
          if (
            local_files.every(
              (_, idx) =>
                newRequests[idx].readyState === 4 &&
                newRequests[idx].status === 200,
            )
          ) {
            fetcher({
              url: "/batches/testimonials",
              method: "POST",
              data: {
                keys: response.data.map((item) => item.key),
                type: params.type,
              },
              token,
            })
              .then(() => {
                toast.success("Berhasil mengunggah testimonial");
                setLoading(false);
                mutate();
                onClose();
              })
              .catch(() => {
                toast.error("Gagal mengunggah file, silakan coba lagi.");
                setLoading(false);
              });
          }
        };

        xhr.onerror = () => {
          toast.error("Gagal upload file, silakan coba lagi.");
          setLoading(false);
        };

        xhr.send(file);
        newRequests.push(xhr);
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah file, silakan coba lagi.");
    }
  }

  async function handleDeleteTestimonial(testimonial_id: string) {
    if (!confirm("apakah anda yakin?")) return;

    try {
      await fetcher({
        url: `/testimonials/${testimonial_id}`,
        method: "DELETE",
        token,
      });

      toast.success("Berhasil menghapus testimonial");
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus testimonial");
    }
  }

  return (
    <Layout
      title={`Daftar Testimonial ${product?.label}`}
      className="scrollbar-hide"
    >
      <Container className="gap-8">
        <ButtonBack />

        {isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-8 w-[300px] rounded-lg" />
            <Skeleton className="h-8 w-[500px] rounded-lg" />
          </div>
        ) : (
          <TitleText
            title="Daftar Testimonial 📝"
            text={`Testimonial pada ${product?.label} akan tampil di ini`}
            className="w-max"
          />
        )}

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={onOpen}
              className="font-semibold"
            >
              Tambah Testimonial
            </Button>

            <Modal
              isDismissable={false}
              hideCloseButton={loading}
              placement="center"
              scrollBehavior="inside"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClose={() => {
                onClose();
              }}
            >
              <ModalContent>
                <ModalHeader className="font-extrabold text-black">
                  Tambah Testimonial
                </ModalHeader>

                <ModalBody>
                  <div
                    className="grid w-full gap-4 rounded-xl border border-dashed border-gray/30 bg-gray/5 py-8"
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleAddTestimonial(Array.from(e.dataTransfer.files));
                    }}
                  >
                    <ImageSquare
                      weight="duotone"
                      size={42}
                      className="justify-self-center text-purple"
                    />

                    <label className="flex items-center justify-center">
                      {loading ? (
                        <Spinner color="secondary" />
                      ) : (
                        <>
                          <input
                            multiple
                            hidden
                            accept=".jpg, .jpeg, .png"
                            type="file"
                            onChange={(e) => {
                              if (!e.target.files?.length) return;
                              handleAddTestimonial(Array.from(e.target.files));
                            }}
                          />

                          <div className="flex h-9 w-28 cursor-pointer flex-col items-center justify-center rounded-full bg-purple px-2 text-xs font-semibold leading-4 text-white shadow focus:outline-none">
                            klik atau drag
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </ModalBody>

                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.testimonials.length || 10 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.testimonials.length ? (
              data?.data.testimonials.map((item) => (
                <div
                  key={item.testimonial_id}
                  className="group relative isolate grid h-auto items-center justify-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
                  onClick={() => window.open(item.img_url, "_blank")}
                >
                  <Image
                    src={item.img_url}
                    alt="testimonial image"
                    width={500}
                    height={500}
                    className="aspect-square size-full rounded-lg object-cover object-center"
                    priority
                  />

                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteTestimonial(item.testimonial_id)}
                    className="absolute right-4 top-4 z-40 hidden group-hover:flex"
                  >
                    <Trash weight="duotone" size={18} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-5 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20">
                <EmptyData text="Testimoni Belum Tersedia!" />
              </div>
            )}
          </div>

          {!isLoading && data?.data.testimonials.length ? (
            <Pagination
              isCompact
              showControls
              page={data?.data.page as number}
              total={data?.data.total_pages as number}
              onChange={(e) => {
                divRef.current?.scrollIntoView({ behavior: "smooth" });
                setPage(`${e}`);
              }}
              className="mt-5 justify-self-center"
              classNames={{
                cursor: "bg-purple text-white",
              }}
            />
          ) : null}
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
