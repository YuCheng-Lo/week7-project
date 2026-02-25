import { useLoaderData } from "react-router-dom";
import CartQtyControl from "../../components/CartQtyControl";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../../slices/cartSlice";

const ProductDetail = () => {
  const product = useLoaderData();
  const [qty, setQty] = useState(1);

  const { loadingItemId } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="container pt-5 my-5">
      <div className="d-flex justify-content-center">
        <div className="card" style={{ maxWidth: "1000px" }}>
          <div className="row g-0">
            <div className="col-md-6">
              <img
                src={product.imageUrl}
                className="img-fluid rounded-start w-100"
                style={{ height: "450px", objectFit: "cover" }}
                alt={product.title}
              />
            </div>
            <div className="col-md-6 ">
              <div className="card-body">
                <h2 className="card-title mt-3">
                  <strong>{product.title}</strong>
                </h2>
                <p className="card-text ">{product.description}</p>
                <p className="card-text ">
                  <span className="h5">分類:</span>{" "}
                  <span className="badge bg-success ms-2">
                    {product.category}
                  </span>
                </p>
                <p className="card-text ">
                  <span className="h5">單位:</span> {product.unit}
                </p>
                <p className="card-text ">
                  <span className="h5">原價:</span>{" "}
                  <del>{product.origin_price}</del> 元
                </p>
                <p className="card-text ">
                  <span className="h5">現價:</span> {product.price} 元
                </p>
                <div className="d-flex mt-3 gap-4 align-items-center">
                  <span className="h5">購買數量</span>
                  <CartQtyControl
                    qty={qty}
                    onIncrease={() => setQty((prev) => prev + 1)}
                    onDecrease={() => setQty((prev) => Math.max(1, prev - 1))}
                  />
                </div>

                <div className="d-flex justify-content-center mt-5">
                  <button
                    type="button"
                    className="btn btn-primary "
                    onClick={() => {
                      dispatch(addToCartAsync({ productId: product.id, qty }));
                    }}
                    disabled={loadingItemId.add === product.id}
                  >
                    {loadingItemId.add === product.id
                      ? "處理中..."
                      : "立即購買"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
