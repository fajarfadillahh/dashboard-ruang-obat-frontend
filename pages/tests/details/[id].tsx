import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import {
  Accordion,
  AccordionItem,
  Chip,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { ClockCountdown } from "@phosphor-icons/react";

export default function DetailsTestPage() {
  return (
    <Layout title="Details Test Page">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid divide-y-2 divide-dashed divide-gray/20">
            <div className="grid gap-6 pb-8">
              <div>
                <h4 className="mb-2 text-[28px] font-bold capitalize leading-[120%] -tracking-wide text-black">
                  Tryout Internal Ruangobat Part 1
                </h4>
                <p className="max-w-[700px] font-medium leading-[170%] text-gray">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Deleniti doloremque commodi corrupti doloribus voluptatem in
                  voluptates voluptate vel a amet maxime nam natus libero nisi
                  quo, ratione cumque eaque assumenda!
                </p>
              </div>

              <div className="flex items-start gap-8">
                <div className="grid gap-1">
                  <span className="text-sm font-medium text-gray">
                    Tanggal Mulai:
                  </span>
                  <h1 className="font-semibold text-black">
                    5 Agustus 2024 10:00
                  </h1>
                </div>

                <div className="grid gap-1">
                  <span className="text-sm font-medium text-gray">
                    Tanggal Selesai:
                  </span>
                  <h1 className="font-semibold text-black">
                    10 Agustus 2024 23:59
                  </h1>
                </div>

                <div className="grid gap-1">
                  <span className="text-sm font-medium text-gray">
                    Durasi Pengerjaan:
                  </span>
                  <h1 className="font-semibold text-black">200 Menit</h1>
                </div>

                <div className="grid gap-1">
                  <span className="text-sm font-medium text-gray">
                    Jumlah Soal:
                  </span>
                  <h1 className="font-semibold text-black">100 Butir</h1>
                </div>

                <div className="grid gap-1">
                  <span className="text-sm font-medium text-gray">
                    Status Ujian:
                  </span>

                  <Chip
                    variant="flat"
                    color="default"
                    startContent={
                      <ClockCountdown
                        weight="bold"
                        size={18}
                        className="text-black"
                      />
                    }
                    classNames={{
                      base: "px-3 gap-1",
                      content: "font-semibold text-black",
                    }}
                  >
                    Belum Dimulai
                  </Chip>
                </div>
              </div>
            </div>

            <div className="grid pt-8">
              <div className="sticky left-0 top-0 z-50 bg-white py-4">
                <h5 className="font-bold text-black">Daftar Soal</h5>
              </div>

              <div className="grid gap-2 overflow-y-scroll">
                <div className="flex items-start gap-6 rounded-xl border-2 border-gray/20 p-6">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray/20 font-bold text-gray">
                    1
                  </div>

                  <div className="flex-1 divide-y-2 divide-dashed divide-gray/20">
                    <div className="grid gap-6 pb-6">
                      <p className="font-semibold leading-[170%] text-black">
                        Seorang pasien laki-laki berusia 50 tahun datang ke
                        rumah sakit dengan diagnosa kanker prostat. Setelah
                        dilakukan pemeriksaan, pasien direkomendasikan terapi
                        menggunakan Hidroksiurea yang akan dilakukan selama
                        beberapa siklus.
                        <br />
                        <br />
                        Pada fase manakah agen tersebut bekerja?
                      </p>

                      <RadioGroup
                        aria-label="select the answer"
                        defaultValue="fase-s"
                        classNames={{
                          base: "font-semibold text-black",
                        }}
                      >
                        <Radio
                          isDisabled={false}
                          value="fase-s"
                          color="success"
                          classNames={{
                            label: "text-success font-extrabold",
                          }}
                        >
                          Fase S
                        </Radio>
                        <Radio
                          isDisabled={true}
                          value="fase-g1"
                          color="default"
                        >
                          Fase G1
                        </Radio>
                        <Radio
                          isDisabled={true}
                          value="fase-g2"
                          color="default"
                        >
                          Fase G2
                        </Radio>
                        <Radio isDisabled={true} value="fase-m" color="default">
                          Fase M
                        </Radio>
                        <Radio
                          isDisabled={true}
                          value="fase-non-spesifik"
                          color="default"
                        >
                          Fase non-spesifik
                        </Radio>
                      </RadioGroup>
                    </div>

                    <div className="pt-6">
                      <Accordion variant="bordered">
                        <AccordionItem
                          aria-label="accordion answer"
                          key="answer"
                          title="Penjelasan:"
                          classNames={{
                            title: "font-semibold text-black",
                            content:
                              "font-medium text-black leading-[170%] pb-4",
                          }}
                        >
                          Hidroksiurea bekerja pada fase S dari siklus sel. Pada
                          fase S, sel melakukan replikasi atau duplikasi DNA
                          sebelum masuk ke tahap pembelahan. Dengan menghambat
                          sintesis DNA pada fase ini, Hidroksiurea mencegah sel
                          kanker untuk berkembang biak, sehingga memperlambat
                          atau menghentikan pertumbuhannya.
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
