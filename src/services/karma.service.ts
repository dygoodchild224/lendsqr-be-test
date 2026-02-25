import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const checkKarmaBlacklist = async (identity: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
        },
      }
    );
    return response.data?.data !== null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // 404 means user is not blacklisted
      return false;
    }
    throw new Error("Karma check failed");
  }
};