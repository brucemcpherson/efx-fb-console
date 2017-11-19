import React from "react";
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
 

export default class  extends React.Component {

  
  render() {
    
    const {props} = this;
    const {pageResults} = props; 
    
    const up = pageResults && pageResults.ready && pageResults.commentary.ok;
    const down = pageResults && pageResults.ready && !pageResults.commentary.ok;
    const scs =  <span>{up ? "running" : "service unavailable"}</span>;
    
    const xcs = down ? <XCard 
          initiallyExpanded = {true}
          title = {"Failure details"}
          subtitle = {scs}
          content = {<TAGenericResult pageResults={pageResults} />}
        /> : null;

    return xcs;
  }
}
 