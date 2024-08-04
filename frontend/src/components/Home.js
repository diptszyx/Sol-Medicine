import React from "react";
import bannerImage from "../assets/medicine-trendy-banner-vector.jpg"; // Đảm bảo đường dẫn này chính xác

function Home() {
  return (
    <div className="home" style={{ height: "calc(100vh - 56px)" }}>
      <img
        src={bannerImage}
        alt="Banner"
        className="banner-image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default Home;
