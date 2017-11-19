import React from "react";
import XCard from '../XCard';

export default class TRequest extends React.Component {

  render() {

    const xcs = <span>
      <XCard
        initiallyExpanded = {false}
        expanded = {false}
        title = {"Request Url"}
        subtitle = {"variable mandatory content is shown with : (eg /:key)"}
        content={this.props.requestUrl}
      />,
     </span>;

    return xcs;
  }
}
