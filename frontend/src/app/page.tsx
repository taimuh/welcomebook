export default function Home() {
  return (
    <div className="wb-landing">
      {/* Nav */}
      <header className="wb-landing-nav">
        <div className="wb-nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span className="wb-nav-name">WelcomeBook</span>
      </header>

      {/* Hero */}
      <div className="wb-landing-hero">
        <div className="wb-landing-content anim-fadeup">
          <div className="wb-landing-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>

          <h1 className="wb-landing-title">
            Welcome<span>Book</span>
          </h1>

          <p className="wb-landing-desc">
            民泊ゲスト向けのデジタルマニュアルサービスです。
            ホストから共有されたURLにアクセスして、滞在に関する情報をご確認ください。
          </p>

          <div className="wb-landing-hint">
            <strong>ゲストの方へ</strong><br />
            ホストから受け取ったURLを使ってマニュアルにアクセスしてください。
            URLは通常、予約確認メールや宿泊施設の案内に記載されています。
          </div>
        </div>
      </div>
    </div>
  );
}
