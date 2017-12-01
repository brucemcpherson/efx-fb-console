import React from "react";

import cs from '../../constants/params';
import Handy from '../../utils/handy';
import NotLoggedIn from './NotLoggedIn';
import WorkingOn from '../WorkingOn';
import ConsoleBodyAccounts from './ConsoleBodyAccounts';
import ConsoleBodyBosses from './ConsoleBodyBosses';
import DashParams from './DashParams';
import DashChart from './DashChart';
import DashKeys from './DashKeys';
import TAReportFailure from './TAReportFailure';
import Screwed from '../Screwed';
import JsonEditor from './JsonEditor';

import {
  acFetchBosses,
  acLocalUpdateAccount,
  acUpdateAccount,
  acAddAccount,
  acRemoveAccount,
  acSelectedAccounts,
  dispatchStats
}
from '../../actions/index';

export default class extends React.Component {

  // use uid to know whether to show working on
  constructor (props) {
    super(props);
    this.state = {
      uid:""
    };
  }
  
  // get stats for a given range
  fetchStats (accountId) {
    dispatchStats (accountId);
  }
  
  fetchBosses (accountId) {
    

    // get the boss keys for this account
    const ad = acFetchBosses({
      pageResults:"bosses",
      accountId
    });
    if (ad) {
      this.props.dispatch(ad);
    }
  }
  

  setSelectedAccounts (selectedItems) {

    // old selected
    const props = this.props;
    const olds = props.accounts.selectedAccounts ;

    if (selectedItems) {
      // if things have changed then we need to reget the bosses and the stats for this account
      if (!olds || selectedItems.length !== olds.length || selectedItems.some(d=>olds.indexOf(d)===-1)) {
        // only get the first selected item -- theres only one anyway for accounts
        if (selectedItems.length) {
          // this should always be true unless there's been some fetch error - if not then dont get thos data anyway
          this.fetchBosses(selectedItems[0]);
          this.fetchStats (selectedItems[0]);
        }
      }
    }
    
    // set the new items
    props.dispatch (acSelectedAccounts(selectedItems));

    
  }
  
  // when account becomes active/inactive  
  handleAccountToggle = (accountId,ob) => {

    // a patch of state of toggle while waiting for response
    const pack = {
      accountId,
      ob
    };
    
    // cause a switch to happen locally before its actually happened back in the api
    const al = acLocalUpdateAccount (pack);
    if (al)this.props.dispatch (al);
    
    //now on the api
    const ad = acUpdateAccount(pack);
    if (ad) this.props.dispatch(ad);


  } 

    
  // adding an account
  handleAddAccount = () => {
    // add it
    return acAddAccount();
  }
  
  // removing an account
  handleRemoveAccount = (accountId) => {
    // remove it
    this.setSelectedAccounts ([]);
    return acRemoveAccount(accountId);
  }
  
  rowsToItems = (rowSelection, data) => {
    
    // where the data normally is - it can be recieved also to deal with nextProps calls
    data  = data || this.props.accounts.pageResults.accounts.data;
    
    // the keys are the item names, sorted in reverse alphabetical order (newsest first)
    const dataKeys = Handy.sortKeys (data, true);
    
    // this will be a collection of row indexes
    rowSelection = rowSelection || [];
    if (!Array.isArray(rowSelection) && rowSelection === "all") rowSelection = dataKeys.map((d,i)=>i);

    // this is an array of item names where their indexes exist int theRowSelection
    return dataKeys.filter((k,i)=>rowSelection.indexOf(i)!==-1 || rowSelection === "all");

  }
  
  handleAccountSelection = (selectedItems) => {
   // record this selection
    this.setSelectedAccounts (selectedItems);
    
  }
  
  // when row is selected 
  handleAccountRowSelection = (rowSelection, data) => {

    // this is an array of item names where their indexes exist int theRowSelection
    const selectedItems = this.rowsToItems(rowSelection, data);  
    this.handleAccountSelection (selectedItems);

    
  } 
 
  
  // will decide whether the next render is ready to 
  componentWillReceiveProps (nextProps)  {
    // will get ready to show in transition or not
    const dataPlace = nextProps.accounts.pageResults.accounts;
    if (nextProps.auth.status === cs.status.AUTH_LOGGED_IN && dataPlace.ready) {
      this.setState ({
        uid:nextProps.auth.uid
      });
    }
    
  }
  
  
  render() {
    
    const props = this.props;

    // need to be logged in
    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <NotLoggedIn place="console"/>;
    }

    // info about getting stuff
    if (props.auth.uid !== this.state.uid ){
       return <WorkingOn workingOn = {"getting your accounts data"}/>;
    }
    
    // set up funcs controlled here
    const funcs = {
      handleAccountSelection:this.handleAccountRowSelection.bind(this),
      handleAccountToggle:this.handleAccountToggle.bind(this),
      handleAddAccount:this.handleAddAccount.bind(this),
      handleRemoveAccount:this.handleRemoveAccount.bind(this)
    };
    
    const dashParamsFuncs = {
      handleAccountSelection:(value)=>this.handleAccountSelection([value])
    };
    
    const jsonFuncs = {
      handleAccountSelection:(value)=>this.handleAccountSelection([value])
    };
    
    // whether this is the dashboard or the console
    if (props.consolePage === "console") {
      return (
        <span>
          <ConsoleBodyAccounts {...props} {...funcs}/>
          <ConsoleBodyBosses {...props}/>
          <TAReportFailure pageResults={props.accounts.pageResults.accounts}/>
          <TAReportFailure pageResults={props.accounts.pageResults.bosses}/>
        </span>
      );
    }
    
    else if (props.consolePage === "dash") {
      return (
        <span>
          <DashParams {...props} {...dashParamsFuncs}/>
          <DashChart {...props}/>
          <DashKeys {...props}/>
          <TAReportFailure pageResults={props.accounts.pageResults.accounts}/>
          <TAReportFailure pageResults={props.stats.pageResults.stats}/>
        </span>
      );
    }
    
    else if (props.consolePage === "json") {
      return (<span>
        <JsonEditor 
          title={"Create JSON"} 
          subtitle = {`Manually creating json data`}
          intro = {`Enter JSON data and write it to the store`}
          {...props} {...jsonFuncs}
        />
        </span>);
    }
    
    else {
      return <Screwed screwed={`unknown console page ${props.consolePage}`}/>;
    }
    
  }
}


