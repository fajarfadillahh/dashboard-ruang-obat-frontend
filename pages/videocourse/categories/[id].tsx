import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingTitleImage from "@/components/loading/LoadingTitleImage";
import TitleTextImage from "@/components/title/TitleTextImage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
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
  Select,
  SelectItem,
  Skeleton,
  Switch,
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
import { useQueryState } from "nuqs";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function SubCategoriesPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });

  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<SubCategory>
  >({
    url: getUrl(
      `/categories/${encodeURIComponent(params?.id as string)}/videocourse`,
      {
        filter,
        sort,
      },
    ),
    method: "GET",
    token,
  });
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [typeModal, setTypeModal] = useState<"create" | "edit">("create");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

      toast.error("Gagal menambahkan sub kategori!");
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSubCategory() {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("category_id", data?.data.category_id as string);
      formData.append("sub_category_id", subCategoryId);
      formData.append("name", name);
      formData.append("image", image as Blob);
      formData.append("by", session.data?.user.fullname as string);
      formData.append("is_active", String(!isSelected));

      await fetcher({
        url: "/subcategories",
        method: "PATCH",
        data: formData,
        file: true,
        token,
      });

      onClose();
      mutate();

      setImage(null);
      setName("");
      setIsSelected(false);

      toast.success("Sub Kategori berhasil diubah!");
    } catch (error: any) {
      console.error(error);

      toast.error("Gagal mengubah sub kategori!");
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

        {isLoading ? (
          <LoadingTitleImage />
        ) : (
          <TitleTextImage
            src={data?.data.img_url as string}
            name={data?.data.name as string}
            description="Daftar sub Kategori dari"
          />
        )}

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-center justify-end gap-4 bg-white pb-4">
            <Select
              aria-label="filter"
              size="md"
              placeholder="Filter"
              variant="flat"
              startContent={
                <SlidersHorizontal
                  weight="bold"
                  size={18}
                  className="text-gray"
                />
              }
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
              aria-label="sort"
              size="md"
              placeholder="Sort"
              variant="flat"
              startContent={
                <Funnel weight="duotone" size={18} className="text-gray" />
              }
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
              onClick={() => {
                onOpen();
                setTypeModal("create");
              }}
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
                      {typeModal == "create" ? "Tambah" : "Edit"} Sub Kategori
                    </ModalHeader>

                    <ModalBody className="gap-8 scrollbar-hide">
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      {typeModal == "edit" && (
                        <Switch
                          size="sm"
                          color="secondary"
                          isSelected={isSelected}
                          onValueChange={setIsSelected}
                          className="-mt-4 text-sm font-semibold text-black"
                        >
                          Nonaktifkan Sub Kategori
                        </Switch>
                      )}
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
                        isLoading={loading}
                        onClick={() => {
                          if (typeModal == "create") {
                            handleAddSubCategory();
                          } else {
                            handleEditSubCategory();
                          }
                        }}
                        className="font-semibold"
                      >
                        {typeModal == "create"
                          ? "Tambah Sub Kategori"
                          : "Simpan Perubahan"}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {isLoading ? (
              Array.from({
                length: data?.data.sub_categories.length || 10,
              }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-xl" />
              ))
            ) : data?.data.sub_categories.length ? (
              data?.data.sub_categories.map((subcategory) => (
                <div
                  key={subcategory.sub_category_id}
                  className="group relative grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      onOpen();
                      setTypeModal("edit");

                      setName(subcategory.name);
                      setSubCategoryId(subcategory.sub_category_id);
                      setIsSelected(!subcategory.is_active as boolean);
                    }}
                    className="absolute right-4 top-4"
                  >
                    <CustomTooltip content="Edit Sub Kategori">
                      <Gear weight="bold" size={18} />
                    </CustomTooltip>
                  </Button>

                  <Image
                    src={subcategory.img_url}
                    alt={subcategory.name}
                    width={1000}
                    height={1000}
                    className="size-20 object-fill"
                    priority
                  />

                  <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
                    {subcategory.name}
                  </h4>
                </div>
              ))
            ) : (
              <div className="col-span-5 flex items-center justify-center rounded-xl border-2 border-dashed border-gray/20 p-8">
                <EmptyData text="Data sub kategori belum tersedia." />
              </div>
            )}
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
