import cs from '../constants/params';
import Process from '../containers/process';
import EC from 'effex-api-client';

import {
  acPromise,
  getTutorialUid
}
from './index';
//import moment from 'moment';

//-- supporting the tutorial
// maybe TODO.. redo everything if key time is running out?
/*
function enoughTime(coupon) {

  return coupon && coupon.validtill ?
    new Date(coupon.validtill).getTime() > moment().add(cs.tutorial.enough, "seconds").toDate().getTime() : false;

}
*/

/**
 * get a list of keys from history
 */
export function getTutorialKeys (props, type) {
  
  
  const tutorial = props.tutorial;
  
  return (tutorial.past[type] || [])
  .reduce ((p,c) => {
    if (c) {
      
      const key = c.data.key || c.data.id;
      const keys = c.data.keys || [key];
      
      if (!keys) {
        console.log('coundnt find keys in ', c);
      }
      p.push(...keys);
    }
    return p;
  },[]).reverse();
     
}
 
   
/**
 * validate a given key
 * @param {object} pack the params
 * @return {object} a dispatchable object
 */
export function atValidateKey(pack) {


  const validateKey = (pack) => {
   
    return EC.validateKey(pack.key)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };
  
  return ecPattern (cs.actions.T_VALIDATE_KEY, pack, validateKey);

}
   
/**
 * generate a key of the given type, but only if we have a boss key
 * @param {string} mode reader/writer/updater
 * @return {object} a dispatchable object
 */
