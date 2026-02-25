import { useRouteError, Link } from "react-router-dom";

const ProductError = () => {
  const error = useRouteError();

  let message = "發生未知錯誤";
  let status = "";

  if (error instanceof Response) {
    status = error.status;

    if (error.status === 404) {
      message = "找不到該商品";
    } else if (error.status === 500) {
      message = "伺服器發生錯誤";
    }
  }

  return (
    <div className="container text-center pt-5 my-5">
      <h2>
        {status && `${status} - `}
        {message}
      </h2>
      <Link to="/products" className="btn btn-primary mt-3">
        返回商品列表
      </Link>
    </div>
  );
};

export default ProductError;
