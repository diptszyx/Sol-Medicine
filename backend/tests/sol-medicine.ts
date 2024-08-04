import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolMedicine } from "../target/types/sol_medicine";
import { expect } from 'chai';

describe("sol-medicine", () => {
  // Cấu hình client để sử dụng cụm local
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolMedicine as Program<SolMedicine>;

  // Sử dụng một trong hai khóa công khai được ủy quyền
  const authorizedUser = new anchor.web3.PublicKey("3MkLRginsw98GKhheHSz5nMShhhsRGJseyp3GD79F4uK");

  // Định nghĩa dữ liệu test
  const testMedicineInfo = {
    maThuoc: "MED001",
    tenThuoc: "Paracetamol",
    nhaSanXuat: "PharmaCorp",
    nguonGoc: "USA",
    nhaPhanPhoi: "MedDistribute",
    nhanHieu: "ParaBrand",
    loaiThuoc: "Giảm đau",
    maKiemNghiem: "TEST123",
    imageUrl: "https://example.com/med001.jpg",
  };

  let medicineAccountPDA: anchor.web3.PublicKey;

  before(async () => {
    // Tạo PDA cho tài khoản thuốc
    const [pda, _] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("medicine-info"), authorizedUser.toBuffer()],
      program.programId
    );
    medicineAccountPDA = pda;
    console.log("Medicine Account PDA:", medicineAccountPDA.toString());
  });

  it("Khởi tạo thông tin thuốc", async () => {
    // Gọi hàm initialize
    const tx = await program.methods
      .initialize(
        testMedicineInfo.maThuoc,
        testMedicineInfo.tenThuoc,
        testMedicineInfo.nhaSanXuat,
        testMedicineInfo.nguonGoc,
        testMedicineInfo.nhaPhanPhoi,
        testMedicineInfo.nhanHieu,
        testMedicineInfo.loaiThuoc,
        testMedicineInfo.maKiemNghiem,
        testMedicineInfo.imageUrl
      )
      .accounts({
        medicineAccount: medicineAccountPDA,
        user: authorizedUser,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      // Lưu ý: Trong môi trường test thực tế, bạn cần có quyền ký cho authorizedUser
      .rpc();

    console.log("Chữ ký giao dịch của bạn:", tx);
  });

  it("Lấy và kiểm tra thông tin thuốc", async () => {
    // Lấy thông tin tài khoản đã tạo
    const account = await program.account.medicineInfo.fetch(medicineAccountPDA);

    // Xác minh dữ liệu tài khoản
    expect(account.maThuoc).to.equal(testMedicineInfo.maThuoc);
    expect(account.tenThuoc).to.equal(testMedicineInfo.tenThuoc);
    expect(account.nhaSanXuat).to.equal(testMedicineInfo.nhaSanXuat);
    expect(account.nguonGoc).to.equal(testMedicineInfo.nguonGoc);
    expect(account.nhaPhanPhoi).to.equal(testMedicineInfo.nhaPhanPhoi);
    expect(account.nhanHieu).to.equal(testMedicineInfo.nhanHieu);
    expect(account.loaiThuoc).to.equal(testMedicineInfo.loaiThuoc);
    expect(account.maKiemNghiem).to.equal(testMedicineInfo.maKiemNghiem);
    expect(account.imageUrl).to.equal(testMedicineInfo.imageUrl);

    console.log("Thông tin thuốc:", account);
  });
});