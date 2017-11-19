import cs from '../constants/params';
import ca from '../constants/auth';
import Process from '../containers/process';
import EC from 'effex-api-client';
import firebase from 'firebase';
import moment from 'moment';

//-- all about authentication and managing the users account


// get firebase going
const firebaseApp = firebase.initializeApp(ca.config);
const firebaseAuth = firebaseApp.auth();
const firebaseRef = firebase.database();

/**
 * these are some helpers for firebase
 */
const FB = (function(ns) {

  const counterUrl = 'counters/accounts';

  /**
   * we'll need the store later
   */
  ns.init = function() {

    // nothing to do

  };

  /**
   * usinga firebase counter to maintain the next account numner
   */
  ns.counterUpdate = function() {
    firebaseRef.ref(counterUrl)
      .transaction(function(cv) {
        return cv ? cv + 1 : 1;
      });
  };

  /**
   * stop listening to accounts
   */
  ns.offAccounts = function(uid) {
    // this would be the url of the previous guy that we need to turn off
    if (uid) {
      firebaseRef.ref('users/' + uid + '/accounts').off('value');
      firebaseRef.ref('users/' + uid + '/profile').off('value');
    }
  };

  /**
   * update account
   * @param {string} uid the user
   * @param {string} accountId the current state
   * @param {object} ob the account data
   * @return {string} accountId the account id 
   */
  ns.updateAccount = function(uid, accountId, ob) {
    const url = 'users/' + uid + '/accounts';
    firebaseRef.ref(`${url}/${accountId}`).set(ob);
    return accountId;
  };
  
  /**
   * create account
   * @param {string} uid the user
   * @param {object} state the current state
   * @param {object} ob the account data
   * @return {string} accountId the account id created
   */
  ns.createAccount = function(uid, state, ob) {
    const url = 'users/' + uid + '/accounts';
    const accountId = (state.accounts.counter + cs.values.COUNTER_START).toString(32);
    firebaseRef.ref(`${url}/${accountId}`).set(ob);
    ns.counterUpdate();
    return accountId;
  };

  /**
   * create/update profile
   * @param {string} uid the user
   * @param {object} ob the account data
   * @return {string} accountId the account id created
   */
  ns.updateProfile = function(uid, ob) {
    const url = 'users/' + uid + '/profile';
    firebaseRef.ref(`${url}`).set(ob);
    return uid;
  };
  /**
   * remove account
   * @param {string} uid the user
   * @param {object} state the current state
   * @param {object} ob the account data
   */
  ns.removeAccount = function(uid, accountId) {

    // this looks like a kind of anti pattern for an unkown reason
    // the redux-promise doesnt like the promises coming from firebase
    return new Promise(function(resolve, reject) {
      const url = 'users/' + uid + '/accounts/' + accountId;
      if (!accountId) {
        resolve('nothing to delete');
      }
      else {

        firebaseRef.ref(url).remove()
          .then(function() {
            resolve('remove complete for ' + url);
          })
          .catch(function(err) {
            reject(err);
          });
      }
    });
  };

  return ns;
})({});



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
export function acPromise (actionType,  pendingPayload, func) {

  // later on I'll make this middleware so i dont need to pass the dispatcher
  // for now I have it stored somewhere
  const dispatch= Process.store.dispatch; 
  
  // first check the function is actually a promise
  // and convert it if it isnt
  const theAction = typeof func.then === 'function' ? func : function () {
    return new Promise (function (resolve, reject) {
      try {
        resolve(func());
      }
      catch(err) {
        console.log("acpromise failure", actionType , err);
        reject (err);
      }
    });
  };
  
  // now we execute the thing, but dispatch a fullfilled/rejected when done
  theAction()
  .then (function (result) {
    // the result of the original function
    dispatch({
      type:actionType+"_FULFILLED",
      payload:result
    });
  })
  .catch (function (err) {
    dispatch({
      type:actionType+"_REJECTED",
      payload:err
    });
  });
  
  // what we return is the pending action
  return {
    type:actionType+"_PENDING",
    payload:pendingPayload
  };
  
  
}




/**
 * set up a listener for changes in user
 * and dispatch a user action if it happens
 */
