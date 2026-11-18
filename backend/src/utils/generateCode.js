import crypto from "crypto";

// O'xshash belgilar (0/O, 1/I) olib tashlangan
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(length = 8) {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export async function generateUniqueConnectCode(manager) {
  while (true) {
    const code = generateCode();
    const exists = await manager.findOne("Dealer", {
      where: { connectCode: code },
    });
    if (!exists) return code;
  }
}