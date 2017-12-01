import React from "react";

import cs from '../../constants/params';
import Handy from '../../utils/handy';
import moment from 'moment';
import Toggle from 'material-ui/Toggle';
import ConsoleContent from './ConsoleContent';


export default class extends React.Component {

  constructor (props) {
    super(props);
    // nothing to do here yet
  }

  
  // the accounts section of the console
  render() {
    
    const props = this.props;
    const accountId = props.accounts.selectedAccounts [0];
    
    // here's where the account API results are stored
    const pp = props.accounts.pageResults.accounts;
    const data = pp.data;

    // now render  .. this calls a generalized version so there are quite a few props
    return  ( <span>
      <div>

        <ConsoleContent 
          
          {...props}
     
          data={data}

          
          // whether more than one item can be selected
          multiSelectable={false}
          
          // limit size of of accounts depending on plan
          maxRows={props.auth.planId ? cs.plans[props.auth.planId].MAX_ACCOUNTS : 1}
          
          // must have at lease one account
          minRows={1}
          
          // title
          title="Accounts"
          
          // show user name
          subtitle={props.auth.displayName}
          
          // what to do when remove is requested
          removeAction={()=>props.handleRemoveAccount(accountId)}
          
          // what do do when add is requetsed
          addAction={()=>props.handleAddAccount()}
          
          
          // the table headings
          header={["Account","created","expires","plan","active"]}
          
          // dont need a checkbox
          displayRowCheckbox = {false}
          
          // handle selected item
          handleSelection = {(rowSelection)=>props.handleAccountSelection (rowSelection,data)}
          
          // how to figure out which items are selected
          makeSelectedItems = {()=>[accountId]}
          
          // map selected items to their row numbers
          makeSelectedRows={()=> {
            // sort the keys in reverse alphabeticall order
            const dataKeys = Handy.sortKeys (data, true);
            
            return [accountId]
              .map((d)=>dataKeys.indexOf(d))
              .filter((d,i)=>d !== -1);
          }}
          
          // how to generate rows in the table
          makeRows={(selectedRows)=>{

            // sort the keys in reverse alphabeticall order
            const dataKeys = Handy.sortKeys (data, true);
            
            // make table rows
            return dataKeys.map ((k,i)=>{
 
                const ob = data[k];
                const now = new Date().getTime();
                return [
                
                  // the account name
                  k,
                  
                  // when the account was created
                  moment(ob.created).format("lll"),
                  
                  // when the account expires
                  ob.expires ? moment(ob.expires).format("lll") : "never",
                  
                  // the plan name
                  cs.plans[ob.planId].name,
                  
                  // toggle the account active/not active - disabled if row not selected
                  // this div avoids the deselection of a row when the toggle is clicked
                  <div onClick={(e) => { e.preventDefault(); e.stopPropagation();}}>
                    
                    <Toggle 
                      toggled={( (!ob.expires || ob.expires > now) && ob.active) ? true : false}
                      disabled = { (selectedRows.indexOf(i) ===-1 || (ob.expires <= now && ob.expires)) ? true : false}
                      onToggle = { () => {
                        // we're only toggling the first of the selected items (there's only one)
                        props.handleAccountToggle(accountId,{...ob,active:!ob.active});
                      }}
                    />
                  </div>
                  
                ];
              });
          }}
              
          // warning if delete is selected
          dialogContent={(id) => `The boss keys and analytics for account ${id} 
               will be removed. This operation cannot be undone.`}
          
          // title if delete is selected
          dialogTitle = {"Removing accounts"}


         
        />
      </div>
      <p></p>

    </span>);
  }
}