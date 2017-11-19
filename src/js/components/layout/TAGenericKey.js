import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import TSBossKey from './TSBossKey';
import XCard from '../XCard';
import { atGenerateKeys  }  from '../../actions/tutorial';  
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import cs from '../../constants/params';


export default class  extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      count:"1",
      errorText:""
    };
  }


  handleTextChange = (event) => {

    const n =  parseInt (event.target.value,10) ;
    if (event.target.value && isNaN(n) || n < 1 || n > cs.tutorial.keyCount) {
      this.setState({
        errorText:"must be a number between 1 and " + cs.tutorial.keyCount
      });
    }
    else {
      this.setState ({
        count:event.target.value,
        errorText:""
      });
    }
  }
  
  handleGenerate = () => {

    this.setState({
      errorText:""
    });

    const ad = atGenerateKeys({
      mode:this.props.keyType,
      params: {
        count:parseInt(this.state.count,10)
      },
      add:true,
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
                <TSBossKey tutorial={this.props.tutorial} />
              </div>
              <div>
                <p>Your {this.state.count} {props.keyType} key(s) will be shown in the API response section</p>
              </div>
              <div>
                <TextField
                  floatingLabelText={`number of ${props.keyType} keys to make`}
                  value = {this.state.count}
                  disabled = {false}
                  errorText = {this.state.errorText}
                  onChange = {this.handleTextChange}
                /> 
              </div>
              <p></p>
              <div>
              <RaisedButton 
                  label="generate" 
                  primary={true} 
                  onClick = {this.handleGenerate}
                  disabled = {this.state.count ? false:true }
              />
              </div>
            </span>
          }
        />
      </span>;
        
    // this is where the page results will have been reduced to
    const pt = this.props.tutorial.pageResults;    
    const pageResults =  pt && pt[props.keyType] ?   pt[props.keyType] : null;
    
    return <Article 
      title={"Access keys"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/:boss/${props.keyType}`} 
              rows={[
                ['count','How many keys to generate'],
                ['seconds','Key liftetime in seconds (specify either the seconds or the days parameter)'],
                ['days','Key lifetime in days (specify either the seconds or the days parameter'],
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`generating ${props.keyType} keys`}
      /> ;

  }
}
 