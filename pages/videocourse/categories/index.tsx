import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
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
  Select,
  SelectItem,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import {
  FileText,
  Funnel,
  Gear,
  Plus,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function CategoriesPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });

  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<Category[]>
  >({
    url: getUrl(`/categories?type=videocourse`, {
      filter,
      sort,
    }),
    method: "GET",
    token,
  });
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddCategory() {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image as Blob);
      formData.append("type", "videocourse");
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

      setImage(null);
      setName("");

      toast.success("Kategori berhasil ditambahkan");
    } catch (error: any) {
      console.error(error);

      toast.error("Gagal menambahkan kategori");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <Layout title="Kategori - Video Pembelajaran" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Kategori - Video Pembelajaran 📚"
          text="Kategori yang tersedia pada kelas video pembelajaran."
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Select
              variant="flat"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
              size="md"
              placeholder="Filter"
              selectedKeys={[filter]}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="active">Aktif</SelectItem>
              <SelectItem key="inactive">Nonaktif</SelectItem>
            </Select>

            <Select
              variant="flat"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
              size="md"
              placeholder="Sort"
              selectedKeys={[sort]}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[180px] text-gray"
              classNames={{
                value: "font-semibold text-gray",
              }}
            >
              <SelectItem key="name.asc">Nama A-Z</SelectItem>
              <SelectItem key="name.desc">Nama Z-A</SelectItem>
              <SelectItem key="created_at.desc">Terbaru</SelectItem>
              <SelectItem key="created_at.asc">Terlama</SelectItem>
            </Select>

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
                        label="Nama Kategori"
                        labelPlacement="outside"
                        placeholder="Contoh: Farmakoterapi"
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

          <div className="grid grid-cols-5 items-start gap-4">
            {isLoading ? (
              Array.from({ length: data?.data.length || 10 }).map(
                (_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ),
              )
            ) : data?.data.length ? (
              data?.data.map((category) => (
                <div
                  key={category.category_id}
                  className="group relative grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
                  onClick={() =>
                    router.push(`/videocourse/categories/${category.slug}`)
                  }
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    color="secondary"
                    className="absolute right-4 top-4"
                  >
                    <CustomTooltip content="Edit Kategori">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <Image
                    src={category.img_url}
                    alt={category.name}
                    width={1000}
                    height={1000}
                    className="size-20 object-fill"
                  />

                  <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
                    {category.name}
                  </h4>
                </div>
              ))
            ) : (
              <div className="col-span-5 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Data kategori belum tersedia." />
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
