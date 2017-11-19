import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';

import { atFetchQuotas  }  from '../../actions/tutorial';  
import RaisedButton from 'material-ui/RaisedButton';

export default class  extends React.Component {
  


  handleQuotas = () => {
    const ad = atFetchQuotas({
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
                <p>Service quotas shown in API reponse section</p>
              </div>

              <p></p>
              <div>
              <RaisedButton 
                  label="GET QUOTAS" 
                  primary={true} 
                  onClick = {this.handleQuotas}
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
      title={"Quotas"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/quotas`} 
              rows={[
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`Getting the API quotas and limitations`}
      /> ;

  }
}
 