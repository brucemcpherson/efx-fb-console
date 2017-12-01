
export function delegateCommentary(action, act, status) {

  // standard commentary for request success

  // summarize what happened

  const result = action.payload.result ;
  const data = result ? result.data : null;
  const message = result ? result.message : "";

  return {
    serviceOk: result && result.request && result.request.status === 200 ? true : false,
    serviceStatus: result && result.request ? result.request.statusText :  message,
    appStatus: status || "unknown",
    appError: status === "REJECTED" ? result : "",
    ok: data && data.ok ? true : false,
    code: data ? data.code : "unknown",
    error: data ? data.error : "unknown"
  };

}
export function delegateEveryCommentary(action, act, status) {

  // standard commentary for request success

  // summarize what happened
  const result = action.payload.result || {} ;
  const serviceOk = action.payload.success;
  const serviceStatus = serviceOk ? "OK" : "error";
  const ok = serviceOk && Object.keys(result)
    .every (d=> result[d].result && result[d].result.data && result[d].result.data.ok) ? true : false;
  const appError = ok ? "" : "some keys not generated";
  const code = Object.keys(result)
    .filter (d=> result[d].result && result[d].result.data && !result[d].result.data.ok)
    .map(d=>result[d].result.data.error).join(",");
  const error = Object.keys(result)
    .filter (d=> result[d].result && result[d].result.data && !result[d].result.data.ok)
    .map(d=>result[d].result.data.code).join(",");

  return {
    serviceOk, 
    serviceStatus,
    appStatus: status || "unknown",
    appError,
    ok,
    code,
    error
  };

}

    
export function efResultDelegate  ( action, acts, state , initialState )  {
    

    
    // figure out what status is being reported
    const status = action.type.replace(/(.*)_(.*)$/, "$2");
    const act =  action.type.replace(/(.*)_(.*)$/, "$1");

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
        if (action.payload.cloneResults) {
          state.pageResults[action.payload.cloneResults] = {...initialState.everything};
        }
        return state;
      }
      
      case "PENDING": {
        state = {...state};
        const pr = state.pageResults[action.payload.pageResults];
        pr.active = true;
        pr.ready = false;
        if (action.payload.cloneResults) {
          state.pageResults[action.payload.cloneResults] = {...pr};
        }
        return state;
      }
      

        
      case "FULFILLED": {

        state  = {...state};
        const ps = [action.payload.pageResults];
        const pp = state.pageResults;
        const result = action.payload.result;

        // sometime the data is in a value field, or within a pageresults value of that, or coupons
        let data = data || (result && result.data && result.data.value  && result.data.value[ps]);
        data = data || (result && result.data && result.data.coupons);
        data = data || (result && result.data && result.data.value );
        data = data || (result && result.data);
        data = data || {};

        
        const everything = {
          active:false,
          ready:true, 
          error:action.payload.message || action.payload,
          commentary:delegateCommentary (action, act, status),
          things:result,
          data:data  // for convenience, hoist the data up top too
        };

        pp[ps] = everything;
        if (action.payload.cloneResults) {
          pp[action.payload.cloneResults] = {...everything};
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
        if (action.payload.cloneResults) {
          state.pageResults[action.payload.cloneResults] = state.pageResults[action.payload.pageResults];
        }
        return state;
      }
    }
    
    // i couldnt deal with it
    return null;
    
    
  };
