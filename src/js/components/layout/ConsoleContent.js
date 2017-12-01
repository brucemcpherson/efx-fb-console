import React from "react";

import cs from '../../constants/params';


import XCard from '../XCard';
import XDialog from '../XDialog';
import XTable from '../XTable';

export default class extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      dialogOpen:false
    };
  }
  


  // add an item - how to do it is inherited from the 
  handleRemove = () => {

    const ad = this.props.removeAction ();
    if (ad) {
      this.props.dispatch (ad);
    }

  }

  // add an item - how to do it is inherited from the 
  handleAdd = () => {

    const ad = this.props.addAction ();        
    if (ad) {
      this.props.dispatch (ad);
    }

  }

  
  render() {
    
    const props = this.props;
    const data = props.data;

    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <span></span>;
    }

    if (!data) {
      return <span>no data</span>;
    }
   
   
    // the row numbers of the selected items
    const selectedRows = this.props.makeSelectedRows ();
    
    // the table header
    const header = props.header;
    
    // the rows of the table
    const rows = props.makeRows (selectedRows);
    
    // the values of the selected items
    const selectedItems = props.makeSelectedItems();
   
    // this is the data table
    const jsx = <XTable
      header = {header}
      rows = {rows}
      displayRowCheckbox = {props.displayRowCheckbox}
      selectedRows = {selectedRows}
      multiSelectable={props.multiSelectable} 
      onRowSelection={(rowSelection)=>{
         props.handleSelection(rowSelection);
      }}
      selectable={true}
     />;

    // the card actions for adding/removing
    
      const cardActions= props.removeAction && props.addAction ? [{
          name:'add',
          action:this.handleAdd.bind(this),
          primary:true,
          disabled: rows.length >= props.maxRows
        },{
          name:'remove',
          action:()=>this.setState ({ dialogOpen:true }),
          secondary:true,
          disabled:rows.length <= this.props.minRows
        }
      ] : null;
    
      const dialogActions = props.removeAction ? [{
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
      
    const table =  <div>{jsx}</div>;
    const content = <span>{props.extraContent}{table}</span>;
    
    const dialog = props.dialogContent ? 
      <XDialog
        content={props.dialogContent (selectedItems || [] )}
        title = {props.dialogTitle}
        actions = {dialogActions}
        open = {this.state.dialogOpen}
        close = {()=>this.setState({dialogOpen:false})}
      /> : <span></span>;
    
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
        {dialog}
      </span>
    );
  }
}