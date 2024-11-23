export const errorMessages: Record<number, string> = {
  401: "Anda Tidak Memiliki Akses Untuk Melakukan Perubahan",
  500: "Terjadi Kesalahan Pada Server, Silakan Coba Lagi",
  503: "Layanan Sedang Tidak Tersedia, Silakan Coba Lagi",
};

export const getErrorMessage = (
  statusCode: number,
  customMessages?: Record<number, string>,
): string => {
  if (customMessages?.[statusCode]) {
    return customMessages[statusCode];
  }

  return (
    errorMessages[statusCode] ||
    "Terjadi Kesalahan Pada Server, Silakan Coba Lagi"
  );
};
