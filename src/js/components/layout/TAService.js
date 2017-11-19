import React from "react";
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
import { atPing  }  from '../../actions/tutorial';  

export default class  extends React.Component {
  

  handlePing = () => {
    const ad = atPing({
      pageResults:'service'
    });
    if (ad) this.props.dispatch (ad);
  }

  componentDidMount () {
    this.handlePing();
  }
  
  render() {
    
    const props = this.props;
    const pt = props.tutorial.pageResults;    
    const pageResults =  pt && pt.service ;
    const up = pageResults && pageResults.ready && pageResults.commentary.ok;
    const down = pageResults && pageResults.ready && !pageResults.commentary.ok;
    const scs =  <span>{up ? "running" : "service unavailable"}</span>;
    
    const xcs = down ? <XCard 
          initiallyExpanded = {true}
          title = {"Service status"}
          subtitle = {scs}
          content = {<TAGenericResult pageResults={pageResults} />}
        /> : null;

    return xcs;
  }
}
 