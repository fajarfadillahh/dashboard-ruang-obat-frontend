import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingData from "@/components/loading/LoadingData";
import LoadingScreen from "@/components/loading/LoadingScreen";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { SuccessResponse } from "@/types/global.type";
import { SubjectPrivateDetails } from "@/types/private.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Textarea } from "@nextui-org/react";
import { FloppyDisk, Plus, Trash } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputState = {
  title: string;
  description: string;
};

type SubjectPart = {
  subject_part_id: string;
  description: string;
  price: number;
  link_order: string;
};

export default function EditPrivateContentPage({
  token,
  params,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { data, error, isLoading, mutate } = useSWR<
    SuccessResponse<SubjectPrivateDetails>
  >({
    url: `/admin/subjects/private/${encodeURIComponent(params?.id as string)}`,
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputState>({
    title: "",
    description: "",
  });
  const [subjectParts, setSubjectParts] = useState<SubjectPart[]>([
    { subject_part_id: "", description: "", price: 0, link_order: "" },
  ]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!data?.data) return;

    const { title, description, subject_part, is_active } = data.data;

    setInput({ title, description });
    setSubjectParts(subject_part);
  }, [data?.data]);

  useEffect(() => {
    const isFormValid = [input.title, input.description].every(Boolean);
    const areSubjectPartsValid = subjectParts.every(
      (part) =>
        part.description.trim() && part.price > 0 && part.link_order.trim(),
    );

    setIsReady(true);
    setButtonDisabled(!(isFormValid && areSubjectPartsValid));
  }, [input, subjectParts]);

  function addSubjectPart() {
    setSubjectParts((prev) => [
      ...prev,
      {
        subject_part_id: crypto.randomUUID(),
        description: "",
        price: 0,
        link_order: "",
      },
    ]);
  }

  function updateSubjectPart(
    index: number,
    key: keyof SubjectPart,
    value: any,
  ) {
    setSubjectParts((prev) =>
      prev.map((part, i) => (i === index ? { ...part, [key]: value } : part)),
    );
  }

  async function handleDeleteSubSubjectPrivate(id: string) {
    try {
      await fetcher({
        url: `/admin/subjects/private/parts/${data?.data.subject_id}/${id}`,
        method: "DELETE",
        token,
      });

      mutate();
      toast.success("Harga berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      toast.error(getError(error));
    }
  }

  async function handleEditPackage() {
    setLoading(true);

    try {
      const fullname = session.data?.user.fullname;
      const formattedSubjectParts = subjectParts.map((part) => ({
        subject_part_id: part.subject_part_id || crypto.randomUUID(),
        description: part.description,
        price: part.price,
        link_order: part.link_order,
      }));

      const payload = {
        subject_id: data?.data.subject_id,
        title: input.title,
        description: input.description,
        subject_parts: formattedSubjectParts,
        by: fullname,
      };

      await fetcher({
        url: "/admin/subjects/private",
        method: "PATCH",
        data: payload,
        token,
      });

      toast.success("Paket berhasil diubah");
      router.back();
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  if (error) {
    return (
      <Layout title="Edit Paket Kelas Private Farmasi">
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
    <Layout title="Edit Paket Kelas Private Farmasi" className="scrollbar-hide">
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Edit Paket Kelas Private Farmasi 🔏"
            text="Edit dan sesuaikan data paket kelas"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[900px] gap-8 pt-8">
            {!isReady ? (
              <LoadingData />
            ) : (
              <>
                <div className="grid gap-4">
                  <Input
                    isRequired
                    type="text"
                    variant="flat"
                    label="Nama Kelas"
                    labelPlacement="outside"
                    placeholder="Contoh: Paket Ruang Bersama"
                    name="title"
                    value={input.title}
                    onChange={(e) =>
                      setInput({ ...input, title: e.target.value })
                    }
                    classNames={customStyleInput}
                  />

                  <Textarea
                    isRequired
                    maxRows={6}
                    type="text"
                    variant="flat"
                    label="Deskripsi Paket"
                    labelPlacement="outside"
                    placeholder="Masukan Deskripsi"
                    name="description"
                    value={input.description}
                    onChange={(e) =>
                      setInput({ ...input, description: e.target.value })
                    }
                    classNames={customStyleInput}
                  />
                </div>

                <div className="grid gap-6">
                  <h1 className="text-lg font-extrabold text-black">
                    Daftar Harga
                  </h1>

                  <div className="grid gap-4">
                    {subjectParts?.map((part, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[150px_repeat(2,1fr)_max-content] items-end gap-4"
                      >
                        <Input
                          isRequired
                          type="number"
                          variant="flat"
                          label="Nominal"
                          labelPlacement="outside"
                          placeholder="Contoh: Rp150.000"
                          value={part.price.toString()}
                          onChange={(e) =>
                            updateSubjectPart(
                              index,
                              "price",
                              Number(e.target.value),
                            )
                          }
                          classNames={customStyleInput}
                        />

                        <Input
                          isRequired
                          type="text"
                          variant="flat"
                          label="Deskripsi"
                          labelPlacement="outside"
                          placeholder="Contoh: Untuk 1 kali pertemuan"
                          value={part.description}
                          onChange={(e) =>
                            updateSubjectPart(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          classNames={customStyleInput}
                        />

                        <Input
                          isRequired
                          type="text"
                          variant="flat"
                          label="Link Order"
                          labelPlacement="outside"
                          placeholder="Contoh: https://lynk.id/xxxxx"
                          value={part.link_order}
                          onChange={(e) =>
                            updateSubjectPart(
                              index,
                              "link_order",
                              e.target.value,
                            )
                          }
                          classNames={customStyleInput}
                        />

                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          onClick={() =>
                            handleDeleteSubSubjectPrivate(part.subject_part_id)
                          }
                        >
                          <Trash
                            weight="bold"
                            size={18}
                            className="text-danger"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="bordered"
                    startContent={<Plus weight="bold" size={18} />}
                    className="font-bold"
                    onClick={addSubjectPart}
                  >
                    Tambahkan Harga
                  </Button>
                </div>
              </>
            )}

            <Button
              isLoading={loading}
              isDisabled={buttonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleEditPackage}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Simpan Paket"}
            </Button>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  params: ParsedUrlQuery;
}> = async ({ req, params }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      params: params as ParsedUrlQuery,
    },
  };
};
