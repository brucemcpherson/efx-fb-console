import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';

import { atPing  }  from '../../actions/tutorial';  
import RaisedButton from 'material-ui/RaisedButton';

export default class  extends React.Component {
  


  handlePing = () => {
    const ad = atPing({
      pageResults:this.props.keyType
    });
    if (ad) this.props.dispatch (ad);
  }

  
  render() {


    const props = this.props;
    
    const xcs = 
      <span>
        <XCard 
          initiallyExpanded = {true}
          title = {props.title}
          subtitle ={props.subtitle}
          content = { 
            <span> 
              <p>{props.intro}</p>

              <div>
                <p>Service status will be shown in the API response section</p>
              </div>

              <p></p>
              <div>
              <RaisedButton 
                  label="ping" 
                  primary={true} 
                  onClick = {this.handlePing}
                  disabled = {false}
              />
              </div>
            </span>
          }
        />
      </span>;
        
    // this is where the page results will have been reduced to
    const pt = this.props.tutorial.pageResults;    
    const pageResults =  pt && pt[this.props.keyType] ? pt[this.props.keyType] : null;
    
    return <Article 
      title={"Service check"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/ping`} 
              rows={[
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`pinging the API`}
      /> ;

  }
}
 