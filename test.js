import crypto from "crypto";
const resetToken = crypto.randomBytes(20).toString('hex');
console.log(resetToken);
const hashedToken = crypto.createHash('sha256').update(resetToken);

console.log(hashedToken);