export function authInit() {

  // set up firebase helpers
  FB.init();

  // this is about signing in and out
  firebaseAuth.onAuthStateChanged(
    user => {
      const state = Process.store.getState();
      if (user && state.auth.uid && state.auth.uid === user.uid) {
        // do nothing as this can get fired on a refresh token, 
        // but the user hasnt actually changed
      }
      else {

        // this would be the url of the previous guy that we need to turn off
        FB.offAccounts(state.auth.uid);

        // we've received a new user
        Process.store.dispatch(acAuthUser(user));

        // so listen for his accounts
        if (user) {

        /**
         * this is used to set up listening for changes to next account number
         * 
         */
          const counterUrl = 'counters/accounts';
          firebaseRef.ref(counterUrl)
          .on('value', function(snapshot) {
            Process.store.dispatch(acCounterAccounts(snapshot.val() || 0));
          });
      
          // and for changes to profile
          const profileUrl = 'users/' + user.uid + '/profile';
          
          firebaseRef.ref(profileUrl)
          .on('value', function(snapshot) {
            var data = snapshot.val();
            if (data) {
              Process.store.dispatch (acProfileChanged(data));
            }
            else {

              FB.updateProfile(user.uid,{
                planId:user.uid === getTutorialUid() ? "x" : "a"
              });
            }
          });
          
          // also need to set up a listener for changes to the users accounts
          const url = 'users/' + user.uid + '/accounts';
          firebaseRef.ref(url)
          .on('value', function(snapshot) {
            var data = snapshot.val();
            // if theres no data, then we want to create a default account
            if (data) {
              const accountId = data ? Object.keys(data)[Object.keys(data).length-1] :"";
              const ranges = state.stats.ranges;
              Process.store.dispatch(acFetchAccounts(data));
              const ad = acFetchBosses({
                pageResults:"bosses",
                accountId
              });
              if (ad) {
                Process.store.dispatch(ad);
              }
              
              if (accountId && ranges) {
                const ax = acFetchStats({
                  pageResults:"stats",
                  accountId,
                  start:ranges.start,
                  finish:ranges.finish
                });
                if (ax) {
                  Process.store.dispatch(ax);
                }
              }
            }
            else {
              Process.store.dispatch(acAddAccount({
                pageResults:"accountsAdd",
                uid:user.uid
              }));
            }

          });
        }
      }
    }
  );
}


/**
 * sign out of firebase
 */
export function acSignout() {

  
  return acPromise (
    cs.actions.AUTH_SIGNOUT,
    getCurrentUid(), 
    () => {
      firebase.signOut;
      Process.store.dispatch (acStatsClear());
      Process.store.dispatch (acAccountsClear());
    });
  

}

export function acStatsClear () {
  return {
    type:cs.actions.STATS_RESULT_CLEAR,
    payload:null
  };
}

export function acAccountsClear() {
  return {
    type:cs.actions.ACCOUNTS_RESULT_CLEAR,
    payload:null
  }
}


export function acProfileChanged(data) {
  return {
    type:cs.actions.PROFILE_CHANGED,
    payload:data
  }; 
}

/**
 * sign in to firebase
 */
export function acSignin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  return acPromise (
    cs.actions.AUTH_SIGNIN,'google',
    () => {
      return firebaseAuth.signInWithPopup(provider);
    }
  );
}

/**
 * change in user fired
 */
export function acAuthUser(user) {

  return {
    type: cs.actions.AUTH_USER,
    payload: user
  };

}

export function acCounterAccounts(counter) {
  if (!counter) {
    console.log ("warning-accounts counter is",counter);
  }
  return {
    type: cs.actions.COUNTER_ACCOUNTS,
    payload: counter
  };

}

/**
 * get the user accounts from firebase
 */
export function acFetchAccounts(snapshot) {
  return {
    type: cs.actions.FETCH_ACCOUNTS,
    payload: snapshot
  };
}

/**
 * update the user accounts on firebase
 */
export function acUpdateAccount(pack) {
  
  const updateAccount = (pack) => {
    
    return new Promise ((resolve,reject)=>{
      resolve (FB.updateAccount(pack.uid,pack.accountId,pack.ob));
    })
    .then (pr=> EC.registerAccount(pack.accountId,pack.uid, pack.ob.active))
    .then (pr => { return {...pack,result:pr,success:pr.data && pr.data.ok}});

  };
  
  return efPattern (cs.actions.UPDATE_ACCOUNT, pack, updateAccount);

}



/**
 * need
 * pageResults 
 * pack.accountId 
 */
