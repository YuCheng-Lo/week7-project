import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getAsyncCart,
  removeCartItemAsync,
  selectCartItemsCount,
} from "../../slices/cartSlice";
import { showAsyncMessage } from "../../slices/messageSlice";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

const Checkout = () => {
  const dispatch = useDispatch();
  const { carts, loading, loadingItemId, final_total, initialized } =
    useSelector((state) => state.cart);

  const cartItemsCount = useSelector(selectCartItemsCount);

  useEffect(() => {
    if (!initialized) {
      dispatch(getAsyncCart());
    }
  }, [dispatch, initialized]);

  const [isFinishedCheckout, setIsFinishedCheckout] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${url}/api/${path}/order`, {
        data: {
          user: data,
          message: data.message,
        },
      });

      setIsFinishedCheckout(true); //優先處理阻擋 useEffect 導回商品頁

      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "success",
          title: "成功",
          text: "訂單送出成功！",
        }),
      );
      reset();

      dispatch(getAsyncCart()); //送出訂單後，後端會清空購物車資料
      // navigate(`/thank-you/${res.data.orderId}`, { replace: true }); //購物成功導向頁尚待製作
    } catch {
      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "danger",
          title: "失敗",
          text: "訂單送出失敗，請稍後再試！",
        }),
      );
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!isFinishedCheckout && !loading && cartItemsCount === 0) {
      navigate("/products", { replace: true });
    }
  }, [isFinishedCheckout, loading, cartItemsCount, navigate]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 ">
        <Oval
          height={60}
          width={60}
          color="#748be7"
          secondaryColor="#0c4169"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
        <p className="mt-2">訂單內容處理中...</p>
      </div>
    );
  }
  if (cartItemsCount === 0) {
    // 避免渲染 Checkout 內容
    return null;
  }

  return (
    <>
      <div className="container pt-5 my-5">
        <div className="text-center">
          <h2>您的訂單內容</h2>
        </div>
        <table className="table mt-4 align-middle">
          <thead>
            <tr>
              <th>商品圖片</th>
              <th>品名</th>
              <th>數量</th>
              <th>小計</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carts.map((item) => {
              return (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="rounded-2 shadow-sm"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.product.title}</td>
                  <td>{item.qty}</td>
                  <td>
                    <span>{item.total} </span>
                    <span> 元</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      // className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
                      className="btn btn-link text-danger p-0 border-0"
                      onClick={() => {
                        dispatch(removeCartItemAsync(item.id));
                      }}
                      disabled={loadingItemId.remove === item.id}
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}></td>
              <td className="text-end">
                <span className="m-5">總計:</span>
              </td>
              <td>
                <span>{final_total} </span>
                <span> 元</span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <hr className="my-5 opacity-0" />

        {/* 表單資料 */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-10 col-lg-8">
            <div className="text-center mb-4">
              <h2>收件人資訊</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="請輸入姓名"
                  {...register("name", { required: "姓名欄位不得為空" })}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="請輸入Email"
                  {...register("email", {
                    required: "Email欄位不得為空",
                    pattern: { value: /^\S+@\S+$/i, message: "Email格式錯誤" },
                  })}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話 <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  id="tel"
                  className="form-control"
                  placeholder="請輸入電話"
                  {...register("tel", {
                    required: "電話欄位不得為空",
                    minLength: { value: 8, message: "電話號碼至少需要 8 碼" },
                    pattern: {
                      value: /^\d+$/,
                      message: "電話號碼格式有誤，僅限數字",
                    },
                  })}
                />
                {errors.tel && (
                  <p className="text-danger">{errors.tel.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  className="form-control"
                  placeholder="請輸入地址"
                  {...register("address", {
                    required: "地址欄位不得為空",
                  })}
                />
                {errors.address && (
                  <p className="text-danger">{errors.address.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  placeholder="您的留言"
                  rows={3}
                  {...register("message")}
                ></textarea>
              </div>

              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5 py-3 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "訂單送出中..." : "送出訂單"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
