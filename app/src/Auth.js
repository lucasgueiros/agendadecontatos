import {useState, useEffect} from 'react';
import {usePersistedState} from './generics.js';
import axios from 'axios';
import {Modal, Form, Button, Nav} from 'react-bootstrap';

const baseURL = 'http://localhost:8080/v1/';
const config = {
  baseURL: baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export function useAuth() {
  const [auth, setAuth] = usePersistedState('api',  {
    status: 'unauthenticated',
    config: config,
  });

  const login = (user,password) => {
    const http = axios.create({...config});

    http.post('login', {
      user: user,
      password: password
    }).then((r) => {
      const Authorization = 'Bearer ' + r.data.token;
      setAuth({
        status: 'authenticated',
        user: r.data.user,
        config: {
          ...config,
          headers: {
            ...config.headers,
            Authorization: Authorization,
          }
        }
      });
    }, (e) => {
      console.log(e);
    })
  };

  const logout = () => {
    setAuth({
      status: 'unauthenticated',
      config: config,
    });
  };

  return [auth, login, logout];
}

export const Auth = (props) => {
  const [auth, login, logout] = useAuth();
  const [user,setUser] = useState('');
  const [password,setPassword] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    if(auth.status != 'authenticated') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [auth]);
  let Authentication = () => <></>;
  if(show == false) {
    Authentication = () => <>
      <Button variant="primary" onClick={(e) => logout()}>Sair</Button>
    </>;
  }


  return <>
    <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Autenticação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="user" className="mb-3">
            <Form.Label>Usuário</Form.Label>
            <Form.Control type="text" placeholder="Digite aqui seu usuário"
              onChange={(e) => setUser(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Digite aqui sua senha"
              onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" onClick={(e) => {
            login(user,password);
          }}>Entrar</Button>
        </Form>
      </Modal.Body>
    </Modal>
    <Authentication/>
  </>;
}
