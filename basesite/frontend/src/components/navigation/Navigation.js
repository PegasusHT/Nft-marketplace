import { useNavigate } from "react-router-dom";


import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand>NFT Marketplace</Navbar.Brand>
        <Navbar.Toggle aria-controls="nft-navbar" />
        <Navbar.Collapse id="nft-navbar">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Marketplace</Nav.Link>
            <Nav.Link onClick={() => navigate("/favourites")}>Favourites</Nav.Link>
            <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
            <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate('/transactions')}>Transaction History</Nav.Link>
          </Nav>
          <Nav>
            <Button onClick={() => navigate("/create")}>Create a NFT</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}