import { Container, Navbar, Nav, Button, Jumbotron, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">EMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
              <Nav.Link href="#">Contact</Nav.Link>
              <Nav.Link href='#'>Login</Nav.Link> 
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Jumbotron className="header" style={{ backgroundImage: 'url(header-bg.jpg)', backgroundSize: 'cover' }}>
        <Container>
          <h1>Welcome to the Employee Management System</h1>
          <p>Manage your employees efficiently and effectively</p>
          <Button variant="primary" size="lg">Get Started</Button>
        </Container>
      </Jumbotron>

      <Container className="features py-5">
        <Row className="text-center">
          <Col md={4}>
            <div className="feature-box p-4 mb-4">
              <i className="bi bi-people feature-icon"></i>
              <h3>Manage Employees</h3>
              <p>Efficiently manage your employee information and details.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box p-4 mb-4">
              <i className="bi bi-card-checklist feature-icon"></i>
              <h3>Assign Projects</h3>
              <p>Easily assign and manage employee projects.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box p-4 mb-4">
              <i className="bi bi-bar-chart-line feature-icon"></i>
              <h3>Track Performance</h3>
              <p>Monitor and track employee performance and progress.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <p>&copy; 2025 Employee Management System. All Rights Reserved.</p>
        </Container>
      </footer>
    </>
  );
}

export default HomePage;
