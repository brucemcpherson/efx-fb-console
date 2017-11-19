import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';

import { atInfo  }  from '../../actions/tutorial';  
import RaisedButton from 'material-ui/RaisedButton';

export default class  extends React.Component {
  


  handleInfo = () => {
    const ad = atInfo ({
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
                <p>Info about the service will be shown in the API response section</p>
              </div>

              <p></p>
              <div>
              <RaisedButton 
                  label="info" 
                  primary={true} 
                  onClick = {this.handleInfo}
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
      title={"Service info"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/info`} 
              rows={[
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`getting API info`}
      /> ;

  }
}
 