export function acFetchBosses (pack) {

  const fetchBosses = (pack) => {
    
    const state = Process.store.getState();
    const uid = state.auth.uid;
    
      // if we're changing accounts then we have to get a load of stuff associated with the account
    return (
      EC.getBosses(pack.accountId, uid)
      .then(pr=> { return {...pack,result:pr,success:pr.data && pr.data.ok}}));
        
    };

    return pack.accountId ? efPattern (cs.actions.FETCH_BOSSES, pack, fetchBosses) : null;

}

export function acAccountsSelectedRows(pack) {

  return {
    type:cs.actions.ACCOUNT_SELECTED_ROWS,
    payload:pack
  };
  
}
export function acStatsSelectedRows(pack) {

  return {
    type:cs.actions.STATS_SELECTED_ROWS,
    payload:pack
  };
  
}


function efPattern (action, pack, func, place) {
  
  // only if we;re not already doing it
  const state = Process.store.getState();
  place = place || "accounts";
  if (state[place].pageResults[pack.pageResults].active) return null;
  
    // now set up a basic set of keys for use by the tutorial
  return acPromise(action, pack, () => {
    return func (pack)
      .catch (pe=> {
        console.log ('failed init', pe);
        return {...pack,pageResults:pack.pageResults,result:pe,success:false};
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
      .then(pr => { return {...pack,result:pr,success:pr.data && pr.data.ok}});

  };
  
  return efPattern (cs.actions.REMOVE_BOSS, {...pack,cloneResults:"bosses"}, removeBoss);
  
}
/**
 * generate a new boss key
 */
export function acAddBoss(pack) {


  const addBoss = (pack) => {
    
    const params = pack.params ? { ...pack.params} : {};
    params.apikey = getCurrentUid();
   
    return EC.generateBoss(pack.accountId,pack.planId, params)
    .then(pr => { if (!pr.data && pr.data.ok) console.log ('failed to create boss ',pr.data); return EC.getBosses(pack.accountId);})
    .then(pr => { return {...pack,result:pr,success:pr.data && pr.data.ok}});

  };
  
  return efPattern (cs.actions.ADD_BOSS, {...pack,cloneResults:"bosses"}, addBoss);
  
}
 
/**
 * remove an account
 */
export function acAddAccount(pack) {

  const state = Process.store.getState();
  if (!pack.uid) {
    console.log ("trying to add an account with no uid");
    return null;
  }
  const addAccount = (pack) => {
    
    pack.accountId = FB.createAccount(pack.uid, Process.store.getState(), {
      created: new Date().getTime(),
      planId: state.auth.profile.planId,
      expires: moment().add(3, "M").toDate().getTime(),
      active: true
    });

    return EC.registerAccount(pack.accountId,pack.uid, true)
      .then(pr => { return {...pack,result:pr,success:pr.data && pr.data.ok}});

  };
  
  return efPattern (cs.actions.ADD_ACCOUNT, pack, addAccount);

}

/**
 * remove an account
 */
export function acRemoveAccount(pack) {


  const removeAccount = (pack) => {
    return FB.removeAccount (pack.uid, pack.accountId)
      .then(pr => EC.removeAccount(pack.accountId))
      .then(pr => { return {...pack,result:pr,success:pr.data && pr.data.ok}});
  };
  
  return efPattern (cs.actions.REMOVE_ACCOUNT, pack, removeAccount);

}



export function dispatchStats (accountId, start, finish) {
  
  if (accountId && start && finish) {
    const ax = acFetchStats({
      pageResults:"stats",
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
export function acRangeStart(accountId, start , finish) {

  dispatchStats (accountId, start, finish);
  return {
    type: cs.actions.RANGE_START,
    payload: start
  };
}


export function acRangeFinish(accountId, start , finish) {
  
  dispatchStats (accountId, start, finish);
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

export function acMenuSelectedValue (term = null) {

  return {
    type: cs.actions.M_SELECTED_VALUE,
    payload: term
  };

}

export function acDrawerOpen (term = null) {

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
export function acFetchStats (pack) {

  const fetchStats = (pack) => {
    
      // if we're changing accounts then we have to get a load of stuff associated with the account
    return (
      EC.getStats(pack.accountId, {
        start:pack.start.getTime(),
        finish:pack.finish.getTime()
      })
      .then(pr=>{ 
        
        Process.store.dispatch(acGenerateSlots());
        return pr;
      })
      .then(pr=> { return {...pack,result:pr,success:pr.data && pr.data.ok}}));
        
    };

    return pack.accountId ? efPattern (cs.actions.FETCH_STATS, pack, fetchStats,"stats") : null;

}

