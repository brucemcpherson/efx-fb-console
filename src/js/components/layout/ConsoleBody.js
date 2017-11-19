import React from "react";

import cs from '../../constants/params';
import XClipboard from '../XClipboard';

import {
  acAddAccount,
  acFetchBosses,
  acAddBoss,
  acRemoveBoss,
  acRemoveAccount,
  acUpdateAccount
}
from '../../actions/index';


import moment from 'moment';
import Toggle from 'material-ui/Toggle';
import NotLoggedIn from './NotLoggedIn';
import ConsoleContent from './ConsoleContent';
import TAReportFailure from './TAReportFailure';
import TextField from 'material-ui/TextField';

export default class extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
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
  
  handleAccountToggle = (accountId,ob) => {
    const ad = acUpdateAccount({
      uid:this.props.auth.uid,
      accountId,
      ob,
      pageResults:"accountsUpdate"
    });
    
    if (ad) {
      this.props.dispatch(ad);
    }

  } 
  
  render() {
    
    const props = this.props;

    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <NotLoggedIn place="console"/>;
    }
    
    // we'll use the selected account later
    const resultRoot = props.accounts.pageResults.accounts;
    const place = resultRoot.selectedItems;
    const selectedAccount = place ? place[0] : "";

    const extraContent = <TextField
      floatingLabelText={`new key lifetime (minutes)`}
      value = {this.state.bossMinutes}
      disabled = {false}
      errorText = {this.state.errorText}
      onChange = {this.handleBossMinutesChange}
    /> ;
    
    // well also need to provide a default boss period
    
    // now render  .. this calls a generalized version so there are quite a few props
    return  ( <span>
      <div>
        <ConsoleContent 
          {...props} 
          pageResults={"accounts"}
          multiSelectable={false}
          maxRows={props.auth.profile.planId ? cs.plans[props.auth.profile.planId].MAX_ACCOUNTS : 1}
          minRows={1}
          title="Accounts"
          subtitle={props.auth.displayName}
          removeAction={acRemoveAccount}
          addAction={acAddAccount}
          spinner= {true}
          header={["Account","created","expires","plan","active"]}
          makeSelectedItems ={ (rows, data) => {
            return rows.length ? rows.map(d=>Object.keys(data)[d]) : (place|| []);
          }}
          makeSelectedRows={(selectedItems,data)=> {
            return selectedItems
            .map((d)=>Object.keys(data).indexOf(d))
            .filter((d,i)=>i !== -1);
          }}
          makeRows={(ids,data)=>{
            return Object.keys (data)
              .map (k=>{
                const ob = data[k];
                const now = new Date().getTime();
                  return [
                  k,
                  moment(ob.created).format("lll"),
                  moment(ob.expires).format("lll"),
                  cs.plans[ob.planId].name,
                  <Toggle 
                    toggled={ob.active && ob.expires > now}
                    disabled = {ob.expires <= now}
                    onToggle = { () => {
                      this.handleAccountToggle(ids[0],{...ob,active:!ob.active});
                    }}
                  />];
              });
          }}
          dialogContent={(id) => `The boss keys and analytics for account ${id} 
               will be removed. This operation cannot be undone.`}
          dialogTitle = {"Removing accounts"}
          extraDispatch = {(items) => {
            const ad = acFetchBosses({
              pageResults:"bosses",
              accountId:items[0]
            });
            if (ad) {
              this.props.dispatch(ad);
            }
          }}
         
        />
      </div>
      <p></p>

      <div>
        <ConsoleContent 
          {...props} 
          pageResults={"bosses"}
          multiSelectable={true}
          maxRows={cs.plans.a.MAX_BOSSES}
          minRows={1}
          title="Boss Keys"
          subtitle={selectedAccount ? `account ${selectedAccount}`:null}
          removeAction={acRemoveBoss}
          addAction={(pack)=>{
            const params = {...pack.params} || {};
            params.seconds = this.state.bossMinutes*60;
            return acAddBoss ({...pack,params});
          }}
          header={["Key","expires"]}
          makeSelectedItems ={ (rows, data) => {
            if (rows==="none") {
              return [];
            }
            else if (rows==="all") {
              return data.coupons;
            }
            else {
              const pp = props.accounts.pageResults["bosses"];
              return rows.length ? rows.map(d=>data.coupons[d]) : (pp.selectedItems || []);
            }
          }}
          makeSelectedRows={(selectedItems,data)=> {
          
            return selectedItems
            .map((d)=>data.coupons.indexOf(d))
            .filter((d,i)=>i !== -1);
          }}
          makeRows={(ids,data)=>{
            return (data.coupons || [])
              .map ((k,i)=>{
                  return [<XClipboard content={k}/>,moment(data.coupons[i].validtill).format("lll")];
              });
          }}
          dialogContent={(bossKeys) => `The boss keys ${bossKeys} 
               will be removed. This operation cannot be undone.`}
          dialogTitle = {"Removing boss key(s)"}
          spinner = {false}
          extraContent = {extraContent}
        />
      </div>
      <div>
        <TAReportFailure pageResults={resultRoot.accounts}/>
        <TAReportFailure pageResults={resultRoot.bosses}/>
        <TAReportFailure pageResults={resultRoot.accountsUpdate}/>
        <TAReportFailure pageResults={resultRoot.accountsAdd}/>
        <TAReportFailure pageResults={resultRoot.accountsRemove}/>
        <TAReportFailure pageResults={resultRoot.bossesAdd}/>
        <TAReportFailure pageResults={resultRoot.bossesRemove}/>
      </div>
    </span>);
  }
}