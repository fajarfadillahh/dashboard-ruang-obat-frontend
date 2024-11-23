import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { cloneElement } from "react";

type ModalConfirmProps = {
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  trigger: any;
  header: any;
  body: any;
  footer: any;
};

export default function ModalConfirm({
  hideCloseButton,
  isDismissable,
  trigger,
  header,
  body,
  footer,
}: ModalConfirmProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {cloneElement(trigger, { onClick: onOpen })}

      <Modal
        hideCloseButton={hideCloseButton}
        isDismissable={isDismissable}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {header && <ModalHeader>{header}</ModalHeader>}
              {body && <ModalBody>{body}</ModalBody>}
              {footer && (
                <ModalFooter>
                  {typeof footer == "function" ? footer(onClose) : footer}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
