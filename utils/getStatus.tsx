import {
  CheckCircle,
  ClockCountdown,
  HourglassLow,
  XCircle,
} from "@phosphor-icons/react";

export const getStatusColor = (status: string) => {
  const statusColors = {
    "Belum dimulai": "danger",
    "Tidak aktif": "danger",
    Berlangsung: "warning",
    Aktif: "success",
  };

  return statusColors[status] || "success";
};

export const getStatusIcon = (status: string) => {
  const statusIcons = {
    "Belum dimulai": <ClockCountdown weight="fill" size={16} />,
    Berlangsung: <HourglassLow weight="fill" size={16} />,
    "Tidak aktif": <XCircle weight="fill" size={16} />,
    Aktif: <CheckCircle weight="fill" size={16} />,
  };

  return statusIcons[status] || <CheckCircle weight="fill" size={16} />;
};
