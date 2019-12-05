import axios from 'axios';
import { AssignmentReturnTwoTone } from '@material-ui/icons';

const BASE_URI = 'https://ucal-backend.herokuapp.com';

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

	loginUser(form) {
		return this.perform('post', '/logIn', form);
	}

	authenticateUser() {
		return this.perform('get', '/auth');
	}

	logoutUser() {
		return this.perform('get', '/logOut');
	}

	editUser(form) {
		return this.perform('post', '/editUser', form);
	}

	addEvent(form) {
		return this.perform('post', '/addEvent', form);
	}

	deleteEvent(form) {
		return this.perform('post', '/deleteEvent', form);
	}

	editEvent(form) {
		return this.perform('post', '/editEvent', form);
	}

	getEvent(id) {
		const form = { eventID: id };
		return this.perform('post', '/getEventById', form);
	}

	getEventByUserAndDate(form) {
		return this.perform('post', '/getEventByUserAndDate', form);
	}

	getAvailableRoom(form) {
		return this.perform('post', '/getRoom', form);
	}

	getNotifs() {
		return this.perform('get', '/getNotifs');
	}

	async perform(method, resource, data = {}) {
		console.log(method, 'request to:', resource, 'with:');
		console.log(data);
		return client({
			withCredentials: true,
			method,
			url: resource,
			data: data
			//   headers: {
			//     Authorization: `Bearer ${this.accessToken}`
			//   }
		}).then((resp) => {
			console.log(resp);
			return resp.data ? resp.data : [];
		});
	}
}

export default Server;
