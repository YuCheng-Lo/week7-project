import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../slices/messageSlice";
const MessageToast = () => {
  const messages = useSelector((state) => {
    return state.message;
  });

  const dispatch = useDispatch();

  return (
    <div
      className="toast-container position-fixed  end-0 p-3"
      style={{ top: "80px" }}
    >
      {messages.length > 0 &&
        messages.map((msg) => (
          <div
            key={msg.id}
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className={`toast-header text-white bg-${msg.type}`}>
              <strong className="me-auto">{msg.title}</strong>

              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(removeMessage(msg.id))}
              ></button>
            </div>
            <div className="toast-body">{msg.text}</div>
          </div>
        ))}
    </div>
  );
};

export default MessageToast;
