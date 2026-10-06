const BLOCKCHAIN_CONFIG = {
    // Đã thay địa chỉ Contract thực tế của bạn
    CONTRACT_ADDRESS: "0x4f0c254a6235ec5b297ba4e1edb49ae551d3105a",

    CONTRACT_ABI: [
        {
            "inputs": [
                { "internalType": "string", "name": "certId", "type": "string" },
                { "internalType": "bytes32", "name": "certificateHash", "type": "bytes32" }
            ],
            "name": "issueCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "string", "name": "certId", "type": "string" }],
            "name": "revokeCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "string", "name": "certId", "type": "string" },
                { "internalType": "bytes32", "name": "certificateHash", "type": "bytes32" }
            ],
            "name": "verifyCertificate",
            "outputs": [
                { "internalType": "bool", "name": "exists", "type": "bool" },
                { "internalType": "bool", "name": "hashMatched", "type": "bool" },
                { "internalType": "bool", "name": "revoked", "type": "bool" },
                { "internalType": "address", "name": "issuer", "type": "address" },
                { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "string", "name": "certId", "type": "string" }],
            "name": "getCertificate",
            "outputs": [
                { "internalType": "bytes32", "name": "certificateHash", "type": "bytes32" },
                { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
                { "internalType": "bool", "name": "revoked", "type": "bool" },
                { "internalType": "address", "name": "issuer", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};