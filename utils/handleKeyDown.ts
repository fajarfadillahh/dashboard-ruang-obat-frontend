import { KeyboardEvent } from "react";

export function handleKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  callback: () => void,
) {
  if (e.key === "Enter") {
    callback();
  }
}
