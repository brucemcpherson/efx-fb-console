import React from "react";
import XPaper from '../XPaper';
import CircularProgress from 'material-ui/CircularProgress';


export default class  extends React.Component {
  
  render() {
    const everything = this.props.everything;
    const xcs = !everything || everything.error ? 
      <span>there was an error while preparing the tutorial <p>{this.props.everything.error}</p><p>Please try refreshing</p></span> : 
      <span><CircularProgress /> ...working on fresh keys to play with the tutorial</span>;
    
    return (
      <XPaper>
       {xcs}
      </XPaper>

    );
  }
}
