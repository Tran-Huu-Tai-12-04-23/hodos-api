import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoading } from "src/context/LoadingContext";
import { useToast } from "src/context/ToastContext";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

export type Variables = {
  place: string;
};

export interface IDetailLocation {
  name: string;
  location: string;
  history: string;
  legend: string;
  architecture: string;
  religiousSignificance: string;
  culturalImportance: string;
  special: Special;
  visiting: Visiting;
  summary: string;
  lstImgs: string[];
}

export interface Special {
  historicalSignificance: string;
  architecturalSignificance: string;
  culturalSymbol: string;
}

export interface Visiting {
  bestTimeToVisit: string;
  expectCrowds: string;
  mustSee: string;
  respectfulVisiting: string;
}

type Response = {
  data: IDetailLocation;
};

const useLocationDetail = (variables: Variables) => {
  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const { data, isLoading, error } = useQuery<Response, Error>({
    queryKey: [endpoints.SCHEDULE_DETAIL, variables],
    queryFn: () =>
      rootApi.post<Variables, Response>(endpoints.SCHEDULE_DETAIL, variables),
  });

  useEffect(() => {
    if (error) {
      showToast("Cannot fetch location details, please try again", "ERROR");
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isLoading]);
  return {
    data: data?.data ?? null,
    isLoading: isLoading,
    error,
  };
};

export default useLocationDetail;
