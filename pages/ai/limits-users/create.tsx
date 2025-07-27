import ButtonBack from "@/components/button/ButtonBack";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import useSearch from "@/hooks/useSearch";
import { withToken } from "@/lib/getToken";
import { getUrl } from "@/lib/getUrl";
import { SuccessResponse } from "@/types/global.type";
import { User, UsersResponse } from "@/types/user.type";
import { customStyleInput } from "@/utils/customStyleInput";
import { customStyleTable } from "@/utils/customStyleTable";
import { fetcher } from "@/utils/fetcher";
import { getError } from "@/utils/getError";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Pagination,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Calendar, FloppyDisk } from "@phosphor-icons/react";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type InputType = {
  total: number;
  expired_at: string;
};

export default function CreateAILimitsCustomPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const session = useSession();
  const { setSearch, searchValue } = useSearch(800);
  const { data, isLoading, error } = useSWR<SuccessResponse<UsersResponse>>({
    url: getUrl("/admin/users", query),
    method: "GET",
    token,
  });
  const [input, setInput] = useState<InputType>({
    total: 0,
    expired_at: "",
  });
  const [value, setValue] = useState<Selection>(new Set([]));
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(true);

  useEffect(() => {
    if (searchValue) {
      router.push({ query: { q: searchValue } });
    } else {
      router.push("/ai/limits-users/create");
    }
  }, [searchValue]);

  useEffect(() => {
    const isInputValid = input.total && input.expired_at && value;

    setIsDisableButton(!isInputValid);
  }, [input, value]);

  const columnsUser = [
    { name: "ID Pengguna", uid: "user_id" },
    { name: "Nama Lengkap", uid: "fullname" },
  ];

  function renderCellUsers(user: User, columnKey: React.Key) {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "user_id":
        return (
          <div className="w-max font-medium text-black">{user.user_id}</div>
        );
      case "fullname":
        return <div className="font-medium text-black">{user.fullname}</div>;

      default:
        return cellValue;
    }
  }

  async function handleAddLimitUser() {
    const payload = {
      user_id: Array.from(value).toString(),
      total: input.total,
      expired_at: input.expired_at,
      by: session.data?.user.fullname,
    };

    try {
      setLoading(true);

      await fetcher({
        url: "/ai/limits/users",
        method: "POST",
        data: payload,
        token,
      });

      toast.success("Limit pengguna berhasil ditambahkan");
      router.push("/ai/limits-users");
    } catch (error: any) {
      setLoading(false);
      console.error(error);

      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Layout title="Tambah Limit Pengguna">
        <Container>
          <ErrorPage
            {...{
              status_code: error.status_code,
              message: error.error.message,
              name: error.error.name,
            }}
          />
        </Container>
      </Layout>
    );
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout title="Tambah Limit Pengguna" className="scrollbar-hide">
      <Container>
        <ButtonBack />

        <TitleText
          title="Tambah Limit Pengguna 📋"
          text="Tambahkan kustomisasi limit bagi pengguna spesial"
          className="border-b-2 border-dashed border-gray/20 py-8"
        />

        <div className="grid max-w-[700px] gap-8 pt-8">
          <div className="grid gap-8">
            <div className="grid grid-cols-2 items-center gap-4">
              <Input
                isRequired
                type="number"
                variant="flat"
                label="Jumlah Limitasi"
                labelPlacement="outside"
                name="total"
                value={input.total.toString()}
                onChange={(e) =>
                  setInput({
                    ...input,
                    total: Number(e.target.value),
                  })
                }
                classNames={customStyleInput}
              />

              <DatePicker
                isRequired
                hideTimeZone
                showMonthAndYearPickers
                hourCycle={24}
                variant="flat"
                label="Tanggal Expired"
                labelPlacement="outside"
                endContent={<Calendar weight="duotone" size={20} />}
                minValue={today(getLocalTimeZone())}
                defaultValue={now(getLocalTimeZone())}
                onChange={(date) => {
                  if (date) {
                    const newDate = date as DateValue;

                    setInput({
                      ...input,
                      expired_at: newDate.toDate("UTC").toISOString(),
                    });
                  }
                }}
              />
            </div>

            <div className="grid gap-2">
              <SearchInput
                placeholder="Cari Nama Pengguna atau ID Pengguna..."
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <div className="overflow-x-scroll scrollbar-hide">
                <Table
                  isHeaderSticky
                  aria-label="users table"
                  color="secondary"
                  selectionMode="single"
                  selectedKeys={value}
                  onSelectionChange={setValue}
                  classNames={customStyleTable}
                  className="scrollbar-hide"
                >
                  <TableHeader columns={columnsUser}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={data?.data.users ? data.data.users : []}
                    emptyContent={
                      <span className="text-sm font-semibold italic text-gray">
                        Pengguna tidak ditemukan!
                      </span>
                    }
                  >
                    {(item: User) => (
                      <TableRow key={item.user_id}>
                        {(columnKey) => (
                          <TableCell>
                            {renderCellUsers(item, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {data?.data?.users.length ? (
                <Pagination
                  isCompact
                  showControls
                  page={data.data.page as number}
                  total={data.data.total_pages as number}
                  onChange={(e) => {
                    router.push({
                      query: {
                        ...router.query,
                        page: e,
                      },
                    });
                  }}
                  className="justify-self-center"
                  classNames={{
                    cursor: "bg-purple text-white",
                  }}
                />
              ) : null}
            </div>
          </div>

          <Button
            isLoading={loading}
            isDisabled={isDisableButton || loading}
            color="secondary"
            startContent={
              loading ? null : <FloppyDisk weight="duotone" size={18} />
            }
            onClick={handleAddLimitUser}
            className="w-max justify-self-end font-semibold"
          >
            {loading ? "Tunggu Sebentar..." : "Tambah Pengguna"}
          </Button>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withToken(async (ctx) => {
  const { query } = ctx;

  return {
    props: {
      query: query as ParsedUrlQuery,
    },
  };
});
