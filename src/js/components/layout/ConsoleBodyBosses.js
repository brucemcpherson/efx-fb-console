import React from "react";
import WorkingOn from '../WorkingOn';
import Screwed from '../Screwed';
import cs from '../../constants/params';
import XClipboard from '../XClipboard';

import {
  acAddBoss,
  acRemoveBoss,
  acSelectedBosses
}
from '../../actions/index';


import moment from 'moment';
import ConsoleContent from './ConsoleContent';
import TextField from 'material-ui/TextField';

export default class extends React.Component {

  constructor (props) {
    super(props);
    // nothing to do here yet
    this.state= {
      bossMinutes:cs.values.BOSS_MINUTES.toString(),
      errorText:""
    };
  }
  
  
  handleBossMinutesChange = (event) => {
    
    const n =  parseInt (event.target.value,10) ;
    if (event.target.value && isNaN(n) || n < 1) {
      this.setState({
        errorText:`enter number of minutes (>0)`
      });
    }
    else {
      this.setState ( {
        bossMinutes:event.target.value,
        errorText:""
      });
    }
  }
  
  
  // when bosses are selected
  setSelectedBosses (selectedItems) {
    
    this.props.dispatch (acSelectedBosses(selectedItems));

  }
  
  // when boss is selected 
  handleBossSelection = (rowSelection, data) => {

    // where the data normally is - it can be recieved also to deal with nextProps calls
    const dataKeys = data && data.map(d=>d.key) || [];

    // this will be a collection of row indexes
    rowSelection = rowSelection || [];
    if (!Array.isArray(rowSelection) && rowSelection === "all") rowSelection = dataKeys.map((d,i)=>i);

    // this is an array of item names where their indexes exist int theRowSelection
    const selectedItems = dataKeys.filter((k,i)=>rowSelection.indexOf(i)!==-1 || rowSelection === "all");
    
    // record this selection
    this.setSelectedBosses (selectedItems);
    
  }

  // removing a boss
  handleRemoveBosses = (accountId) => {

    const props= this.props;
    const selectedBosses = props.accounts.selectedBosses;
    
    // remove it
    if (selectedBosses && selectedBosses.length) {
      const ad = acRemoveBoss({
        bossKeys:selectedBosses,
        accountId
      });
      if (ad) props.dispatch (ad);
    }
    
    // need to unselect the current one
    this.handleBossSelection ();
  }
  
  // adding a boss
  
  // the accounts section of the console
  render() {
    
    const props = this.props;

    // nothing to do yet
    const accountId = props.accounts.selectedAccounts[0];
    
    if (!accountId) return <span></span>;
    
    // here's where the account API results are stored
    const pp = props.accounts.pageResults.bosses;
    const ac = props.accounts.pageResults.accounts;
    console.log ("bosses pp",pp);
    if (!pp.ready) {
      return <WorkingOn workingOn = {"getting your boss keys for account " + accountId }/>;
    }
    // extract out the coupon data and sort it
    const data = pp.data;
    console.log ("in bosses doing account", accountId);
    
    if (accountId !== pp.things.data.accountId) {
      return <Screwed screwed = {`Expected to be working on ${accountId} but have been handed ${pp.things.data.accountId}`} /> ;
    }

    const acOb = ac.data[accountId];
    if (!acOb || !acOb.planId) {
      return <Screwed screwed = {`data not available for ${accountId}`} /> ;
    }
    
    const extraContent = <TextField
      floatingLabelText={`new key lifetime (minutes)`}
      value = {this.state.bossMinutes}
      disabled = {false}
      errorText = {this.state.errorText}
      onChange = {this.handleBossMinutesChange}
    /> ;
    
    // now render  .. this calls a generalized version so there are quite a few props
    return  ( <span>
      <div>

        <ConsoleContent 
          
          {...props}
     
          data={data}
          
          
          // whether more than one item can be selected
          multiSelectable={false}
          
          // limit size of of accounts depending on plan
          maxRows={props.auth.planId ? cs.plans[props.auth.planId].MAX_BOSSES : 1}
          
          // doesnt need to have any accounts
          minRows={0}
          
          // title
          title="Boss keys"
          
          // show account name
          subtitle={"account " + accountId}
          
          // what to do when remove is requested
          removeAction={()=>this.handleRemoveBosses(accountId)}
          
          // what do do when add is requetsed
          addAction={()=>{
            const pack = {
              params: {
                seconds:this.state.bossMinutes*60
              },
              planId:acOb.planId,
              accountId
            };
            return acAddBoss (pack);
          }}
          
          
          // the table headings
          header={["Key","expires"]}
          
          // dont need a checkbox
          displayRowCheckbox = {false}
          
          // handle selected item
          handleSelection = {(rowSelection)=>this.handleBossSelection (rowSelection,data)}
          
          // how to figure out which items are selected
          makeSelectedItems = {()=>props.accounts.selectedBosses}
          
          // map selected items to their row numbers
          makeSelectedRows={()=> {
          
            // for bosses, the data is just the keys
            const dataKeys = data && data.map(d=>d.key) || [];
            
            return props.accounts.selectedBosses.map((d)=>dataKeys.indexOf(d)).filter((d,i)=>d !== -1);
          }}
          
          // how to generate rows in the table
          makeRows={(selectedRows)=>{

            // selectedRows not necessary
            // make table rows
            return data.map ((ob,i)=>[
              <XClipboard content={ob.key}/>,
              moment(ob.validtill).format("lll")
            ]);
    
              
          }}
          
          // warning if delete is selected
          dialogContent={(id) => `The boss keys and analytics for account ${id} 
               will be removed. This operation cannot be undone.`}
          
          // title if delete is selected
          dialogTitle = {"Removing accounts"}

          // allow changing of minutes for boss keys
          extraContent = {extraContent} 
         
        />
      </div>

    </span>);
  }
}