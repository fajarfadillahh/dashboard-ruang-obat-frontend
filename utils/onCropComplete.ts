import { Dispatch, SetStateAction } from "react";

type onCropCompleteProps = {
  setCroppedAreaPixels: Dispatch<SetStateAction<null>>;
};

export function onCropComplete({ setCroppedAreaPixels }: onCropCompleteProps) {
  return (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
}
