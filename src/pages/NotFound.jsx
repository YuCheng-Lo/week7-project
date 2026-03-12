import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorView from "../components/ErrorView";

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", {
        replace: true,
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);
  return (
    <ErrorView
      title="404NotFound 找不到頁面"
      message="這段時光似乎不存在，或是已經走遠了... 我們將在幾秒後帶您回到首頁。"
      onRetry={() => navigate("/")}
      buttonText="回到首頁"
    />
  );
};

export default NotFound;
