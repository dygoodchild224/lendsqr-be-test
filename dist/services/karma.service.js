"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKarmaBlacklist = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkKarmaBlacklist = async (identity) => {
    try {
        // TODO: Replace with real Adjutor API call when key is available
        // const response = await axios.get(
        //   `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
        //     },
        //   }
        // );
        // return response.data?.data !== null;
        // Temporary mock - treat these emails as blacklisted for testing
        const blacklistedEmails = ["blacklisted@example.com", "blocked@test.com"];
        return blacklistedEmails.includes(identity);
    }
    catch (error) {
        throw new Error("Karma check failed");
    }
};
exports.checkKarmaBlacklist = checkKarmaBlacklist;
//# sourceMappingURL=karma.service.js.map