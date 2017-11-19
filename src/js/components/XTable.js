import React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class extends React.Component {

  render() {

    const headers = this.props.header.map((d, i) => {
      return <TableHeaderColumn key={i}>{d}</TableHeaderColumn>;
    });
    
    const rows = this.props.rows.map((d, i) => {
      return <TableRow key={i} selected={this.props.selectedRows && this.props.selectedRows.indexOf(i) !==-1}>{
                d.map ( (e,j) => {
                  return <TableRowColumn key={j}>{e}</TableRowColumn>;
                })};
              </TableRow>;
    });
    
    if (!headers.length) return null;
    
    const xcs =
      <Table           
        multiSelectable={this.props.multiSelectable} 
        onRowSelection={this.props.onRowSelection} 
        selectable={this.props.selectable}
        allRowsSelected={this.props.allRowsSelected}>
        
        <TableHeader
          adjustForCheckbox={this.props.displayRowCheckbox} 
          displaySelectAll={this.props.displaySelectAll}
        >
        <TableRow>{headers}</TableRow>
        </TableHeader>
        
        <TableBody 
          displayRowCheckbox={this.props.displayRowCheckbox}
          deselectOnClickaway={false} >
          {rows}
        </TableBody>
          
      </Table>;

    return xcs;
  }
}
