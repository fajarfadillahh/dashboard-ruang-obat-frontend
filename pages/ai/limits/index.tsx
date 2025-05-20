import ButtonBack from "@/components/button/ButtonBack";
import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import ModalConfirm from "@/components/modal/ModalConfirm";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { LimitAI } from "@/types/ai/limit.type";
import { SuccessResponse } from "@/types/global.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { CurrencyDollar, PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  type: string;
  total: number;
};

export default function AILimitsPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data, isLoading, error, mutate } = useSWR<SuccessResponse<LimitAI[]>>(
    {
      url: "/ai/limits",
      method: "GET",
      token,
    },
  );
  const [input, setInput] = useState<InputType>({
    type: "",
    total: 0,
  });
  const [limitId, setLimitId] = useState<string>("");
  const [typeModal, setTypeModal] = useState<"create" | "edit">("create");
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  useEffect(() => {
    const isInputValid = input.total && input.type;

    setIsDisableButton(!isInputValid);
  }, [input]);

  const columnsLimit = [
    { name: "Tipe Limit", uid: "type" },
    { name: "Total", uid: "total" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellLimits(limit: LimitAI, columnKey: React.Key) {
    const cellValue = limit[columnKey as keyof LimitAI];

    switch (columnKey) {
      case "type":
        return (
          <div className="font-medium text-black">
            {limit.type === "free" ? (
              "Gratis"
            ) : (
              <p className="inline-flex items-center">
                Berbayar
                <CurrencyDollar
                  weight="bold"
                  size={16}
                  className="text-success"
                />
              </p>
            )}
          </div>
        );
      case "total":
        return <div className="font-medium text-black">{limit.total}</div>;
      case "created_at":
        return (
          <div className="font-medium text-black">
            {formatDate(limit.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() => {
                onOpen();
                setTypeModal("edit");

                setLimitId(limit.limit_id);
                setInput({
                  total: limit.total,
                  type: limit.type,
                });
              }}
            >
              <CustomTooltip content="Edit Limit">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <CustomTooltip content="Hapus Limit">
                    <Trash weight="bold" size={18} className="text-danger" />
                  </CustomTooltip>
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Limit</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus limit{" "}
                    <strong className="font-extrabold text-purple">
                      {limit.total}
                    </strong>
                    ?
                  </p>
                </div>
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
                    onClick={() => handleDeleteLimit(limit.limit_id)}
                  >
                    Ya, Hapus Limit
                  </Button>
                </>
              )}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleAddLimit() {
    const payload = {
      ...input,
      by: session.data?.user.fullname,
      token,
    };

    try {
      await fetcher({
        url: "/ai/limits",
        method: "POST",
        data: payload,
        token,
      });

      mutate();
      toast.success("Limitasi berhasil ditambahkan");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleEditLimit() {
    const payload = {
      ...input,
      limit_id: limitId,
      by: session.data?.user.fullname,
      token,
    };

    try {
      await fetcher({
        url: "/ai/limits",
        method: "PATCH",
        data: payload,
        token,
      });

      mutate();
      toast.success("Limitasi berhasil diubah");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleDeleteLimit(limit_id: string) {
    try {
      await fetcher({
        url: `/ai/limits/${limit_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Limitasi berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Limitasi AI">
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

  return (
    <Layout title="Daftar Limitasi AI">
      <Container className="gap-8">
        <ButtonBack href="/ai" />

        <TitleText
          title="Daftar Limitasi AI 📋"
          text="Semua data limitasi akan muncul di sini"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex justify-end bg-white pb-4">
            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => {
                onOpen();
                setTypeModal("create");
              }}
              className="font-semibold"
            >
              Tambah Limitasi
            </Button>

            <Modal
              isDismissable={false}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              onClose={() => {
                onClose(),
                  setInput({
                    total: 0,
                    type: "",
                  });
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-extrabold capitalize text-black">
                      {typeModal == "create" ? "Tambah" : "Edit"} Limitasi
                    </ModalHeader>

                    <ModalBody>
                      <div className="grid gap-6">
                        <Input
                          isRequired
                          type="number"
                          variant="flat"
                          label="Jumlah Limitasi"
                          labelPlacement="outside"
                          name="total"
                          value={input.total.toString()}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              total: Number(e.target.value),
                            })
                          }
                          classNames={customStyleInput}
                        />

                        <RadioGroup
                          isRequired
                          aria-label="select limit type"
                          label="Tipe Limitasi"
                          color="secondary"
                          value={input.type}
                          onValueChange={(value) =>
                            setInput((prev) => ({ ...prev, type: value }))
                          }
                          classNames={{
                            base: "font-semibold text-black",
                            label: "text-sm font-normal text-foreground",
                          }}
                        >
                          <Radio value="free">Gratis</Radio>
                          <Radio value="paid">Berbayar</Radio>
                        </RadioGroup>
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        className="font-semibold"
                        onClick={() => {
                          onClose(),
                            setInput({
                              total: 0,
                              type: "",
                            });
                        }}
                      >
                        Tutup
                      </Button>

                      <Button
                        isDisabled={isDisableButton}
                        color="secondary"
                        onClick={() => {
                          typeModal == "create"
                            ? handleAddLimit()
                            : handleEditLimit();

                          onClose();
                        }}
                        className="font-semibold"
                      >
                        Ya, {typeModal == "create" ? "Tambahan" : "Simpan"}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isHeaderSticky
              aria-label="limits table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsLimit}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                items={data?.data}
                emptyContent={<EmptyData text="Limit tidak ditemukan!" />}
              >
                {(limit: LimitAI) => (
                  <TableRow key={limit.limit_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellLimits(limit, columnKey)}
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

export const getServerSideProps = withToken();
