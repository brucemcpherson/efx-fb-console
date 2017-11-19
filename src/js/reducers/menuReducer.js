import cs from '../constants/params';
const initialState = {
  selectedValue:null,
  drawerOpen:true
};

export default function (state = initialState, action) {

	switch (action.type) {
	    
	    case cs.actions.M_SELECTED_VALUE: {
    		return {...state,selectedValue:action.payload};
    	}
    	
	    case cs.actions.M_DRAWER_OPEN: {
    		return {...state,drawerOpen:action.payload};
    	}
    	
    }

	return state;
};


