import React from "react";
import { Link } from "react-router-dom";

function Navbar({ connectWallet, walletAddress }) {
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const navStyles = {
    backgroundColor: "#00CCFF", // Màu nền navbar
    padding: "10px 20px", // Khoảng cách bên trong navbar
    borderBottom: "2px solid #ecf0f1", // Đường viền dưới
  };

  const brandStyles = {
    color: "#ecf0f1", // Màu chữ
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  const linkStyles = {
    color: "#ecf0f1", // Màu chữ của các liên kết
    marginLeft: "20px",
    textDecoration: "none",
    fontSize: "1.1rem",
    transition: "color 0.3s", // Hiệu ứng chuyển màu khi hover
  };

  const buttonStyles = {
    width: "200px",
    marginLeft: "20px",
    backgroundColor: "#e74c3c", // Màu nền của nút
    color: "#ecf0f1", // Màu chữ của nút
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s", // Hiệu ứng chuyển màu khi hover
  };

  const buttonHoverStyles = {
    backgroundColor: "#c0392b", // Màu nền khi hover
  };

  return (
    <nav className="navbar navbar-expand-lg" style={navStyles}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={brandStyles}>
          Trang Chủ
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/add-medicine" style={linkStyles}>
                Đăng Ký Thuốc
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/search-medicine"
                style={linkStyles}
              >
                Tra Cứu Thuốc
              </Link>
            </li>
          </ul>
          <form>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={connectWallet}
              style={buttonStyles}
              onMouseOver={(e) => {
                e.target.style.backgroundColor =
                  buttonHoverStyles.backgroundColor;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = buttonStyles.backgroundColor;
              }}
            >
              {walletAddress ? shortenAddress(walletAddress) : "Kết Nối Ví"}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
