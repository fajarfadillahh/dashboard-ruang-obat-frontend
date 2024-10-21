import ErrorPage from "@/components/ErrorPage";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { FeedbackType } from "@/types/feedback.type";
import { ErrorDataType, SuccessResponse } from "@/types/global.type";
import { fetcher } from "@/utils/fetcher";
import { formatDate } from "@/utils/formatDate";
import { Avatar, Input, Pagination } from "@nextui-org/react";
import { MagnifyingGlass, Star } from "@phosphor-icons/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type FeedbackProps = {
  feedback: FeedbackType[];
  page: number;
  total_feedback: number;
  total_pages: number;
};

const feedbacks: FeedbackType[] = [
  {
    user_id: "ROUTU461184",
    fullname: "Test User",
    rating: 5,
    text: "ajib kak, tingkatkan terus kalo bisa kasih program free sesering mungkin yaa",
    created_at: "2024-10-20T16:07:42.897Z",
  },
];

export default function FeedbackPage({
  feedback,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
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

  return (
    <Layout title="Daftar Masukan dan Saran" className="scrollbar-hide">
      <Container>
        <section className="grid gap-8">
          <div className="grid gap-1">
            <h1 className="text-[22px] font-bold -tracking-wide text-black">
              Masukan dan Saran ⭐
            </h1>
            <p className="font-medium text-gray">
              Semua masukan dan saran akan tampil disini
            </p>
          </div>

          <div className="grid gap-4">
            <div className="sticky left-0 top-0 z-50 bg-white">
              <Input
                type="text"
                variant="flat"
                labelPlacement="outside"
                placeholder="Cari User ID atau Nama User"
                startContent={
                  <MagnifyingGlass
                    weight="bold"
                    size={18}
                    className="text-gray"
                  />
                }
                classNames={{
                  input:
                    "font-semibold placeholder:font-semibold placeholder:text-gray",
                }}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-[500px]"
              />
            </div>

            {searchValue && feedback?.feedback.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-16">
                <MagnifyingGlass
                  weight="bold"
                  size={20}
                  className="text-gray"
                />
                <p className="font-semibold capitalize text-gray">
                  Feedback tidak ditemukan!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 items-start gap-x-4 gap-y-2">
                {feedback?.feedback.map((data, index) => (
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

          {feedback?.feedback.length ? (
            <Pagination
              isCompact
              showControls
              page={feedback?.page as number}
              total={feedback?.total_pages as number}
              onChange={(e) => {
                router.push({
                  query: {
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

type DataProps = {
  feedback?: FeedbackProps;
  error?: ErrorDataType;
};

function getUrl(query: ParsedUrlQuery) {
  if (query.q) {
    return `/admin/feedback?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `/admin/feedback?page=${query.page ? query.page : 1}`;
}

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  req,
  query,
}) => {
  const token = req.headers["access_token"] as string;

  try {
    const response = (await fetcher({
      url: getUrl(query) as string,
      method: "GET",
      token,
    })) as SuccessResponse<FeedbackProps>;

    return {
      props: {
        feedback: response.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        error,
      },
    };
  }
};
