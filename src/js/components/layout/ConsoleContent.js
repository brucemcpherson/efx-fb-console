import React from "react";

import cs from '../../constants/params';

import {
  acAccountsSelectedRows,
}
from '../../actions/index';


import XCard from '../XCard';
import XDialog from '../XDialog';
import XTable from '../XTable';
import CircularProgress from 'material-ui/CircularProgress';

export default class extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      dialogOpen:false
    };
  }
  
  dispatchSelection (rows,data) {

    // we'll also dispatch again to force a re-render if all boxes are unticked
    const props = this.props;
    const pageResults = props.pageResults;
    const selectedItems = props.makeSelectedItems (rows, data);
    const ad = acAccountsSelectedRows  ( {
      selectedItems, 
      pageResults
    });
    
    if (ad) {
      props.dispatch(ad);
    }
    
    if (this.props.extraDispatch) {
      this.props.extraDispatch (selectedItems);
    }
    

  }

  handleRemove = () => {
    
    const pp = this.props.accounts.pageResults;
    const selectedItems = pp.accounts.selectedItems || [];
    const selectedBosses = pp.bosses.selectedItems || [];
    if (selectedItems.length  && this.props.auth.uid) {
      const ad = this.props.removeAction ({
        accountId:selectedItems[0] || "",
        bossKeys:selectedBosses,
        uid:this.props.auth.uid,
        pageResults:this.props.pageResults+"Remove"
      });        
      if (ad) {
        this.props.dispatch (ad);
      }
    }
    
  }


  handleAdd = () => {

    const pageResults=this.props.pageResults;
    const pp = this.props.accounts.pageResults["accounts"];
    const selectedItems = pp.selectedItems || [];
    const selectedOb = pp.data[selectedItems[0]];
    const accountPlan = selectedOb && selectedOb.planId;
    if (this.props.auth.uid) {
      const ad = this.props.addAction ({
        uid:this.props.auth.uid,
        pageResults:pageResults+"Add",
        accountId:selectedItems[0],
        planId:accountPlan
      });        
      if (ad) {
        this.props.dispatch (ad);
      }
    }
    
  }

  
  render() {
    
    const props = this.props;

    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <span></span>;
    }
    const pageResults=this.props.pageResults;
    const pp = props.accounts.pageResults[pageResults];
    const data = pp.data;
    if (!data) {
      return <span></span>;
    }
    
    // set the selected rows .. controlled in the store
    const selectedItems = pp.selectedItems || [];
    const header = props.header;
    const rows = props.makeRows (selectedItems || [], data);
   
    const jsx = <XTable
      header = {header}
      rows = {rows}
      displayRowCheckbox = {true}
      selectedRows = {this.props.makeSelectedRows (selectedItems,data)}
      multiSelectable={this.props.multiSelectable} 
      onRowSelection={(rowSelection)=>{
         this.dispatchSelection(rowSelection,data);
      }}
      selectable={true}
     />;

    // the card actions for adding/removing
    
      const cardActions= this.props.removeAction && this.props.addAction ? [{
          name:'add',
          action:this.handleAdd.bind(this),
          primary:true,
          disabled: rows.length >= this.props.maxRows
        },{
          name:'remove',
          action:()=>this.setState ({ dialogOpen:true }),
          secondary:true,
          disabled:rows.length <= this.props.minRows
        }
      ] : null;
    
      const dialogActions = this.props.removeAction ? [{
          name:'remove',
          action:()=>{
            this.setState({dialogOpen:false}); 
            this.handleRemove(); 
          }, 
          secondary:true,
          disabled: false
        },{
          name:'cancel',
          action:()=>this.setState ({ dialogOpen:false }),
          disabled:false
        }
      ] : null;
      
    const table =  
      <div>{rows.length || !this.props.spinner ? jsx : <CircularProgress />}</div>;

    const content = <span>{props.extraContent}{table}</span>;
    
    // now render  
    return  (
      <span>
        <XCard 
          initiallyExpanded={true}
          title={props.title}
          subtitle={props.subtitle}
          content={content}
          cardActions ={cardActions}
        />

        <XDialog
          content={this.props.dialogContent (selectedItems || [] )}
          title = {this.props.dialogTitle}
          actions = {dialogActions}
          open = {this.state.dialogOpen}
          close = {()=>this.setState({dialogOpen:false})}
        />
      </span>
    );
  }
}