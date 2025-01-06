export function validateEmail(value: string): string | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return value && !emailRegex.test(value) ? "Email tidak valid" : null;
}

export function validatePassword(value: string): string | null {
  return value && value.length < 8 ? "Minimal 8 karakter" : null;
}

export function validateFullname(value: string): string | null {
  const regexOnlyWordAndSpacing = /^[A-Za-z\s]+$/;
  return value && !regexOnlyWordAndSpacing.test(value)
    ? "Harus tanpa angka dan simbol"
    : null;
}

export function validatePhoneNumber(value: string): string | null {
  const phoneNumberRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
  return value && !phoneNumberRegex.test(value)
    ? "Nomor telepon tidak valid"
    : null;
}
function setInput(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}

function setErrors(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}
