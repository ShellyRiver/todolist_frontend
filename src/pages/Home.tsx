import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Home = () => {
    return (
      <>
        <h1>Home</h1>
        <div>
          <Navigator />
        </div>
      </>
    );
  };
  




function Navigator() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="monthly">Monthly</Nav.Link>
              <Nav.Link href="weekly">Weekly</Nav.Link>
              <Nav.Link href="daily">Daily</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      

      <Outlet />
    </>
  )
}


export default Home;