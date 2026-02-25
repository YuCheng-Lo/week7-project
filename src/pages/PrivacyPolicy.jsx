const PrivacyPolicy = () => {
  return (
    <div
      className="pt-5 my-5"
      style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}
    >
      <h1>隱私政策</h1>
      <p>更新日期: 2026年2月</p>
      <p>
        我們非常重視您的隱私權。本網站僅使用 Cookie
        儲存登入驗證資訊（如：token），僅作為身份驗證用途，不會用於行為追蹤、廣告推播，亦不會將資料提供給第三方。
      </p>

      <h2>1. 我們蒐集的資訊</h2>
      <p>
        為了提供登入與保持會話功能，我們會在您的瀏覽器儲存 cookie，以保存 token
        。
      </p>

      <h2>2. Cookie 使用目的</h2>
      <ul>
        <li>用戶登入驗證</li>
        <li>保持登入狀態（Token）</li>
      </ul>

      <h2>3. 第三方服務</h2>
      <p>
        本網站目前未整合任何第三方服務（如 Google Analytics、Facebook
        Pixel），因此不會有行為追蹤或廣告紀錄。
      </p>

      <h2>4. 資料安全</h2>
      <p>
        本網站使用後端 API 所提供的 token 作為登入驗證機制， token
        會儲存在瀏覽器端並於請求時透過 Authorization Header 傳送。
        本專案為學習與展示用途，未處理高度敏感之使用者資料。
      </p>

      <h2>5. 聯絡我們</h2>
      <p>若您對本政策有任何疑問，請透過 cucu199307@gmail.com 聯絡我們。</p>
    </div>
  );
};

export default PrivacyPolicy;
