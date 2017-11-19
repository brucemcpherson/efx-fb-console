import React from "react";
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
 

export default class  extends React.Component {

  
  render() {
    
    const props = this.props;
    const pt = props.tutorial.pageResults;    
    const pageResults =  pt && pt.makeEverything ;
    const up = pageResults && pageResults.ready && pageResults.commentary.ok;
    let down = pageResults && pageResults.ready && !pageResults.commentary.ok;
    const scs =  <span>{up ? "Tutorial keys ok" : "couldnt create tutorial keys"}</span>;

    const xcs = down ? <XCard 
          initiallyExpanded = {true}
          title = {"Tutorial keys status"}
          subtitle = {scs}
          content = {<TAGenericResult pageResults={pageResults} />}
        /> : null;

    return xcs;
  }
}
 