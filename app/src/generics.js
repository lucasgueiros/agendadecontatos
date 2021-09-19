import {useState, useEffect} from 'react';
import axios from 'axios';
import {Collapse, Alert} from 'react-bootstrap';

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

export function useRestResource(name) {
  const [data, setData] = useState();
  const fetch = (config) => theFetch(name, config, setData);
  const dispatch = async (action, config) => {
    switch (action.action) {
      case 'delete':
        axios.delete('/' + name + '/' + action.data.id, config).then((r) => {
          fetch(config);
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
              fetch(config);
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
              fetch(config);
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

export function useNotification () {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationVariant, setNotificationVariant] = useState('primary');

  const notify = (message,variant) => {
    setNotification(message);
    setNotificationVariant(variant);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  const Notification = (props) => <Collapse in={showNotification}><div><Alert variant={notificationVariant}>{notification}</Alert></div></Collapse>;

  return [Notification, notify];
}
