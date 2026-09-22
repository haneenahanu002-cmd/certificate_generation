import {
  Container,
  Row,
  Col,
  Button,
  Card
} from 'react-bootstrap'

import {
  Award,
  Palette,
  Download,
  ShieldCheck,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <main>

      {/* HERO SECTION */}
      <section className="bg-light py-5">
        <Container>
          <Row className="align-items-center g-5 py-lg-5">

            {/* LEFT CONTENT */}
            <Col lg={6}>
              <span className="badge rounded-pill text-bg-primary px-3 py-2 mb-3">
                ✨ Professional Certificate Builder
              </span>

              <h1 className="display-4 fw-bold lh-sm mb-4">
                Create Beautiful
                <span className="text-primary">
                  {' '}Certificates
                </span>
                <br />
                In Just A Few Clicks
              </h1>

              <p className="lead text-secondary mb-4">
                Design professional certificates with beautiful
                templates, customize your details, and download
                your certificates easily.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Button
                  variant="primary"
                  size="lg"
                  className="px-4 d-flex align-items-center gap-2"
                  onClick={() => navigate('/create-certificate')}
                >
                  Create Certificate
                  <ArrowRight size={19} />
                </Button>

                <Button
                  variant="outline-dark"
                  size="lg"
                  className="px-4"
                  onClick={() => navigate('/my-certificates')}
                >
                  My Certificates
                </Button>

              </div>

              <div className="d-flex flex-wrap gap-4 mt-4">

                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  <small className="text-secondary">
                    Easy to use
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  <small className="text-secondary">
                    Custom templates
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  <small className="text-secondary">
                    Quick download
                  </small>
                </div>

              </div>
            </Col>

            {/* RIGHT CERTIFICATE MOCKUP */}
            <Col lg={6}>
              <div className="p-3 p-md-4">

                <div className="bg-white rounded-4 shadow-lg p-3">

                  <div className="border border-warning border-4 p-3 p-md-4">

                    <div className="border border-secondary-subtle p-4 text-center">

                      <Award
                        size={48}
                        className="text-warning mb-3"
                      />

                      <p className="small text-secondary mb-2">
                        CERTIFYPRO PRESENTS
                      </p>

                      <h3 className="fw-bold text-uppercase">
                        Certificate
                      </h3>

                      <p className="text-secondary small">
                        of Achievement
                      </p>

                      <hr />

                      <p className="small text-secondary mb-2">
                        This certificate is proudly presented to
                      </p>

                      <h4 className="fw-bold">
                        Your Name
                      </h4>

                      <p className="small text-secondary mt-3">
                        For outstanding performance and dedication
                      </p>

                      <Row className="mt-4 g-2">
                        <Col xs={6}>
                          <div className="border-top pt-2">
                            <small className="text-secondary">
                              Date
                            </small>
                          </div>
                        </Col>

                        <Col xs={6}>
                          <div className="border-top pt-2">
                            <small className="text-secondary">
                              Signature
                            </small>
                          </div>
                        </Col>
                      </Row>

                    </div>

                  </div>

                </div>

              </div>
            </Col>

          </Row>
        </Container>
      </section>


      {/* FEATURES SECTION */}
      <section className="py-5">
        <Container>

          <div className="text-center mb-5">
            <span className="text-primary fw-semibold">
              SIMPLE & POWERFUL
            </span>

            <h2 className="fw-bold mt-2">
              Everything You Need
            </h2>

            <p className="text-secondary">
              Create professional certificates without complicated tools.
            </p>
          </div>

          <Row className="g-4">

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="bg-primary-subtle rounded-3 d-inline-flex p-3 mb-3">
                    <Palette
                      size={27}
                      className="text-primary"
                    />
                  </div>

                  <h5 className="fw-bold">
                    Beautiful Templates
                  </h5>

                  <p className="text-secondary">
                    Choose from multiple professional certificate
                    designs that match your needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="bg-success-subtle rounded-3 d-inline-flex p-3 mb-3">
                    <ShieldCheck
                      size={27}
                      className="text-success"
                    />
                  </div>

                  <h5 className="fw-bold">
                    Easy Customization
                  </h5>

                  <p className="text-secondary">
                    Enter recipient details, achievement,
                    organization and issuer information.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm p-3">
                <Card.Body>
                  <div className="bg-warning-subtle rounded-3 d-inline-flex p-3 mb-3">
                    <Download
                      size={27}
                      className="text-warning"
                    />
                  </div>

                  <h5 className="fw-bold">
                    Save & Download
                  </h5>

                  <p className="text-secondary">
                    Save your certificates and access them
                    anytime from My Certificates.
                  </p>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>


      {/* HOW IT WORKS */}
      <section className="bg-light py-5">
        <Container>

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              How It Works
            </h2>

            <p className="text-secondary">
              Create your certificate in three simple steps.
            </p>
          </div>

          <Row className="g-4 text-center">

            <Col md={4}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '55px', height: '55px' }}>
                <span className="fw-bold fs-5">1</span>
              </div>

              <h5 className="fw-bold">
                Choose a Template
              </h5>

              <p className="text-secondary">
                Select a certificate design from our templates.
              </p>
            </Col>

            <Col md={4}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '55px', height: '55px' }}>
                <span className="fw-bold fs-5">2</span>
              </div>

              <h5 className="fw-bold">
                Add Your Details
              </h5>

              <p className="text-secondary">
                Fill in the certificate information and preview it.
              </p>
            </Col>

            <Col md={4}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '55px', height: '55px' }}>
                <span className="fw-bold fs-5">3</span>
              </div>

              <h5 className="fw-bold">
                Save Your Certificate
              </h5>

              <p className="text-secondary">
                Save and manage your certificates from one place.
              </p>
            </Col>

          </Row>
        </Container>
      </section>


      {/* BOTTOM CTA */}
      <section className="py-5">
        <Container>
          <div className="bg-primary text-white rounded-4 p-4 p-md-5 text-center">

            <h2 className="fw-bold">
              Ready to Create Your Certificate?
            </h2>

            <p className="mb-4">
              Start with a beautiful template and create your
              professional certificate today.
            </p>

            <Button
              variant="light"
              size="lg"
              className="px-4"
              onClick={() => navigate('/templates')}
            >
              Get Started
              <ArrowRight size={18} className="ms-2" />
            </Button>

          </div>
        </Container>
      </section>


      {/* FOOTER */}
      <footer className="border-top py-4">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">

            <div className="d-flex align-items-center gap-2">
              <Award size={22} className="text-primary" />
              <span className="fw-bold">
                CertifyPro
              </span>
            </div>

            <small className="text-secondary">
              © 2026 CertifyPro. All rights reserved.
            </small>

          </div>
        </Container>
      </footer>

    </main>
  )
}

export default Home