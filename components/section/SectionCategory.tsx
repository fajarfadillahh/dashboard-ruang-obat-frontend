import LoadingScreen from "@/components/loading/LoadingScreen";
import SearchInput from "@/components/SearchInput";
import { SuccessResponse } from "@/types/global.type";
import useSWR from "swr";

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

export default function SectionCategory({ token }: { token: string }) {
  const { data, isLoading } = useSWR<SuccessResponse<SubCategories>>({
    url: "/subcategories/all/videocourse",
    method: "GET",
    token,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="grid">
      <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
        <SearchInput
          placeholder="Cari Sub Kategori..."
          // defaultValue={query.q as string}
          // onChange={(e) => setSearch(e.target.value)}
          // onClear={() => setSearch("")}
          className="max-w-[500px]"
        />
      </div>

      <div className="grid grid-cols-5 items-start gap-4">
        {data?.data.sub_categories.map((subcategory) => (
          <div
            key={subcategory.sub_category_id}
            className="group grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
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
    </div>
  );
}
