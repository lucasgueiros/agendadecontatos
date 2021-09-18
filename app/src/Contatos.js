import {useAuth} from './Auth.js';
import {useState, useEffect, useReducer} from 'react';
import {useRestResource} from './generics';
import {Button, CloseButton, Card, CardColumns, Collapse, Modal, Form} from 'react-bootstrap';

function ordenarPorNome(a,b) {
  const c = a.nome.localeCompare(b.nome);
  if(c==0) {
    return a.sobrenome.localeCompare(b.sobrenome);
  } else {
    return c;
  }
}

export const Contatos = (props) => {
  const [auth] = useAuth();
  const [data, fetch, dispatch] = useRestResource('contatos', auth.config);
  const [editing, setEditing] = useState(null);

  if(!data) {
    return <>Carregando</>
  }
  return (
    <>
    <h1>Contatos</h1>
    <ContatoEditorModal editing={editing} dispatchResource={dispatch} setEditing={setEditing}/>
    <CardColumns>
      <Card>
        <Button variant="primary" onClick={(e) => {
          setEditing({});
        }}>Adicionar contato</Button>
      </Card>
      {data.sort(ordenarPorNome).map((contato) => <ContatoCard contato={contato} setEditing={setEditing} dispatchResource={dispatch}/>)}

    </CardColumns>
    </>
  );
};

// NOME, SOBRENOME, TELEFONE, DATA DE NASCIMENTO, ENDERECO e EMAIL
const ContatoCard = ({contato,setEditing,dispatchResource}) => {
  const [open, setOpen] = useState(false);
  return <>
    <Card body onClick={() => {if(!open) setOpen(true)}}>
      <Card.Title onClick={() => setOpen(!open)}>
        {
          open ?
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        }
        {' '}
        {contato.nome + ' ' + contato.sobrenome}

      </Card.Title>


      <Collapse  in={open}>
        <div>
          Telefone: {contato.telefone}<br/>
          Data de nascimento: {contato.dataDeNascimento}<br/>
          Endereço: {contato.endereco}<br/>
          E-mail: {contato.email}<br/>
          <br/>
          <Button varian="primary"
            onClick={(e) => {setEditing(contato)}}>Editar</Button>{' '}
          <Button varian="primary"
            onClick={(e) => {setOpen(false); dispatchResource({action: 'delete', data: contato})}}>Excluir</Button>
        </div>
      </Collapse>
    </Card>
  </>;
}

const ContatoEditorModal = ({editing, dispatchResource, setEditing}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.action) {
      case 'substitute':
        return action.data;
      case 'change':
        return {...state, ...action.data};
        break;
      default:
        return state;
    }
  },
  {
    nome: '',
    sobrenome: '',
    telefone: '',
    dataDeNascimento: '',
    endereco: '',
    email: '',
    _status: 'closed'
  });

  useEffect(() => {
    if(editing == null ){
      dispatch({
        action: 'substitute',
        data: {
          _status: 'closed'
        },
      })
    } else {
      dispatch({
        action: 'substitute',
        data: editing,
        _status: 'editing'
      })
    }
  }, [editing]);

  return <>
    <Modal show={state._status != 'closed'} onHide={() => setEditing(null )}>
      <Modal.Header>
        <Modal.Title>Novo Contato</Modal.Title>
        <CloseButton onClick={() => setEditing(null)}/>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nome" className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text"
              value={state.nome}
              onChange={(e) => dispatch({action: 'change', data: {nome: e.target.value}})}/>
          </Form.Group>
          <Form.Group controlId="sobrenome" className="mb-3">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control type="text"
              value={state.sobrenome}
              onChange={(e) => dispatch({action: 'change', data: {sobrenome: e.target.value}})}/>
          </Form.Group>
          <Form.Group controlId="telefone" className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control type="text"
              value={state.telefone}
              onChange={(e) => dispatch({action: 'change', data: {telefone: e.target.value}})}/>
          </Form.Group>
          <Form.Group controlId="dataDeNascimento" className="mb-3">
            <Form.Label>Data de Nascimento</Form.Label>
            <Form.Control type="date"
              value={state.dataDeNascimento}
              onChange={(e) => dispatch({action: 'change', data: {dataDeNascimento: e.target.value}})}/>
          </Form.Group>
          <Form.Group controlId="endereco" className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control type="text"
              value={state.endereco}
              onChange={(e) => dispatch({action: 'change', data: {endereco: e.target.value}})}/>
          </Form.Group>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="email"
              value={state.email}
              onChange={(e) => dispatch({action: 'change', data: {email: e.target.value}})}/>
          </Form.Group>
          <Button variant="primary" onClick={(e) => {
            dispatchResource({action: 'save', data: state});
            setEditing(null);
          }}>Salvar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  </>;
}
