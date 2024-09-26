import ButtonBack from "@/components/button/ButtonBack";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import Image from "next/image";

type UserType = {
  id: string | number;
  name: string;
  email: string;
  no_telp: number;
  university: string;
};

const user: UserType = {
  id: "ROUFFA152683",
  name: "Fajar Fadillah Agustian",
  email: "fajar.fadillah@mail.com",
  no_telp: 62812345678987,
  university: "Universitas Indonesia",
};

export default function DetailsUserPage() {
  return (
    <Layout title="Detail Pengguna">
      <Container>
        <section className="grid gap-8">
          <ButtonBack />

          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Detail Pengguna 🧑🏽‍💻
            </h1>
            <p className="font-medium text-gray">
              Anda bisa melihat data pengguna lebih detail disini.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-16">
            <div className="grid gap-2 rounded-xl border-2 border-l-8 border-gray/20 p-8">
              {[
                ["ID Pengguna", `${user.id}`],
                ["Nama Lengkap", `${user.name}`],
                ["Email", `${user.email}`],
                ["No. Telpon", `${user.no_telp}`],
                ["Asal Kampus", `${user.university}`],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-[150px_2px_1fr] gap-4 font-medium text-black"
                >
                  <p>{label}</p>
                  <span>:</span>
                  <p className="font-extrabold text-purple">{value}</p>
                </div>
              ))}
            </div>

            <Image
              priority
              src="/img/detail-user-img.svg"
              alt="detail user image"
              width={1000}
              height={500}
              className="h-auto w-[250px]"
            />
          </div>
        </section>
      </Container>
    </Layout>
  );
}
