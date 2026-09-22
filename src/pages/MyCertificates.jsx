
import { useEffect, useState } from 'react'

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal
} from 'react-bootstrap'

import {
  Award,
  Eye,
  Pencil,
  Download,
  Trash2
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import CertificateShare from "../components/CertificateShare";

import CertificatePreview from '../components/CertificatePreview'


function MyCertificate() {
  const navigate = useNavigate()

  const [certificates, setCertificates] = useState([])

  const [selectedCertificate, setSelectedCertificate] =
    useState(null)

  const [showModal, setShowModal] = useState(false)
  const [shareCertificate, setShareCertificate] = useState(null);
const API_URL = 'https://backend-certificate-mw53.onrender.com'

  // LOAD CERTIFICATES
  // LOAD CERTIFICATES FROM BACKEND
useEffect(() => {
  const fetchCertificates = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        'https://backend-certificate-mw53.onrender.com/api/certificates'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch certificates')
      }

      const data = await response.json()

      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)

      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  fetchCertificates()
}, [])


  // VIEW CERTIFICATE
  const handleView = (certificate) => {
    setSelectedCertificate(certificate)
    setShowModal(true)
  }


  // EDIT CERTIFICATE
  const handleEdit = (certificate) => {
    localStorage.setItem(
      'editingCertificate',
      JSON.stringify(certificate)
    )

    navigate('/create-certificate')
  }


  // DELETE CERTIFICATE
  // DELETE CERTIFICATE FROM BACKEND
