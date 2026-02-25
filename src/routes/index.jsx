import Layout from "../Layout";
import Home from "../pages/front/Home";
import Products from "../pages/front/Products";
import ProductDetail from "../pages/front/ProductDetail";
import ProductError from "../pages/front/ProductError";
import Cart from "../pages/front/Cart";
import Checkout from "../pages/front/Checkout";
import Login from "../pages/Login";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import NotFound from "../pages/NotFound";
import axios from "axios";

import AdminLayout from "../AdminLayout";
import AdminProducts from "../pages/admin/AdminProducts";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
        errorElement: <ProductError />,
        loader: async ({ params }) => {
          const res = await axios.get(
            `${url}/api/${path}/product/${params.id}`,
          );

          if (!res.data.product) {
            throw new Response("Product Not Found", { status: 404 });
          }

          return res.data.product;
        },
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
