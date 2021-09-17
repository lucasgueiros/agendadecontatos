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
        await axios.delete('/' + name + '/' + action.data.id, config);
        theFetch(name, config, setData);
        break;
      case 'save':
        if(action.data.id) {
          await axios.patch('/'+name+'/'+action.data.id, action.data, config);
        } else {
          await axios.post('/'+name, action.data, config);
        }
        theFetch(name, config, setData);
      default:

    }

  };


  return [data, fetch, dispatch];
}