export function atGenerateKeys(pack) {

  const state = Process.store.getState();
  const boss = getTutorialKeys(state, "boss")[0];
  // cant do it without a boss key
  if (!boss) {
    return null;
  }

  const generateKey = (pack) => {
   
    return EC.generateKey(boss, pack.mode,pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };
  
  return ecPattern (cs.actions.T_GENERATE_KEYS, pack, generateKey);

}



/**
 * GOOD
 * a generic pattern for creating and access action
 * @param {object] pack the paranmeters and options
 * @param {string} action the action type
 * @param {function} func the thing to execute
 * @return {null||object} an action object that can be dispatched if not null
 */
function ecPattern (action, pack, func) {
  
  // only if we;re not already doing it
  
  const state = Process.store.getState();
  if (state.tutorial.pageResults[pack.pageResults].active) return null;
  
    // now set up a basic set of keys for use by the tutorial
  return acPromise(action, pack, () => {
    return func (pack)
      .catch (pe=> {
        console.log ('failed init', pe);
        return {...pack,pageResults:pack.pageResults,result:pe ,success:false};
      });
  });
    
}

/**
 * GOOD
 * update a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atUpdateItem(pack) {

  const updateItem = (pack) => {
    return EC.update( pack.data, pack.id, pack.key, pack.method, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };
  
  return ecPattern (cs.actions.T_UPDATE_ITEM, pack, updateItem);

}

/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atWriteJsonItem(pack) {

  const writeItem = (pack) => {
   
    return (pack.alias ? 
      EC.writeAlias( pack.data,pack.alias,pack.key, pack.method, pack.params) :
      EC.write( pack.data,pack.key, pack.method, pack.params))
      .then(pr => {
       
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_WRITE_JSON_ITEM, pack, writeItem);
}   

/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atRemoveJsonItem(pack) {

  const readItem = (pack) => {

    return EC.remove(pack.id, pack.key, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_REMOVE_JSON_ITEM, pack, readItem);
} 

/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atUpdateJsonItem(pack) {

  const readItem = (pack) => {

    return EC.update(pack.data , pack.id, pack.key, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_UPDATE_JSON_ITEM, pack, readItem);
} 

/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atReadJsonItem(pack) {

  const readItem = (pack) => {

    return EC.read(pack.id, pack.key, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_READ_JSON_ITEM, pack, readItem);
} 
    
/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atWriteItem(pack) {

  const writeItem = (pack) => {
    return EC.write( pack.data,pack.key, pack.method, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_WRITE_ITEM, pack, writeItem);
}
/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atRemoveItem(pack) {

  const removeItem = (pack) => {
    return EC.remove(pack.id, pack.key, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_REMOVE_ITEM, pack, removeItem);
}
/**
 * GOOD
 * register an alias
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atRegisterAlias(pack) {

  const aliasItem = (pack) => {
    return EC.registerAlias(pack.writer, pack.key, pack.id, pack.alias, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });

  };

  return ecPattern (cs.actions.T_REGISTER_ALIAS, pack, aliasItem);
}
/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atReadItem(pack) {

  const readItem = (pack) => {
    return EC.read(pack.id, pack.key, pack.params)
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_READ_ITEM, pack, readItem);
}

/**
 * GOOD
 * get quotas 
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atFetchQuotas (pack) {

  const quotas = (pack) => {
    return EC.getQuotas()
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_FETCH_QUOTAS, pack, quotas);
}
/**
 * GOOD
 * ping service
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atInfo (pack) {

  const info = (pack) => {
    return EC.info()
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_INFO, pack, info);
}
/**
 * GOOD
 * ping service
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atPing (pack) {

  const ping = (pack) => {
    return EC.ping()
      .then(pr => {
        return {...pack,result:pr,success:pr.data && pr.data.ok};
      });
  };

  return ecPattern (cs.actions.T_PING, pack, ping);
}
/**
 * GOOD
 * read a given item
 * @param {object} options the options
 * @return {null|object} and action object or null if one is already in flight with the same pageresult
 */
export function atClearResult(pack) {

  return {
    type:cs.actions.T_RESULT +'_CLEAR',
    payload:pack
  };

}
/**
 * @param {object} pack the options
 * @return {object} and action object
 */
export function atJsonKeys(pack) {

  return {
    type:cs.actions.T_AJSON_KEYS,
    payload:pack
  };

}

/**
 * get someKeys
 * @param {object} pack
 * @return {object} an action object
 */
export function atGetSomeKeys (pack) {
  const kt = ['updater','writer','reader'];
  const makeKeys = () => {
    return Promise.all(kt.map (d=>EC.generateKey(pack.boss, d)))
    .then (pr=>{
      // get the individual results to one place
       return kt.reduce((p,c,i) => {
        p.result[c] = {result:pr[i],success:pr[i].data && pr[i].data.ok};
        return p;
       }, {...pack, result:{}});
    });
  };
  return ecPattern (cs.actions.T_GET_SOMEKEYS, pack, makeKeys);

}

/**
 * This is fairly complex because we're putting together
 * results from a number of async queries that depend on each other
 * and which return different shaped results
 * generate all the keys we're going to need for the tutorial
 * its better to just do this once as doing it piecemeal
 * causes complicated stuff when entering a page
 * @return {object} a dispatchable object or null if we dont need anything
 */
export function atMakeEverything() {

  const state = Process.store.getState();
  // use a range of account ids for the tutorials to keep no of keys manageable
  const pots = state.tutorial.accountIds.filter (d=>true);
  const accountId = pots[Math.floor(Math.random() * (state.tutorial.accountIds.length))];
  const keyTypes = ['writer', 'reader', 'updater'];
  const itemTypes = ['item','shared','sharedUpdate'];
  

  
  // used to get a boss key
  const getInitialBoss = (pack)  => {
    return EC.generateBoss(accountId, state.tutorial.planId, {
      seconds: cs.tutorial.bossLife,
      apikey: getTutorialUid()
    })
    .then (pr=>{
      return {...pack,boss:{result:pr,success:pr.data && pr.data.ok}};
    });
  };


  // get all the keys we'll need and return a promise
  const getInitialKeys = (pack)  => {

    return Promise.all(keyTypes.map(d => !pack.boss.success ? Promise.resolve ({}) : EC.generateKey(pack.boss.result.data.key, d)))
    .then (pr=>{

       return keyTypes.reduce((p,c,i) => {
        p[c] = {result:pr[i],success:pr[i].data && pr[i].data.ok};
        return p;
       }, {...pack});
    });
  };
  
  // get all the items we'll need and return a promise
  const getInitialItems = (pack)  => {
    const method = "POST";

    return Promise.all([
      !pack.writer.success ? 
         Promise.resolve({}) : EC.write( "a data item that can be read only by the creator",pack.writer.result.data.keys[0], method),
      !pack.reader.success ? 
         Promise.resolve({}) : EC.write( "a data item that can be read by another", pack.writer.result.data.keys[0], method,{
           readers:pack.reader.result.data.keys[0]
         }),
      !pack.updater.success ? 
         Promise.resolve({}) : EC.write("a data item that can be updated by another",pack.writer.result.data.keys[0], method,  {
           updaters:pack.updater.result.data.keys[0]
         })
    ])
    .then (pr=> {
      return itemTypes.reduce((p,c,i) => {
        p[c] = {result:pr[i],success:pr[i].data && pr[i].data.ok};
        return p;
       }, {...pack});
    });
  };
  
  // get all the alias items
  const getAliases = (pack) => {
    // use this to extract the keys from the different format
    const kep = {"updaters":d=>d[0],  "readers":d=>d[0], "writer":d=>d};
    // thes are what needs to be called to generate aliases.. pack contains the results
    // from getting various items
    const aMap = Object.keys(pack).filter(e=>itemTypes.indexOf(e) !==-1).map ((e,i)=> {
      // the kind of key to extract can be deduced from the properties of the data
      const d = pack[e].result;
      let k;
     
      if (pack[e].success) {
       
        k = Object.keys(kep).filter(e=>Object.keys(d.data).indexOf(e) !==-1)[0];
      }
      if (!k) {
        return Promise.reject("failed to find correct property in data", d.data);
      }
      else {
        
        return EC.registerAlias(
          pack.writer.result.data.keys[0],
          kep[k](d.data[k]),
          d.data.id,
          "alias-"+keyTypes[i]);
      }
      
    });
    // we'll do these all at once
    return Promise.all(aMap)
    .then (pr=>{
      // push all the results together
      return itemTypes.reduce((p,c,i) => {
        p['alias'+c] = {result:pr[i],success:pr[i].data && pr[i].data.ok};
        return p;
       }, {...pack});

    });
  };  


  // only do it if necessary to avoid multiple calling
  if (state.tutorial.everything.active || state.tutorial.everything.ready || state.tutorial.everything.error) return null;
  
  // now set up a basic set of keys for use by the tutorial
  return acPromise(cs.actions.T_MAKE_EVERYTHING, accountId, () => {
    return getInitialBoss ({})
    .then (pr=> getInitialKeys(pr))
    .then (pr=> getInitialItems(pr))
    .then (pr=> getAliases(pr))
    .then (pr=> {
      const ek = Object.keys (pr).filter (d=>!pr[d].success);
      const errors = ek.map(d=>pr[d].result);

      if (errors.length) { 
        const result = {...errors[0],message:errors.length + " keys could not be created"};
        return {pageResults:"makeEverything",result,success:false};
      }
      else {
        return {pageResults:"makeEverything",result:pr,success:true};
      }
    })
    .catch (pe=> {
      console.log ('failed init make everything', pe);
      return {pageResults:"makeEverything",result:pe,success:false};
    });
  });


}


