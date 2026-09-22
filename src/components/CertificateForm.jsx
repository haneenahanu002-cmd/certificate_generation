import { Card, Form, Button } from 'react-bootstrap'
import { Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function CertificateForm({
  certificateData,
  setCertificateData,
  editingCertificate
}) {
  const navigate = useNavigate()

  // Render Backend URL
  const API_URL = 'https://backend-certificate-mw53.onrender.com'

  // Check whether the user is editing an existing certificate
  const isEditing = Boolean(editingCertificate)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setCertificateData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  // SAVE OR UPDATE CERTIFICATE
  const handleSave = async () => {
    // Validate required fields
    if (
      !certificateData.organization?.trim() ||
      !certificateData.recipientName?.trim() ||
      !certificateData.achievement?.trim() ||
      !certificateData.issueDate ||
      !certificateData.issuedBy?.trim()
    ) {
      alert('Please fill all required fields.')
      return
    }

    // Preserve certificate ID and database ID
    const certificateToSave = {
      ...certificateData,

      // Certificate ID remains unchanged
      certificateId: certificateData.certificateId,

      // Keep existing database ID while editing
      id: editingCertificate?.id || Date.now()
    }

    try {
      let response

      if (isEditing) {
        // UPDATE EXISTING CERTIFICATE
        response = await fetch(
          `${API_URL}/api/certificates/${editingCertificate.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(certificateToSave)
          }
        )
      } else {
        // CREATE NEW CERTIFICATE
        response = await fetch(
          `${API_URL}/api/certificates`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(certificateToSave)
          }
        )
      }

      if (!response.ok) {
        throw new Error('Failed to save certificate')
      }

      // Remove edit mode
      localStorage.removeItem('editingCertificate')

      // Show success message
      alert(
        isEditing
          ? 'Certificate updated successfully!'
          : 'Certificate saved successfully!'
      )

      // Navigate to My Certificates
      navigate('/my-certificates')
    } catch (error) {
      console.error(
        'Error saving certificate:',
        error
      )

      alert(
        'Unable to save certificate. Please check your backend server.'
      )
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="fw-bold">
            Certificate Details
          </h3>

          <p className="text-secondary">
            Enter the information that will appear on your certificate.
          </p>
        </div>

        <Form>

          {/* CERTIFICATE COLOR */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Choose Certificate Color
            </Form.Label>

            <Form.Select
              name="template"
              value={certificateData.template || 'classic'}
              onChange={handleChange}
            >
              <option value="classic">
                Classic Gold
              </option>

              <option value="modern">
                Modern Red
              </option>

              <option value="minimal">
                Minimal Blue
              </option>

              <option value="creative">
                Creative Green
              </option>
            </Form.Select>
          </Form.Group>

          {/* ORGANIZATION */}
          <Form.Group className="mb-3">
            <Form.Label>
              University / Organization
            </Form.Label>

            <Form.Control
              type="text"
              name="organization"
              value={certificateData.organization || ''}
              onChange={handleChange}
              placeholder="Enter university or organization"
            />
          </Form.Group>

          {/* CERTIFICATE TYPE */}
          <Form.Group className="mb-3">
            <Form.Label>
              Certificate Title
            </Form.Label>

            <Form.Select
              name="certificateType"
              value={certificateData.certificateType || ''}
              onChange={handleChange}
            >
              <option value="Certificate of Achievement">
                Certificate of Achievement
              </option>

              <option value="Certificate of Completion">
                Certificate of Completion
              </option>

              <option value="Certificate of Participation">
                Certificate of Participation
              </option>

              <option value="Certificate of Excellence">
                Certificate of Excellence
              </option>

              <option value="Certificate of Appreciation">
                Certificate of Appreciation
              </option>

              <option value="Certificate of Recognition">
                Certificate of Recognition
              </option>
            </Form.Select>
          </Form.Group>

          {/* RECIPIENT NAME */}
          <Form.Group className="mb-3">
            <Form.Label>
              Recipient Name
            </Form.Label>

            <Form.Control
              type="text"
              name="recipientName"
              value={certificateData.recipientName || ''}
              onChange={handleChange}
              placeholder="Enter recipient name"
            />
          </Form.Group>

          {/* ACHIEVEMENT TYPE */}
          <Form.Group className="mb-3">
            <Form.Label>
              Achievement Type
            </Form.Label>

            <Form.Select
              name="achievementType"
              value={certificateData.achievementType || ''}
              onChange={handleChange}
            >
              <option value="Course Completion">
                Course Completion
              </option>

              <option value="Academic Achievement">
                Academic Achievement
              </option>

              <option value="Sports Achievement">
                Sports Achievement
              </option>

              <option value="Award">
                Award
              </option>

              <option value="Presentation">
                Presentation
              </option>

              <option value="Competition">
                Competition
              </option>

              <option value="Participation">
                Participation
              </option>

              <option value="Workshop">
                Workshop
              </option>

              <option value="Appreciation">
                Appreciation
              </option>

              <option value="Other">
                Other
              </option>
            </Form.Select>
          </Form.Group>

          {/* ACHIEVEMENT / COURSE */}
          <Form.Group className="mb-3">
            <Form.Label>
              Achievement / Course Name
            </Form.Label>

            <Form.Control
              type="text"
              name="achievement"
              value={certificateData.achievement || ''}
              onChange={handleChange}
              placeholder="e.g. MERN Stack Development"
            />
          </Form.Group>

          {/* DESCRIPTION */}
          <Form.Group className="mb-3">
            <Form.Label>
              Description
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={certificateData.description || ''}
              onChange={handleChange}
              placeholder="Describe why this certificate is awarded..."
            />

            <Form.Text className="text-muted">
              Example: For demonstrating outstanding performance
              in the inter-college football competition.
            </Form.Text>
          </Form.Group>

          {/* ISSUE DATE */}
          <Form.Group className="mb-3">
            <Form.Label>
              Issue Date
            </Form.Label>

            <Form.Control
              type="date"
              name="issueDate"
              value={certificateData.issueDate || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* CERTIFICATE ID */}
          <Form.Group className="mb-3">
            <Form.Label>
              Certificate ID
            </Form.Label>

            <Form.Control
              type="text"
              name="certificateId"
              value={certificateData.certificateId || ''}
              onChange={handleChange}
              placeholder="CERT-2026-001"
              readOnly={isEditing}
            />

            <Form.Text className="text-muted">
              {isEditing
                ? 'Certificate ID cannot be changed while editing.'
                : 'A certificate ID is automatically generated for new certificates.'}
            </Form.Text>
          </Form.Group>

          {/* ISSUED BY */}
          <Form.Group className="mb-4">
            <Form.Label>
              Issued By
            </Form.Label>

            <Form.Control
              type="text"
              name="issuedBy"
              value={certificateData.issuedBy || ''}
              onChange={handleChange}
              placeholder="Principal / Director / Authorized Signatory"
            />
          </Form.Group>

          {/* SAVE / UPDATE BUTTON */}
          <Button
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleSave}
          >
            <Save size={18} />

            {isEditing
              ? 'Update Certificate'
              : 'Save Certificate'}
          </Button>

        </Form>

      </Card.Body>
    </Card>
  )
}

export default CertificateForm