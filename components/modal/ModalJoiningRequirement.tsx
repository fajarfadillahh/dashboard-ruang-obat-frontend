import { SuccessResponse } from "@/types/global.type";
import { ParticipantType } from "@/types/user.type";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { CheckCircle, Eye } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type RequirementProps = {
  program_id: string;
  participant: ParticipantType;
  token: string;
};

export default function ModalJoiningRequirement({
  program_id,
  participant,
  token,
}: RequirementProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetImagesApproval(program_id: string, user_id: string) {
    try {
      const response = (await fetcher({
        url: `/admin/programs/${program_id}/images/${user_id}`,
        method: "GET",
        token,
      })) as SuccessResponse<{ url: string }[]>;

      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleApprovalParticipant(
    program_id: string,
    user_id: string,
  ) {
    setLoading(true);

    try {
      (await fetcher({
        url: "/admin/programs/approved",
        method: "PATCH",
        token,
        data: {
          program_id: program_id,
          user_id: user_id,
        },
      })) as SuccessResponse<ParticipantType>;

      toast.success("Permintaan Berhasil Diterima");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Terjadi Kesalahan, Silakan Coba Lagi");
      console.error(error);
    }
  }

  return (
    <>
      <Button
        variant="light"
        color="secondary"
        size="sm"
        startContent={<Eye weight="bold" size={16} />}
        onPress={() => {
          onOpen(), handleGetImagesApproval(program_id, participant.user_id);
        }}
        className="font-bold"
      >
        Lihat Persyaratan
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-black">
                Permintaan Bergabung
              </ModalHeader>

              <ModalBody>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    {[
                      ["ID Partisipan", `${participant.user_id}`],
                      ["Nama Lengkap", `${participant.fullname}`],
                      ["Asal Kampus", `${participant.university}`],
                      [
                        "Bergabung Pada",
                        `${
                          participant.joined_at === null
                            ? "-"
                            : formatDate(participant.joined_at)
                        }`,
                      ],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[120px_2px_1fr] gap-4 text-sm font-medium text-black"
                      >
                        <p>{label}</p>
                        <span>:</span>
                        <p className="font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    {images?.map((image, index) => (
                      <Link
                        href={image.url}
                        key={index}
                        className="overflow-hidden rounded-xl"
                        target="_blank"
                      >
                        <Image
                          isBlurred
                          src={`${image.url}`}
                          alt="approval image"
                          width={149.33}
                          height={149.33}
                          className="aspect-square rounded-xl border-2 border-dashed border-gray/30 bg-gray/10 object-cover object-center p-1"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold"
                >
                  Tutup
                </Button>

                {!participant.is_approved ? (
                  <Button
                    isLoading={loading}
                    variant="solid"
                    color="secondary"
                    onClick={() =>
                      handleApprovalParticipant(program_id, participant.user_id)
                    }
                    className="font-bold"
                  >
                    {loading ? "Tunggu Sebentar..." : "Permintaan Diterima"}
                  </Button>
                ) : (
                  <div className="inline-flex items-center gap-1">
                    <CheckCircle
                      weight="fill"
                      size={20}
                      className="text-success"
                    />
                    <p className="text-sm font-bold text-black">
                      Telah Diterima
                    </p>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
