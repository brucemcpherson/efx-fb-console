import cs from '../constants/params';
import {
  efResultDelegate
}
from './delegates';
const initialState = {
  counter: 0, // this is used to generate account numbers

  selectedAccounts:[],
  selectedBosses:[],
  
  // fetches from redis go here
  everything: {
    active: false,
    ready: false,
    error: "",
    commentary: "",
    things: {

    }
  },

  // and end up here
  pageResults: {
    accounts: {},
    bosses: {},
    bossesRemove: {}
  }


};

export default function(state = initialState, action) {

  // things I can deal with
  const acts = [
    cs.actions.ADD_ACCOUNT,
    cs.actions.FETCH_BOSSES,
    cs.actions.REMOVE_ACCOUNT,
    cs.actions.ADD_BOSS,
    cs.actions.REMOVE_BOSS,
    cs.actions.FETCH_ACCOUNTS,
    cs.actions.UPDATE_ACCOUNT
  ];

  state  = efResultDelegate(action, acts, state, initialState) || state;

  // this is for extra processing
  switch (action.type) {
      
    case cs.actions.ACCOUNT_LOCALUPDATE:
      {
        state = {...state};
        // patch the data active status
        const item = state.pageResults.accounts.data[action.payload.accountId];
        if (item)item.active = action.payload.ob.active ? true : false;
        return state;
      }
      
    case cs.actions.ACCOUNTS_SELECTED:
      {
        const selectedItems = action.payload;
        return {...state, selectedAccounts:selectedItems};
      }
      
    case cs.actions.BOSSES_SELECTED:
      {
        return {...state, selectedBosses:action.payload};
      }
    

  }

  return state;
};
