declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    token: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface Wallet {
    id: string;
    user_id: string;
    balance: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface Transaction {
    id: string;
    sender_wallet_id: string | null;
    receiver_wallet_id: string;
    amount: number;
    type: "fund" | "transfer" | "withdraw";
    created_at?: Date;
    updated_at?: Date;
}
//# sourceMappingURL=index.d.ts.map