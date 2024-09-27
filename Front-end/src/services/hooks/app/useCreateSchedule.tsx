import { useMutation } from "@tanstack/react-query";
import { useToast } from "src/context/ToastContext";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

export type Variables = {
  kind: string[];
  long: 10.782920865147576;
  lat: 106.69800860703285;
  startTime: string;
  endTime: string;
};

export interface IScheduleItem {
  cost: string;
  description: string;
  endTime: string;
  image: string;
  latitude: number;
  longitude: number;
  name?: string;
  startTime?: string;
}

type Response = {
  data: IScheduleItem[];
};

const useCreateSchedule = () => {
  const { showToast } = useToast();

  const mutation = useMutation<Response, Error, Variables>({
    mutationFn: (variables: Variables) => {
      return rootApi.post<Variables, Response>(endpoints.SCHEDULE, variables);
    },
    onError: (error) => {
      showToast("Cannot create schedule, try again", "ERROR");
    },
    onSuccess: () => {
      showToast("Create schedule successfully", "SUCCESS");
    },
  });

  return {
    data: mutation.data?.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    onCreate: mutation.mutateAsync,
  };
};

export default useCreateSchedule;
