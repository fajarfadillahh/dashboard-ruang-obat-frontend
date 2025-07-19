import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import { SuccessResponse } from "@/types/global.type";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import EmptyData from "../EmptyData";

interface SubCategories {
  name: string;
  img_url: null;
  sub_categories: {
    sub_category_id: string;
    name: string;
    slug: string;
    img_url: string;
    created_at: Date;
    created_by: string;
  }[];
}

interface SectionSubCategoryProps {
  token: string;
  path?: string;
}

export default function SectionSubCategory({
  token,
  path,
}: SectionSubCategoryProps) {
  const router = useRouter();
  const { data, isLoading } = useSWR<SuccessResponse<SubCategories>>({
    url: "/subcategories/all/videocourse",
    method: "GET",
    token,
  });
  const [search, setSearch] = useState<string>("");

  const filterSubCategory =
    !isLoading || data?.data.sub_categories.length
      ? data?.data.sub_categories.filter((subcategory) =>
          [subcategory.name, subcategory.slug].some((value) =>
            value.toLowerCase().includes(search.toLowerCase()),
          ),
        )
      : [];

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="grid">
      <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
        <SearchInput
          placeholder="Cari Sub Kategori..."
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="max-w-[500px]"
        />
      </div>

      {filterSubCategory?.length ? (
        <div className="grid grid-cols-5 items-start gap-4">
          {filterSubCategory?.map((subcategory) => (
            <div
              key={subcategory.sub_category_id}
              className="group grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
              onClick={() => router.push(`${path}/${subcategory.slug}`)}
            >
              <img
                src={subcategory.img_url}
                alt={subcategory.name}
                className="size-20 rounded-full object-cover"
              />

              <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
                {subcategory.name}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center border-2 border-dashed border-gray/20 p-8">
          <EmptyData text="Sub Kategori Tidak Ditemukan!" />
        </div>
      )}
    </div>
  );
}
