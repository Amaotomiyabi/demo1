import axios from '../../axios';
import qs from 'qs';

axios.defaults.baseURL = 'http://localhost:8847/api';

axios.defaults.timeout = 5000;

export default {
  get: function(path = '', data = {}) {
    let config = {
      params: data,
      headers: {}
    }
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token')
    }
    return new Promise(function(resolve, reject) {
      axios.get(path, config)
        .then(function(response) {
          resolve(response.data.data)
        })
        .catch(function(error) {
          reject(error)
        })
    })
  },
  post: function(path = '', data = {}) {
    let config = {}
    if (localStorage.getItem('token')) {
      config.token = localStorage.getItem('token')
    }
    return new Promise(function(resolve, reject) {
      axios.post(path, qs.stringify(data), {
          headers: config
        })
        .then(function(response) {
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  upload: function(path = '', data = {}) {
    let config = {}
    if (localStorage.getItem('token')) {
      config.token = localStorage.getItem('token')
    }
    return new Promise(function(resolve, reject) {
      axios.post(path, data, {
          headers: config
        })
        .then(function(response) {
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
}
