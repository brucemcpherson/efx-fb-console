import React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class extends React.Component {

  render() {

    const headers = this.props.header.map((d, i) => {
      return <TableHeaderColumn key={i}>{d}</TableHeaderColumn>;
    });

    const rows = this.props.rows.map((d, i) => {
      const sel = this.props.selectedRows && this.props.selectedRows.indexOf(i) !==-1;
      return <TableRow key={i} selected={sel}>{
                d.map ( (e,j) => {
                  return <TableRowColumn key={j}>{e}</TableRowColumn>;
                })};
              </TableRow>;
    });
    
    if (!headers.length) return null;
    // theres a bug in this that means it doesnt respect selected row
    // to get round it you can change the key of the table each time
    const tableKey = new Date().getTime();
    const xcs =
      <Table  style={{tableLayout: 'auto'}} fixedHeader={false} 
        key={tableKey}
        multiSelectable={this.props.multiSelectable} 
        onRowSelection={this.props.onRowSelection} 
        selectable={this.props.selectable}
        allRowsSelected={this.props.allRowsSelected}>
        
        
        <TableHeader 
          adjustForCheckbox={this.props.displayRowCheckbox} 
          displaySelectAll={this.props.displayRowCheckbox}
          enableSelectAll={this.props.displayRowCheckbox}
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
