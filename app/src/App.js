import './App.css';
import {Container, Row, Col, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {Auth, useAuth} from './Auth.js';
import {Contatos} from './Contatos';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const App = () => {
  return (
      <Router>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Agenda de contatos</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/contatos">Contatos</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
            <Auth/>
          </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/contatos">
            <Contatos/>
          </Route>
          <Route path="/">
            <h1>Welcome</h1>
          </Route>
        </Switch>
      </Router>

  );
}

export default App;
