import React from "react";
import XCard from '../XCard';
import JSONTree from 'react-json-tree';
import TANotExecuted from './TANotExecuted';


export default class extends React.Component {
  
  render() {
    const pr = this.props.pageResults;
    const commentary = pr && pr.ready ? pr.commentary : null;
    const success = commentary && commentary.ok;
    const error = commentary && !commentary.ok;
    const subtitle = success ? "Request was successful" : (error ? "Request failed" : "whether API call succeeded");
    return (

        <span>
        <XCard
          initiallyExpanded = {false}
          expanded = {error}
          title={"Error report"}
          subtitle={subtitle}
          content = 
            {commentary  ? 
              <span><JSONTree 
                data={commentary} 
                invertTheme={true}
                theme={"google"}
                hideRoot={true}
                shouldExpandNode={ (keyName, data, level) => true}
              /></span> : <TANotExecuted />}
         />
        </span>

    );

  }
}
