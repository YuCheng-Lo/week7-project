import crashImg from "../assets/images/crash.png";

const ApiCrashed = ({ message, onRetry }) => {
  return (
    <div className="container pt-5 my-5">
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center p-5"
        style={{ minHeight: "50vh" }}
      >
        <img
          src={crashImg}
          alt="API Crashed"
          className="mb-5"
          style={{ width: "350px" }}
        />

        <h2>哎呀，資料載入失敗...</h2>

        <p>{message || "請稍後再試或重新整理頁面"}</p>

        {onRetry && (
          <button className="btn btn-primary mt-3" onClick={onRetry}>
            重新載入
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiCrashed;
