use anchor_lang::prelude::*;

declare_id!("7KkA5mE2J3VJqbAKsSVicajny9VGXStDNtefbxCCbjjM");

pub const AUTHORIZED_PUBKEY_1: Pubkey = pubkey!("3MkLRginsw98GKhheHSz5nMShhhsRGJseyp3GD79F4uK");
pub const AUTHORIZED_PUBKEY_2: Pubkey = pubkey!("HHm5DYCHMVcCnrdVDwJ1TVz5bHFmT3csEfSA7fGLwZVv");

#[program]
pub mod sol_medicine {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        ma_thuoc: String,
        ten_thuoc: String,
        nha_san_xuat: String,
        nguon_goc: String,
        nha_phan_phoi: String,
        nhan_hieu: String,
        loai_thuoc: String,
        ma_kiem_nghiem: String,
        image_url: String,
    ) -> Result<()> {
        let medicine_account = &mut ctx.accounts.medicine_account;
        medicine_account.ma_thuoc = ma_thuoc;
        medicine_account.ten_thuoc = ten_thuoc;
        medicine_account.nha_san_xuat = nha_san_xuat;
        medicine_account.nguon_goc = nguon_goc;
        medicine_account.nha_phan_phoi = nha_phan_phoi;
        medicine_account.nhan_hieu = nhan_hieu;
        medicine_account.loai_thuoc = loai_thuoc;
        medicine_account.ma_kiem_nghiem = ma_kiem_nghiem;
        medicine_account.image_url = image_url;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ma_thuoc: String)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + (50 * 9), // Điều chỉnh kích thước nếu cần
        seeds = [b"medicine-info", ma_thuoc.as_bytes()],
        bump
    )]
    pub medicine_account: Account<'info, MedicineInfo>,
    #[account(
        mut,
        constraint = 
            *user.key == AUTHORIZED_PUBKEY_1 || 
            *user.key == AUTHORIZED_PUBKEY_2
    )]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
#[derive(Default, Debug)]
pub struct MedicineInfo {
    pub ma_thuoc: String,
    pub ten_thuoc: String,
    pub nha_san_xuat: String,
    pub nguon_goc: String,
    pub nha_phan_phoi: String,
    pub nhan_hieu: String,
    pub loai_thuoc: String,
    pub ma_kiem_nghiem: String,
    pub image_url: String,
}
