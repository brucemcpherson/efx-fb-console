import React from "react";
import XCard from '../XCard';
import XTable from '../XTable';
export default class  extends React.Component {

  render() {
    const header= ['Parameter','Purpose'];
    const xcs = <span>
      <XCard
        initiallyExpanded = {false}
        expanded = {false}
        title = {"Optional parameters"}
        subtitle = {"can be passed in the uri"}
        content={<XTable 
                  adjustForCheckbox={false} 
                  displaySelectAll={false}
                  header={header}
                  rows={this.props.rows}
                  displayRowCheckbox={false}
              />}
      />,
     </span>;

    return xcs;
  }
}
