import { NavLink, Outlet } from "react-router-dom";
import minimalist_everyday_goods_logo from "../assets/images/minimalist_everyday_goods_logo.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { showAsyncMessage } from "../slices/messageSlice";

const AdminLayout = () => {
  const getNavLinkClass = (isActive) => {
    return `nav-link mx-3 fs-4 fw-medium d-flex gap-2 ${isActive ? "text-primary" : "text-muted"}`;
  };

  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    //從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    //如果完全沒 Token，直接踢走，不用發請求了
    if (!token) {
      navigate("/login");
      return;
    }

    //把 Token 設定到 Axios 的預設 Header 中
    axios.defaults.headers.common["Authorization"] = token;

    const checkAdminLogin = async () => {
      try {
        await axios.post(`${url}/api/user/check`);
        setIsAuth(true);
      } catch {
        navigate("/login");

        dispatch(
          showAsyncMessage({
            id: crypto.randomUUID(),
            type: "danger",
            title: "驗證失敗",
            text: "請重新登入以繼續操作",
          }),
        );
      }
    };

    checkAdminLogin();
  }, [navigate, url, dispatch]);

  if (!isAuth) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 ">
        <Oval
          height={60}
          width={60}
          color="#748be7"
          secondaryColor="#0c4169"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
        <p className="mt-2">權限驗證中...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className=" fixed-top border-bottom bg-white">
        <div className="container">
          <nav className="navbar navbar-expand">
            {/* Logo */}
            <NavLink to="/" className="navbar-brand">
              <img
                src={minimalist_everyday_goods_logo}
                alt="拾光日常"
                className="navbar-logo"
                style={{
                  height: "55px",
                  width: "auto",
                }}
              />
            </NavLink>

            {/* Menu */}

            <div className="navbar-nav ms-auto">
              <NavLink
                className={({ isActive }) => getNavLinkClass(isActive)}
                to="/"
              >
                首頁
                <i className="bi bi-house-door"></i>
              </NavLink>
              <NavLink
                className={({ isActive }) => getNavLinkClass(isActive)}
                to="/admin/products"
              >
                產品管理
                <i className="bi bi-list-ul"></i>
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow-1 ">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
