import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
import XSelect from '../XSelect';
import { atValidateKey, getTutorialKeys  }  from '../../actions/tutorial';  
import RaisedButton from 'material-ui/RaisedButton';

export default class  extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      keyValue:"",
      allKeys:[]
    };
  }


  handleValidate = () => {

    const ad = atValidateKey({
      key:this.state.keyValue,
      pageResults:this.props.keyType
    });

    if (ad) this.props.dispatch (ad);
  }
  
  
  getAllKeys = (props) => {
    const past = props.tutorial.past;
    return Object.keys(past)
    .reduce ((p,c) =>  {
      if (c && c.length) {
        p.push (...getTutorialKeys (props,c));
      }
      return p;
    },[]);  
  }
  
  componentWillReceiveProps (nextProps) {
    this.gotNewStuff (nextProps);
  }
  
  componentDidMount () {
    this.gotNewStuff (this.props);
  }
  
  gotNewStuff = (props) => {
    const allKeys =  this.getAllKeys(props);
  
    if (allKeys.length && !this.state.keyValue) {
      this.setState({
        keyValue:allKeys[0],
        allKeys:allKeys
      });
    }
    else {
      this.setState({
        allKeys:allKeys
      });
    }
    
  };
  
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
                <XSelect 
                  options={this.state.allKeys}
                  label = {`Select a key to validate`}
                  value={this.state.keyValue} 
                  onChange={(value) => this.setState({keyValue:value})}
                />
              <div>
                <p>Key validation results for {this.state.keyValue} will be shown in the API response section</p>
              </div>

              <p></p>
              <div>
              <RaisedButton 
                  label="validate" 
                  primary={true} 
                  onClick = {this.handleValidate}
                  disabled = {this.state.keyValue ? false:true }
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
      title={"Access keys"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/validate/:key`} 
              rows={[
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`validating keys`}
      /> ;

  }
}
 