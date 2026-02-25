import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCartAsync } from "../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { showAsyncMessage } from "../../slices/messageSlice";

const Products = () => {
  const url = import.meta.env.VITE_URL;
  const path = import.meta.env.VITE_PATH;
  const navigate = useNavigate();

  const { loadingItemId } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${url}/api/${path}/products`);

        setProducts(res.data.products);
      } catch {
        dispatch(
          showAsyncMessage({
            id: crypto.randomUUID(),
            type: "danger",
            title: "系統失敗",
            text: "產品取得失敗，請稍後再試",
          }),
        );
      }
    };

    getProducts();
  }, [url, path, dispatch]);
  return (
    <div className="container pt-5 my-5">
      <div className="row g-4">
        {products.map((product) => {
          return (
            <div key={product.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card">
                <img
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                  src={product.imageUrl}
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <strong>{product.title}</strong>
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      whiteSpace: "nowrap", //不換行
                      overflow: "hidden", //超出部分隱藏
                      textOverflow: "ellipsis", //多餘文字顯示...
                    }}
                  >
                    {product.description}
                  </p>
                  <p className="card-text">
                    <strong>售價:</strong>{" "}
                    <del className="text-muted">{product.origin_price}</del>{" "}
                    <strong>{product.price} 元</strong>
                  </p>
                  <div className="d-flex  justify-content-center gap-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      查看商品
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => {
                        dispatch(addToCartAsync({ productId: product.id }));
                      }}
                      disabled={loadingItemId.add === product.id}
                    >
                      {loadingItemId.add === product.id
                        ? "處理中..."
                        : "加入購物車"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
