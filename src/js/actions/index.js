import cs from '../constants/params';
import ca from '../constants/auth';
import Process from '../containers/process';
import EC from 'effex-api-client';
import firebase from 'firebase';
import moment from 'moment';

//-- all about authentication and managing the users account


// get firebase going
// its needed for authentication
const firebaseApp = firebase.initializeApp(ca.config);
const firebaseAuth = firebaseApp.auth();

export function getTutorialUid() {
  return ca.tutorialId;
}

export function getCurrentUid() {
  const state = Process.store.getState();
  return state.auth ? state.auth.uid : "";
}


  

/**
 * this is a redux action creater that dispatches promises
 * I use this directly instead of the promise-redux middleware
 * because it allows me to sfet an initial value for 
 * the pending state
 * if a function is passed that isn't a promise
 * it will make it into one
 * actionType_PENDING is returned from this
 * and later when the function is completed, actionType_FULFILLED or _REJECTED are dispatched
 * @param {string} actionType the base action type
 * @param {*} pendingPayload the payload to dispatch with the _PENDING action
 * @param {func} function the function to execute that should return a promise
 * @return {object} the action to be dispatched
 */
export function acPromise(actionType, pendingPayload, func) {

  // later on I'll make this middleware so i dont need to pass the dispatcher
  // for now I have it stored somewhere
  const dispatch = Process.store.dispatch;

  // first check the function is actually a promise
  // and convert it if it isnt
  const theAction = typeof func.then === 'function' ? func : function() {
    return new Promise(function(resolve, reject) {
      try {
        resolve(func());
      }
      catch (err) {
        console.log("acpromise failure", actionType, err);
        reject(err);
      }
    });
  };

  // now we execute the thing, but dispatch a fullfilled/rejected when done
  theAction()
    .then(function(result) {
      // the result of the original function
      dispatch({
        type: actionType + "_FULFILLED",
        payload: result
      });
    })
    .catch(function(err) {
      dispatch({
        type: actionType + "_REJECTED",
        payload: err
      });
    });

  // what we return is the pending action
  return {
    type: actionType + "_PENDING",
    payload: pendingPayload
  };


}




/**
 * set up a listener for changes in user
 * and dispatch a user action if it happens
 */
export function authInit() {


  // this is about signing in and out
  firebaseAuth.onAuthStateChanged(
    user => {
      const state = Process.store.getState();

      if (user && state.auth.uid && state.auth.uid === user.uid) {
        // do nothing as this can get fired on a refresh token, 
        // but the user hasnt actually changed
    
      }
      else {

        // we've received a new user
        Process.store.dispatch(acAuthUser(user));
        
        // and we'll get or create the accounts in parallel
        const ad = acFetchAccounts(user);
        if (ad) {
          Process.store.dispatch(acFetchAccounts(user));
        }

      }
    }
  );
}


/**
 * sign out of firebase
 */
export function acSignout() {


  return acPromise(
    cs.actions.AUTH_SIGNOUT,
    getCurrentUid(),
    () => {

      firebaseAuth.signOut();
      Process.store.dispatch(acStatsClear());
      Process.store.dispatch(acAccountsClear());
    });


}

export function acStatsClear() {
  return {
    type: cs.actions.STATS_RESULT_CLEAR,
    payload: null
  };
}

export function acAccountsClear() {
  return {
    type: cs.actions.ACCOUNTS_RESULT_CLEAR,
    payload: null
  };
}




// returns a function to get Promise to get the user info for a given firebase user object
// atually it doesnt do any processing for now just wraps the result in a promise
const fireAuth_ = (user) => {
  return  () => Promise.resolve (user);
};

/**
 * sign in to firebase
 */
export function acSignin() {

  const provider = new firebase.auth.GoogleAuthProvider();

  return acPromise(
    cs.actions.AUTH_SIGNIN, 'google',
    ()=>firebaseAuth.signInWithPopup(provider) 
  );

     
}



/**
 * change in user fired
 */
export function acAuthUser(user) {
  return acPromise(cs.actions.AUTH_SIGNIN, 'google', fireAuth_(user));
}


export function acCounterAccounts(counter) {
  if (!counter) {
    console.log("warning-accounts counter is", counter);
  }
  return {
    type: cs.actions.COUNTER_ACCOUNTS,
    payload: counter
  };

}

// update the accout locally to avoid api wait for reaction
export function acLocalUpdateAccount(pack) {

  return {
    type: cs.actions.ACCOUNT_LOCALUPDATE,
    payload: pack
  };

}

// update the accout locally to avoid api wait for reaction

export function acLocalRecord(pack) {

  return {
    type: cs.actions.ACCOUNT_LOCALRECORD,
    payload: pack
  };

}

     
/**
 * update the user accounts on firebase
 */
export function acUpdateAccount(pack) {

  
  const updateAccount = (pack) => {
    return EC.updateAccount (pack.accountId , pack.uid , pack.active) 
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } })};
      
  const uid = getCurrentUid();
  
  return uid ? 
    efPattern(cs.actions.UPDATE_ACCOUNT, {
      uid:uid,
      pageResults:"accounts",
      active:pack.ob.active ? 1 : 0,
      accountId:pack.accountId
    }, updateAccount) : 
    null;
  

}




/**
 * get the user accounts from auth
 */
function acFetchAccounts(user) {

  const fetchAccounts = (pack) => {
    return EC.createProfile (pack.uid) 
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } })};
      

  return user && user.uid ? 
    efPattern(cs.actions.FETCH_ACCOUNTS, {
      uid:user.uid,
      pageResults:"accounts"
    }, fetchAccounts) : 
    null;
  
  
}

