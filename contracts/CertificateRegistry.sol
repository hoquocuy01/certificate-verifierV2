// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateRegistry
 * @dev Quản lý cấp phát, xác thực và thu hồi văn bằng bằng Hash SHA-256.
 * Tuân thủ quy định bảo mật: Không lưu trữ thông tin định danh cá nhân (PII) On-Chain.
 */
contract CertificateRegistry {

    struct Certificate {
        bytes32 certificateHash; // Mã Hash SHA-256 của nội dung bằng (32 bytes)
        uint256 issuedAt;        // Timestamp phát hành
        bool revoked;            // Trạng thái thu hồi
        address issuer;          // Địa chỉ ví của đơn vị phát hành
    }

    // Mapping: Certificate ID (e.g. "SV2026001") => Certificate Struct
    mapping(string => Certificate) private certificates;

    // Events phục vụ On-Chain Auditing
    event CertificateIssued(
        string indexed certId,
        bytes32 indexed certificateHash,
        address indexed issuer,
        uint256 issuedAt
    );

    event CertificateRevoked(
        string indexed certId,
        address indexed issuer,
        uint256 revokedAt
    );

    /**
     * @notice Cấp phát văn bằng mới lên Blockchain
     * @param certId Mã định danh bằng (Duy nhất)
     * @param certificateHash Chuỗi Hash SHA-256 0x... của file JSON
     */
    function issueCertificate(
        string calldata certId,
        bytes32 certificateHash
    ) external {
        require(bytes(certId).length > 0, "Error: Certificate ID is required");
        require(certificateHash != bytes32(0), "Error: Invalid certificate hash");
        require(certificates[certId].issuedAt == 0, "Error: Certificate ID already exists");

        certificates[certId] = Certificate({
            certificateHash: certificateHash,
            issuedAt: block.timestamp,
            revoked: false,
            issuer: msg.sender
        });

        emit CertificateIssued(certId, certificateHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Thu hồi văn bằng đã phát hành (Chỉ Admin/Issuer gốc có quyền)
     * @param certId Mã định danh bằng cần thu hồi
     */
    function revokeCertificate(string calldata certId) external {
        require(certificates[certId].issuedAt != 0, "Error: Certificate does not exist");
        require(certificates[certId].issuer == msg.sender, "Error: Only issuer can revoke");
        require(!certificates[certId].revoked, "Error: Certificate already revoked");

        certificates[certId].revoked = true;

        emit CertificateRevoked(certId, msg.sender, block.timestamp);
    }

    /**
     * @notice Xác minh tính hợp lệ của văn bằng
     * @param certId Mã định danh bằng
     * @param certificateHash Hash SHA-256 tính toán từ Client
     */
    function verifyCertificate(
        string calldata certId,
        bytes32 certificateHash
    )
        external
        view
        returns (
            bool exists,
            bool hashMatched,
            bool revoked,
            address issuer,
            uint256 issuedAt
        )
    {
        Certificate memory cert = certificates[certId];

        exists = (cert.issuedAt != 0);
        hashMatched = (exists && cert.certificateHash == certificateHash);
        revoked = cert.revoked;
        issuer = cert.issuer;
        issuedAt = cert.issuedAt;
    }

    /**
     * @notice Truy vấn chi tiết thông tin On-chain của bằng
     */
    function getCertificate(string calldata certId)
        external
        view
        returns (
            bytes32 certificateHash,
            uint256 issuedAt,
            bool revoked,
            address issuer
        )
    {
        Certificate memory cert = certificates[certId];
        require(cert.issuedAt != 0, "Error: Certificate does not exist");
        return (cert.certificateHash, cert.issuedAt, cert.revoked, cert.issuer);
    }
}