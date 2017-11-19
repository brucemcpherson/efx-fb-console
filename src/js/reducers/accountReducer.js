import cs from '../constants/params';
import {
  efResultDelegate
}
from './delegates';
const initialState = {
  counter: 0, // this is used to generate account numbers


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
    accountsRemove: {},
    accountsAdd: {},
    accountsUpdate: {},
    bosses: {},
    bossesAdd: {},
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
    cs.actions.REMOVE_BOSS
  ];

  const newState = efResultDelegate(action, acts, state, initialState);
  if (newState) {
    return newState;
  }

  switch (action.type) {

    case cs.actions.COUNTER_ACCOUNTS:
      {
        return {...state,
          counter: action.payload
        };
      }

      // this is serviced by a firebase call back so is dealy with syncronously
    case cs.actions.FETCH_ACCOUNTS:
      {

        state = {...state
        };
        let selectedItems = state.pageResults.accounts.selectedItems || [];
        selectedItems = selectedItems.filter(d => Object.keys(action.payload).indexOf(d) !== -1);
        if (!selectedItems.length && action.payload) {
          selectedItems = [Object.keys(action.payload)[Object.keys(action.payload).length - 1]];
        }

        state.pageResults.accounts = {
          data: action.payload,
          selectedItems
        };

        return state;
      }

      // record which accounts are currently selected
    case cs.actions.ACCOUNT_SELECTED_ROWS:
      {
        state = {...state
        };
        state.pageResults[action.payload.pageResults].selectedItems = action.payload.selectedItems;

        return state;
      }

    case cs.actions.ACCOUNTS_RESULT_CLEAR:
      {
        return  {...state,pageResults:{...initialState.pageResults}};
      }


  }

  return state;
};
