import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button, Input } from "@nextui-org/react";
import { FloppyDisk, Lock, User } from "@phosphor-icons/react";

export default function CreateAdminPage() {
  return (
    <Layout title="Create Admin Page">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="border-gray/200 grid gap-1 border-b-2 border-dashed py-8">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Buat Admin 🧑🏽
            </h1>
            <p className="font-medium text-gray">
              Tambahkan admin untuk dapat membantu yang lain.
            </p>
          </div>

          <div className="grid gap-4 py-8">
            <div className="grid grid-cols-2 gap-4">
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Nama Lengkap"
                labelPlacement="outside"
                placeholder="Contoh: Ahmad Megantara Putra"
                startContent={
                  <User weight="bold" size={18} className="text-default-600" />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
              />

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Username"
                labelPlacement="outside"
                placeholder="Contoh: ahmadmegantara.putra"
                startContent={
                  <User weight="bold" size={18} className="text-default-600" />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
              />
            </div>

            <Input
              isRequired
              type="text"
              variant="flat"
              label="Kata Sandi"
              labelPlacement="outside"
              placeholder="Masukan Kata Sandi"
              startContent={
                <Lock weight="bold" size={18} className="text-default-600" />
              }
              classNames={{
                input:
                  "font-semibold placeholder:font-normal placeholder:text-default-600",
              }}
            />
          </div>

          <Button
            variant="solid"
            color="secondary"
            startContent={<FloppyDisk weight="bold" size={18} />}
            className="w-max justify-self-end font-bold"
          >
            Simpan Admin
          </Button>
        </section>
      </Container>
    </Layout>
  );
}
