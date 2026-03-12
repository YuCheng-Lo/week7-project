import crashImg from "../assets/images/crash.png";

const ErrorView = ({
  title = "哎呀，出錯了",
  message,
  onRetry,
  buttonText = "重新載入",
}) => {
  return (
    <div className="container pt-5 my-5">
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center p-5"
        style={{ minHeight: "50vh" }}
      >
        <img
          src={crashImg}
          alt="Something went wrong"
          className="mb-5"
          style={{ width: "350px" }}
        />

        <h2>{title}</h2>

        <p>{message || "請稍後再試或重新整理頁面"}</p>

        {onRetry && (
          <button className="btn btn-primary mt-3" onClick={onRetry}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;
