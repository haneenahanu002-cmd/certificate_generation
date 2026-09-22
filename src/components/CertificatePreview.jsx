import { Award, ShieldCheck } from 'lucide-react'

function CertificatePreview({
  certificateData,
  compact = false,
  exportMode = false
}) {
  const {
    organization,
    recipientName,
    certificateType,
    achievementType,
    achievement,
    description,
    issueDate,
    certificateId,
    issuedBy,
    template
  } = certificateData

  const selectedTemplate = template || 'classic'

  const templateColors = {
    classic: {
      primary: '#1c416f',
      gold: '#cda957',
      background: '#ffffff',
      softBackground: '#f8f9fa'
    },

    modern: {
      primary: '#091113',
      gold: '#930303',
      background: '#faf5ee',
      softBackground: '#e0f2fe'
    },

    minimal: {
      primary: '#0a0800',
      gold: '#38047b',
      background: '#f2ebeb',
      softBackground: '#f8f9fa'
    },

    creative: {
      primary: '#010c05',
      gold: '#3e6503',
      background: '#fdfefb',
      softBackground: '#ecfccb'
    }
  }

  const colors =
    templateColors[selectedTemplate] ||
    templateColors.classic

  return (
    <div
      className={`
        certificate-preview-wrapper
        ${compact ? 'certificate-preview-compact' : ''}
        ${exportMode ? 'certificate-export-preview' : ''}
      `}
    >
      <div
        className={`certificate-sheet certificate-${selectedTemplate}`}
        data-certificate-preview="true"
        data-certificate-id={certificateId}
        style={{
          '--certificate-primary': colors.primary,
          '--certificate-gold': colors.gold,
          '--certificate-background': colors.background,
          '--certificate-soft-background':
            colors.softBackground
        }}
      >

        {/* DECORATIVE CORNERS */}

        <div className="certificate-corner corner-top-left"></div>

        <div className="certificate-corner corner-top-right"></div>

        <div className="certificate-corner corner-bottom-left"></div>

        <div className="certificate-corner corner-bottom-right"></div>


        {/* INNER BORDER */}

        <div className="certificate-inner-border">


          {/* HEADER */}

          <div className="certificate-header">

            <div className="certificate-badge">
              <Award
                size={35}
                strokeWidth={1.8}
              />
            </div>

            <h3 className="certificate-organization">
              {organization ||
                "NOBLE WOMEN'S COLLEGE"}
            </h3>

            <p className="certificate-tagline">
              EXCELLENCE • ACHIEVEMENT • RECOGNITION
            </p>

          </div>


          {/* TITLE */}

          <div className="certificate-title-section">

            <p className="certificate-small-title">
              CERTIFICATE
            </p>

            <h1 className="certificate-main-title">

              {certificateType ===
              'Certificate of Participation'
                ? 'PARTICIPATION'
                : certificateType ===
                  'Certificate of Completion'
                ? 'COMPLETION'
                : 'ACHIEVEMENT'}

            </h1>

            <div className="certificate-divider">

              <span></span>

              <span className="certificate-diamond">
                ◆
              </span>

              <span></span>

            </div>

          </div>


          {/* RECIPIENT */}

          <div className="certificate-recipient-section">

            <p className="certificate-presented-text">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>

            <h2 className="certificate-recipient-name">
              {recipientName || 'Recipient Name'}
            </h2>

            <div className="recipient-underline"></div>

          </div>


          {/* ACHIEVEMENT */}

          <div className="certificate-achievement-section">

            <p className="certificate-completion-text">
              For successfully completing
            </p>

            <h3 className="certificate-course-name">
              {achievementType ||
                'Course Completion'}
            </h3>

            <p className="certificate-issued-by-text">

              from{' '}

              <strong>
                {organization ||
                  "Noble Women's College"}
              </strong>

            </p>

            <p className="certificate-description">

              {description ||
                achievement ||
                'For successfully completing the required course and demonstrating dedication and achievement.'}

            </p>

          </div>


          {/* BOTTOM SECTION */}

          <div className="certificate-bottom-section">


            {/* ISSUE DATE */}

            <div className="certificate-info">

              <span className="certificate-info-label">
                ISSUE DATE
              </span>

              <strong>
                {issueDate || '20 October 2027'}
              </strong>

            </div>


            {/* VERIFIED SEAL */}

            <div className="certificate-seal">

              <div className="certificate-seal-inner">

                <ShieldCheck
                  size={30}
                  strokeWidth={1.5}
                />

                <span>
                  VERIFIED
                </span>

              </div>

              <small>
                CERTIFICATE ID
              </small>

              <strong>
                {certificateId ||
                  'CERT-2026-001'}
              </strong>

            </div>


            {/* ISSUED BY */}

            <div
              className="
                certificate-info
                certificate-issued-info
              "
            >

              <span className="certificate-info-label">
                ISSUED BY
              </span>

              <strong>
                {issuedBy ||
                  'Authorized Signatory'}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CertificatePreview