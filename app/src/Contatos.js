import {useAuth} from './Auth.js';
import {useState, useEffect} from 'react';
import {useRestResource} from './generics';
import {Button, Card, CardColumns, Collapse} from 'react-bootstrap';

export const Contatos = (props) => {
  const [auth] = useAuth();
  const [data, fetch, remove] = useRestResource('contatos', auth.config);

  if(!data) {
    return <>Carregando</>
  }
  return (
    <>
    <h1>Contatos</h1>
    <CardColumns>
      {
        data.map((contato) => <ContatoCard
          contato={contato}/>)
      }

    </CardColumns>
    </>
  );
};

// NOME, SOBRENOME, TELEFONE, DATA DE NASCIMENTO, ENDERECO e EMAIL
const ContatoCard = ({contato, remove}) => {
  const [open, setOpen] = useState(false);
  return <>
    <Card onClick={() => setOpen(!open)} body>
      <Card.Title>{contato.nome + ' ' + contato.sobrenome}</Card.Title>
      <Collapse  in={open}>
        <div>
          Telefone: {contato.telefone}<br/>
          Data de nascimento: {contato.dataDeNascimento}<br/>
          Endereço: {contato.endereco}<br/>
          E-mail: {contato.email}<br/>
          <br/>
          <Button varian="primary">Editar</Button>{' '}
          <Button varian="primary"
            onClick={(e) => {contato._delete()}}>Excluir</Button>
        </div>
      </Collapse>
    </Card>
  </>;
}
