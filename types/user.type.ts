export type User = {
  user_id: string;
  fullname: string;
  university: string;
};

export type UserType = {
  id_pengguna: string;
  nama_lengkap: string;
  email: string;
  no_telp: number | string;
  asal_kampus: string;
  kode_akses: string;
  status_bergabung: "mengikuti" | "belum mengikuti";
  bergabung_pada: string;
};
