import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { showAsyncMessage } from "../slices/messageSlice";
import { useDispatch } from "react-redux";
const Login = () => {
  const url = import.meta.env.VITE_URL;

  const [tokenData, setTokenData] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${url}/admin/signin`, data);
      const { token, expired } = res.data;

      setTokenData({ token, expired });
    } catch {
      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "danger",
          title: "驗證失敗",
          text: "登入失敗! 請重新嘗試",
        }),
      );
    }
  };

  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (cookieToken) {
      // 有 Token 時才去檢查
      const checkAdminLogin = async () => {
        try {
          await axios.post(`${url}/api/user/check`);
          navigate("/admin/products");
        } catch {
          // token 失效，清掉 cookie
          document.cookie =
            "hexToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      };
      checkAdminLogin();
      return;
    }

    if (tokenData) {
      const { token, expired } = tokenData;

      document.cookie = `hexToken=${token}; expires=${new Date(
        expired,
      )};  path=/`;

      navigate("/admin/products");
    }
  }, [tokenData, navigate, url]);
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 login">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          </div>
          <div className="col-8">
            <form
              id="form"
              className="form-signin"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                  {...register("username", {
                    required: "Email為必填",
                    pattern: { value: /^\S+@\S+$/i, message: "Email格式有誤" },
                  })}
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
                {loginErrors.username && (
                  <p className="text-danger">{loginErrors.username.message}</p>
                )}
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "密碼為必填",
                    minLength: { value: 6, message: "密碼至少需要 6 碼" },
                  })}
                />
                <label htmlFor="password">Password</label>
                {loginErrors.password && (
                  <p className="text-danger">{loginErrors.password.message}</p>
                )}
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2026~∞ - HexSchool</p>
      </div>
    </>
  );
};

export default Login;
