import ButtonBack from "@/components/button/ButtonBack";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { DetailAccess } from "@/types/accesses/accesses.type";
import { SuccessResponse } from "@/types/global.type";
import { SubscriptionsResponse } from "@/types/subscriptions/packages.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { fetcher } from "@/utils/fetcher";
import { formatRupiah } from "@/utils/formatRupiah";
import { getError } from "@/utils/getError";
import {
  Button,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { FloppyDisk, Tag } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputState = {
  idempotency_key: string;
  type_access: string;
  product_type: string;
  discount_amount: number;
  user_timezone: string;
};

export default function ChangePlanApotekerClassAccess({
  token,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: dataSubscriptions } = useSWR<
    SuccessResponse<SubscriptionsResponse>
  >({
    url: getUrl("/subscriptions/packages?type=apotekerclass", {
      page: "1",
    }),
    method: "GET",
    token,
  });

  const { data } = useSWR<SuccessResponse<DetailAccess>>({
    url: `/accesses/${id}/detail`,
    method: "GET",
    token,
  });
  const [packageId, setPackageId] = useState<Selection>(new Set([]));

  const [input, setInput] = useState<InputState>({
    idempotency_key: "",
    type_access: "apotekerclass",
    product_type: "apotekerclass",
    discount_amount: 0,
    user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (key: keyof InputState, value: any) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleUpdatePlan() {
    const payload = {
      ...input,
      product_id: Array.from(packageId)[0] || "",
    };

    try {
      setIsLoading(true);

      await fetcher({
        url: "/accesses/plan",
        method: "PATCH",
        data: {
          ...payload,
          access_id: id,
        },
        token,
      });

      toast.success("Paket berhasil diubah");
      localStorage.removeItem("idempotency_key");
      return router.back();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let key = localStorage.getItem("idempotency_key");
    if (!key) {
      key =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("idempotency_key", key);
    }
    setInput((prev) => ({
      ...prev,
      idempotency_key: key as string,
    }));
  }, []);

  const product = Array.from(packageId).length
    ? dataSubscriptions?.data?.packages.find(
        (pkg) => pkg.package_id === Array.from(packageId)[0],
      )
    : null;

  const preview = [
    ["ID Pengguna", data?.data.user_id || ""],
    ["Nama Pengguna", data?.data.fullname || ""],
    [
      "Nama Produk",
      product ? (
        <div>
          <span className="text-danger-500 line-through">
            {data?.data.order.items[0].product_name}
          </span>{" "}
          <span>{product.name}</span>
        </div>
      ) : (
        <span>{data?.data.order.items[0].product_name}</span>
      ),
    ],
    [
      "Durasi",
      product ? (
        <div>
          <span className="text-danger-500 line-through">
            {data?.data.duration} bulan
          </span>{" "}
          <span>{product.duration} bulan</span>
        </div>
      ) : (
        <span>{data?.data.duration} bulan</span>
      ),
    ],
    ["Total Harga", product ? formatRupiah(product.price) : ""],
  ];

  if (input.discount_amount) {
    preview.push(
      [
        "Jumlah Diskon",
        input.discount_amount ? formatRupiah(input.discount_amount) : "0",
      ],
      [
        "Jumlah Akhir",
        product
          ? formatRupiah(product.price - (input.discount_amount || 0))
          : "",
      ],
    );
  }

  const packages =
    dataSubscriptions?.data?.packages.filter(
      (pkg) => pkg.package_id !== data?.data.order.items[0].product_id,
    ) || [];

  return (
    <Layout title="Ubah Paket" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText title={`Ubah Paket ${data?.data.fullname} 📋`} text="" />

        <div className="grid max-w-[600px] gap-8 pt-8">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Select
                items={packages}
                label="Pilih paket"
                labelPlacement="outside"
                placeholder="Pilih paket berlangganan"
                selectedKeys={packageId}
                onSelectionChange={setPackageId}
              >
                {(pkg) => (
                  <SelectItem key={pkg.package_id} textValue={pkg.name}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-small">{pkg.name}</span>
                        <span className="text-md">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>

              <Input
                type="number"
                variant="flat"
                label="Diskon (optional)"
                labelPlacement="outside"
                placeholder="Contoh: 10000"
                name="discount_amount"
                value={input.discount_amount.toString()}
                onChange={(e) =>
                  handleChange("discount_amount", Number(e.target.value))
                }
                startContent={
                  <Tag weight="duotone" size={18} className="text-gray" />
                }
                classNames={customStyleInput}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">Detail Paket User</h1>
            <div className="grid flex-1 gap-1.5">
              {preview.map(([label, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-[150px_2px_1fr] gap-4 text-sm font-medium text-black"
                >
                  <p>{label}</p>
                  <span>:</span>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            isLoading={isLoading}
            isDisabled={isLoading || !Array.from(packageId).length}
            color="secondary"
            startContent={
              isLoading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleUpdatePlan}
            className="w-max justify-self-end font-semibold"
          >
            {isLoading ? "Tunggu Sebentar..." : "Ubah Paket"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      id,
    },
  };
});
