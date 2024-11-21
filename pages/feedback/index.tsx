import EmptyData from "@/components/EmptyData";
import ErrorPage from "@/components/ErrorPage";
import LoadingScreen from "@/components/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { FeedbackType } from "@/types/feedback.type";
import { SuccessResponse } from "@/types/global.type";
import { formatDate } from "@/utils/formatDate";
import { Avatar, Pagination } from "@nextui-org/react";
import { Star } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

type FeedbackResponse = {
  feedback: FeedbackType[];
  page: number;
  total_feedback: number;
  total_pages: number;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/feedback?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/feedback?page=${query.page ? query.page : 1}`;
}

export default function FeedbackPage({
  token,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<SuccessResponse<FeedbackResponse>>({
    url: getUrl(query) as string,
    method: "GET",
    token,
  });
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 800);

  useEffect(() => {
    if (searchValue) {
      router.push({
        query: {
          q: searchValue,
        },
      });
    } else {
      router.push("/feedback");
    }
  }, [searchValue]);

  function renderStars(rating: number) {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          weight="fill"
          size={18}
          className={i < rating ? "text-warning" : "text-gray/30"}
        />,
      );
    }
    return stars;
  }

  if (error) {
    return (
      <Layout title="Feedback">
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
    <Layout title="Feedback" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <TitleText
            title="Masukan dan Saran ⭐"
            text="Semua masukan dan saran akan tampil disini"
          />

          <div className="grid gap-4">
            <div className="sticky left-0 top-0 z-50 bg-white">
              <SearchInput
                placeholder="Cari User ID atau Nama User"
                defaultValue={query.q as string}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            </div>

            {searchValue && data?.data.feedback.length === 0 ? (
              <EmptyData text="Feedback tidak ditemukan!" />
            ) : (
              <div className="grid grid-cols-2 items-start gap-x-4 gap-y-2">
                {data?.data.feedback.map((data, index) => (
                  <div
                    key={index}
                    className="grid gap-4 rounded-xl border-2 border-purple/10 p-6 hover:border-purple hover:bg-purple/10"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-4">
                        <Avatar
                          isBordered
                          showFallback
                          size="sm"
                          src="/img/avatar.svg"
                          classNames={{
                            base: "ring-purple bg-purple/20",
                            icon: "text-purple",
                          }}
                        />

                        <div>
                          <h3 className="max-w-[300px] text-sm font-bold text-black">
                            {data.fullname}
                          </h3>
                          <p className="text-[12px] font-medium text-gray">
                            {data.user_id}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-1">
                        <p className="text-[12px] font-medium text-gray">
                          Dibuat Pada:
                        </p>
                        <h3 className="text-sm font-semibold text-black">
                          {formatDate(data.created_at)}
                        </h3>
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <div className="inline-flex items-center gap-1">
                        {renderStars(data.rating)}
                      </div>

                      <p className="text-sm font-medium leading-[170%] text-black">
                        {data.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {data?.data.feedback.length ? (
            <Pagination
              isCompact
              showControls
              page={data?.data.page as number}
              total={data?.data.total_pages as number}
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
        </section>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<{
  token: string;
  query: ParsedUrlQuery;
}> = async ({ req, query }) => {
  return {
    props: {
      token: req.headers["access_token"] as string,
      query,
    },
  };
};
