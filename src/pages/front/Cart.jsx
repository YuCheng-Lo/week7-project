import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import CartQtyControl from "../../components/CartQtyControl";
import ErrorView from "../../components/ErrorView";
import { useDispatch, useSelector } from "react-redux";
import {
  getAsyncCart,
  removeCartItemAsync,
  removeCartAsync,
  updateCartItemQtyAsync,
} from "../../slices/cartSlice";
import { useEffect } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const { carts, loading, final_total, loadingItemId, error, initialized } =
    useSelector((state) => state.cart);

  useEffect(() => {
    if (!initialized) {
      dispatch(getAsyncCart());
    }
  }, [dispatch, initialized]);

  if (loading && !initialized) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 ">
        {/* <div className="spinner-border" role="status" /> */}
        <Oval
          height={60}
          width={60}
          color="#748be7"
          secondaryColor="#0c4169"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
        <p className="mt-2">購物車載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorView
        title="資料載入失敗..."
        message={error}
        onRetry={() => dispatch(getAsyncCart())}
      />
    );
  }

  return (
    <>
      <div className="container pt-5 my-5">
        <div className="text-center">
          <h1>購物車</h1>
        </div>
        <div className="mt-4 text-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => dispatch(removeCartAsync())}
            disabled={carts.length === 0}
          >
            清空購物車
          </button>
        </div>
        <table className="table mt-3 align-middle">
          <thead>
            <tr>
              <th></th>
              <th>商品圖片</th>
              <th>品名</th>
              <th>數量</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 ? (
              carts.map((item) => {
                return (
                  <tr key={item.id}>
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
                        {loadingItemId.remove === item.id ? (
                          <span>處理中...</span>
                        ) : (
                          <i className="bi bi-trash fs-5"></i>
                        )}
                      </button>
                    </td>
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
                    <td>
                      <CartQtyControl
                        qty={item.qty}
                        loading={loadingItemId.update === item.id}
                        onIncrease={() => {
                          dispatch(
                            updateCartItemQtyAsync({
                              cartItemId: item.id,
                              productId: item.product.id,
                              qty: item.qty + 1,
                            }),
                          );
                        }}
                        onDecrease={() => {
                          dispatch(
                            updateCartItemQtyAsync({
                              cartItemId: item.id,
                              productId: item.product.id,
                              qty: item.qty - 1,
                            }),
                          );
                        }}
                      />
                    </td>
                    <td>
                      <span>{item.total} </span>
                      <span> 元</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>
                  <h4 className="text-center text-muted">
                    購物車尚未有任何商品
                  </h4>
                </td>
              </tr>
            )}
          </tbody>
          {carts.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} className="text-end">
                  <span className="m-5">總計:</span>
                </td>
                <td>
                  <span>{final_total} </span>
                  <span> 元</span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
        {carts.length > 0 ? (
          <div className="text-center mt-5">
            <Link
              to="/checkout"
              className="btn btn-primary btn-lg px-5 py-3 shadow-sm"
            >
              前往結帳
              <i className="bi bi-chevron-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <div className="text-center mt-5 py-5 border rounded-3 bg-light">
            <p className="h3 text-muted mb-4">還沒找到喜歡的商品嗎?</p>
            <Link to="/products" className="btn btn-outline-dark btn-lg px-4">
              回商店選購
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
