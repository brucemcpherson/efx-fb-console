import React from "react";
import Screwed from '../Screwed';
import ConsoleContent from './ConsoleContent';
import XClipboard from '../XClipboard';

import {acSelectedKeys, acGenerateSlots} from '../../actions/index';
import {  format as d3Format } from 'd3-format';

export default class extends React.Component {


  // when bosses are selected
  setSelectedKeys (selectedItems) {
    this.props.dispatch (acSelectedKeys(selectedItems));
  }
  
  // when key is selected 
  handleKeySelection = (rowSelection, data) => {

    const dataKeys = Object.keys(data);

    // this will be a collection of row indexes
    rowSelection = rowSelection || [];
    if (!Array.isArray(rowSelection) && rowSelection === "all") rowSelection = dataKeys.map((d,i)=>i);

    // this is an array of item names where their indexes exist int theRowSelection
    const selectedItems = dataKeys.filter((k,i)=>rowSelection.indexOf(i)!==-1 || rowSelection === "all");

    // record this selection
    this.setSelectedKeys (selectedItems);
    
    // and we also need to regenerate the chart data
    const ag = acGenerateSlots();
    if (ag){
      this.props.dispatch(ag);
    }
    
  }
  
  render() {
    
    
    const props = this.props;
    
    // nothing to do yet
    const accountId = props.accounts.selectedAccounts[0];
    if (!accountId) return <span></span>;
    
    // here's where the account API results are stored
    const pp = props.stats.pageResults.stats;

    if (!pp.ready) return <span></span>;
    if (accountId !== pp.things.data.accountId) {
      return <Screwed screwed = {`Expected to be working on ${accountId} but have been handed ${pp.things.data.accountId}`} /> ;
    }

    
    // the data to be plotted
    const data = pp.data || [];
    const keyData = (data.chunks || [])
    .reduce((p,c)=>{
      if (!p[c.coupon]) {
        p[c.coupon] = {
          set:0,
          get:0,
          setsize:0,
          getsize:0,
          remove:0
        };
      }
      Object.keys (p[c.coupon]).forEach (d=>p[c.coupon][d] += (c[d] || 0));
      return p;
    },{});
    

    const df = d3Format(".1f");
    
    // now render  .. this calls a generalized version so there are quite a few props
    return  ( <span>
      <div>

        <ConsoleContent 
          
          {...props}
     
          data={keyData}
          
          
          // whether more than one item can be selected
          multiSelectable={true}

        
          // title
          title = {"Access keys"}
          
          // show account name
          subtitle = {`Keys active in period for account ${accountId}`}
          
          // the table headings
          header={["Key","reads","writes","removes","kb read","kb written"]}
          
          // dont need a checkbox
          displayRowCheckbox = {true}
          
          // handle selected item
          handleSelection = {(rowSelection)=>this.handleKeySelection (rowSelection,keyData)}
          
          // how to figure out which items are selected
          makeSelectedItems = {()=>props.stats.selectedKeys}
          
          // map selected items to their row numbers
          makeSelectedRows={()=> {
          
            // find which rows hold keys that are selected
            const dataKeys = Object.keys(keyData);
            return props.stats.selectedKeys.map((d)=>dataKeys.indexOf(d)).filter((d,i)=>d !== -1);
          }}
          
          // how to generate rows in the table
          makeRows={(selectedRows)=>{

            // selected rows not necessary
            const rows = Object.keys (keyData)
              .map (k=>{
                return [<XClipboard content={k}/>,keyData[k].get,keyData[k].set,keyData[k].remove,
                keyData[k].getsize ? df(keyData[k].getsize) : "-" ,
                keyData[k].setsize ? df(keyData[k].setsize) : "-"];
            });
            return rows;
          }}

         
        />
      </div>

    </span>);
  }
    
}
