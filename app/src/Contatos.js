import {useAuth} from './Auth.js';
import {useState, useEffect} from 'react';
import {useRestResource} from './generics';
import {Button, CloseButton, Card, CardColumns, Collapse, Modal, Form} from 'react-bootstrap';

export const Contatos = (props) => {
  const [auth] = useAuth();
  const [data, fetch, create] = useRestResource('contatos', auth.config);
  const [editing, setEditing] = useState(null);

  if(!data) {
    return <>Carregando</>
  }
  return (
    <>
    <h1>Contatos</h1>
    <ContatoEditorModal editing={editing} create={create} setEditing={setEditing}/>
    <CardColumns>
      {data.map((contato) => <ContatoCard contato={contato} setEditing={setEditing}/>)}
      <Card>
        <Button variant="primary" onClick={(e) => {
          setEditing({});
        }}>Adicionar contato</Button>
      </Card>
    </CardColumns>
    </>
  );
};

// NOME, SOBRENOME, TELEFONE, DATA DE NASCIMENTO, ENDERECO e EMAIL
const ContatoCard = ({contato,setEditing}) => {
  const [open, setOpen] = useState(false);
  return <>
    <Card body onClick={() => {if(!open) setOpen(true)}}>
      <Card.Title onClick={() => setOpen(!open)}>
        {contato.nome + ' ' + contato.sobrenome}
      </Card.Title>
      <Collapse  in={open}>
        <div>
          Telefone: {contato.telefone}<br/>
          Data de nascimento: {contato.dataDeNascimento}<br/>
          Endereço: {contato.endereco}<br/>
          E-mail: {contato.email}<br/>
          <br/>
          <Button varian="primary">Editar</Button>{' '}
          <Button varian="primary"
            onClick={(e) => {setOpen(false); contato._delete()}}>Excluir</Button>
        </div>
      </Collapse>
    </Card>
  </>;
}

const ContatoEditorModal = ({editing, create, setEditing}) => {
  const [show, setShow] = useState(false);

  // Atributos
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if(editing == null ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [editing])
  return <>
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Novo Contato</Modal.Title>
        <CloseButton onClick={() => setEditing(null)}/>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nome" className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setNome(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="sobrenome" className="mb-3">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setSobrenome(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="telefone" className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setTelefone(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="dataDeNascimento" className="mb-3">
            <Form.Label>Data de Nascimento</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setDataDeNascimento(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="endereco" className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setEndereco(e.target.value)}/>
          </Form.Group>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="text"
              onChange={(e) => setEmail(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" onClick={(e) => {
            create({
              nome: nome,
              sobrenome: sobrenome,
              telefone: telefone,
              dataDeNascimento: dataDeNascimento,
              endereco: endereco,
              email: email
            });
            setEditing(null);
          }}>Salvar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  </>;
}
