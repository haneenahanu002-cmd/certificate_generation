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

import CertificatePreview from '../components/CertificatePreview'


function MyCertificate() {

  const navigate = useNavigate()

  // BACKEND API URL
  const API_URL =
    'https://backend-certificate-mw53.onrender.com'


  // STATES
  const [certificates, setCertificates] = useState([])

  const [selectedCertificate, setSelectedCertificate] =
    useState(null)

  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(true)


  // ==========================================
  // LOAD CERTIFICATES FROM BACKEND
  // ==========================================

  useEffect(() => {

    const fetchCertificates = async () => {

      try {

        setLoading(true)

        const response = await fetch(
          `${API_URL}/api/certificates`
        )

        const result = await response.json()

        console.log('Backend response:', result)


        if (!response.ok) {

          throw new Error(
            result.message || 'Failed to fetch certificates'
          )

        }


        // Handle different backend response formats

        const certificateList = Array.isArray(result)
          ? result
          : result.certificates ||
            result.data ||
            []


        setCertificates(certificateList)


      } catch (error) {

        console.error(
          'Error fetching certificates:',
          error
        )

        setCertificates([])

      } finally {

        setLoading(false)

      }

    }


    fetchCertificates()

  }, [])


  // ==========================================
  // VIEW CERTIFICATE
  // ==========================================

  const handleView = (certificate) => {

    setSelectedCertificate(certificate)

    setShowModal(true)

  }


  // ==========================================
  // EDIT CERTIFICATE
  // ==========================================

  const handleEdit = (certificate) => {

    localStorage.setItem(
      'editingCertificate',
      JSON.stringify(certificate)
    )

    navigate('/create-certificate')

  }


  // ==========================================
  // DELETE CERTIFICATE
  // ==========================================

  const handleDelete = async (certificateId) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this certificate?'
    )


    if (!confirmDelete) {
      return
    }


    try {

      const response = await fetch(
        `${API_URL}/api/certificates/${certificateId}`,
        {
          method: 'DELETE'
        }
      )


      const result = await response.json()

      console.log('Delete response:', result)


      if (!response.ok) {

        throw new Error(
          result.message || 'Failed to delete certificate'
        )

      }


      // Remove deleted certificate from UI

      const updatedCertificates =
        certificates.filter(
          (certificate) =>
            certificate.certificateId !== certificateId
        )


      setCertificates(updatedCertificates)


      // Close modal if deleted certificate is selected

      if (
        selectedCertificate?.certificateId === certificateId
      ) {

        setSelectedCertificate(null)

        setShowModal(false)

      }


      alert('Certificate deleted successfully!')


    } catch (error) {

      console.error(
        'Error deleting certificate:',
        error
      )

      alert(
        'Unable to delete certificate. Please try again.'
      )

    }

  }


  // ==========================================
  // PDF DOWNLOAD
  // ==========================================

  const handlePdfClick = async (
    certificate,
    event
  ) => {

    try {

      // Find current certificate card

      const card =
        event.currentTarget.closest(
          '.certificate-card'
        )


      // Find certificate preview

      const preview =
        card?.querySelector(
          '.certificate-card-preview'
        )


      if (!preview) {

        console.error(
          'Certificate preview not found'
        )

        return

      }


      // Wait until fonts are loaded

      if (document.fonts?.ready) {

        await document.fonts.ready

      }


      // Wait for rendering

      await new Promise((resolve) => {

        setTimeout(resolve, 300)

      })


      // Capture certificate preview

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
        canvas.toDataURL(
          'image/png',
          1.0
        )


      // Create PDF

      const pdf = new jsPDF(
        {
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
          compress: true
        }
      )


      const pageWidth =
        pdf.internal.pageSize.getWidth()


      const pageHeight =
        pdf.internal.pageSize.getHeight()


      const imageRatio =
        canvas.width / canvas.height


      let imageWidth = pageWidth

      let imageHeight =
        imageWidth / imageRatio


      // Keep image inside A4 page

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
        certificate.recipientName ||
        'certificate'


      const safeFileName =
        recipientName
          .trim()
          .replace(
            /[^a-zA-Z0-9-_ ]/g,
            ''
          )
          .replace(
            /\s+/g,
            '-'
          )


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


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {

    return (

      <main>

        <Container className="py-5">

          <div className="text-center py-5">

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <h5>
              Loading certificates...
            </h5>

            <p className="text-secondary">
              Please wait while your certificates are loading.
            </p>

          </div>

        </Container>

      </main>

    )

  }


  // ==========================================
  // PAGE UI
  // ==========================================

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
                key={
                  certificate.id ||
                  certificate.certificateId
                }
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

                    <div
                      className="d-flex justify-content-between align-items-start gap-2 mb-2"
                    >

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



                    {/* CERTIFICATE INFORMATION */}

                    <div className="small text-secondary mb-3">

                      <div>

                        Certificate ID:{' '}

                        <strong>

                          {certificate.certificateId ||
                            'Not available'}

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


                      {/* VIEW BUTTON */}

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



                      {/* EDIT BUTTON */}

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



                      {/* PDF BUTTON */}

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



                      {/* DELETE BUTTON */}

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

              {/* CERTIFICATE DESIGN */}

              <div className="certificate-modal-preview">

                <div className="certificate-card-preview">

                  <CertificatePreview
                    certificateData={
                      selectedCertificate
                    }
                    compact={true}
                  />

                </div>

              </div>



              {/* CERTIFICATE DETAILS */}

              <div className="mt-4">

                <h5 className="fw-bold">
                  Certificate Details
                </h5>


                <p className="mb-1">

                  <strong>
                    Recipient:
                  </strong>{' '}

                  {selectedCertificate.recipientName ||
                    'Not specified'}

                </p>


                <p className="mb-1">

                  <strong>
                    Certificate ID:
                  </strong>{' '}

                  {selectedCertificate.certificateId ||
                    'Not specified'}

                </p>


                <p className="mb-1">

                  <strong>
                    Issue Date:
                  </strong>{' '}

                  {selectedCertificate.issueDate ||
                    'Not specified'}

                </p>


                <p className="mb-1">

                  <strong>
                    Issued By:
                  </strong>{' '}

                  {selectedCertificate.issuedBy ||
                    'Authorized Signatory'}

                </p>


                <p className="mb-1">

                  <strong>
                    Organization:
                  </strong>{' '}

                  {selectedCertificate.organization ||
                    'Not specified'}

                </p>


                <p className="mb-1">

                  <strong>
                    Achievement:
                  </strong>{' '}

                  {selectedCertificate.achievement ||
                    'Not specified'}

                </p>

              </div>

            </>

          )}

        </Modal.Body>



        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >

            Close

          </Button>

        </Modal.Footer>

      </Modal>


    </main>

  )

}


export default MyCertificate