import { AsyncStorage } from 'react-native';
import config from '../config';
import base64 from 'base-64';

export default {

  getUser() {
    return AsyncStorage.getItem('@Store:user')
      .then(user => {
        user = JSON.parse(user);
        return this.basicGet('/restful/user', user.credentials)
          .then(res => {
            return res.status === 200 ? user : null;
          });
      })
      .catch(console.warn);
  },

  getFichas(credentials) {
    return this.basicGet('/restful/services/simple.FichaMenu/actions/listar/invoke', credentials)
      .then(res => {
        if(res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.json());
  },

  basicGet(uri, credentials) {
    const url = config.apiUrl + uri;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;profile="urn:org.apache.isis/v1";suppress=true',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + credentials,
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }
    });
  },

  getTecnicos(credentials) {
    return this.basicGet('/restful/services/simple.TecnicoMenu/actions/listarTecnico/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.json());
  },

  getInsumos(credentials) {
    return this.basicGet('/restful/services/simple.Insumo/actions/listar/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.json());
  },

  getUnidades(credentials) {
    return this.basicGet('/restful/services/simple.UnidadMenu/actions/listar/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.json());
  },
  
  login(username, password) {
    const credentials = base64.encode(username + ':' + password);
    return this.basicGet('/restful/user', credentials)
      .then(res => {
        if(res.status === 200) {
          const data = res.json();
          const user = {
            nombre: username,
            usuario: data.userName,
            roles: data.roles,
            credentials
          };
          return AsyncStorage.setItem('@Store:user', JSON.stringify(user))
            .then(() => user)
            .catch(console.warn);
        } else {
          throw new Error('Credenciales incorrectas');
        }
      });

  }
  
}
