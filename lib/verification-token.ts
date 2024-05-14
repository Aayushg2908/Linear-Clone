import { db } from "./db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verification_token = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verification_token;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};
