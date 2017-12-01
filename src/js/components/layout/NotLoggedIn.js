import React from "react";
import XPaper from '../XPaper';


export default class extends React.Component {

  render () {

    return <XPaper> 
      You need to be logged in to access this {this.props.progressingWith}
    </XPaper>;
  }
  
}
