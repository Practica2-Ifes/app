import { AsyncStorage } from 'react-native';
import config from '../config';
import base64 from 'base-64';
import axios from 'axios';

export default {
  
  basicGet(uri, credentials, options) {
    const url = config.apiUrl + uri;
    return axios({
      url,
      method: 'get',
      headers: {
        'Accept': 'application/json;profile="urn:org.apache.isis/v1";suppress=true',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + credentials,
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }
    });
  },

  basicPut(uri, credentials, data) {
    const url = config.apiUrl + uri;
    return axios({
      url,
      method: 'put',
      data,
      headers: {
        'Accept': 'application/json;profile="urn:org.apache.isis/v1"',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + credentials,
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      }
    });
  },
  
  getUser() {
    return AsyncStorage.getItem('@Store:user')
      .then(user => {
        user = JSON.parse(user);
        return this.basicGet('/user', user.credentials)
          .then(res => {
            return res.status === 200 ? user : null;
          });
      })
      .catch(console.warn);
  },

  getFichas(credentials) {
    return this.basicGet('/services/simple.FichaMenu/actions/listar/invoke', credentials)
      .then(res => {
        if(res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.data);
  },
    
  guardarFicha(credentials, fechaDeCreacion, tipoDeFicha, observaciones) {
    const queryString = `?fechaDeCreacion=${fechaDeCreacion}&&tipoDeFicha=${tipoDeFicha}&&observaciones=${observaciones}`;
    return this.basicGet('/services/simple.FichaMenu/actions/crear/invoke' + queryString, credentials)
      .then(res => {
        if(res.status !== 200) {
          throw new Error('Not Created');
        } else {
          return res;
        }
      })
      .then(res => res.data);
  },

  objectToMeta(item) {
    return {
      rel: 'urn:org.restfulobjects:rels/value',
      href: item.$$href,
      method: 'GET',
      type: 'application/json;profile=\"urn:org.restfulobjects:repr-types/object\"',
      title: item.$$title
    };
  },

  agregarTecnico(credentials, id, tecnico, horasTrabajo) {
    const body = {
      tecnico: {
        value: this.objectToMeta(tecnico)
      },
      horasTrabajo: {
        value: parseInt(horasTrabajo)
      }
    };
    const uri = `/objects/mantenimiento.Ficha/${id}/actions/agregarTecnico/invoke`;
    return this.basicPut(uri, credentials, body).catch(e => console.log(e.response));
  },

  agregarInsumo(credentials, id, insumo, cantidadUsada) {
    const body = {
      insumoUsado: {
        value: this.objectToMeta(insumo)
      },
      cantidadUsada: {
        value: parseInt(cantidadUsada)
      }
    };
    const uri = `/objects/mantenimiento.Ficha/${id}/actions/agregarInsumo/invoke`;
    return this.basicPut(uri, credentials, body).catch(e => console.log(e.response));
  },

  agregarUnidad(credentials, id, unidad, horas, estadoUnidad) {
    const body = {
      unidad: {
        value: this.objectToMeta(unidad)
      },
      horas: {
        value: parseInt(horas)
      },
      estadoUnidad: {
        value: estadoUnidad
      }
    };
    const uri = `/objects/mantenimiento.Ficha/${id}/actions/agregarUnidad/invoke`;
    return this.basicPut(uri, credentials, body).catch(e => console.log(e.response));
  },


  getTecnicos(credentials) {
    return this.basicGet('/services/simple.TecnicoMenu/actions/listarTecnico/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.data);
  },

  getInsumos(credentials) {
    return this.basicGet('/services/simple.Insumo/actions/listar/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.data);
  },

  getUnidades(credentials) {
    return this.basicGet('/services/simple.UnidadMenu/actions/listar/invoke', credentials)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Not found');
        } else {
          return res;
        }
      })
      .then(res => res.data);
  },
  
  login(username, password) {
    const credentials = base64.encode(username + ':' + password);
    return this.basicGet('/user', credentials)
      .then(res => {
        if(res.status === 200) {
          const data = res.data;
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
