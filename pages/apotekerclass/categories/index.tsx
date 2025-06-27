import CustomTooltip from "@/components/CustomTooltip";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Category } from "@/types/categories/category.type";
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
  useDisclosure,
} from "@nextui-org/react";
import { Gear, Plus, Trash } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function CategoriesPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();

  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<Category[]>
  >({
    url: "/categories?type=apotekerclass",
    method: "GET",
    token,
  });
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (error) {
    return (
      <Layout title="Kategori">
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

  if (isLoading) return <LoadingScreen />;

  async function handleAddCategory() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image as Blob);
      formData.append("type", "apotekerclass");
      formData.append("by", session.data?.user.fullname as string);

      await fetcher({
        url: "/categories",
        method: "POST",
        data: formData,
        token,
        file: true,
      });

      onClose();
      mutate();
      toast.success("Kategori berhasil ditambahkan");
      setImage(null);
      setName("");
    } catch (error) {
      toast.error("Gagal menambahkan kategori");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Kategori" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Kategori 📚"
          text="Kategori yang tersedia pada kelas masuk apoteker."
        />

        <div className="grid gap-4">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={onOpen}
              className="font-semibold"
            >
              Tambah Kategori
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
                      Tambah Kategori
                    </ModalHeader>

                    <ModalBody className="scrollbar-hide">
                      <div className="grid w-full gap-5">
                        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-9">
                          <div className="grid gap-3">
                            <svg
                              className="mx-auto"
                              width={40}
                              height={40}
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="File">
                                <path
                                  id="icon"
                                  d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                                  fill="#6238c3"
                                />
                              </g>
                            </svg>
                            <div className="grid gap-1">
                              <div className="flex items-center justify-center">
                                <label>
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <Input
                        isRequired
                        type="text"
                        variant="flat"
                        label="Kategori"
                        labelPlacement="outside"
                        placeholder="Masukan Nama Kategori"
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
                        onClick={handleAddCategory}
                        className="font-semibold"
                        isDisabled={!name || !image}
                        isLoading={loading}
                      >
                        Tambah Kategori
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {data?.data.map((category) => (
              <div
                key={category.category_id}
                className="group relative grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 text-sm [padding:2rem_1rem] hover:cursor-pointer hover:bg-purple/10 sm:text-base"
              >
                <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
                  <Button isIconOnly variant="flat" size="sm" color="secondary">
                    <CustomTooltip content="Ubah Kategori">
                      <Gear weight="bold" size={18} className="text-purple" />
                    </CustomTooltip>
                  </Button>
                  <Button isIconOnly variant="flat" size="sm" color="danger">
                    <CustomTooltip content="Hapus Kategori">
                      <Trash weight="bold" size={18} className="text-red" />
                    </CustomTooltip>
                  </Button>
                </div>

                <img
                  src={category.img_url}
                  alt={category.name}
                  className="h-20 w-20 rounded-full object-cover"
                />

                <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
                  {category.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
}> = async ({ req }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
    },
  };
};
