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

  const certificateRef = useRef(null);

  // FETCH CERTIFICATE

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/certificates/verify/${encodeURIComponent(
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

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  // DOWNLOAD CERTIFICATE AS PDF

  const handleDownloadPDF = async () => {
    if (!certificateRef.current || !certificate) {
      return;
    }

    try {
      setDownloading(true);

      const certificateElement = certificateRef.current;

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth;
      const imageHeight =
        (canvas.height * imageWidth) / canvas.width;

      const positionY =
        (pageHeight - imageHeight) / 2;

      pdf.addImage(
        imageData,
        "PNG",
        0,
        positionY > 0 ? positionY : 0,
        imageWidth,
        imageHeight
      );

      pdf.save(
        `${certificate.recipientName || "certificate"}-certificate.pdf`
      );
    } catch (error) {
      console.error("PDF download failed:", error);

      alert("Unable to download certificate PDF");
    } finally {
      setDownloading(false);
    }
  };

  // LOADING

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />

        <p className="mt-3">
          Verifying certificate...
        </p>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">
          Invalid Certificate
        </h2>

        <p>{error}</p>
      </div>
    );
  }

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

      {/* DOWNLOAD BUTTON */}

      <div
        className="text-center mt-4"
      >
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