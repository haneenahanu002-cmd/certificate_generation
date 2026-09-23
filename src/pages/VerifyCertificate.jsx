
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import CertificatePreview from "../components/CertificatePreview";

function VerifyCertificate() {
  const { certificateId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const certificateRef = useRef(null);

  const API_URL = "https://backend-certificate-mw53.onrender.com";

  // FETCH CERTIFICATE
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/certificates/verify/${encodeURIComponent(
            certificateId
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Certificate not found"
          );
        }

        setCertificate(data);
      } catch (error) {
        console.error("Verification error:", error);
        setError(error.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  // COPY VERIFICATION LINK
  const handleCopyLink = async () => {
    const verificationLink = `${window.location.origin}/verify/${certificateId}`;

    try {
      await navigator.clipboard.writeText(verificationLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy link failed:", error);

      alert("Unable to copy link");
    }
  };

  // DOWNLOAD CERTIFICATE AS PDF
  const handleDownloadPDF = async () => {
  if (!certificateRef.current || !certificate) {
    return;
  }

  try {
    setDownloading(true);

    const certificateElement = certificateRef.current;

    // Wait for fonts to load
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Wait for certificate preview to render
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    const canvas = await html2canvas(certificateElement, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const imageData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image ratio
    const imageRatio = canvas.width / canvas.height;

    let imageWidth = pageWidth;
    let imageHeight = imageWidth / imageRatio;

    // Fit image inside A4 page
    if (imageHeight > pageHeight) {
      imageHeight = pageHeight;
      imageWidth = imageHeight * imageRatio;
    }

    // Center image horizontally and vertically
    const positionX = (pageWidth - imageWidth) / 2;
    const positionY = (pageHeight - imageHeight) / 2;

    pdf.addImage(
      imageData,
      "PNG",
      positionX,
      positionY,
      imageWidth,
      imageHeight,
      undefined,
      "FAST"
    );

    const recipientName =
      certificate.recipientName || "certificate";

    const safeFileName = recipientName
      .trim()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-");

    pdf.save(`${safeFileName}-certificate.pdf`);
  } catch (error) {
    console.error("PDF download failed:", error);

    alert("Unable to download certificate PDF");
  } finally {
    setDownloading(false);
  }
};

  // CERTIFICATE VIEW
  return (
    <div className="container py-5">

      {/* VERIFICATION HEADING */}
      <div className="text-center mb-4">
        <h2 className="text-success fw-bold">
          ✓ Certificate Verified
        </h2>

        <p className="text-secondary">
          This certificate is authentic and verified.
        </p>
      </div>

      {/* CERTIFICATE DESIGN */}
      <div className="d-flex justify-content-center">
        <div
          ref={certificateRef}
          className="certificate-card-preview"
          style={{
            width: "100%",
            maxWidth: "1000px",
            backgroundColor: "#ffffff",
          }}
        >
          <CertificatePreview
            certificateData={certificate}
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="text-center mt-4 d-flex justify-content-center gap-3 flex-wrap">

        {/* COPY LINK BUTTON */}
        <Button
          variant="success"
          size="lg"
          onClick={handleCopyLink}
        >
          {copied ? "✓ Link Copied" : "🔗 Copy Link"}
        </Button>

        {/* DOWNLOAD BUTTON */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading
            ? "Preparing PDF..."
            : "Download Certificate PDF"}
        </Button>

      </div>
    </div>
  );
}

export default VerifyCertificate;