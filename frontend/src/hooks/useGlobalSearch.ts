import { useSearchStore } from "@/store/search.store";

export const useGlobalSearch = () => {
  const search = useSearchStore((state) => state.search);
  const setSearch = useSearchStore((state) => state.setSearch);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  return {
    search,
    setSearch,
    clearSearch,
  };
};
