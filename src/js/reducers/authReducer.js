import cs from '../constants/params';
import {getTutorialUid} from '../actions/index';

const initialState = {
	status:cs.status.AUTH_UNKNOWN,
	error:null,
	displayName:'',
	uid:'',
	photoURL:'',
	email:'',
	profile:{
		planId:'a'
	}
};

export default function (state = initialState, action) {

	switch (action.type) {

    	case cs.actions.AUTH_SIGNOUT+'_PENDING': 
			return {...initialState, status: cs.status.AUTH_AWAITING_RESPONSE };
			
    	case cs.actions.AUTH_SIGNOUT+'_REJECTED': 
			return {...initialState, status: cs.status.AUTH_UNKNOWN,error:action.payload };
			
    	case cs.actions.AUTH_SIGNOUT+'_FULFILLED': 
			return {...initialState};
    	
			
    	case cs.actions.AUTH_SIGNIN+'_PENDING': 
			return {...initialState, status: cs.status.AUTH_AWAITING_RESPONSE };
			
    	case cs.actions.AUTH_SIGNIN+'_REJECTED': 
			return {...initialState, status: cs.status.AUTH_UNKNOWN,error:action.payload };
			
    	case cs.actions.AUTH_SIGNIN+'_FULFILLED': {
    		// its possible that firebase will have fired its auth_user action first
    		// so only set to waiting if its not logged in
    		if (state.status === cs.status.AUTH_LOGGED_IN) {
    			return {...state, credential:action.payload.credential};
    		} 
    		else {
				return {
					...initialState, 
					credential:action.payload.credential,
					status: cs.status.AUTH_AWAITING_USER
				};
    		}
    	}
    	
    	case cs.actions.PROFILE_CHANGED: {
    		return {...state, profile:action.payload};
    	}
    		
		case cs.actions.AUTH_USER:
			return action.payload ? {...state, 
				status: cs.status.AUTH_LOGGED_IN, 
				displayName:action.payload.displayName,
				uid:action.payload.uid,
				photoURL:action.payload.photoURL,
				email:action.payload.email,
				planId:action.payload.uid === getTutorialUid() ? 'x' : 'a'
			} : {...initialState};
			
    }

	return state;
}


