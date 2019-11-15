import axios from 'axios';

const BASE_URI = 'http://localhost:5000';

const client = axios.create({
  baseURL: BASE_URI,
  json: true
});

class Server {
  
//   constructor(accessToken) {
//     this.accessToken = accessToken;
//   }

  createUser(form) {
    return this.perform('post', '/signUp', form);
  }

//   deleteKudo(repo) {
//     return this.perform('delete', `/kudos/${repo.id}`);
//   }

//   updateKudo(repo) {
//     return this.perform('put', `/kudos/${repo.id}`, repo);
//   }

//   getKudos() {
//     return this.perform('get', '/kudos');
//   }

//   getKudo(repo) {
//     return this.perform('get', `/kudo/${repo.id}`);
//   }

  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data
    //   headers: {
    //     Authorization: `Bearer ${this.accessToken}`
    //   }
    }).then(resp => {
        console.log(resp);
        return resp.data ? resp.data : [];
    })
  }
}

export default Server;