import { setUser, setToken, setError, setLoading, logoutUser } from "../state/auth.slice";
import { register, login, logout, getMe } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegisterUser = async ({
    name,
    email,
    password,
    role,
    companyId,
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await register({
        name,
        email,
        password,
        role,
        companyId,
      });
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(setToken(data.token));
      }
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoginUser = async ({ email, password, role }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await login({ email, password, role });
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(setToken(data.token));
      }
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogoutUser = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await logout();
      dispatch(logoutUser());
    } catch (error) {
      // Even if API logout fails, clear local state
      dispatch(logoutUser());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      dispatch(logoutUser()); // clear invalid token
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleRegisterUser,
    handleLoginUser,
    handleLogoutUser,
    handleGetMe,
  };
};
