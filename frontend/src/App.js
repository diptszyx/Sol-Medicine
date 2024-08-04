import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Connection } from "@solana/web3.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import SearchMedicine from "./components/SearchMedicine";
import AddMedicine from "./components/AddMedicine";
import Home from "./components/Home";


function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        // Kết nối với ví Phantom
        const resp = await window.solana.connect();
        // Lấy địa chỉ ví từ phản hồi
        const address = resp.publicKey.toString();
        // Tạo kết nối đến devnet Solana
        const connection = new Connection(
          "https://api.devnet.solana.com",
          "confirmed"
        );
        // Kiểm tra kết nối
        const version = await connection.getVersion();
        console.log("Connected to Solana devnet:", version);
        // Lưu địa chỉ ví
        setWalletAddress(address);
        console.log("Wallet connected:", address);
      } catch (err) {
        console.error("Connection failed:", err);
        alert("Connection failed. Please try again.");
      }
    } else {
      alert("Phantom Wallet is not installed. Please install Phantom Wallet.");
    }
  };
  return (
    <Router>
      <div className="App">
        <Navbar connectWallet={connectWallet} walletAddress={walletAddress} />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  connectWallet={connectWallet}
                  walletAddress={walletAddress}
                />
              }
            />
            <Route
              path="/search-medicine"
              element={
                <SearchMedicine
                  connectWallet={connectWallet}
                  walletAddress={walletAddress}
                />
              }
            />
            <Route
              path="/add-medicine"
              element={
                <AddMedicine
                  walletAddress={walletAddress}
                  connectWallet={connectWallet}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
