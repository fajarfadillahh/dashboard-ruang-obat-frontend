import { useState } from "react";
import { useDebounce } from "use-debounce";

const useSearch = (delay: number) => {
  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, delay);

  return { search, setSearch, searchValue };
};

export default useSearch;
