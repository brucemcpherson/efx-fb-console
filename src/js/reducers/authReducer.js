import cs from '../constants/params';
import { getTutorialUid } from '../actions/index';

const initialState = {
	status: cs.status.AUTH_UNKNOWN,
	error: null,
	displayName: '',
	uid: '',
	photoURL: '',
	email: '',
	profile: {
		planId: 'a'
	},
	accounts:{}
};

export default function(state = initialState, action) {

	switch (action.type) {

		case cs.actions.AUTH_SIGNOUT + '_PENDING':
			return { ...initialState, status: cs.status.AUTH_AWAITING_RESPONSE };

		case cs.actions.AUTH_SIGNOUT + '_REJECTED':
			return { ...initialState, status: cs.status.AUTH_UNKNOWN, error: action.payload };

		case cs.actions.AUTH_SIGNOUT + '_FULFILLED':
			return { ...initialState };


		case cs.actions.AUTH_SIGNIN + '_PENDING':
			return { ...initialState, status: cs.status.AUTH_AWAITING_RESPONSE };

		case cs.actions.AUTH_SIGNIN + '_REJECTED':
			return { ...initialState, status: cs.status.AUTH_UNKNOWN, error: action.payload };

		case cs.actions.AUTH_SIGNIN + '_FULFILLED': {
			return makeAuthState_(action.payload);
		}



	// think this is redundant....
		case cs.actions.AUTH_USER:
			{
				// think this is redundant....
				console.log ("AUTH_USER .. this should never hppen", action.payload);
				return  makeAuthState_(action.payload);
			}
	}

	function makeAuthState_(payload) {

		const creds = payload;

		return creds ? {
			...initialState,
			status: cs.status.AUTH_LOGGED_IN,
			displayName: creds.displayName,
			uid: creds.uid,
			photoURL: creds.photoURL,
			email: creds.email,
			planId: creds.uid === getTutorialUid() ? 'x' : 'a'
		} : { ...initialState };

	}

	return state;
}