/**
 * need
 * pageResults 
 * pack.accountId 
 */
export function acFetchBosses(pack) {

  const fetchBosses = (pack) => {

    const state = Process.store.getState();
    const uid = state.auth.uid;

    // if we're changing accounts then we have to get a load of stuff associated with the account
    return (
      EC.getBosses(pack.accountId, uid)
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } }));

  };

  return pack.accountId ? efPattern(cs.actions.FETCH_BOSSES, pack, fetchBosses) : null;

}




function efPattern(action, pack, func, place) {

  // only if we;re not already doing it
  const state = Process.store.getState();
  place = place || "accounts";
  if (state[place].pageResults[pack.pageResults].active) return null;


  // now set up a basic set of keys for use by the tutorial
  return acPromise(action, pack, () => {
    return func(pack)
      .catch(pe => {
        console.log('failed init', pe);
        return { ...pack, pageResults: pack.pageResults, result: pe, success: false };
      });
  });

}

/**
 * remove a new  key
 */
export function acRemoveBoss(pack) {

  const removeBoss = (pack) => {
    return EC.removeBosses(pack.bossKeys)
      .then(pr => EC.getBosses(pack.accountId))
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } });

  };

  return efPattern(cs.actions.REMOVE_BOSS, { ...pack,  pageResults:"bosses" }, removeBoss);

}

export function acSelectedBosses (selectedItems) {

  return {
    type: cs.actions.BOSSES_SELECTED,
    payload: selectedItems
  };

}

export function acSelectedKeys (selectedItems) {

  return {
    type: cs.actions.KEYS_SELECTED,
    payload: selectedItems
  };

}

export function acSelectedAccounts (selectedItems) {

  return {
    type: cs.actions.ACCOUNTS_SELECTED,
    payload: selectedItems
  };

}



      
/**
 * generate a new boss key
 */
export function acAddBoss(pack) {


  const addBoss = (pack) => {

    const params = pack.params ? { ...pack.params } : {};
    params.authid = getCurrentUid();

    return EC.generateBoss(pack.accountId, pack.planId, params)
      .then(pr => { if (!pr.data && pr.data.ok) console.log('failed to create boss ', pr.data); return EC.getBosses(pack.accountId); })
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } });

  };

  return efPattern(cs.actions.ADD_BOSS, { ...pack, pageResults:"bosses" }, addBoss);

}

/**
 * remove an account
 */
export function acAddAccount() {

  const uid = getCurrentUid();
  if (!uid) {
    console.log("trying to add an account with no uid");
    return null;
  }
  
  const pack = {
    uid:uid,
    pageResults:"accounts"
  };
  
  const addAccount = (pack) => {
    return EC.addAccount (uid)
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } });

  };

  return efPattern(cs.actions.ADD_ACCOUNT, pack, addAccount);

}

/**
 * remove an account
 */
export function acRemoveAccount(accountId) {


  const uid = getCurrentUid();
  if (!uid) {
    console.log("trying to remove an account with no uid");
    return null;
  }
  
  const pack = {
    uid:uid,
    pageResults:"accounts",
    accountId:accountId
  };
  
  const removeAccount = (pack) => {
    return EC.removeAccount (pack.accountId , pack.uid)
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } });
  };


  return pack.accountId ? efPattern(cs.actions.REMOVE_ACCOUNT, pack, removeAccount) : null;

}



export function dispatchStats(accountId, start, finish) {

  
  if (accountId) {
    
    // get the default dates from the store
    const state = Process.store.getState();
    const ranges = state.stats.ranges;
  
    start = start || (ranges.start && new Date(ranges.start));
    finish = finish || (ranges.finish && new Date(ranges.finish));
    
    const ax = acFetchStats({
      pageResults: "stats",
      accountId,
      start,
      finish
    });
    if (ax) {
      Process.store.dispatch(ax);
    }
  }
}
/**
 * get the start range
 */
export function acRangeStart(accountId, start, finish) {

  dispatchStats(accountId, start, finish);
  return {
    type: cs.actions.RANGE_START,
    payload: start
  };
}


export function acRangeFinish(accountId, start, finish) {

  dispatchStats(accountId, start, finish);
  return {
    type: cs.actions.RANGE_FINISH,
    payload: finish
  };
}

export function acRangePeriod(term = null) {
  return {
    type: cs.actions.RANGE_PERIOD,
    payload: term
  };
}
export function acGenerateSlots(term = null) {

  return {
    type: cs.actions.GENERATE_SLOTS,
    payload: term
  };

}

export function acMenuSelectedValue(term = null) {

  return {
    type: cs.actions.M_SELECTED_VALUE,
    payload: term
  };

}

export function acDrawerOpen(term = null) {

  return {
    type: cs.actions.M_DRAWER_OPEN,
    payload: term
  };

}

/**
 * need
 * pageResults , start , finish
 * pack.accountId 
 */
export function acFetchStats(pack) {

  const fetchStats = (pack) => {

    const params =  {};
    if (pack.start)params.start = pack.start.getTime();
    if (pack.finish)params.finish = pack.finish.getTime();
      
    // if we're changing accounts then we have to get a load of stuff associated with the account
    return (

      EC.getStats(pack.accountId, params)
      .then(pr => {

        Process.store.dispatch(acGenerateSlots());
        return pr;
      })
      .then(pr => { return { ...pack, result: pr, success: pr.data && pr.data.ok } }));

  };

  return pack.accountId ? efPattern(cs.actions.FETCH_STATS, pack, fetchStats, "stats") : null;

}
