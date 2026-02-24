import dotenv from "dotenv";

dotenv.config();

export const checkKarmaBlacklist = async (identity: string): Promise<boolean> => {
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
  } catch (error: any) {
    throw new Error("Karma check failed");
  }
};