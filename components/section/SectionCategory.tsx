import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/SearchInput";
import { getUrl } from "@/lib/getUrl";
import { Category } from "@/types/categories/category.type";
import { SuccessResponse } from "@/types/global.type";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { Funnel } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
import { useState } from "react";
import useSWR from "swr";

interface SectionCategoryProps {
  token: string;
  path?: string;
}

export default function SectionCategory({ token, path }: SectionCategoryProps) {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const { data, isLoading, error } = useSWR<SuccessResponse<Category[]>>({
    url: getUrl("/categories?type=apotekerclass", { sort }),
    method: "GET",
    token,
  });

  const filterCategory =
    !isLoading || data?.data.length
      ? data?.data.filter((category) =>
          [category.name, category.slug].some((value) =>
            value.toLowerCase().includes(search.toLowerCase()),
          ),
        )
      : [];

  function renderContentCategory() {
    if (isLoading) {
      return Array.from({ length: filterCategory?.length || 10 }).map(
        (_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />,
      );
    }

    if (filterCategory?.length) {
      return filterCategory.map((category) => (
        <div
          key={category.category_id}
          className="group grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
          onClick={() => router.push(`${path}/${category.category_id}`)}
        >
          <Image
            src={category.img_url}
            alt={category.name}
            width={1000}
            height={1000}
            className="size-20 object-fill"
          />

          <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
            {category.name}
          </h4>
        </div>
      ));
    }

    return (
      <div className="col-span-5 flex items-center justify-center border-2 border-dashed border-gray/20 p-8">
        <EmptyData text="Kategori Tidak Ditemukan!" />
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
        <SearchInput
          placeholder="Cari Kategori..."
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />

        <Select
          aria-label="sort"
          size="md"
          variant="flat"
          placeholder="Sort"
          startContent={
            <Funnel weight="duotone" size={18} className="text-gray" />
          }
          selectedKeys={[sort]}
          onChange={(e) => setSort(e.target.value)}
          className="max-w-[180px] text-gray"
          classNames={{
            value: "font-semibold text-gray",
          }}
        >
          <SelectItem key="name.asc">Nama A-Z</SelectItem>
          <SelectItem key="name.desc">Nama Z-A</SelectItem>
          <SelectItem key="created_at.desc">Terbaru</SelectItem>
          <SelectItem key="created_at.asc">Terlama</SelectItem>
        </Select>
      </div>

      <div className="grid grid-cols-5 gap-4">{renderContentCategory()}</div>
    </div>
  );
}
