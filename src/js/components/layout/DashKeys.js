import React from "react";
import XCard from '../XCard';
import XTable from '../XTable';


import {acStatsSelectedRows, acGenerateSlots} from '../../actions/index';
import {  format as d3Format } from 'd3-format';

export default class extends React.Component {


  render() {
    
    const props = this.props;

    // we'll use the selected account later
    const place = props.accounts.pageResults.accounts;
    const selectedAccount = place.selectedItems ? place.selectedItems[0] : "";
    const dataPlace = props.stats.pageResults.stats;
    const data = (dataPlace ? dataPlace.data : []) || [];
    
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
        Object.keys (p[c.coupon]).forEach (d=>p[c.coupon][d] += (c[d] || 0));
      }
      return p;
    },{});
    
    const header = ["Key","reads","writes","removes","kb read","kb written"];
    const df = d3Format(".1f");
    
    const rows = Object.keys (keyData)
    .map (k=>{
        return [k,keyData[k].get,keyData[k].set,keyData[k].remove,
          keyData[k].getsize ? df(keyData[k].getsize) : "-" ,
          keyData[k].setsize ? df(keyData[k].setsize) : "-"];
    });

  
    
    // set the selected rows .. controlled in the store
    const selectedItems = dataPlace && dataPlace.selectedItems ?  dataPlace.selectedItems : [];
    const makeSelectedRows = () => {
      return selectedItems
      .map((d)=>Object.keys(keyData).indexOf(d)).filter((d,i)=>i !== -1);
      };
      
    const makeSelectedItems  = (rowSelection) => {
      if (rowSelection === "all") {
        return Object.keys(keyData);
      }
      else if (rowSelection === "none") {
        return [];
      }
      else {
        return (rowSelection || []).map((d,i)=>Object.keys(keyData)[i]);
      }
      
    };
    const tsx =  <XTable
      header = {header}
      rows = {rows}
      displayRowCheckbox = {true}
      selectable={true}
      multiSelectable={true}
      allRowsSelected={true}
      onRowSelection={(rowSelection)=>{

         const ad = acStatsSelectedRows  ( {
          selectedItems:makeSelectedItems(rowSelection), 
          pageResults:"stats"
        });
        if (ad) {
          props.dispatch(ad);
          // and we also need to regenerate the chart data
          const ag = acGenerateSlots();
          if (ag){
            props.dispatch(ag);
          }
        }
        

      }}
      selectedRows = {makeSelectedRows()}
     />;
     
    const csx = <div>
      <XCard 
        initiallyExpanded = {true}
        title = {"Access keys"}
        subtitle = {`Keys active in period for account ${selectedAccount}`}
        content = {tsx}
      />
    </div> ;
    
    return (
      <div>{csx}</div>
    );
    
  }
}





