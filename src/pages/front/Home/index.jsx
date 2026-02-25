import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const heroImg =
    "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.hero}>
        <img src={heroImg} alt="hero" />
        <div className={styles.hero__overlay}>
          <h1>拾光日常</h1>
          <p>簡約生活，從這一刻開始</p>
          <button
            className={styles.hero__cta}
            onClick={() => {
              navigate("/products");
            }}
          >
            立即選購
          </button>
        </div>
      </div>

      <section className={styles["brand-intro"]}>
        <h3 className={styles["brand-intro__title"]}>拾取時光中的細碎美好</h3>
        <p className={styles["brand-intro__text"]}>
          我們相信，生活不只是生存，而是一場關於質感的實踐。
          <br />
          「拾光日常」精選世界各地極簡設計物，
          <br />
          讓每一件日常用品，都能成為你桌上的一抹流光。
        </p>
        <div className={styles["brand-intro__divider"]} />
      </section>
    </div>
  );
};

export default Home;
