import { db } from "./db";
import { getVerificationTokenByEmail } from "./verification-token";

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verification_token = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verification_token;
};
