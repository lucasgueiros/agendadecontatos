import {useAuth} from './Auth.js';
import {useState, useEffect} from 'react';
import axios from 'axios';

export const Contatos = (props) => {
  const [auth] = useAuth();
  const [data, setData] = useState();

  useEffect(() => {
    axios.get('/contatos', auth.config).then(
      (r) => {
        setData(r.data);
      }, (e) => {
        console.log(e);
      }
    )
  }, [auth])

  return (
    <h1>Contatos</h1>


  );
};
