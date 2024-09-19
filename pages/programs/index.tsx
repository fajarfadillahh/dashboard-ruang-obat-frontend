import { programs } from "@/_dummy/programs";
import CardProgram from "@/components/card/CardProgram";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Button, Input } from "@nextui-org/react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

export default function ProgramsPage() {
  return (
    <Layout title="Users Page">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Daftar Program 📋
            </h1>
            <p className="font-medium text-gray">
              Buat program yang menarik untuk para mahasiswa.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari Program..."
                startContent={
                  <MagnifyingGlass
                    weight="bold"
                    size={18}
                    className="text-gray"
                  />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                }}
                className="flex-1"
              />

              <Button
                variant="solid"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                className="font-semibold"
              >
                Tambah Program
              </Button>
            </div>

            <div className="grid gap-2">
              {programs.map((program) => (
                <CardProgram key={program.id_program} {...program} />
              ))}
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}