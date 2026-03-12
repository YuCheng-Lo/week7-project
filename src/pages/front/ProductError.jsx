import { useRouteError, useNavigate } from "react-router-dom";
import ErrorView from "../../components/ErrorView";

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

  return (
    <ErrorView
      title="資料載入失敗..."
      message={message}
      onRetry={() => navigate(0)}
    />
  );
};

export default ProductError;
