import { Transaction } from "../types";
export declare const TransactionModel: {
    create(transaction: Transaction): Promise<void>;
    findByWalletId(wallet_id: string): Promise<Transaction[]>;
};
//# sourceMappingURL=transaction.model.d.ts.map