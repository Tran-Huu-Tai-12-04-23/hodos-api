import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

type Variables = {
  where?: any;
  skip: number;
  take: number;
};

type Response = {
  data: any;
  totalCount: number;
};

const useLocationPagination = () => {
  const [variables] = useState({
    where: {},
    skip: 0,
    take: 0,
  });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: [endpoints.LOCATION],
    queryFn: ({}) => {
      return rootApi.post<Variables, Response>(endpoints.LOCATION, variables);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const totalCount = lastPage?.totalCount || 0;
      const nextPage = pages.length * variables.take;
      return nextPage < totalCount ? nextPage : undefined;
    },
  });

  return {
    isLoading: isPending,
    data: data?.pages.flatMap((page) => page.data)[0] || [],
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  };
};

export default useLocationPagination;
