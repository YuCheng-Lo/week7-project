import { NavLink, Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import minimalist_everyday_goods_logo from "./assets/images/minimalist_everyday_goods_logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAsyncCart, selectCartItemsCount } from "./slices/cartSlice";

const Layout = () => {
  const { initialized } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!initialized) {
      dispatch(getAsyncCart());
    }
  }, [dispatch, initialized]);

  const cartItemsCount = useSelector(selectCartItemsCount);

  const getNavLinkClass = (isActive) => {
    return `nav-link mx-3 fs-4 fw-medium d-flex gap-2 ${isActive ? "text-primary" : "text-muted"}`;
  };
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
                to="/products"
              >
                產品列表
                <i className="bi bi-list-ul"></i>
              </NavLink>
              <NavLink
                className={({ isActive }) => getNavLinkClass(isActive)}
                to="/cart"
              >
                購物車
                <span className="position-relative d-inline-block">
                  <i className="bi bi-bag-check fs-4"></i>
                  {cartItemsCount > 0 && (
                    <span
                      className="badge rounded-pill text-bg-danger position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "0.65rem", padding: "0.25em 0.45em" }}
                    >
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink
                className={({ isActive }) => getNavLinkClass(isActive)}
                to="/login"
              >
                進入後台
                <i className="bi bi-box-arrow-in-right"></i>
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow-1 ">
        {/* my-5 pt-5 */}
        <Outlet />
      </main>
      <footer className="mt-auto py-3 text-center bg-secondary text-white">
        <p className="mt-3">
          本網站僅使用 cookie
          儲存登入狀態，不涉及追蹤與廣告。如需更多資訊，請參閱{" "}
          <Link className="text-white" to="/privacy-policy">
            隱私政策
          </Link>
          。
        </p>
        <p>© 2026 Cheng. 本網頁僅為作品展示用途。</p>
      </footer>
    </div>
  );
};

export default Layout;
