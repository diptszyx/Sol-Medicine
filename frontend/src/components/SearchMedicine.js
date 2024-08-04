import React, { useState, useRef, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { BorshAccountsCoder } from "@coral-xyz/anchor";
import { Html5Qrcode } from "html5-qrcode";
import idl from "../idl.json";

// Hàm giải mã dữ liệu thuốc
function decodeMedicineInfo(data) {
  const coder = new BorshAccountsCoder(idl);
  return coder.decode("MedicineInfo", data);
}

const Form = () => {
  const [maThuoc, setMaThuoc] = useState("");
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const programID = new PublicKey(idl.address);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMedicineInfo(null);
    setIsLoading(true);
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      // Tìm địa chỉ PDA của tài khoản thuốc
      const [medicineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("medicine-info"), Buffer.from(maThuoc)],
        programID
      );

      console.log("PDA:", medicineAccount.toString());

      // Lấy thông tin tài khoản
      const accountInfo = await connection.getAccountInfo(medicineAccount);

      if (accountInfo === null) {
        throw new Error("Không tìm thấy thông tin thuốc.");
      }

      console.log("Raw account data:", accountInfo.data);

      // Giải mã dữ liệu
      const decodedInfo = decodeMedicineInfo(accountInfo.data);
      setMedicineInfo(decodedInfo);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thuốc:", error);
      console.error("Stack trace:", error.stack);
      setErrorMessage(
        "Không tìm thấy thông tin thuốc hoặc xảy ra lỗi: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isScanning) {
      const qrCodeSuccessCallback = (decodedText) => {
        setMaThuoc(decodedText);
        stopScanning();
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      qrScannerRef.current = new Html5Qrcode("reader");
      qrScannerRef.current.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback
      );
    }
  }, [isScanning]);

  const formContainerStyles = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const inputStyles = {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  };

  const buttonStyles = {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    marginBottom: "10px",
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thTdStyles = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  };

  return (
    <div>
      <div style={formContainerStyles}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            Tra cứu thông tin thuốc
          </h3>
          <div>
            <label
              htmlFor="maThuoc"
              style={{ marginBottom: "10px", display: "block" }}
            >
              Mã thuốc
            </label>
            <input
              type="text"
              style={inputStyles}
              id="maThuoc"
              value={maThuoc}
              onChange={(e) => setMaThuoc(e.target.value)}
              placeholder="Nhập mã thuốc"
            />
            <button type="submit" style={buttonStyles} disabled={isLoading}>
              {isLoading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
            <button
              type="button"
              style={{
                ...buttonStyles,
                backgroundColor: "#6c757d",
                borderColor: "#6c757d",
              }}
              onClick={isScanning ? stopScanning : handleScan}
            >
              {isScanning ? "Dừng quét" : "Quét QR"}
            </button>
          </div>
        </form>

        {isScanning && (
          <div id="reader" style={{ width: "100%", marginTop: "20px" }}></div>
        )}

        {errorMessage && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ marginTop: "20px" }}
          >
            {errorMessage}
          </div>
        )}

        {medicineInfo && (
          <div style={{ marginTop: "20px" }}>
            <h4>Thông tin thuốc:</h4>
            <table style={tableStyles}>
              <tbody>
                <tr>
                  <th style={thTdStyles}>Mã thuốc:</th>
                  <td style={thTdStyles}>{medicineInfo.ma_thuoc}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Tên thuốc:</th>
                  <td style={thTdStyles}>{medicineInfo.ten_thuoc}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Nhà sản xuất:</th>
                  <td style={thTdStyles}>{medicineInfo.nha_san_xuat}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Nguồn gốc:</th>
                  <td style={thTdStyles}>{medicineInfo.nguon_goc}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Nhà phân phối:</th>
                  <td style={thTdStyles}>{medicineInfo.nha_phan_phoi}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Nhãn hiệu:</th>
                  <td style={thTdStyles}>{medicineInfo.nhan_hieu}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Loại thuốc:</th>
                  <td style={thTdStyles}>{medicineInfo.loai_thuoc}</td>
                </tr>
                <tr>
                  <th style={thTdStyles}>Mã kiểm nghiệm:</th>
                  <td style={thTdStyles}>{medicineInfo.ma_kiem_nghiem}</td>
                </tr>
              </tbody>
            </table>
            {medicineInfo.image_url && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <img
                  src={medicineInfo.image_url}
                  alt="Hình ảnh thuốc"
                  style={{ maxWidth: "300px", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
