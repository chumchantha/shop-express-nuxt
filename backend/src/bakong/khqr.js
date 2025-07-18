import { BakongKHQR, khqrData, MerchantInfo } from "bakong-khqr";

export async function generateKhQr(amount) {
  const optionalData = {
    currency: khqrData.currency.usd,
    amount: amount,
    expirationTimestamp: Date.now() + 8 * 60 * 1000, //expire in 2 minutes
  };
  const merchantInfo = new MerchantInfo(
    "chumchantha@aclb",
    "soycoding",
    "PHNOM PENH",
    "123456",
    "ACLEDA",
    optionalData
  );

  const khqr = new BakongKHQR();

  const data = await khqr.generateMerchant(merchantInfo);
  return data;
}

export const decodeKhqr = (qr) => {
  const decodedQr = BakongKHQR.decode(`${qr}`);
  return decodedQr;
};
