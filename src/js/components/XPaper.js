import React from "react";
import Paper from 'material-ui/Paper';


export default class extends React.Component {
  render() {
    return ( <Paper style={{...this.props.style,margin:8,padding:8}}>{this.props.children}</Paper>);
  }
}