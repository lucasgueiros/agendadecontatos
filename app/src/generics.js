import {useState, useEffect} from 'react';
import axios from 'axios';

// from https://dev.to/selbekk/persisting-your-react-state-in-9-lines-of-code-9go
export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function theFetch (name, config, setData) {
  axios.get('/' + name, config).then(
    (r) => {
      setData(r.data[name]);
    }, (e) => {
      console.log(e);
    }
  )
}

export function useRestResource(name, config) {
  const [data, setData] = useState();
  const fetch = () => theFetch(name, config, setData);
  useEffect(fetch, [config, name]);
  const dispatch = async (action) => {
    switch (action.action) {
      case 'delete':
        axios.delete('/' + name + '/' + action.data.id, config).then((r) => {
          theFetch(name, config, setData);
          if(action.notify) {
            action.notify('Contato apagado com sucesso','primary');
          }
        }, (e) => {
          if(action.notify) {
            action.notify('Erro ao apagar o contato','danger');
          }
        });


        break;
      case 'save':
        if(action.data.id) {
          axios.patch('/'+name+'/'+action.data.id, action.data, config).then(
            (r) => {
              if(action.notify) {
                action.notify('Contato atualizado com sucesso','primary');
              }
              theFetch(name, config, setData);
            }, (e) => {
              if(action.notify) {
                action.notify('Erro ao atualizar o contato','danger');
              }
            }
          );
        } else {
          await axios.post('/'+name, action.data, config).then(
            (r) => {
              if(action.notify) {
                action.notify('Contato salvo com sucesso','primary');
              }
              theFetch(name, config, setData);
            }, (e) => {
              if(action.notify) {
                action.notify('Erro ao salvar o contato','danger');
              }
            }
          );
        }
      default:

    }

  };


  return [data, fetch, dispatch];
}
