let provider = null;
let signer = null;
let contract = null;

/**
 * Kết nối MetaMask Wallet
 */
async function connectWallet() {
    if (!window.ethereum) {
        throw new Error("Trình duyệt chưa cài đặt tiện ích MetaMask.");
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS,
        BLOCKCHAIN_CONFIG.CONTRACT_ABI,
        signer
    );
    return await signer.getAddress();
}

/**
 * Ghi Hash văn bằng lên Blockchain
 */
async function issueCertificateOnBlockchain(certId, hashHex) {
    if (!contract) await connectWallet();
    
    // Định dạng bytes32 yêu cầu tiền tố 0x
    const formattedHash = "0x" + hashHex;
    const tx = await contract.issueCertificate(certId, formattedHash);
    await tx.wait(); // Chờ Block xác nhận
    return tx.hash;
}

/**
 * Thu hồi văn bằng On-chain
 */
async function revokeCertificateOnBlockchain(certId) {
    if (!contract) await connectWallet();
    
    const tx = await contract.revokeCertificate(certId);
    await tx.wait();
    return tx.hash;
}

/**
 * Đọc dữ liệu kiểm tra văn bằng từ Blockchain (Read-Only)
 */
async function verifyCertificateOnBlockchain(certId, hashHex) {
    // Với thao tác đọc (view function), chỉ cần xài BrowserProvider không cần Signer
    const readProvider = window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum)
        : ethers.getDefaultProvider(); 

    const readContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS,
        BLOCKCHAIN_CONFIG.CONTRACT_ABI,
        readProvider
    );

    const formattedHash = "0x" + hashHex;
    const result = await readContract.verifyCertificate(certId, formattedHash);

    return {
        exists: result[0],
        hashMatched: result[1],
        revoked: result[2],
        issuer: result[3],
        issuedAt: Number(result[4])
    };
}