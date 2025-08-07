import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import {
  Buildings,
  Calendar,
  Database,
  DownloadSimple,
  EnvelopeSimple,
  IconContext,
  Lock,
  PencilLine,
  Phone,
  Plus,
  Trash,
  User,
  Users,
} from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

type UserType = {
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  university: string;
  password: string;
  entry_year: string;
};

const initialInput: UserType = {
  fullname: "",
  email: "",
  gender: "",
  phone_number: "",
  university: "",
  entry_year: "",
  password: "",
};

export default function AddBatchesUsers({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    onOpen: onOpenAdd,
    onOpenChange: onOpenChangeAdd,
    isOpen: isOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    onOpen: onOpenImport,
    onOpenChange: onOpenChangeImport,
    isOpen: isOpenImport,
    onClose: onCloseImport,
  } = useDisclosure();
  const {
    onOpen: onOpenSubmit,
    onOpenChange: onOpenChangeSubmit,
    isOpen: isOpenSubmit,
    onClose: onCloseSubmit,
  } = useDisclosure();

  const [users, setUsers] = useState<UserType[]>([]);
  const [input, setInput] = useState<UserType>(initialInput);
  const [typeModal, setTypeModal] = useState<"add" | "edit">("add");
  const [userId, setUserId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [accessKey, setAccessKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startYear = 2015;
  const currentYear = new Date().getFullYear();

  const entryYears = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  );

  useEffect(() => {
    setIsClient(true);

    const storedUsers = localStorage.getItem("users_batches");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
      } catch (error) {
        console.error("Gagal parsing data dari localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("users_batches", JSON.stringify(users));
    }
  }, [users, isClient]);

  function handleAddUser(user: UserType) {
    setUsers((prev) => [...prev, user]);
    toast.success("Pengguna berhasil ditambahkan ke draft!");
  }

  function handleEditUser(user: UserType, index: number) {
    setUsers((prev) => {
      const updated = [...prev];
      updated[index] = user;
      return updated;
    });
    toast.success("Pengguna berhasil diedit!");
  }

  function handleRemoveUser(index: number) {
    setUsers((prev) => prev.filter((_, i) => i !== index));
    toast.success("Pengguna berhasil dihapus!");
  }

  function handleImportExcel() {
    if (!excelFile) return toast.error("File belum dipilih!");

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: UserType[] = XLSX.utils.sheet_to_json(ws);

        setUsers((prev) => {
          const updated = [...prev, ...data];
          localStorage.setItem("users_batches", JSON.stringify(updated));
          return updated;
        });

        toast.success("Data berhasil diimport!");
        setExcelFile(null);
        onCloseImport();
      } catch (err) {
        console.error("Error parsing:", err);
        toast.error("Gagal import data. Cek format file-nya.");

        setIsImporting(false);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsBinaryString(excelFile);
  }

  async function handleSubmitUsers() {
    setIsLoading(true);

    try {
      const payload = {
        access_key: accessKey,
        users: Array.from(users),
      };

      await fetcher({
        url: "/batches/users",
        method: "POST",
        data: payload,
        token,
      });

      router.push("/users");
      toast.success("Daftar pengguna berhasil ditambahkan!");

      setAccessKey("");
      localStorage.removeItem("users_batches");
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);

      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  if (!isClient) return null;

  return (
    <Layout title="Pengguna" className="scrollbar-hide">
      <Container className="gap-8">
        <ButtonBack />

        <TitleText
          title="Tambahkan Pengguna 🧑🏽‍💻"
          text="Buat akun untuk beberapa pengguna"
        />

        <div className="grid">
          <div className="sticky left-0 top-0 z-50 flex items-end justify-between gap-4 bg-white pb-4">
            <h1 className="text-xl font-bold text-black">Daftar Pengguna</h1>

            <div className="inline-flex items-center gap-4">
              <Button
                variant="light"
                color="secondary"
                startContent={<Plus weight="bold" size={18} />}
                onClick={() => {
                  onOpenAdd();
                  setTypeModal("add");
                }}
                className="font-semibold"
              >
                Tambah Pengguna
              </Button>

              <Button
                variant="light"
                color="secondary"
                startContent={<DownloadSimple weight="bold" size={18} />}
                onClick={onOpenImport}
                className="font-semibold"
              >
                Import Excel
              </Button>

              <Button
                isLoading={isLoading}
                isDisabled={users.length < 1 || isLoading}
                color="secondary"
                startContent={
                  !isLoading && <Database weight="bold" size={18} />
                }
                onClick={onOpenSubmit}
                className="font-semibold"
              >
                Simpan Database
              </Button>

              <Modal
                isDismissable={false}
                placement="center"
                scrollBehavior="inside"
                isOpen={isOpenAdd}
                onOpenChange={onOpenChangeAdd}
                onClose={() => {
                  onCloseAdd();
                  setInput(initialInput);
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="font-extrabold text-black">
                        {typeModal === "add" ? "Tambah" : "Edit"} Pengguna
                      </ModalHeader>

                      <ModalBody>
                        <IconContext.Provider
                          value={{
                            weight: "duotone",
                            size: 18,
                            className: "text-gray",
                          }}
                        >
                          <div className="grid gap-2">
                            <Input
                              type="text"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Nama Lengkap"
                              startContent={<User />}
                              name="fullname"
                              value={input.fullname}
                              onChange={(e) =>
                                setInput({ ...input, fullname: e.target.value })
                              }
                              classNames={customStyleInput}
                            />

                            <Input
                              type="text"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Alamat Email"
                              startContent={<EnvelopeSimple />}
                              name="email"
                              value={input.email}
                              onChange={(e) =>
                                setInput({ ...input, email: e.target.value })
                              }
                              classNames={customStyleInput}
                            />

                            <Input
                              type="text"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Nomor Telpon"
                              startContent={<Phone />}
                              name="phone_number"
                              value={input.phone_number}
                              onChange={(e) =>
                                setInput({
                                  ...input,
                                  phone_number: e.target.value,
                                })
                              }
                              classNames={customStyleInput}
                            />

                            <Select
                              aria-label="select gender"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Jenis Kelamin"
                              startContent={<Users />}
                              name="gender"
                              selectedKeys={[input.gender]}
                              onChange={(e) =>
                                setInput({ ...input, gender: e.target.value })
                              }
                              classNames={{
                                value: "font-semibold text-gray",
                              }}
                            >
                              <SelectItem key="M">Laki-Laki</SelectItem>
                              <SelectItem key="F">Perempuan</SelectItem>
                            </Select>

                            <Input
                              type="text"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Asal Kampus"
                              startContent={<Buildings />}
                              name="university"
                              value={input.university}
                              onChange={(e) =>
                                setInput({
                                  ...input,
                                  university: e.target.value,
                                })
                              }
                              classNames={customStyleInput}
                            />

                            <Select
                              aria-label="select entry_year"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Tahun Masuk Kuliah"
                              startContent={<Calendar />}
                              name="entry_year"
                              selectedKeys={[input.entry_year]}
                              onChange={(e) =>
                                setInput({
                                  ...input,
                                  entry_year: e.target.value,
                                })
                              }
                              classNames={{
                                value: "font-semibold text-gray",
                              }}
                            >
                              {entryYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year.toString()}
                                </SelectItem>
                              ))}
                            </Select>

                            <Input
                              type="text"
                              variant="flat"
                              labelPlacement="outside"
                              placeholder="Password: Min. 8 Karakter"
                              startContent={<Lock />}
                              name="password"
                              value={input.password}
                              onChange={(e) =>
                                setInput({ ...input, password: e.target.value })
                              }
                              classNames={customStyleInput}
                            />
                          </div>
                        </IconContext.Provider>
                      </ModalBody>

                      <ModalFooter>
                        <div className="inline-flex items-center gap-2">
                          <Button
                            color="danger"
                            variant="light"
                            onClick={onClose}
                            className="px-6 font-bold"
                          >
                            Tutup
                          </Button>

                          <Button
                            color="secondary"
                            onClick={() => {
                              onClose();

                              if (typeModal === "edit" && userId !== null) {
                                handleEditUser(input, userId);
                              } else {
                                handleAddUser(input);
                              }

                              setInput(initialInput);
                              setUserId(null);
                            }}
                            className="px-6 font-semibold"
                          >
                            {typeModal === "edit"
                              ? "Simpan Perubahan"
                              : "Tambah Pengguna"}
                          </Button>
                        </div>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Modal
                isDismissable={false}
                placement="center"
                scrollBehavior="inside"
                isOpen={isOpenImport}
                onOpenChange={onOpenChangeImport}
                onClose={() => {
                  onCloseImport();
                  setExcelFile(null);
                  setInput(initialInput);
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="font-extrabold text-black">
                        Import Data Pengguna
                      </ModalHeader>

                      <ModalBody className="grid gap-4">
                        <p className="font-medium leading-[170%] text-gray">
                          Masukan data pengguna berupa excel atau berformat
                          .xlsx .xls
                        </p>

                        <Input
                          type="file"
                          accept=".xlsx, .xls"
                          disabled={isImporting}
                          onChange={(e) =>
                            setExcelFile(e.target.files?.[0] || null)
                          }
                          classNames={{
                            input:
                              "block w-full flex-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple file:text-sm file:font-sans file:font-semibold file:text-white hover:file:bg-purple/80",
                          }}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <div className="inline-flex items-center gap-2">
                          <Button
                            color="danger"
                            variant="light"
                            onClick={() => {
                              onClose();
                              setExcelFile(null);
                            }}
                            className="px-6 font-bold"
                          >
                            Tutup
                          </Button>

                          <Button
                            isLoading={isImporting}
                            isDisabled={!excelFile || isImporting}
                            color="secondary"
                            onClick={handleImportExcel}
                            className="px-6 font-semibold"
                          >
                            {!isImporting && "Import Data"}
                          </Button>
                        </div>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Modal
                isDismissable={false}
                placement="center"
                scrollBehavior="inside"
                isOpen={isOpenSubmit}
                onOpenChange={onOpenChangeSubmit}
                onClose={() => {
                  onCloseImport();
                  setAccessKey("");
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="font-extrabold text-black">
                        Pemberitahuan
                      </ModalHeader>

                      <ModalBody className="grid gap-4">
                        <p className="font-medium leading-[170%] text-gray">
                          Apakah anda yakin ingin menyimpan data pengguna ke
                          dalam database?
                        </p>

                        <Input
                          type="text"
                          variant="flat"
                          labelPlacement="outside"
                          placeholder="Masukan Kunci Akses"
                          startContent={<Lock />}
                          name="access_key"
                          value={accessKey}
                          onChange={(e) => setAccessKey(e.target.value)}
                          classNames={customStyleInput}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <div className="inline-flex items-center gap-2">
                          <Button
                            color="danger"
                            variant="light"
                            onClick={() => {
                              onClose();
                              setAccessKey("");
                            }}
                            className="px-6 font-bold"
                          >
                            Tutup
                          </Button>

                          <Button
                            isLoading={isLoading}
                            isDisabled={isLoading || !accessKey}
                            color="secondary"
                            onClick={handleSubmitUsers}
                            className="px-6 font-semibold"
                          >
                            {!isLoading && "Simpan Database"}
                          </Button>
                        </div>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>

          <div className="grid gap-2">
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_max-content] gap-4 rounded-xl border-2 border-gray/20 p-8"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ["Nama Lengkap", user.fullname],
                    ["Alamat Email", user.email],
                    ["Nomor Telpon", user.phone_number],
                    [
                      "Jenis Kelamin",
                      user.gender === "M" ? "Laki-Laki" : "Perempuan",
                    ],
                    ["Asal Kampus", user.university],
                    ["Tahun Masuk Kampus", user.entry_year],
                    ["Password", user.password],
                  ].map(([label, value], index) => (
                    <div key={index} className="grid gap-1">
                      <span className="text-xs font-medium text-gray">
                        {label}:
                      </span>

                      <h3 className="font-medium text-black">{value}</h3>
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="secondary"
                  >
                    <PencilLine
                      weight="duotone"
                      size={18}
                      onClick={() => {
                        onOpenAdd();
                        setTypeModal("edit");

                        setInput(users[index]);
                        setUserId(index);
                      }}
                      className="text-purple"
                    />
                  </Button>

                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    color="danger"
                    onClick={() => handleRemoveUser(index)}
                  >
                    <Trash weight="duotone" size={18} className="text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken();
