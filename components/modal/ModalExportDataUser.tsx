import LoadingData from "@/components/loading/LoadingData";
import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Export } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

type ColumnsDataType = {
  field: string;
  translate: string;
};

export default function ModalExportDataUser({ token }: { token: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [columns, setColumns] = useState<ColumnsDataType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchColumns(url: string) {
    setLoading(true);

    try {
      const response: SuccessResponse<ColumnsDataType[]> = await fetcher({
        url,
        method: "GET",
        token,
      });

      setColumns(response.data || []);
    } catch (error: any) {
      console.error("Error fetching columns:", error);

      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleExportDataUser() {
    try {
      const response: SuccessResponse<any[]> = await fetcher({
        url: "/admin/exports/users",
        method: "GET",
        token,
      });

      const filteredData = response.data.map((item) => {
        const filteredItem: any = {};
        selected.forEach((field) => {
          filteredItem[field] = item[field];
        });

        return filteredItem;
      });

      const headers = selected.map((field) => {
        const column = columns.find((col) => col.field === field);
        return column ? column.translate : field;
      });

      const worksheetData = [
        headers,
        ...filteredData.map((row) => Object.values(row)),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pengguna");

      XLSX.writeFile(workbook, "Data Pengguna.xlsx");
      toast.success("Data pengguna berhasil diexport 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Uh oh! Terjadi kesalahan, silakan ulangi 😵");
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchColumns("/admin/columns/users");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant="light"
        color="secondary"
        startContent={<Export weight="duotone" size={18} />}
        onClick={onOpen}
        className="font-semibold"
      >
        Export Data
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        onClose={() => {
          setSelected([]);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-bold text-black">
                Export Data Pengguna
              </ModalHeader>

              <ModalBody className="scrollbar-hide">
                {loading ? (
                  <LoadingData />
                ) : (
                  <div className="grid gap-6">
                    <p className="leading-[170%] text-gray">
                      Pilih data kolom pengguna yang ingin anda export
                    </p>

                    <CheckboxGroup
                      color="secondary"
                      value={selected}
                      onValueChange={setSelected}
                    >
                      {columns.map((item) => (
                        <Checkbox key={item.field} value={item.field}>
                          <span className="leading-[170%] text-gray">
                            {item.translate}
                          </span>
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setSelected([]);
                  }}
                  className="font-semibold"
                >
                  Tutup
                </Button>

                <Button
                  isDisabled={selected.length === 0}
                  color="secondary"
                  onClick={handleExportDataUser}
                  className="font-semibold"
                >
                  Export
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
