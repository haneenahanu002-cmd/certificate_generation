import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Award, LayoutDashboard, Plus, FileText } from 'lucide-react'

function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="app-navbar">
      <Container>
        <BootstrapNavbar.Brand href="/" className="brand">
          <div className="brand-icon">
            <Award size={22} />
          </div>

          <span>Certify<span>Pro</span></span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link href="/" className="nav-link-custom">
              <LayoutDashboard size={17} />
              Dashboard
            </Nav.Link>

            <Nav.Link href="/create-certificate" className="nav-link-custom">
              <Plus size={17} />
              Create
            </Nav.Link>

            <Nav.Link href="/my-certificates" className="nav-link-custom">
              <FileText size={17} />
              My Certificates
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar