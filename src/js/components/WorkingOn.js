import React from "react";
import XPaper from './XPaper';
import CircularProgress from 'material-ui/CircularProgress';

export default class extends React.Component {

  render () {
    return <XPaper> 
        <CircularProgress /> ... working on  {this.props.workingOn}
    </XPaper>;
  }
  
}
