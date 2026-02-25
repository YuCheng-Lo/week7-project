import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", {
        replace: true,
      });
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);
  return (
    <div className="container pt-5 my-5">
      <h2>404 NotFound</h2>
      <p>找不到頁面</p>
    </div>
  );
};

export default NotFound;
