function generateCertificateId() {
  const year = new Date().getFullYear()

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()

  return `CERT-${year}-${randomPart}`
}

export default generateCertificateId