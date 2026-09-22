import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

import CertificateForm from '../components/CertificateForm'
import CertificatePreview from '../components/CertificatePreview'
import generateCertificateId from '../id/certificateId'

function CreateCertificate() {
  const location = useLocation()

  const editingCertificate = JSON.parse(
    localStorage.getItem('editingCertificate') || 'null'
  )

  const selectedTemplate =
    location.state?.template ||
    editingCertificate?.template ||
    'classic'

  const [certificateData, setCertificateData] = useState(() => ({
    organization:
      editingCertificate?.organization ||
      "Noble Women's College",

    recipientName:
      editingCertificate?.recipientName || '',

    certificateType:
      editingCertificate?.certificateType ||
      'Certificate of Achievement',

    achievementType:
      editingCertificate?.achievementType ||
      'Course Completion',

    achievement:
      editingCertificate?.achievement || '',

    course:
      editingCertificate?.course || '',

    description:
      editingCertificate?.description || '',

    issueDate:
      editingCertificate?.issueDate || '',

    // Keep old ID during edit
    certificateId:
      editingCertificate?.certificateId ||
      generateCertificateId(),

    issuedBy:
      editingCertificate?.issuedBy || '',

    template: selectedTemplate
  }))

  return (
    <main>
      <Container className="py-5">

        <div className="mb-4">
          <h1 className="fw-bold">
            {editingCertificate
              ? 'Edit Certificate'
              : 'Create Certificate'}
          </h1>

          <p className="text-secondary">
            Enter details and preview your certificate.
          </p>
        </div>

        <Row className="g-4">

          <Col lg={5}>
            <CertificateForm
              certificateData={certificateData}
              setCertificateData={setCertificateData}
              editingCertificate={editingCertificate}
            />
          </Col>

          <Col lg={7}>
            <CertificatePreview
              certificateData={certificateData}
            />
          </Col>

        </Row>

      </Container>
    </main>
  )
}

export default CreateCertificate