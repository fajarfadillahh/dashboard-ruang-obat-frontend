import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { Button, Input, Textarea } from "@nextui-org/react";
import { FloppyDisk, Plus, Trash } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type InputState = {
  title: string;
  description: string;
};

type SubjectPart = {
  description: string;
  price: number;
  link_order: string;
};

export default function CreatePrivateContentPage({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const [input, setInput] = useState<InputState>({
    title: "",
    description: "",
  });
  const [subjectParts, setSubjectParts] = useState<SubjectPart[]>([
    { description: "", price: 0, link_order: "" },
  ]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isFormValid = [input.title, input.description].every(Boolean);
    const areSubjectPartsValid = subjectParts.every(
      (part) =>
        part.description.trim() && part.price > 0 && part.link_order.trim(),
    );

    setButtonDisabled(!(isFormValid && areSubjectPartsValid));
  }, [input, subjectParts]);

  const addSubjectPart = useCallback(() => {
    setSubjectParts((prev) => [
      ...prev,
      { description: "", price: 0, link_order: "" },
    ]);
  }, []);

  const updateSubjectPart = useCallback(
    (index: number, key: keyof SubjectPart, value: any) => {
      setSubjectParts((prev) =>
        prev.map((part, i) => (i === index ? { ...part, [key]: value } : part)),
      );
    },
    [],
  );

  const removeSubjectPart = useCallback((index: number) => {
    setSubjectParts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  async function handleCreatePackage() {
    setLoading(true);

    try {
      const fullname = session.data?.user.fullname;
      const payload = {
        title: input.title,
        description: input.description,
        subject_parts: subjectParts,
        by: fullname,
      };

      await fetcher({
        url: "/admin/subjects/private",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Paket berhasil dibuat");
      router.back();
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    }
  }

  return (
    <Layout title="Buat Paket Kelas Private Farmasi" className="scrollbar-hide">
      <Container>
        <section className="grid">
          <ButtonBack />

          <TitleText
            title="Buat Paket Kelas Private Farmasi 🔏"
            text="Tambahkan paket lainnya"
            className="border-b-2 border-dashed border-gray/20 py-8"
          />

          <div className="grid max-w-[900px] gap-8 pt-8">
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
                onChange={(e) => setInput({ ...input, title: e.target.value })}
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
                {subjectParts.map((part, index) => (
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
                        updateSubjectPart(index, "description", e.target.value)
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
                        updateSubjectPart(index, "link_order", e.target.value)
                      }
                      classNames={customStyleInput}
                    />

                    <Button
                      isIconOnly
                      variant="flat"
                      color="danger"
                      onClick={() => removeSubjectPart(index)}
                    >
                      <Trash weight="bold" size={18} className="text-danger" />
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

            <Button
              isLoading={loading}
              isDisabled={buttonDisabled || loading}
              color="secondary"
              startContent={
                loading ? null : <FloppyDisk weight="bold" size={18} />
              }
              onClick={handleCreatePackage}
              className="w-max justify-self-end font-bold"
            >
              {loading ? "Tunggu Sebentar..." : "Buat Paket"}
            </Button>
          </div>
        </section>
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
