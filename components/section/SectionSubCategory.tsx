import SearchInput from "@/components/SearchInput";
import { Category } from "@/types/categories/category.type";
import { SuccessResponse } from "@/types/global.type";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { SlidersHorizontal } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQueryState } from "nuqs";
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

  const [filter, setFilter] = useQueryState("filter", { defaultValue: "" });
  let url = "/subcategories/all/videocourse";

  if (filter === "name.asc" || filter === "name.desc") {
    url += `?sort=${filter}`;
  } else if (filter && filter !== "") {
    url = `/subcategories/${filter}/videocourse`;
  }

  const { data, isLoading } = useSWR<SuccessResponse<SubCategories>>({
    url,
    method: "GET",
    token,
  });

  const { data: dataCategory } = useSWR<SuccessResponse<Category[]>>({
    url: "/categories?type=videocourse",
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

  function renderContentSubCategory() {
    if (isLoading) {
      return Array.from({ length: filterSubCategory?.length || 10 }).map(
        (_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />,
      );
    }

    if (filterSubCategory?.length) {
      return filterSubCategory.map((subcategory) => (
        <div
          key={subcategory.sub_category_id}
          className="group grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
          onClick={() => router.push(`${path}/${subcategory.sub_category_id}`)}
        >
          <Image
            src={subcategory.img_url}
            alt={subcategory.name}
            width={1000}
            height={1000}
            className="size-20 object-fill"
          />

          <h4 className="line-clamp-2 text-center font-extrabold text-black group-hover:line-clamp-none">
            {subcategory.name}
          </h4>
        </div>
      ));
    }

    return (
      <div className="col-span-5 flex items-center justify-center border-2 border-dashed border-gray/20 p-8">
        <EmptyData text="Sub Kategori Tidak Ditemukan!" />
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="sticky left-0 top-0 z-50 flex items-center justify-between gap-4 bg-white pb-4">
        <SearchInput
          placeholder="Cari Sub Kategori..."
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />

        <Select
          variant="flat"
          startContent={
            <SlidersHorizontal weight="bold" size={18} className="text-gray" />
          }
          size="md"
          placeholder="Filter"
          selectedKeys={[filter]}
          onChange={(e) => setFilter(e.target.value)}
          items={[
            { key: "name.asc", label: "Nama A-Z" },
            { key: "name.desc", label: "Nama Z-A" },
            ...(dataCategory?.data.length
              ? dataCategory?.data.map((category) => ({
                  key: category.slug,
                  label: category.name,
                }))
              : []),
          ]}
          className="max-w-[180px] text-gray"
          classNames={{
            value: "font-semibold text-gray",
          }}
        >
          {(item) => (
            <SelectItem key={item.key} value={item.key}>
              {item.label}
            </SelectItem>
          )}
        </Select>
      </div>

      <div className="grid grid-cols-5 gap-4">{renderContentSubCategory()}</div>
    </div>
  );
}
