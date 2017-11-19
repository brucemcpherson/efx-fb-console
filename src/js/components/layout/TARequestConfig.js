import React from "react";
import XCard from '../XCard';
import TANotExecuted from './TANotExecuted';

export default class  extends React.Component {
  
  render() {
    const pr = this.props.pageResults;
    const config = pr && pr.ready ? pr.things.config : null;
    
    return (
      <span>

        <XCard
          initiallyExpanded = {false}
          expanded = {config ? true:false}
          title={"Request configuration"}
          subtitle = {"the http method"}
          content =
            {config ? <span>
              <div>payload: {config.data ? config.data : "n/a"}</div>
              <div>method: {config.method}</div></span> : 
              <TANotExecuted />}
         />
        </span>
    );
  }
}
