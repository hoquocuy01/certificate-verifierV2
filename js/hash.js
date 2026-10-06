/**
 * Băm chuỗi văn bản thành mã Hex Hash SHA-256
 * @param {string} text 
 * @returns {Promise<string>} Chuỗi SHA-256 dạng Hex (64 ký tự)
 */
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}