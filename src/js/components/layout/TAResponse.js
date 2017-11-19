import React from "react";
import XCard from '../XCard';
import JSONTree from 'react-json-tree';
import TANotExecuted from './TANotExecuted';

export default class extends React.Component {
  
  render() {
    const pr = this.props.pageResults;
    const data = pr && pr.ready ? pr.things.data : null;

    return (
        <span>
        <XCard
          initiallyExpanded = {false}
          expanded = {data ? true:false}
          title={"API response"}
          subtitle={"response object received"}
          content =
            {data  ? 
              <span><JSONTree 
                data={data} 
                invertTheme={true}
                theme={"google"}
                hideRoot={true}
                shouldExpandNode={ (keyName, data, level) => true}
              /></span> : 
              <TANotExecuted />}
         />
        </span>

    );
  }
}
