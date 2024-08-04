import React, { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, setProvider } from "@coral-xyz/anchor";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WebIrys } from "@irys/sdk";
import idl from "../idl.json";

const programID = new PublicKey("7KkA5mE2J3VJqbAKsSVicajny9VGXStDNtefbxCCbjjM");

function AddMedicine({ walletAddress, connectWallet }) {
  const [maThuoc, setMaThuoc] = useState("");
  const [tenThuoc, setTenThuoc] = useState("");
  const [nhaSanXuat, setNhaSanXuat] = useState("");
  const [nguonGoc, setNguonGoc] = useState("");
  const [nhaPhanPhoi, setNhaPhanPhoi] = useState("");
  const [nhanHieu, setNhanHieu] = useState("");
  const [loaiThuoc, setLoaiThuoc] = useState("");
  const [maKiemNghiem, setMaKiemNghiem] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [medicineAddress, setMedicineAddress] = useState(null);

  const getIrys = async () => {
    const network = "devnet";
    const token = "solana";
    const rpcUrl = "https://api.devnet.solana.com";

    const phantomAdapter = new PhantomWalletAdapter();
    await phantomAdapter.connect();

    const wallet = {
      rpcUrl: rpcUrl,
      name: "phantom",
      provider: phantomAdapter,
    };

    const webIrys = new WebIrys({ network, token, wallet });
    await webIrys.ready();

    return webIrys;
  };

  const uploadToIrys = async (file) => {
    console.log("Bắt đầu tải lên Irys...");
    const irys = await getIrys();

    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(Buffer.from(new Uint8Array(reader.result)));
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });

      const tags = [{ name: "Content-Type", value: file.type }];
      const receipt = await irys.upload(data, { tags });
      console.log("Biên nhận tải lên Irys:", receipt);
      return `https://arweave.net/${receipt.id}`;
    } catch (error) {
      console.error("Lỗi khi tải lên Irys:", error);
      throw error;
    }
  };

  const handleAddMedicine = async () => {
    if (!walletAddress) {
      alert("Vui lòng kết nối ví trước.");
      await connectWallet();
      return;
    }

    setIsCreating(true);
    setTransactionStatus("Đang xử lý...");
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const provider = new AnchorProvider(connection, window.solana, {
        preflightCommitment: "confirmed",
      });
      setProvider(provider);

      const program = new Program(idl, programID);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadToIrys(image);
      }

      const [medicineAccount] = await PublicKey.findProgramAddressSync(
        [Buffer.from("medicine-info"), Buffer.from(maThuoc)],
        program.programId
      );

      const accountInfo = await connection.getAccountInfo(medicineAccount);
      if (accountInfo !== null) {
        setTransactionStatus("Thông báo: Mã Thuốc Này Đã Được Lưu Trước Đó");
        setIsCreating(false);
        return; // Dừng xử lý tại đây
      }

      const tx = await program.methods
        .initialize(
          maThuoc,
          tenThuoc,
          nhaSanXuat,
          nguonGoc,
          nhaPhanPhoi,
          nhanHieu,
          loaiThuoc,
          maKiemNghiem,
          imageUrl
        )
        .accounts({
          medicineAccount: medicineAccount,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

      await provider.sendAndConfirm(tx);

      console.log("Thuốc đã được thêm thành công!");
      setTransactionStatus("Thành công! ");
      setMedicineAddress(medicineAccount.toString());

      // Đặt lại các trường biểu mẫu
      setMaThuoc("");
      setTenThuoc("");
      setNhaSanXuat("");
      setNguonGoc("");
      setNhaPhanPhoi("");
      setNhanHieu("");
      setLoaiThuoc("");
      setMaKiemNghiem("");
      setImage(null);
      setImagePreviewUrl(null);
    } catch (error) {
      console.error("Lỗi khi thêm thuốc:", error);
      setTransactionStatus("Lỗi: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div style={{ padding: "20px" }}>
      <main>
        <div style={formContainerStyles}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Thêm Thuốc
          </h2>
          <div>
            <input
              type="text"
              style={inputStyles}
              value={maThuoc}
              onChange={(e) => setMaThuoc(e.target.value)}
              placeholder="Mã thuốc"
            />
            <input
              type="text"
              style={inputStyles}
              value={tenThuoc}
              onChange={(e) => setTenThuoc(e.target.value)}
              placeholder="Tên thuốc"
            />
            <input
              type="text"
              style={inputStyles}
              value={nhaSanXuat}
              onChange={(e) => setNhaSanXuat(e.target.value)}
              placeholder="Nhà sản xuất"
            />
            <input
              type="text"
              style={inputStyles}
              value={nguonGoc}
              onChange={(e) => setNguonGoc(e.target.value)}
              placeholder="Nguồn gốc"
            />
            <input
              type="text"
              style={inputStyles}
              value={nhaPhanPhoi}
              onChange={(e) => setNhaPhanPhoi(e.target.value)}
              placeholder="Nhà phân phối"
            />
            <input
              type="text"
              style={inputStyles}
              value={nhanHieu}
              onChange={(e) => setNhanHieu(e.target.value)}
              placeholder="Nhãn hiệu"
            />
            <input
              type="text"
              style={inputStyles}
              value={loaiThuoc}
              onChange={(e) => setLoaiThuoc(e.target.value)}
              placeholder="Loại thuốc"
            />
            <input
              type="text"
              style={inputStyles}
              value={maKiemNghiem}
              onChange={(e) => setMaKiemNghiem(e.target.value)}
              placeholder="Mã kiểm nghiệm"
            />
            <input
              type="file"
              onChange={handleImageChange}
              style={inputStyles}
            />
            {imagePreviewUrl && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <img
                  src={imagePreviewUrl}
                  alt="Xem trước"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddMedicine}
              disabled={isCreating}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}
            >
              {isCreating ? "Đang xử lý..." : "Thêm Thuốc"}
            </button>
          </div>
          {transactionStatus && (
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              {transactionStatus}
            </p>
          )}
          {medicineAddress && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <p>Địa chỉ thuốc: {medicineAddress}</p>
              <a
                href={`https://explorer.solana.com/address/${medicineAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem trên Solana Explorer
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddMedicine;
