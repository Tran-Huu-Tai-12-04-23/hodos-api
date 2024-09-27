import { useMutation } from "@tanstack/react-query";
import { useAuth } from "src/context/AuthContext";
import { useToast } from "src/context/ToastContext";
import { IUser } from "src/dto/user.dto";
import Helper from "src/Helper";
import { endpoints } from "src/services/endpoints";
import rootApi from "src/services/rootApi";

type LoginParams = {
  username: string;
  password: string;
};
type LoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
    enumData: any;
  };
};

const useLogin = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { isPending, isError, data, error, mutateAsync } = useMutation({
    mutationFn: (variables: LoginParams) => {
      return rootApi.post<LoginParams, LoginResponse>(
        endpoints.LOGIN,
        variables
      );
    },
    onError: (e: any) => {
      showToast(e.response.data.message, "ERROR");
    },
    onSuccess: async (data) => {
      await Helper.saveToken(data.data.accessToken);
      await login({ user: data.data.user, enumData: data.data.enumData });
    },
  });
  return {
    isLoading: isPending,
    isError,
    data,
    error,
    onLogin: mutateAsync,
  };
};

export default useLogin;
