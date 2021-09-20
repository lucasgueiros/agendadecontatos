import './App.css';
import {Container, Navbar, Nav} from 'react-bootstrap';
import {useAuth} from './Auth.js';
import {Contatos} from './Contatos';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  const [auth, Authentication] = useAuth();
  return (
      <Router>
        <div className="container" style={{'width': '70%'}}>
          <Navbar bg="primary" variant="dark" expand="md">
            <Container>
              <Navbar.Brand as={Link} to="/">Agenda de contatos</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/contatos">Contatos</Nav.Link>
                </Nav>
                <Nav>
                  <Authentication/>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Switch>
            <Route path="/contatos">
              <Contatos auth={auth}/>
            </Route>
            <Route path="/">
              <h1>Welcome</h1>
            </Route>
          </Switch>
        </div>
      </Router>

  );
}


export default App;