const handleDelete = async (certificateId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/certificates/${certificateId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete certificate')
    }

    const updatedCertificates =
      certificates.filter(
        (certificate) =>
          certificate.certificateId !== certificateId
      )

    setCertificates(updatedCertificates)

    if (
      selectedCertificate?.certificateId === certificateId
    ) {
      setSelectedCertificate(null)
      setShowModal(false)
    }
  } catch (error) {
    console.error(
      'Error deleting certificate:',
      error
    )

    alert('Unable to delete certificate')
  }
}


  // PDF DOWNLOAD
  const handlePdfClick = async (certificate, event) => {
    try {
      // Find the current certificate card
      const card =
        event.currentTarget.closest('.certificate-card')

      // Find the actual preview shown inside the card
      const preview =
        card?.querySelector('.certificate-card-preview')

      if (!preview) {
        console.error('Certificate preview not found')
        return
      }

      // Wait until fonts are loaded
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      // Small delay to ensure rendering is complete
      await new Promise((resolve) => {
        setTimeout(resolve, 300)
      })

      // Capture the actual card preview
      const canvas = await html2canvas(
        preview,
        {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0
        }
      )

      const imageData =
        canvas.toDataURL('image/png', 1.0)


      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      })


      const pageWidth =
        pdf.internal.pageSize.getWidth()

      const pageHeight =
        pdf.internal.pageSize.getHeight()


      const imageRatio =
        canvas.width / canvas.height

      let imageWidth = pageWidth

      let imageHeight =
        imageWidth / imageRatio


      // Keep the entire image inside the A4 page
      if (imageHeight > pageHeight) {
        imageHeight = pageHeight

        imageWidth =
          imageHeight * imageRatio
      }


      const positionX =
        (pageWidth - imageWidth) / 2

      const positionY =
        (pageHeight - imageHeight) / 2


      pdf.addImage(
        imageData,
        'PNG',
        positionX,
        positionY,
        imageWidth,
        imageHeight,
        undefined,
        'FAST'
      )


      // Create safe file name
      const recipientName =
        certificate.recipientName || 'certificate'

      const safeFileName =
        recipientName
          .trim()
          .replace(/[^a-zA-Z0-9-_ ]/g, '')
          .replace(/\s+/g, '-')


      // Download PDF
      pdf.save(
        `${safeFileName}-certificate.pdf`
      )

    } catch (error) {
      console.error(
        'PDF generation failed:',
        error
      )

      alert(
        'Unable to generate PDF. Please try again.'
      )
    }
  }


  return (
    <main>

      <Container className="py-5">


        {/* PAGE HEADER */}

        <div className="mb-4">

          <h1 className="fw-bold">
            My Certificates
          </h1>

          <p className="text-secondary">
            View, edit and download your certificates.
          </p>

        </div>



        {/* EMPTY STATE */}

        {certificates.length === 0 ? (

          <div className="text-center py-5">

            <Award
              size={55}
              className="text-secondary mb-3"
            />

            <h4>
              No Certificates Found
            </h4>

            <p className="text-secondary">
              Create your first certificate to see it here.
            </p>

            <Button
              variant="primary"
              onClick={() =>
                navigate('/create-certificate')
              }
            >
              Create Certificate
            </Button>

          </div>

        ) : (

          <Row className="g-4">

            {certificates.map((certificate) => (

              <Col
                key={certificate.certificateId}
                xs={12}
                md={6}
                xl={6}
              >

                <Card
                  className="certificate-card h-100 shadow-sm border-0"
                >


                  {/* CERTIFICATE PREVIEW */}

                  <div className="certificate-card-preview">

                    <CertificatePreview
                      certificateData={certificate}
                    />

                  </div>



                  {/* CERTIFICATE DETAILS */}

                  <Card.Body>

                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">

                      <div>

                        <Card.Title className="mb-1">

                          {certificate.recipientName ||
                            'Recipient Name'}

                        </Card.Title>


                        <Card.Text className="text-secondary small mb-0">

                          {certificate.achievementType ||
                            'Course Completion'}

                        </Card.Text>

                      </div>


                      <Badge bg="success">
                        Created
                      </Badge>

                    </div>



                    <div className="small text-secondary mb-3">

                      <div>

                        Certificate ID:{' '}

                        <strong>
                          {certificate.certificateId}
                        </strong>

                      </div>


                      <div>

                        Issue Date:{' '}

                        <strong>

                          {certificate.issueDate ||
                            'Not specified'}

                        </strong>

                      </div>

                    </div>



                    {/* ACTION BUTTONS */}

                    <div className="d-flex flex-wrap gap-2">


                      {/* VIEW */}

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          handleView(certificate)
                        }
                      >

                        <Eye
                          size={15}
                          className="me-1"
                        />

                        View

                      </Button>



                      {/* EDIT */}

                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleEdit(certificate)
                        }
                      >

                        <Pencil
                          size={15}
                          className="me-1"
                        />

                        Edit

                      </Button>



                      {/* PDF DOWNLOAD */}

                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={(event) =>
                          handlePdfClick(
                            certificate,
                            event
                          )
                        }
                      >

                        <Download
                          size={15}
                          className="me-1"
                        />

                        PDF

                      </Button>



                      {/* DELETE */}

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            certificate.certificateId
                          )
                        }
                      >

                        <Trash2
                          size={15}
                          className="me-1"
                        />

                        Delete

                      </Button>
                      <Button
  variant="outline-primary"
  size="sm"
  onClick={() => setShareCertificate(certificate)}
>
  Share
</Button>

                    </div>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        )}

      </Container>



      {/* VIEW CERTIFICATE MODAL */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>
            Certificate Preview
          </Modal.Title>

        </Modal.Header>



        <Modal.Body>

          {selectedCertificate && (

            <>

              {/* SAME CERTIFICATE DESIGN */}

              <div className="certificate-modal-preview">

                <div className="certificate-card-preview">

                  <CertificatePreview
                    certificateData={selectedCertificate}
                    compact={true}
                  />

                </div>

              </div>



              {/* CERTIFICATE INFORMATION */}

              <div className="mt-4">

                <h5 className="fw-bold">
                  Certificate Details
                </h5>


                <p className="mb-1">

                  <strong>Recipient:</strong>{' '}

                  {selectedCertificate.recipientName}

                </p>


                <p className="mb-1">

                  <strong>Certificate ID:</strong>{' '}

                  {selectedCertificate.certificateId}

                </p>


                <p className="mb-1">

                  <strong>Issue Date:</strong>{' '}

                  {selectedCertificate.issueDate ||
                    'Not specified'}

                </p>


                <p className="mb-1">

                  <strong>Issued By:</strong>{' '}

                  {selectedCertificate.issuedBy ||
                    'Authorized Signatory'}

                </p>

              </div>

            </>

          )}

        </Modal.Body>
        



        

      </Modal>
      {/* VIEW CERTIFICATE MODAL */}

<Modal
  show={showModal}
  onHide={() => setShowModal(false)}
  centered
  size="lg"
>
  {/* Your existing View Modal content */}
</Modal>


{/* SHARE CERTIFICATE MODAL */}

<Modal
  show={Boolean(shareCertificate)}
  onHide={() => setShareCertificate(null)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>
      Share Certificate
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {shareCertificate && (
      <>
        <div className="mb-3">
          <h5 className="fw-bold">
            {shareCertificate.recipientName}
          </h5>

          <p className="text-secondary mb-0">
            Certificate ID:{" "}
            {shareCertificate.certificateId}
          </p>
        </div>

        <CertificateShare certificate={shareCertificate} />
      </>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShareCertificate(null)}
    >
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </main>
  )
}


export default MyCertificate