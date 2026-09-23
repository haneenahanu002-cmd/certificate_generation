
import { useEffect, useState } from 'react'

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Spinner
} from 'react-bootstrap'

import {
  Award,
  Eye,
  Pencil,
  Download,
  Trash2,
  Share2
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import CertificatePreview from '../components/CertificatePreview'
import CertificateShare from '../components/CertificateShare'


const API_URL =
  'https://backend-certificate-mw53.onrender.com'


function MyCertificate() {

  const navigate = useNavigate()


  const [certificates, setCertificates] = useState([])

  const [selectedCertificate, setSelectedCertificate] =
    useState(null)

  const [showModal, setShowModal] =
    useState(false)

  const [showShareModal, setShowShareModal] =
    useState(false)

  const [loading, setLoading] =
    useState(true)


  // ==========================================
  // GET ALL CERTIFICATES
  // ==========================================

  useEffect(() => {

    const fetchCertificates = async () => {

      try {

        setLoading(true)

        const response = await fetch(
          `${API_URL}/api/certificates`
        )

        if (!response.ok) {

          throw new Error(
            `Failed to load certificates: ${response.status}`
          )

        }

        const result = await response.json()

        console.log(
          'Certificates response:',
          result
        )


        let certificateList = []

        if (Array.isArray(result)) {

          certificateList = result

        } else if (Array.isArray(result.certificates)) {

          certificateList = result.certificates

        } else if (Array.isArray(result.data)) {

          certificateList = result.data

        }


        setCertificates(certificateList)

      } catch (error) {

        console.error(
          'Error loading certificates:',
          error
        )

        alert(
          'Unable to load certificates. Please try again.'
        )

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
  // SHARE CERTIFICATE
  // ==========================================

  const handleShare = (certificate) => {

    setSelectedCertificate(certificate)

    setShowShareModal(true)

  }



  // ==========================================
  // DELETE CERTIFICATE
  // ==========================================

  const handleDelete = async (certificate) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this certificate?'
    )


    if (!confirmDelete) {

      return

    }


    // Check all possible ID fields

    const deleteId =
      certificate?._id ||
      certificate?.id ||
      certificate?.certificateId


    if (!deleteId) {

      alert('Certificate ID not found.')

      console.error(
        'Certificate ID is missing:',
        certificate
      )

      return

    }


    try {

      console.log(
        'Deleting certificate ID:',
        deleteId
      )


      const response = await fetch(

        `${API_URL}/api/certificates/${deleteId}`,

        {
          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json'
          }

        }

      )


      // Safely handle empty response

      const responseText =
        await response.text()


      let result = {}


      try {

        result = responseText
          ? JSON.parse(responseText)
          : {}

      } catch {

        result = {
          message: responseText
        }

      }


      console.log(
        'Delete status:',
        response.status
      )

      console.log(
        'Delete response:',
        result
      )


      if (!response.ok) {

        throw new Error(

          result.message ||
          `Delete failed with status ${response.status}`

        )

      }


      // Remove deleted certificate from UI

      setCertificates(
        (previousCertificates) => {

          return previousCertificates.filter(
            (item) => {

              const itemId =
                item?._id ||
                item?.id ||
                item?.certificateId

              return itemId !== deleteId

            }
          )

        }
      )


      const selectedId =
        selectedCertificate?._id ||
        selectedCertificate?.id ||
        selectedCertificate?.certificateId


      if (selectedId === deleteId) {

        setSelectedCertificate(null)

        setShowModal(false)

        setShowShareModal(false)

      }


      alert(
        'Certificate deleted successfully!'
      )


    } catch (error) {

      console.error(
        'Error deleting certificate:',
        error
      )


      alert(
        `Unable to delete certificate: ${error.message}`
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

      const card =
        event.currentTarget.closest(
          '.certificate-card'
        )


      const preview =
        card?.querySelector(
          '.certificate-card-preview'
        )


      if (!preview) {

        console.error(
          'Certificate preview not found'
        )

        alert(
          'Certificate preview not found.'
        )

        return

      }


      if (document.fonts?.ready) {

        await document.fonts.ready

      }


      await new Promise((resolve) => {

        setTimeout(resolve, 300)

      })


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
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <main>

        <Container className="py-5 text-center">

          <Spinner
            animation="border"
            variant="primary"
          />

          <p className="text-secondary mt-3">

            Loading certificates...

          </p>

        </Container>

      </main>

    )

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

            View, edit, share and download your certificates.

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
                  certificate._id ||
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

                          {certificate.certificateId ||
                            certificate._id ||
                            certificate.id ||
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



                      {/* SHARE BUTTON */}

                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() =>
                          handleShare(certificate)
                        }
                      >

                        <Share2
                          size={15}
                          className="me-1"
                        />

                        share

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
                          handleDelete(certificate)
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



      {/* ======================================
          VIEW CERTIFICATE MODAL
      ====================================== */}

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

                  {selectedCertificate.certificateId ||
                    selectedCertificate._id ||
                    selectedCertificate.id}

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



        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >

            Close

          </Button>

        </Modal.Footer>


      </Modal>



      {/* ======================================
          SHARE CERTIFICATE MODAL
      ====================================== */}

      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        size="lg"
        centered
      >


        <Modal.Header closeButton>

          <Modal.Title>

            Share Certificate

          </Modal.Title>

        </Modal.Header>



        <Modal.Body>

          {selectedCertificate && (

            <CertificateShare
              certificate={selectedCertificate}
            />

          )}

        </Modal.Body>



        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowShareModal(false)}
          >

            Close

          </Button>

        </Modal.Footer>


      </Modal>


    </main>

  )

}


export default MyCertificate