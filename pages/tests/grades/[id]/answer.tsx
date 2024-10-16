import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { Radio, RadioGroup } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AnswerPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title="Daftar Semua Jawaban" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-4">
            <div className="grid gap-1">
              <h1 className="max-w-[550px] text-[24px] font-bold leading-[120%] -tracking-wide text-black">
                Fajar Fadillah Agustian
              </h1>
              <p className="font-medium text-gray">Stanford Univesity</p>
            </div>

            <div className="grid grid-cols-[1fr_260px] items-start gap-4">
              <div className="h-[500px] overflow-y-scroll rounded-xl border-2 border-gray/20 scrollbar-hide">
                <div className="sticky left-0 top-0 z-40 bg-white p-6 text-[18px] font-extrabold text-purple">
                  No. 1
                </div>

                <div className="grid gap-6 overflow-hidden p-[0_1.5rem_1.5rem]">
                  <p className="font-semibold leading-[170%] text-black">
                    Seorang pasien laki-laki berusia 50 tahun datang ke rumah
                    sakit dengan diagnosa kanker prostat. Setelah dilakukan
                    pemeriksaan, pasien direkomendasikan terapi menggunakan
                    Hidroksiurea yang akan dilakukan selama beberapa siklus.
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
                      color="danger"
                      classNames={{
                        label: "text-danger",
                      }}
                    >
                      Fase G1
                    </Radio>
                    <Radio
                      isDisabled={true}
                      value="fase-g2"
                      color="danger"
                      classNames={{
                        label: "text-danger",
                      }}
                    >
                      Fase G2
                    </Radio>
                    <Radio
                      isDisabled={true}
                      value="fase-m"
                      color="danger"
                      classNames={{
                        label: "text-danger",
                      }}
                    >
                      Fase M
                    </Radio>
                    <Radio
                      isDisabled={true}
                      value="fase-non-spesifik"
                      color="danger"
                      classNames={{
                        label: "text-danger",
                      }}
                    >
                      Fase non-spesifik
                    </Radio>
                  </RadioGroup>
                </div>
              </div>

              <div className="h-[500px] rounded-xl border-2 border-gray/20 p-6">
                <div className="grid gap-4 overflow-hidden">
                  <h4 className="text-sm font-semibold text-black">
                    Daftar Pertanyaan:
                  </h4>

                  <div className="grid h-full max-h-[400px] grid-cols-5 justify-items-center gap-2 overflow-y-scroll scrollbar-hide">
                    {Array.from({ length: 100 }, (_, i) => {
                      const randomAnswer = Math.floor(Math.random() * 3);
                      let answerClass = "";

                      if (randomAnswer === 0) {
                        answerClass = "bg-danger text-white";
                      } else {
                        answerClass = "bg-success text-white";
                      }

                      return (
                        <Link
                          key={i}
                          href="#"
                          className={`inline-flex size-[34px] items-center justify-center rounded-lg text-[12px] font-bold ${answerClass}`}
                        >
                          {i + 1}
                        </Link>
                      );
                    })}
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
