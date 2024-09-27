import { useMutation } from "@tanstack/react-query";
import { useToast } from "src/context/ToastContext";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

type LoginParams = {
  username: string;
  password: string;
  confirmPassword: string;
};
type RegisterResponse = any;

const useRegister = () => {
  const { showToast } = useToast();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: LoginParams) => {
      return rootApi.post<LoginParams, RegisterResponse>(
        endpoints.REGISTER,
        variables
      );
    },
    onError: (e: any) => {
      showToast(e.response.data.message, "ERROR");
    },
    onSuccess: () => {
      showToast("Create new an account successfully!", "SUCCESS");
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onRegister: mutateAsync,
  };
};

export default useRegister;
