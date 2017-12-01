import cs from '../constants/params';
import ca from '../constants/auth';

import {
  delegateCommentary,
  delegateEveryCommentary
}
from './delegates';

const initialState = {
  
  jsonKeys: {
    writer:"",
    reader:"",
    updater:"",
    item:"",
    alias:"",
    code:'{"demo":"enter json data here or read from store"}',
    boss:""
  },
  
  past: {
    boss:[],
    writer:[],
    updater:[],
    reader:[],
    item:[],
    read:[],
    shared:[],
    sharedUpdate:[],
    aliasitem:[],
    aliasshared:[],
    aliassharedUpdate:[],
    alias:[]
  },
  
  everything: {
    active:false,
    ready:false,
    error:"",
    commentary:"",
    things: {
      
    }
  },
  
  pageResults: {
    ajson:{},
    boss:{},
    writer:{},
    updater:{},
    reader:{},
    item:{},
    read:{},
    write:{},
    shared:{},
    sharedUpdate:{},
    tempResults:{},
    sharedRead:{},
    validate:{},
    ping:{},
    info:{},
    remove:{},
    service:{},
    makeEverything:{}, 
    quotas:{},
    alias:{},
    readAlias:{},
    jsonKeyResults:{},
    jsonItemResults:{}
  },
  
  accountIds: ca.tutorialAccounts,
  planId:'x'
  
};

