import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import ErrorPage from "@/components/ErrorPage";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { LogoRuangobat } from "@/public/img/LogoRuangobat";
import { Accesses, DetailAccess } from "@/types/accesses/accesses.type";
import { SuccessResponse } from "@/types/global.type";
import { UniversityResponse } from "@/types/university.type";
import { fetcher } from "@/utils/fetcher";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { getStatus } from "..";

export default function DetailApotekerClassAccess({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<DetailAccess>
  >({
    url: `/accesses/${id}/detail`,
    method: "GET",
    token,
  });

  const { data: dataUniversities, isLoading: isLoadingUniversities } = useSWR<
    SuccessResponse<UniversityResponse[]>
  >({
    url: getUrl(`/universities`, { q: "" }),
    method: "GET",
    token,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  const availableUniversities = useMemo(() => {
    if (!dataUniversities?.data || !data?.data.universities) return [];
    const usedIds = new Set(data.data.universities.map((u) => u.title));
    return dataUniversities.data.filter((u) => !usedIds.has(u.title));
  }, [dataUniversities?.data, data?.data.universities]);

  if (error) {
    return (
      <Layout title="Detail Akses">
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

  async function handleDeleteTest(access_test_id: string) {
    try {
      await fetcher({
        url: `/accesses/tests/${access_test_id}`,
        method: "DELETE",
        token,
      });

      toast.success("Berhasil menghapus aksees universitas.");
      mutate();
    } catch (error) {
      console.error("Failed to delete access test:", error);
      toast.error("Gagal menghapus aksees universitas.");
    }
  }

  async function handleUpsertUniversities() {
    if (!selectedUniversity) return;

    try {
      await fetcher({
        url: `/accesses/tests`,
        method: "POST",
        token,
        data: {
          access_id: id,
          user_id: data?.data.user_id,
          univ_tests: [
            {
              access_test_id: id,
              univ_id: selectedUniversity,
            },
          ],
        },
      });

      toast.success("Berhasil menambahkan universitas.");
      setOpenModal(false);
      setSelectedUniversity("");
      mutate();
    } catch (error) {
      console.error("Failed to upsert universities:", error);
      toast.error("Gagal menambahkan universitas.");
    }
  }

  const columnsUniversities = [
    { name: "Nama Universitas", uid: "title" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellUniversity(
    university: DetailAccess["universities"][0],
    columnKey: React.Key,
  ) {
    const cellValue =
      university[columnKey as keyof DetailAccess["universities"][0]];

    switch (columnKey) {
      case "title":
        return <div className="font-medium text-black">{university.title}</div>;
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="danger"
              onClick={() => {
                if (confirm("apakah anda yakin?")) {
                  handleDeleteTest(university.access_test_id);
                }
              }}
            >
              <CustomTooltip content="Hapus Akses">
                <Trash weight="duotone" size={18} />
              </CustomTooltip>
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }

  const detail: any[] = [
    ["ID Pengguna", `${data?.data.user_id}`],
    ["Nama Lengkap", `${data?.data.fullname}`],
    [
      "Status",
      <Chip
        key={data?.data.user_id as string}
        variant="flat"
        size="sm"
        color={
          getStatus(data?.data.status as Accesses["status"])?.color as
            | "danger"
            | "default"
            | "primary"
            | "success"
            | "secondary"
            | "warning"
        }
        startContent={
          getStatus(data?.data.status as Accesses["status"])
            ?.icon as React.ReactNode
        }
        classNames={{
          base: "px-2 gap-1",
          content: "font-bold capitalize",
        }}
      >
        {getStatus(data?.data.status as Accesses["status"])?.label ?? "-"}
      </Chip>,
    ],
  ];

  return (
    <Layout title="Detail Akses Universitas" className="scrollbar-hide">
      <Container className="gap-2">
        <ButtonBack />

        <TitleText
          title={`Detail Akses Universitas ${data?.data.fullname}`}
          text=""
        />

        <div className="mb-8 grid grid-cols-[650px_auto] items-center gap-16">
          {isLoading ? (
            <Skeleton className="h-[450px] w-full rounded-xl" />
          ) : (
            <div className="flex items-start gap-4 rounded-xl border-2 border-l-8 border-gray/20 p-8">
              <div className="grid flex-1 gap-1.5">
                {detail.map(([label, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                  >
                    <p>{label}</p>
                    <span>:</span>
                    <p className="font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <LogoRuangobat className="h-[200px] w-auto justify-self-center text-gray/20 grayscale" />
        </div>

        <div className="grid w-[500px] gap-4">
          <Button
            color="secondary"
            startContent={<Plus weight="bold" size={16} />}
            onClick={() => {
              setOpenModal(true);
            }}
            className="w-max justify-self-end font-semibold"
          >
            Tambah Universitas
          </Button>

          <Modal
            isOpen={openModal}
            onOpenChange={setOpenModal}
            size="md"
            placement="center"
            onClose={() => {
              setSelectedUniversity("");
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Tambah Universitas</ModalHeader>
                  <ModalBody>
                    <Select
                      label="Pilih Universitas"
                      placeholder="Pilih universitas"
                      selectedKeys={
                        selectedUniversity ? [selectedUniversity] : []
                      }
                      onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                      }}
                      className="w-full"
                      isDisabled={availableUniversities.length === 0}
                    >
                      {availableUniversities.length === 0 ? (
                        <SelectItem key="none" value="">
                          Semua universitas sudah ditambahkan
                        </SelectItem>
                      ) : (
                        availableUniversities.map((u) => (
                          <SelectItem key={u.univ_id} value={u.univ_id}>
                            {u.title}
                          </SelectItem>
                        ))
                      )}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="light" onClick={onClose}>
                      Batal
                    </Button>
                    <Button
                      color="secondary"
                      isDisabled={
                        !selectedUniversity ||
                        availableUniversities.length === 0
                      }
                      onClick={handleUpsertUniversities}
                    >
                      Tambah
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              aria-label="university table"
              color="secondary"
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsUniversities}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data.universities ?? []}
                emptyContent={
                  <span className="text-sm font-semibold italic text-gray">
                    Universitas tidak ditemukan!
                  </span>
                }
                isLoading={isLoadingUniversities}
                loadingContent={
                  <Spinner size="md" color="secondary" label="Loading..." />
                }
              >
                {(item: DetailAccess["universities"][0]) => (
                  <TableRow key={item.access_test_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellUniversity(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
