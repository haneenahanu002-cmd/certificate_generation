import { useState } from "react";
import { Button } from "react-bootstrap";

function CertificateShare({ certificate }) {
  const [copied, setCopied] = useState(false);

  const certificateId = certificate?.certificateId;

  const certificateUrl = `${window.location.origin}/verify/${encodeURIComponent(
    certificateId
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy link");
    }
  };

  
  

  const handleNativeShare = async () => {
    if (!navigator.share) {
      alert("Your browser does not support native sharing");
      return;
    }

    try {
      await navigator.share({
        title: "My Certificate",
        text: `View certificate of ${certificate.recipientName}`,
        url: certificateUrl,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Sharing failed:", error);
      }
    }
  };

  return (
    <div className="certificate-share mt-3">
      <h5>Share Certificate</h5>

      <div className="mb-3">
        <label className="form-label">Certificate URL</label>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={certificateUrl}
            readOnly
          />

          <Button variant="outline-primary" onClick={handleCopyLink}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      
    </div>
  );
}

export default CertificateShare;