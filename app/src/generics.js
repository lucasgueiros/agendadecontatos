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

function fetch (name, config, setData) {
  axios.get('/' + name, config).then(
    (r) => {
      setData(r.data[name].map((d) => {
        return {
          ...d,
          _delete: async () => {
            await axios.delete('/' + name + '/' + d.id, config);
            fetch();
          }
        }
      }));
    }, (e) => {
      console.log(e);
    }
  )
}

export function useRestResource(name, config) {
  const [data, setData] = useState();

  useEffect(() => fetch(name, config, setData), [config, name]);
  return [data, fetch];
}
