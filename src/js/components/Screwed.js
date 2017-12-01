import React from "react";
import XPaper from './XPaper';

export default class extends React.Component {

  render () {
    return <XPaper>
        <div>Unexpected error</div>
        <div>{this.props.screwed}</div>
    </XPaper>;
  }
  
}
