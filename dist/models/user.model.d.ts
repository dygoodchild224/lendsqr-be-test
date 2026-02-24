import { User } from "../types";
export declare const UserModel: {
    create(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | undefined>;
    findByToken(token: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
};
//# sourceMappingURL=user.model.d.ts.map