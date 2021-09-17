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
      setData(r.data[name].map((d) => {
        return {
          ...d,
          _delete: async () => {
            await axios.delete('/' + name + '/' + d.id, config);
            theFetch(name, config, setData);
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
  const fetch = () => theFetch(name, config, setData);
  useEffect(fetch, [config, name]);
  const create = (data) => {
    axios.post('/' + name, data,config).then(
      (r) => {
        console.log(r);
        fetch();
      }, (e) => {
        console.log(e);
      }
    )
  };

  return [data, fetch, create];
}
