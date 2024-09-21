import ButtonBack from "@/components/button/ButtonBack";
import CardInputTest from "@/components/card/CardInputTest";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import {
  Calendar,
  ClockCountdown,
  FloppyDisk,
  Plus,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function CreateTestPage() {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) return null;

  return (
    <Layout title="Create Test Page">
      <Container>
        <section className="grid">
          <ButtonBack />

          <div className="divide-y-2 divide-dashed divide-gray/20 py-8">
            <div className="grid gap-1 pb-10">
              <h1 className="text-[22px] font-bold -tracking-wide text-black">
                Buat Ujian ✏️
              </h1>
              <p className="font-medium text-gray">
                Saatnya buat ujian sekarang.
              </p>
            </div>

            <div className="grid gap-4 py-10">
              <h5 className="font-bold text-black">Data Ujian</h5>

              <Input
                isRequired
                type="text"
                variant="flat"
                label="Judul Ujian"
                labelPlacement="outside"
                placeholder="Contoh: Tryout Internal Ruangobat"
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
                className="flex-1"
              />

              <Textarea
                isRequired
                variant="flat"
                label="Deskripsi Ujian"
                labelPlacement="outside"
                placeholder="Ketikan Deskripsi Ujian..."
                classNames={{
                  input:
                    "font-semibold placeholder:font-normal placeholder:text-default-600",
                }}
              />

              <div className="grid grid-cols-3 gap-4">
                <DatePicker
                  isRequired
                  hideTimeZone
                  showMonthAndYearPickers
                  variant="flat"
                  label="Tanggal Mulai"
                  labelPlacement="outside"
                  endContent={<Calendar weight="bold" size={18} />}
                  hourCycle={24}
                  minValue={today(getLocalTimeZone())}
                  defaultValue={now(getLocalTimeZone())}
                />

                <DatePicker
                  isRequired
                  hideTimeZone
                  showMonthAndYearPickers
                  variant="flat"
                  label="Tanggal Selesai"
                  labelPlacement="outside"
                  endContent={<Calendar weight="bold" size={18} />}
                  hourCycle={24}
                  defaultValue={now(getLocalTimeZone())}
                />

                <Input
                  isRequired
                  type="number"
                  variant="flat"
                  label="Durasi Pengerjaan"
                  labelPlacement="outside"
                  placeholder="Satuan Menit..."
                  endContent={
                    <ClockCountdown
                      weight="bold"
                      size={18}
                      className="text-default-600"
                    />
                  }
                  classNames={{
                    input:
                      "font-semibold placeholder:font-normal placeholder:text-default-600",
                  }}
                />
              </div>
            </div>

            <div className="grid pt-10">
              <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white py-4">
                <h5 className="font-bold text-black">Daftar Soal</h5>

                <Button
                  variant="solid"
                  color="secondary"
                  startContent={<FloppyDisk weight="bold" size={18} />}
                  className="w-max justify-self-end font-bold"
                >
                  Simpan Ujian
                </Button>
              </div>

              <div className="grid gap-4 overflow-y-scroll">
                <div className="grid gap-2">
                  {Array.from({ length: 2 }, (_, i) => (
                    <CardInputTest key={i} />
                  ))}
                </div>

                <Button
                  variant="bordered"
                  color="default"
                  startContent={<Plus weight="bold" size={18} />}
                  className="font-bold"
                >
                  Tambah Soal
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
