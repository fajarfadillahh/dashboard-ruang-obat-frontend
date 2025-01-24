import EmptyData from "@/components/EmptyData";
import ModalConfirm from "@/components/modal/ModalConfirm";
import { ClassMentor } from "@/types/classmentor.type";
import { customStyleTable } from "@/utils/customStyleTable";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Trash } from "@phosphor-icons/react";

type TableClassMentorProps = {
  mentors: ClassMentor[];
  handleDeleteClassMentor: (classMentorId: string) => void;
};

export default function TableClassMentor({
  mentors,
  handleDeleteClassMentor,
}: TableClassMentorProps) {
  const columnsClassMentor = [
    { name: "Mentor ID", uid: "mentor_id" },
    { name: "Nama Lengkap", uid: "fullname" },
    { name: "Nama Panggilan", uid: "nickname" },
    { name: "Mentor", uid: "mentor_title" },
    { name: "Aksi", uid: "action" },
  ];

  function renderCellClassMentor(mentor: ClassMentor, columnKey: React.Key) {
    const cellValue = mentor[columnKey as keyof ClassMentor];

    switch (columnKey) {
      case "mentor_id":
        return (
          <div className="w-max font-medium text-black">{mentor.mentor_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{mentor.fullname}</div>;
      case "nickname":
        return <div className="font-medium text-black">{mentor.nickname}</div>;
      case "mentor_title":
        return (
          <div className="w-max font-medium text-black">
            {mentor.mentor_title}
          </div>
        );
      case "action":
        return (
          <div className="inline-flex w-max items-center gap-1">
            <ModalConfirm
              trigger={
                <Button isIconOnly variant="light" color="danger" size="sm">
                  <Trash weight="bold" size={18} className="text-danger" />
                </Button>
              }
              header={<h1 className="font-bold text-black">Hapus Mentor</h1>}
              body={
                <div className="grid gap-3 text-sm font-medium">
                  <p className="leading-[170%] text-gray">
                    Apakah anda ingin menghapus {mentor.nickname} dari Kelas
                    Skripsi?
                  </p>
                </div>
              }
              footer={(onClose: any) => (
                <>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-bold"
                  >
                    Tutup
                  </Button>

                  <Button
                    color="danger"
                    className="font-bold"
                    onClick={() => {
                      handleDeleteClassMentor(mentor.class_mentor_id);
                    }}
                  >
                    Ya, Hapus Mentor
                  </Button>
                </>
              )}
            />
          </div>
        );

      default:
        return cellValue;
    }
  }

  return (
    <Table
      isHeaderSticky
      aria-label="theses table"
      color="secondary"
      selectionMode="none"
      classNames={customStyleTable}
      className="scrollbar-hide"
    >
      <TableHeader columns={columnsClassMentor}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>

      <TableBody
        items={mentors}
        emptyContent={<EmptyData text="Mentor tidak ditemukan!" />}
      >
        {(mentor) => (
          <TableRow key={mentor.mentor_id}>
            {(columnKey) => (
              <TableCell>{renderCellClassMentor(mentor, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
