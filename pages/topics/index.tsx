import CustomTooltip from "@/components/CustomTooltip";
import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import ModalConfirm from "@/components/modal/ModalConfirm";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { Topic, TopicsResponse } from "@/types/topics/topic.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { getError } from "@/utils/getError";
import { handleKeyDown } from "@/utils/handleKeyDown";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { PencilLine, Plus, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export default function TopicsArticlePage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [searchValue] = useDebounce(search, 800);

  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [topicNameId, setTopicNameId] = useState<string>("");
  const [typeModal, setTypeModal] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<TopicsResponse>
  >({
    url: getUrl("/topics", {
      q: searchValue,
      page,
    }),
    method: "GET",
    token,
  });

  const columnsTopic = [
    { name: "Nama Topik", uid: "name" },
    { name: "Huruf Pertama", uid: "first_letter" },
    { name: "Dibuat Pada", uid: "created_at" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellTopics(topic: Topic, columnKey: React.Key) {
    const cellValue = topic[columnKey as keyof Topic];

    switch (columnKey) {
      case "name":
        return (
          <div className="w-[200px] font-medium text-black">{topic.name}</div>
        );
      case "first_letter":
        return (
          <div className="w-max font-medium text-black">
            {topic.first_letter}
          </div>
        );
      case "created_at":
        return (
          <div className="w-max font-medium text-black">
            {formatDate(topic.created_at)}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="secondary"
              onClick={() => {
                onOpen();
                setTypeModal("edit");

                setName(topic.name);
                setTopicNameId(topic.topic_id);
              }}
            >
              <CustomTooltip content="Edit Topik">
                <PencilLine weight="duotone" size={18} />
              </CustomTooltip>
            </Button>

            {topic.can_delete ? (
              <ModalConfirm
                trigger={
                  <Button isIconOnly variant="light" color="danger" size="sm">
                    <Trash weight="bold" size={18} className="text-danger" />
                  </Button>
                }
                header={<h1 className="font-bold text-black">Hapus Topik</h1>}
                body={
                  <div className="grid gap-3 text-sm font-medium">
                    <p className="leading-[170%] text-gray">
                      Apakah anda ingin menghapus topik{" "}
                      <strong className="font-bold text-danger">
                        {topic.name}
                      </strong>{" "}
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
                      className="font-bold"
                    >
                      Tutup
                    </Button>

                    <Button
                      color="danger"
                      className="font-bold"
                      onClick={() => {
                        handleDeleteTopic(topic.topic_id);
                      }}
                    >
                      Ya, Hapus
                    </Button>
                  </>
                )}
              />
            ) : null}
          </div>
        );

      default:
        return cellValue;
    }
  }

  async function handleAddTopic() {
    setLoading(true);

    try {
      await fetcher({
        url: "/topics",
        method: "POST",
        data: {
          name,
        },
        token,
      });

      mutate();
      onClose();
      setName("");

      toast.success("Topik berhasil ditambahkan!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditTopic() {
    setLoading(true);

    try {
      await fetcher({
        url: "/topics",
        method: "PATCH",
        data: {
          topic_id: topicNameId,
          name,
        },
        token,
      });

      mutate();
      onClose();
      setName("");

      toast.success("Topik berhasil di edit!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTopic(topic_id: string) {
    try {
      await fetcher({
        url: `/topics/${topic_id}`,
        method: "DELETE",
        token,
      });

      mutate();
      if (data?.data.topics.length === 1 && Number(page) > 1) {
        setPage(`${Number(page) - 1}`);
      }

      toast.success("Topik berhasil dihapus!");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Topik Artikel">
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
    <Layout title="Topik Artikel" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Daftar Topik Artikel 📝"
          text="Tabel topik artikel yang sudah di input"
        />

        <div className="grid" ref={divRef}>
          <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
            <SearchInput
              placeholder="Cari Topik Artikel atau ID Topik..."
              defaultValue={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage("1");
              }}
              onClear={() => setSearch("")}
            />

            <Button
              color="secondary"
              startContent={<Plus weight="bold" size={18} />}
              onClick={() => {
                onOpen();
                setTypeModal("create");
              }}
              className="font-semibold"
            >
              Tambah Topik
            </Button>

            <Modal
              isDismissable={false}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              scrollBehavior="inside"
              onClose={() => {
                setName("");
              }}
              size="sm"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-bold text-black">
                      {typeModal == "create" ? "Tambah" : "Edit"} Topik
                    </ModalHeader>

                    <ModalBody className="gap-8 scrollbar-hide">
                      <Input
                        isRequired
                        type="text"
                        variant="flat"
                        label="Nama Topik"
                        labelPlacement="outside"
                        placeholder="Contoh: Amoxcilin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            typeModal === "create"
                              ? handleAddTopic
                              : handleEditTopic,
                          )
                        }
                        classNames={customStyleInput}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => {
                          onClose();
                          setName("");
                        }}
                        className="font-semibold"
                      >
                        Tutup
                      </Button>

                      <Button
                        isLoading={loading}
                        isDisabled={!name.trim() || loading}
                        color="secondary"
                        onClick={() => {
                          typeModal === "create"
                            ? handleAddTopic()
                            : handleEditTopic();
                        }}
                        className="font-semibold"
                      >
                        {typeModal === "create" ? "Tambah" : "Simpan"}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <div className="overflow-x-scroll scrollbar-hide">
            <Table
              isStriped
              aria-label="topics table"
              color="secondary"
              selectionMode="none"
              classNames={customStyleTable}
              className="scrollbar-hide"
            >
              <TableHeader columns={columnsTopic}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>

              <TableBody
                isLoading={isLoading}
                items={data?.data.topics || []}
                emptyContent={<EmptyData text="Topik tidak ditemukan!" />}
                loadingContent={
                  <Spinner label="Loading..." color="secondary" />
                }
              >
                {(topic: Topic) => (
                  <TableRow key={topic.topic_id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCellTopics(topic, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && data?.data.topics.length ? (
          <Pagination
            isCompact
            showControls
            page={data?.data.page as number}
            total={data?.data.total_pages as number}
            onChange={(e) => {
              divRef.current?.scrollIntoView({ behavior: "smooth" });
              setPage(`${e}`);
            }}
            className="justify-self-center"
            classNames={{
              cursor: "bg-purple text-white",
            }}
          />
        ) : null}
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