export default function(state = initialState, action) {

    // things I can delegate 
  const acts = [
    cs.actions.T_READ_ITEM,
    cs.actions.T_UPDATE_ITEM,
    cs.actions.T_RESULT,
    cs.actions.T_WRITE_ITEM,
    cs.actions.T_GENERATE_KEYS,
    cs.actions.T_VALIDATE_KEY,
    cs.actions.T_PING,
    cs.actions.T_INFO,
    cs.actions.T_REMOVE_ITEM,
    cs.actions.T_FETCH_QUOTAS,
    cs.actions.T_REGISTER_ALIAS,
    cs.actions.T_WRITE_JSON_ITEM,
    cs.actions.T_READ_JSON_ITEM,
    cs.actions.T_UPDATE_JSON_ITEM,
    cs.actions.T_REMOVE_JSON_ITEM

  ];
  
  // figure out what status is being reported
  const status = action.type.replace(/(.*)_(.*)$/, "$2");
  const act =  action.type.replace(/(.*)_(.*)$/, "$1");
  
  // common pattern for dealing with result of ecAccess
  const ecResultDelegate =  ()=>  {

    // if i dont know how to deal with it, go away
    if (acts.indexOf(act) === -1) {
      // not one of mine
      return null;
    }
    
    // i know how to dela with these.
    switch (status) {
      
      case "CLEAR": {
        state = {...state};
        state.pageResults[action.payload.pageResults] = {...initialState.everything};
        
        return state;
      }
      
      case "PENDING": {
        state = {...state};
        state.pageResults[action.payload.pageResults] = {...initialState.everything,active:true};
        if (action.type === cs.actions.T_WRITE_JSON_ITEM) {
          state.jsonKeys.item="";
        }
        return state;
      }
      
      case "FULFILLED": {

        const everything = {
          active:false,
          ready:true,
          error:"",
          commentary:delegateCommentary (action, act, status),
          things:action.payload.result
        };
        state  = {...state};
        state.pageResults[action.payload.pageResults] = everything;
        
        // it's possible this has to be added to the past history
        // but we wont allow duplicate
        if (action.payload.add) {
          const sp = [...state.past[action.payload.pageResults]];
          let dc;
          if (action.payload.dupCheck) {
            dc = sp.some (d=>action.payload.result.data[action.payload.dupCheck] === d.data[action.payload.dupCheck]);
          }
          if (dc) {
            sp.forEach ((d,i,a)=>{
              if (action.payload.result.data[action.payload.dupCheck] === d.data[action.payload.dupCheck]) {
                a[i] = action.payload.result; 
              }
            });
          }
          else {
            sp.push (action.payload.result);
          }
          state.past[action.payload.pageResults] = sp;
        }
        
        // extra step for json writer/reader
        var aw = action.payload.result && action.payload.result.data;
        if (act === cs.actions.T_WRITE_JSON_ITEM) {
          state.jsonKeys.item = (aw && aw.ok && aw.id) || "";
          state.jsonKeys.alias = (aw && aw.ok && aw.alias)|| "";
        }
        
        if (act === cs.actions.T_READ_JSON_ITEM) {
          state.jsonKeys.code = (aw && aw.ok && JSON.stringify(aw.value,null,2)) || "";
        }
        
        
        return state;
      }
      
      case "REJECTED": {
        const everything = {
          active:false,
          ready:true,
          error:action.payload,
          commentary:delegateCommentary (action, act, status),
          things:action.payload.result
        };
        state = {...state};
        state.pageResults[action.payload.pageResults] = everything;

        return state;
      }
    }
    
  };
  
  const newState = ecResultDelegate();
  if (newState) {
    return newState;
  } 

  
  switch (action.type) {
    
    
    // -- store any keys being used for json editing
    
    case cs.actions.T_AJSON_KEYS: {
      state = {...state};
      state.jsonKeys[action.payload.type] = action.payload.value;
      return state;
    }
    
   
    case cs.actions.T_GET_SOMEKEYS + "_PENDING": {
      state = {...state};
      state.pageResults[action.payload.pageResults] = {...initialState.everything,active:true,things:action.payload.result};
      return state;
    }
    
    case cs.actions.T_GET_SOMEKEYS + "_FULFILLED": {
      state = {...state};
      state.pageResults[action.payload.pageResults] = {active:false, ready:true, things:action.payload.result};
      var ap = action.payload.result;
      
      Object.keys (action.payload.result)
      .forEach (function (d) {
        // oops... writer in payload, writers in store
        var k = state.jsonKeys.hasOwnProperty(d) ? d : d + "s";
        var r = ap[d];
        
        state.jsonKeys[k] = r.success ? 
          (r.result.data.keys? r.result.data.keys[0] : r.result.data.key) : 
          ("failed to generate:" + r.result.statusText + "-" + ((r.result.data && r.result.data.error) || ""));    
      });
      return state;
    }
    
    case cs.actions.T_GET_SOMEKEYS + "_REJECTED": {
      state = {...state};
      state.pageResults[action.payload.pageResults] = {active:false, ready:true, things:action.payload.result};
      ['updater','writer','reader']
      .forEach (function (d) {
          state.jsonKeys[d] = "failed to generate:API error";
      });
      return state;
    }
    
     //---generate all the keys we'd need for a tutorial
    case cs.actions.T_MAKE_EVERYTHING + "_PENDING": {

      const everything = {...initialState.everything,active:true};
      const pageResults = {...initialState.pageResults};
      return {...state , everything, pageResults};

    }
    

    case cs.actions.T_MAKE_EVERYTHING + "_FULFILLED":
      {
        
        const everything = {
          active:false,
          ready:true,
          error:"",
          commentary:delegateEveryCommentary (action, act, status),
          things:action.payload.result ? Object.keys(action.payload.result)
          .reduce ( (p,c) => {
             p[c] = action.payload.result[c].result || {};
             return p;
          },{}) : {}
        };
        const past = Object.keys (initialState.past).reduce ((p,c) => {
          if (everything.things[c]) {
            p[c] = [everything.things[c]];
          }
          return p;
        }, {...initialState.past});
        
        state = {...state, everything, past} ;
        state.pageResults[action.payload.pageResults] = everything;
        
        return state;
      }
      

    case cs.actions.T_MAKE_EVERYTHING + "_REJECTED":
      {
        const everything = {
          active:false,
          ready:true,
          error:action.payload,
          commentary:delegateCommentary (action, act, status),
          things:action.payload.result
        };
        state = {...state};
        state.pageResults[action.payload.pageResults] = everything;
        return state;
      }

  }

  return state;

  
}

