/**
 * Khởi tạo struct dữ liệu bằng
 */
function createCertificateData({ certId, studentName, degree, issuer, issueDate }) {
    return {
        certificateId: certId,
        studentName: studentName,
        degree: degree,
        issuer: issuer,
        issueDate: issueDate
    };
}

/**
 * Chuẩn hóa cấu trúc JSON theo thứ tự key cố định.
 * Bắt buộc áp dụng trước khi băm SHA-256 ở cả Client Admin lẫn Client Verify.
 */
function canonicalizeCertificate(cert) {
    return JSON.stringify({
        certificateId: cert.certificateId,
        studentName: cert.studentName,
        degree: cert.degree,
        issuer: cert.issuer,
        issueDate: cert.issueDate
    });
}