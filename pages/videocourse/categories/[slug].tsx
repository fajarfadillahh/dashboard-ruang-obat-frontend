import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { SubCategory } from "@/types/categories/subcategory.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { FileText, Gear, Plus } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function SubCategoriesPage({
  token,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<SubCategory>
  >({
    url: `/categories/${encodeURIComponent(slug)}/videocourse`,
    method: "GET",
    token,
  });
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddSubCategory() {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("category_id", data?.data.category_id as string);
      formData.append("name", name);
      formData.append("image", image as Blob);
      formData.append("by", session.data?.user.fullname as string);

      await fetcher({
        url: "/subcategories",
        method: "POST",
        data: formData,
        file: true,
        token,
      });

      onClose();
      mutate();

      setImage(null);
      setName("");

      toast.success("Sub Kategori berhasil ditambahkan");
    } catch (error: any) {
      console.error(error);

      toast.error("Gagal menambahkan sub kategori");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Layout title={data?.data.name}>
        <Container>
          <ErrorPage
            {...{
              status_code: error.status_code,
              message: error.error.message,
              name: error.error.name,
            }}
          />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title={data?.data.name} className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title={`${data?.data.name} 📚`}
          text={`Daftar sub Kategori yang tersedia dari ${data?.data.name}`}
        />

        <div className="grid gap-4">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={onOpen}
              className="font-semibold"
            >
              Tambah Sub Kategori
            </Button>

            <Modal
              isDismissable={false}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              scrollBehavior="inside"
              onClose={() => {
                setImage(null);
                setName("");
              }}
              size="sm"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-bold text-black">
                      Tambah Sub Kategori
                    </ModalHeader>

                    <ModalBody className="scrollbar-hide">
                      <div className="grid w-full gap-4 rounded-xl border border-dashed border-gray/30 bg-gray/5 py-8">
                        <FileText
                          weight="duotone"
                          size={42}
                          className="justify-self-center text-purple"
                        />

                        <label className="flex items-center justify-center">
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (!e.target.files?.length) return;
                              setImage(e.target.files[0]);
                            }}
                          />

                          <div className="flex h-9 w-28 cursor-pointer flex-col items-center justify-center rounded-full bg-purple px-2 text-xs font-semibold leading-4 text-white shadow focus:outline-none">
                            {image ? image.name : "Pilih Gambar"}
                          </div>
                        </label>
                      </div>

                      <Input
                        isRequired
                        type="text"
                        variant="flat"
                        label="Nama Sub Kategori"
                        labelPlacement="outside"
                        placeholder="Contoh: Sub Farmakoterapi"
                        classNames={customStyleInput}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => {
                          onClose();
                          setImage(null);
                          setName("");
                        }}
                        className="font-semibold"
                      >
                        Tutup
                      </Button>

                      <Button
                        color="secondary"
                        onClick={handleAddSubCategory}
                        className="font-semibold"
                        isDisabled={!name || !image}
                        isLoading={loading}
                      >
                        Tambah Sub Kategori
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-5 gap-4">
              {Array.from({
                length: data?.data.sub_categories.length || 10,
              }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : data?.data.sub_categories.length ? (
            <div className="grid grid-cols-5 gap-4">
              {data?.data.sub_categories.map((subcategory) => (
                <div
                  key={subcategory.sub_category_id}
                  className="group relative grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    color="secondary"
                    className="absolute right-4 top-4"
                  >
                    <CustomTooltip content="Edit Sub Kategori">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <img
                    src={subcategory.img_url}
                    alt={subcategory.name}
                    className="size-20 rounded-full object-cover"
                  />

                  <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
                    {subcategory.name}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
              <EmptyData text="Data sub kategori belum tersedia." />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const slug = ctx.params?.slug as string;

  return {
    props: {
      slug,
    },
  };
});
