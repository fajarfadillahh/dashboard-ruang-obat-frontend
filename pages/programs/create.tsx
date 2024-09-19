import { tests } from "@/_dummy/tests";
import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { FloppyDisk } from "@phosphor-icons/react";
import { useState } from "react";

export default function CreateProgramPage() {
  const [selected, setSelected] = useState<string>("");
  const [values, setValues] = useState<Selection>(new Set([]));

  return (
    <Layout title="Create Program Page">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="border-gray/200 grid gap-1 border-b-2 border-dashed pb-8">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Buat Program ✏️
            </h1>
            <p className="font-medium text-gray">
              Buatlah program yang menarik untuk para mahasiswa.
            </p>
          </div>

          <div className="grid gap-6 py-8">
            <Input
              isRequired
              type="text"
              variant="flat"
              label="Judul Program"
              labelPlacement="outside"
              placeholder="Contoh: Tryout Internal Ruangobat"
              classNames={{
                input:
                  "font-semibold placeholder:font-normal placeholder:text-default-600",
              }}
              className="flex-1"
            />

            <div className="grid grid-cols-[300px_1fr] items-start gap-4">
              <RadioGroup
                isRequired
                aria-label="select program type"
                label={
                  <span className="text-sm font-normal text-foreground">
                    Tipe Program
                  </span>
                }
                color="secondary"
                value={selected}
                onValueChange={setSelected}
                classNames={{
                  base: "font-semibold text-black",
                }}
              >
                <Radio value="free">Gratis</Radio>
                <Radio value="paid">Berbayar</Radio>
              </RadioGroup>

              {selected == "paid" ? (
                <Input
                  isRequired
                  type="number"
                  variant="flat"
                  label="Harga Program"
                  labelPlacement="outside"
                  placeholder="Contoh: 500.000"
                  startContent={
                    <span className="text-sm font-semibold text-default-600">
                      Rp
                    </span>
                  }
                  classNames={{
                    input:
                      "font-semibold placeholder:font-semibold placeholder:text-gray",
                  }}
                  className="flex-1"
                />
              ) : null}
            </div>

            <div className="grid gap-4">
              <Select
                isRequired
                aria-label="select test"
                label="Pilih Ujian"
                labelPlacement="outside"
                placeholder="Silakan Pilih Ujian..."
                items={tests}
                selectedKeys={values}
                onSelectionChange={setValues}
                selectionMode="multiple"
                classNames={{
                  value: "placeholder:font-black placeholder:text-gray",
                }}
              >
                {(test) => (
                  <SelectItem key={test.title}>{test.title}</SelectItem>
                )}
              </Select>

              <div className="grid gap-2 pl-16">
                <h6 className="text-sm font-semibold text-black">
                  Ujian yang sudah dipilih:
                </h6>
                <ul className="grid list-inside list-disc gap-[2px]">
                  {Array.from(values).map((value, index) => (
                    <li key={index} className="text-sm font-medium text-gray">
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Button
            variant="solid"
            color="secondary"
            startContent={<FloppyDisk weight="bold" size={18} />}
            className="w-max justify-self-end font-bold"
          >
            Simpan Program
          </Button>
        </section>
      </Container>
    </Layout>
  );
}
