import { useRouteError, Link, useNavigate } from "react-router-dom";
import ApiCrashed from "../../components/ApiCrashed";

const ProductError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = "載入商品時發生錯誤";

  if (error instanceof Response) {
    if (error.status === 404) {
      message = "哎呀！找不到這件商品";
    } else if (error.status === 500) {
      message = "伺服器有點累了，請稍後再試";
    }
  }

  return <ApiCrashed message={message} onRetry={() => navigate(0)} />;
};

export default ProductError;
