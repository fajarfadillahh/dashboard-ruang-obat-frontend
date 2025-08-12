import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { products } from "@/lib/products";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { ImageSquare, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import useSWR from "swr";

export default function TestimonialListPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { onOpen, onOpenChange, isOpen, onClose } = useDisclosure();
  const { data, isLoading, mutate } = useSWR({
    url: `/testimonials?type=${params.type}`,
    method: "GET",
    token,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const product = products.find((item) => item.code === router.query.type);

  async function handleAddTestimonial() {
    const payload = {
      image: file,
      type: router.query.type,
      by: session.data?.user.fullname,
    };

    console.log(payload);
  }

  async function handleDeleteTestimonial(testimonial_id: string) {
    alert(`ID: ${testimonial_id} successfully deleted`);
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

        <div className="grid">
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
              placement="center"
              scrollBehavior="inside"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClose={() => {
                onClose();
                setFile(null);
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-extrabold text-black">
                      Tambah Testimonial
                    </ModalHeader>

                    <ModalBody>
                      <div className="grid w-full gap-4 rounded-xl border border-dashed border-gray/30 bg-gray/5 py-8">
                        <ImageSquare
                          weight="duotone"
                          size={42}
                          className="justify-self-center text-purple"
                        />

                        <label className="flex items-center justify-center">
                          <input
                            hidden
                            accept=".jpg, .jpeg, .png"
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
                    </ModalBody>

                    <ModalFooter>
                      <div className="inline-flex items-center gap-2">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={() => {
                            onClose();
                            setFile(null);
                          }}
                          className="px-6 font-bold"
                        >
                          Tutup
                        </Button>

                        <Button
                          color="secondary"
                          onClick={handleAddTestimonial}
                          className="px-6 font-semibold"
                        >
                          Simpan Testimonial
                        </Button>
                      </div>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group relative isolate grid h-auto items-center justify-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
              >
                <Image
                  src="https://ruangobat.is3.cloudhost.id/statics/images/ruangobat-logo/default-thumbnail.png"
                  alt="testimonial image"
                  width={500}
                  height={500}
                  className="size-full rounded-lg object-cover object-center"
                  priority
                />

                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteTestimonial(index.toString())}
                  className="absolute right-4 top-4 z-40 hidden group-hover:flex"
                >
                  <Trash weight="duotone" size={18} />
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
  const { params } = ctx;

  return {
    props: {
      params: params as ParsedUrlQuery,
    },
  };
});
