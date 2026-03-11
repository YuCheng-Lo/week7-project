import { useState, useEffect, useCallback, useRef } from "react";
import * as bootstrap from "bootstrap";
import axios from "axios";
import { Oval } from "react-loader-spinner";

import Pagination from "../../components/Pagination";
import BootstrapModal from "../../components/BootstrapModal";

import { useDispatch } from "react-redux";
import { showAsyncMessage } from "../../slices/messageSlice";

const AdminProducts = () => {
  const url = import.meta.env.VITE_URL;
  const path = import.meta.env.VITE_PATH;

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  const productModalRef = useRef(null); // 用來抓子組件的 div 節點
  const modalInstance = useRef(null); // 用來存Bootstrap new出來的實例

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const onPageChange = (page) => {
    getProducts(page);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productModalRef.current) {
      modalInstance.current = new bootstrap.Modal(productModalRef.current, {
        keyboard: false,
      });
    }
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }
    };
  }, [isLoading]);

  const getProducts = useCallback(
    async (page = 1) => {
      setIsLoading(true); //開始載入
      try {
        const res = await axios.get(
          `${url}/api/${path}/admin/products?page=${page}`,
        );
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch {
        dispatch(
          showAsyncMessage({
            id: crypto.randomUUID(),
            type: "danger",
            title: "系統錯誤",
            text: "產品取得失敗，請稍後在試",
          }),
        );
      } finally {
        setIsLoading(false); //載入完成
      }
    },
    [url, path, dispatch],
  );

  useEffect(() => {
    const init = async () => {
      await getProducts();
    };
    init();
  }, [getProducts]);

  const defaultProductState = {
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: [],
    stock: 0,
  };

  const [templateProduct, setTemplateProduct] = useState(defaultProductState);
  const [modalMode, setModalMode] = useState("");

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(`${url}/api/${path}/admin/upload`, formData);

      const imageUrl = res.data.imageUrl;

      if (!templateProduct.imageUrl) {
        setTemplateProduct((prev) => {
          return { ...prev, imageUrl };
        });
      } else if (templateProduct.imagesUrl.length < 4) {
        setTemplateProduct((prev) => {
          const newImages = [...prev.imagesUrl];
          newImages[prev.imagesUrl.length] = imageUrl;
          return { ...prev, imagesUrl: newImages };
        });
      }
    } catch {
      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "danger",
          title: "系統錯誤",
          text: "圖片上傳時發生錯誤，請稍後再試",
        }),
      );
    }
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === "create") {
      setTemplateProduct(defaultProductState);
    } else if (mode === "edit" || mode === "delete") {
      //把edit和delete寫在一起，因為都需要帶入產品資料
      setTemplateProduct({
        // 確保欄位都有預設值，避免undefined而噴錯
        title: product.title || "",
        category: product.category || "",
        origin_price: product.origin_price || 0,
        price: product.price || 0,
        unit: product.unit || "",
        description: product.description || "",
        content: product.content || "",
        is_enabled: product.is_enabled || 0,
        imageUrl: product.imageUrl || "",
        imagesUrl: product.imagesUrl ? [...product.imagesUrl] : [],
        stock: product.stock || 0,
        id: product.id, //編輯和刪除絕對需要的 ID
      });
    }
    modalInstance.current.show();
  };

  const closeModal = () => {
    modalInstance.current.hide();
  };

  const handleTemplateChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateProduct((prev) => ({
      ...prev,

      //id如果是is_enabled且type是checkbox的話，我們給他checked的值
      //id如果是content、price、...或別的，我們一律給value的值
      //如果是數字欄位，轉為Number
      [id]:
        type === "checkbox"
          ? checked
          : id === "origin_price" || id === "price" || id === "stock"
            ? Number(value)
            : value,
    }));
  };

  const handleMainImageUrlChange = (e) => {
    setTemplateProduct((prev) => {
      return { ...prev, imageUrl: e.target.value };
    });
  };

  const handleImagesUrlChange = (e, index) => {
    const { value } = e.target;
    setTemplateProduct((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value; //改對應index
      return { ...prev, imagesUrl: newImages };
    });
  };

  const addImage = () => {
    setTemplateProduct((prev) => {
      if (prev.imagesUrl.length >= 4) return prev;
      return {
        ...prev,
        imagesUrl: [...prev.imagesUrl, ""],
      };
    });
  };

  const deleteImage = () => {
    setTemplateProduct((prev) => {
      if (prev.imagesUrl.length === 0) return prev;
      const newImages = [...prev.imagesUrl];
      newImages.pop();
      return { ...prev, imagesUrl: newImages };
    });
  };

  const isUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateProduct = () => {
    const {
      title,
      category,
      unit,
      description,
      imageUrl,
      imagesUrl,
      origin_price,
      price,
      stock,
    } = templateProduct;

    if (!title.trim()) return "請輸入產品標題";
    if (!category.trim()) return "請輸入產品分類";
    if (!unit.trim()) return "請輸入產品單位";
    if (!description.trim()) return "請輸入產品描述";

    if (!imageUrl.trim()) return "請輸入產品圖片";
    if (!isUrl(imageUrl)) return "圖片網址格式錯誤";

    // 驗證副圖
    for (let i = 0; i < imagesUrl.length; i++) {
      const url = imagesUrl[i].trim();
      if (url !== "" && !isUrl(url)) {
        return `副圖 ${i + 1} 的網址格式錯誤`;
      }
    }

    const originPrice = Number(origin_price) || 0;
    const priceValue = Number(price) || 0;
    const stockValue = Number(stock) || 0;

    if (priceValue <= 0) return "售價必須大於0";
    if (originPrice < priceValue) return "原價不能小於售價";
    if (stockValue < 0) return "庫存不能小於0";

    return null;
  };

  const handleModalConfirm = async () => {
    if (modalMode !== "delete") {
      const error = validateProduct();
      if (error) {
        dispatch(
          showAsyncMessage({
            id: crypto.randomUUID(),
            type: "danger",
            title: "表單錯誤",
            text: error,
          }),
        );
        return;
      }
    }

    try {
      //清洗不必要的主、副圖資料
      const cleanMainImage =
        templateProduct.imageUrl.trim() !== ""
          ? templateProduct.imageUrl
          : null;
      const cleanImagesUrl = templateProduct.imagesUrl.filter(
        (url) => url.trim() !== "",
      );

      //組出真正要送的 product，重要的是is_enabled必須是1 or 0，而非true or false
      const productData = {
        ...templateProduct,
        imageUrl: cleanMainImage,
        imagesUrl: cleanImagesUrl,
        is_enabled: templateProduct.is_enabled ? 1 : 0,
      };

      let api = "";
      let method = "";
      if (modalMode === "create") {
        api = `${url}/api/${path}/admin/product`;
        method = "post";
        await axios[method](api, {
          data: productData,
        });
      } else if (modalMode === "edit") {
        api = `${url}/api/${path}/admin/product/${templateProduct.id}`;
        method = "put";
        await axios[method](api, {
          data: productData,
        });
      } else if (modalMode === "delete") {
        api = `${url}/api/${path}/admin/product/${templateProduct.id}`;
        method = "delete";
        await axios[method](api);
      }

      //成功後處理關閉modal、刷新產品列表
      closeModal();
      await getProducts();

      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "success",
          title: "成功",
          text:
            modalMode === "create"
              ? "產品新增成功"
              : modalMode === "edit"
                ? "產品更新成功"
                : "產品刪除成功",
        }),
      );

      //只有新增時才重置
      if (modalMode === "create") {
        setTemplateProduct(defaultProductState);
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message || "操作失敗，請重新再試";

      dispatch(
        showAsyncMessage({
          id: crypto.randomUUID(),
          type: "danger",
          title: "系統錯誤",
          text: apiMessage,
        }),
      );
    }
  };

  //確保打開頁面 or 刷新 時，不會因為檢查token而出現 登入畫面 閃一下進入 產品列表畫面
  if (isLoading) {
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
        <p className="mt-2">商品內容載入中...</p>
      </div>
    );
  }
  return (
    <>
      <div className="pt-5 my-5">
        <div className="container">
          <div className="text-end mt-4">
            <button
              className="btn btn-primary"
              //呼叫時用 modalInstance
              onClick={() => openModal("create")}
            >
              建立新的產品
            </button>
          </div>
          <table className="table mt-4">
            <thead>
              <tr>
                <th width="120">分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="120">庫存</th>
                <th width="100">是否啟用</th>
                <th width="120">編輯</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span className="text-failed">未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            openModal("edit", product);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            openModal("delete", product);
                          }}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">尚無產品資料</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      </div>
      {/*將 productModalRef 傳進去抓取 DOM*/}
      <BootstrapModal
        ref={productModalRef}
        closeModal={closeModal}
        templateProduct={templateProduct}
        handleTemplateChange={handleTemplateChange}
        modalMode={modalMode}
        handleMainImageUrlChange={handleMainImageUrlChange}
        handleImagesUrlChange={handleImagesUrlChange}
        addImage={addImage}
        deleteImage={deleteImage}
        handleModalConfirm={handleModalConfirm}
        handleUploadImage={handleUploadImage}
      />
    </>
  );
};

export default AdminProducts;
