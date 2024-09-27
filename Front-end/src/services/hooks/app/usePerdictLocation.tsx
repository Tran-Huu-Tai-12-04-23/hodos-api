import { useMutation } from "@tanstack/react-query";
import { useToast } from "src/context/ToastContext";
import { ILocation } from "src/screens/app/HomeScreen/ViewDetail";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

export type Variables = {
  imgUrl: string;
};

type Response = {
  data: ILocation[];
};

const usePredictLocation = () => {
  const { showToast } = useToast();

  const mutation = useMutation<Response, Error, Variables>({
    mutationFn: (variables: Variables) => {
      return rootApi.post<Variables, Response>(
        endpoints.LOCATION_PREDICT,
        variables
      );
    },
    onError: (error) => {
      showToast("Cannot predict image, try again with another image", "ERROR");
    },
    onSuccess: () => {
      showToast("Predict image successfully", "SUCCESS");
    },
  });

  return {
    data: mutation.data?.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    onPredict: mutation.mutateAsync,
  };
};

export default usePredictLocation;
