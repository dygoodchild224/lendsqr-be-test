import { Wallet } from "../types";
export declare const WalletModel: {
    create(wallet: Wallet): Promise<void>;
    findByUserId(user_id: string): Promise<Wallet | undefined>;
    findById(id: string): Promise<Wallet | undefined>;
    updateBalance(id: string, balance: number): Promise<void>;
};
//# sourceMappingURL=wallet.model.d.ts.map