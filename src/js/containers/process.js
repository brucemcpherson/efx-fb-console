/**
 * sets up all structure to get started
 * use EC.setBase to point to the correct version of the API
 */
import configureStore from '../store/configureStore';
import {authInit} from '../actions/index';
import EC from 'effex-api-client';
import ca from '../constants/auth';

const Process = (function(ns) {
    
    // populate store with initial values (there are none)
    ns.init = function () {
      // change to prod/dev/alpha
      EC.setEnv ("fb");
      EC.setBase (null, ca.effexAdmin); 
      
      // set up redux store
      ns.store = configureStore({});

      // set up firebase auth      
      authInit();

      // actually syncronosu, but in case it doesn't
      return Promise.resolve ();
    };


    return ns;
})({});

export default Process;
 
