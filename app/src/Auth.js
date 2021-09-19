import {useState, useEffect} from 'react';
import {usePersistedState, useNotification} from './generics.js';
import axios from 'axios';
import {Modal, Form, Button, Nav, Navbar} from 'react-bootstrap';

const baseURL = 'http://localhost:5000/v1/';
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

  const login = (username,password) => {
    const http = axios.create({...config});

    http.post('login', {
      username: username,
      password: password
    }).then((r) => {
      const Authorization = 'Bearer ' + r.data.token;
      setAuth({
        status: 'authenticated',
        username: r.data.username,
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

  const register = async (username,password) => {
    const http = axios.create({...config});
    return await http.post('register', {
      username: username,
      password: password
    });
  }

  return [auth, login, logout, register];
}

export const Auth = (props) => {
  const [auth, login, logout, register] = useAuth();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [Notification, notify] = useNotification();

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
      <Navbar.Text style={{'color':'#fff', 'text-align':'center'}}>Olá, {auth.username + ' '} </Navbar.Text>
      <Button variant="primary" onClick={(e) => logout()}>Sair</Button>
    </>;
  }


  return <>
    <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Autenticação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Notification/>
        <Form>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Usuário</Form.Label>
            <Form.Control type="text" placeholder="Digite aqui seu usuário"
              onChange={(e) => setUsername(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Digite aqui sua senha"
              onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" onClick={(e) => {
            login(username,password);
          }}>Entrar</Button>
          {' '}
          <Button variant="primary" onClick={(e) => {
            register(username,password).then((r) => {
              notify('Cadastrado com sucesso.', 'primary');
              login(username,password);
            }, (e) => {
              notify('Erro ao cadastrar novo usuário.', 'danger');
            });
          }}>Registrar</Button>
        </Form>
      </Modal.Body>
    </Modal>
    <Authentication/>
  </>;
}
