import { SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
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
    } catch (error) {
      console.error("Error fetching columns:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    const payload = { data: selected };

    try {
      console.log("Export successful:", payload);
    } catch (error) {
      console.error(error);
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
        color="secondary"
        variant="solid"
        startContent={<Export weight="bold" size={18} />}
        onClick={onOpen}
        className="font-bold"
      >
        Export Data
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        onClose={() => {
          setSelected([]);
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Export Data
              </ModalHeader>

              <ModalBody className="scrollbar-hide">
                {loading ? (
                  <div className="flex justify-center py-2 text-sm font-medium leading-[170%] text-black">
                    Tunggu Sebentar...
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <p className="text-sm font-medium leading-[170%] text-gray">
                      Pilih data kolom pengguna yang ingin anda export
                    </p>

                    <CheckboxGroup
                      color="secondary"
                      value={selected}
                      onValueChange={setSelected}
                    >
                      {columns.map((item) => (
                        <Checkbox key={item.field} value={item.field}>
                          <span className="text-sm font-medium leading-[170%] text-gray">
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
                  className="font-bold"
                >
                  Tutup
                </Button>

                <Button
                  isDisabled={selected.length === 0}
                  color="secondary"
                  variant="solid"
                  onClick={handleExport}
                  className="font-bold"
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
