import ButtonBack from "@/components/button/ButtonBack";
import CardQuestionPreview from "@/components/card/CardQuestionPreview";
import EmptyData from "@/components/EmptyData";
import ModalConfirm from "@/components/modal/ModalConfirm";
import ModalEditQuestion from "@/components/modal/ModalEditQuestion";
import ModalGenerateDataFromAi from "@/components/modal/ModalGenerateDataFromAi";
import ModalInputQuestion from "@/components/modal/ModalInputQuestion";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { SuccessResponse } from "@/types/global.type";
import { CreateQuestion } from "@/types/question.type";
import { DetailsTestResponse, Test, TestsResponse } from "@/types/test.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Database, DownloadSimple, Trash } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputType = {
  title: string;
  description: string;
};

export default function CreateTryoutPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { setSearch, searchValue } = useSearch(800);

  const [input, setInput] = useState<InputType>({
    title: "",
    description: "",
  });
  const initialQuestions: CreateQuestion[] = [];
  const [questions, setQuestions] = useState(initialQuestions);
  const [questionsFromAi, setQuestionsFromAi] = useState(initialQuestions);

  const [testsOSCE, setTestsOSCE] = useState<TestsResponse>();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loadingValue, setLoadingValue] = useState<boolean>(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  function handleAddQuestion(question: CreateQuestion) {
    setQuestions((prev) => [...prev, question]);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify([...questions, question]),
    );
    toast.success("Soal berhasil ditambahkan ke draft");
  }

  function handleEditQuestion(question: CreateQuestion, index: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = question;
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil diedit");
  }

  function handleRemoveQuestion(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem(
      "questions_tryout_apotekerclass",
      JSON.stringify(updatedQuestions),
    );
    toast.success("Soal berhasil dihapus");
  }

  async function handleSaveTryout() {
    setLoading(true);

    try {
      const payload = {
        ...input,
        questions: questions.map((question, index) => ({
          ...question,
          number: index + 1,
          type: question.type,
        })),
        by: session.data?.user.fullname,
      };

      await fetcher({
        url: "/universities/tryouts",
        method: "POST",
        data: payload,
        token,
      });

      router.back();
      toast.success("Tryout berhasil ditambahkan!");

      localStorage.removeItem("input_tryout_apotekerclass");
      localStorage.removeItem("questions_tryout_apotekerclass");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetDetailsTestOSCE() {
    setLoadingValue(true);

    try {
      const response: SuccessResponse<DetailsTestResponse> = await fetcher({
        url: `/admin/tests/${Array.from(value)}?all=true`,
        method: "GET",
        token,
      });

      onClose();
      setValue(new Set([]));

      const responseOSCE = response.data.questions;

      if (responseOSCE.length > 0) {
        setQuestions((prev) => [...prev, ...responseOSCE]);
        localStorage.setItem(
          "questions_tryout_apotekerclass",
          JSON.stringify([...questions, ...responseOSCE]),
        );
        toast.success("Data soal OSCE & UKMPPAI berhasil didapatkan!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));

      setLoadingValue(false);
    } finally {
      setLoadingValue(false);
    }
  }

  async function fetchTestsOSCE(url: string) {
    try {
      const response: SuccessResponse<TestsResponse> = await fetcher({
        url,
        method: "GET",
        token,
      });

      setTestsOSCE(response.data);
    } catch (error: any) {
      console.error("Error fetching tests:", error);

      toast.error(getError(error));
    }
  }

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    if (searchValue || page) {
      fetchTestsOSCE(`/admin/tests?q=${searchValue}&page=${page}`);
    }
  }, [searchValue, page]);

  useEffect(() => {
    if (isOpen) {
      fetchTestsOSCE(`/admin/tests?page=1`);
    }
  }, [isOpen]);

  useEffect(() => {
    const storedInput = localStorage.getItem("input_tryout_apotekerclass");
    const storedQuestions = localStorage.getItem(
      "questions_tryout_apotekerclass",
    );

    if (storedInput) setInput(JSON.parse(storedInput));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
  }, []);

  useEffect(() => {
    const isFormValid =
      Object.values(input).every((value) => value !== "") &&
      questions.length > 0;
    setIsButtonDisabled(!isFormValid);
  }, [input, questions]);

  useEffect(() => {
    if (questionsFromAi.length > 0) {
      setQuestions((prev) => [...prev, ...questionsFromAi]);
      localStorage.setItem(
        "questions_tryout_apotekerclass",
        JSON.stringify([...questions, ...questionsFromAi]),
      );
      toast.success("Soal dari AI berhasil ditambahkan ke draft");
      setQuestionsFromAi(initialQuestions);
    }
  }, [questionsFromAi]);

  const columnsTest = [
    { name: "ID Ujian", uid: "test_id" },
    { name: "Nama Ujian", uid: "title" },
    { name: "Status", uid: "status" },
  ];

  return (
    <Layout title="Buat Tryout" className="scrollbar-hide">
      <Container className="relative isolate gap-8">
        <ButtonBack />

        <div className="divide-y-2 divide-dashed divide-gray/20">
          <TitleText
            title="Buat Tryout ✏️"
            text="Saatnya buat tryout sekarang"
            className="pb-8"
          />

          <div className="grid gap-6 [padding:2rem_0_3rem]">
            <h5 className="-mb-2 text-xl font-bold text-black">Data Tryout</h5>

            <Input
              isRequired
              type="text"
              variant="flat"
              label="Judul Tryout"
              labelPlacement="outside"
              placeholder="Contoh: Tryout Universitas Pancasila"
              value={input.title}
              onChange={(e) => {
                setInput({
                  ...input,
                  title: e.target.value,
                });
              }}
              classNames={customStyleInput}
            />

            <Textarea
              isRequired
              variant="flat"
              label="Deskripsi Tryout"
              labelPlacement="outside"
              placeholder="Contoh: Kerjakan tryout dengan baik dan benar..."
              value={input.description}
              onChange={(e) => {
                setInput({
                  ...input,
                  description: e.target.value,
                });
              }}
              classNames={customStyleInput}
            />
          </div>

          <div className="grid pt-12">
            <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
              <h5 className="text-xl font-bold text-black">Daftar Soal</h5>

              <div className="inline-flex gap-4">
                <ModalInputQuestion
                  {...{ handleAddQuestion, page: "create", token: token }}
                />

                <Button
                  color="secondary"
                  startContent={<DownloadSimple weight="bold" size={18} />}
                  onClick={onOpen}
                  className="w-max font-semibold"
                >
                  Import Soal OSCE
                </Button>

                <ModalGenerateDataFromAi setQuestions={setQuestionsFromAi} />

                <ModalConfirm
                  trigger={
                    <Button
                      isDisabled={isButtonDisabled}
                      color="secondary"
                      startContent={
                        loading ? null : <Database weight="duotone" size={18} />
                      }
                      className="w-max justify-self-end font-semibold"
                    >
                      Simpan Database
                    </Button>
                  }
                  header={<h1 className="font-bold text-black">Perhatian!</h1>}
                  body={
                    <p className="leading-[170%] text-gray">
                      Apakah anda ingin menyimpan tryout ini ke dalam database?
                    </p>
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
                        isLoading={loading}
                        isDisabled={loading}
                        color="secondary"
                        onClick={handleSaveTryout}
                        className="font-semibold"
                      >
                        Ya, Simpan
                      </Button>
                    </>
                  )}
                />

                <Modal
                  isDismissable={false}
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  scrollBehavior="inside"
                  onClose={() => {
                    onClose();
                    setPage(1);
                    setValue(new Set([]));
                    setSearch("");
                    setLoadingValue(false);
                  }}
                  size="4xl"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="font-bold text-black">
                          Daftar Ujian OSCE & UKMPPAI
                        </ModalHeader>

                        <ModalBody className="scrollbar-hide">
                          <div className="grid gap-6">
                            <p className="max-w-[500px] text-sm font-medium leading-[170%] text-gray">
                              Cari ujian OSCE & UKMPPAI untuk ditambahkan pada
                              tryout Ruang Masuk Apoteker, pastikan ID ujian
                              OSCE & UKMPPAI yang anda cari sudah benar!
                            </p>

                            <div className="grid gap-4">
                              <SearchInput
                                placeholder="Cari Nama Ujian atau ID Ujian..."
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch("")}
                                className="max-w-[500px]"
                              />

                              <div className="max-h-[300px] overflow-x-scroll scrollbar-hide">
                                <Table
                                  isStriped
                                  aria-label="users table"
                                  color="secondary"
                                  selectionMode="single"
                                  selectedKeys={value}
                                  onSelectionChange={setValue}
                                  classNames={customStyleTable}
                                  className="scrollbar-hide"
                                >
                                  <TableHeader columns={columnsTest}>
                                    {(column) => (
                                      <TableColumn key={column.uid}>
                                        {column.name}
                                      </TableColumn>
                                    )}
                                  </TableHeader>

                                  <TableBody
                                    items={
                                      testsOSCE?.tests ? testsOSCE.tests : []
                                    }
                                    emptyContent={
                                      <span className="text-sm font-semibold italic text-gray">
                                        Ujian tidak ditemukan!
                                      </span>
                                    }
                                  >
                                    {(item: Test) => (
                                      <TableRow key={item.test_id}>
                                        {(columnKey) => (
                                          <TableCell>
                                            {getKeyValue(item, columnKey)}
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>

                              {testsOSCE?.tests.length ? (
                                <Pagination
                                  isCompact
                                  showControls
                                  page={testsOSCE?.page as number}
                                  total={testsOSCE?.total_pages as number}
                                  onChange={(e) => setPage(e)}
                                  className="justify-self-center"
                                  classNames={{
                                    cursor: "bg-purple text-white",
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </ModalBody>

                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                              onClose();
                              setPage(1);
                              setValue(new Set([]));
                              setSearch("");
                            }}
                            className="font-semibold"
                          >
                            Tutup
                          </Button>

                          <Button
                            isLoading={loadingValue}
                            isDisabled={loadingValue}
                            color="secondary"
                            onClick={handleGetDetailsTestOSCE}
                            className="font-semibold"
                          >
                            {!loadingValue && "Tambah Soal Ujian"}
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>

            <div className="grid gap-2 overflow-y-scroll scrollbar-hide">
              {questions.length ? (
                questions.map((question, index) => (
                  <CardQuestionPreview
                    key={index}
                    index={index}
                    question={question}
                    type="create"
                    buttonAction={
                      <div className="flex gap-2">
                        <ModalEditQuestion
                          {...{
                            question,
                            handleEditQuestion,
                            index,
                            page: "create",
                            token: token,
                          }}
                        />

                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          size="sm"
                          onClick={() => {
                            handleRemoveQuestion(index);
                            toast.success("Soal berhasil dihapus");
                          }}
                        >
                          <Trash
                            weight="duotone"
                            size={18}
                            className="text-danger"
                          />
                        </Button>
                      </div>
                    }
                  />
                ))
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gray/20">
                  <EmptyData text="Belum ada soal..." />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
