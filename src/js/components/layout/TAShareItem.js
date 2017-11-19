// Tutorial page for shared data updating
// will generate data items and keys as required to demo
// read action will get the selected item, using the selected key
// and display the result in the standard format
import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
import XSelect from '../XSelect';
import { atWriteItem }  from '../../actions/tutorial';  
import TextField from 'material-ui/TextField';

export default class  extends React.Component {

  // get all the updater and writer keys for
  // a given data item
  // get any data items that have been created for shared update
  // store result of update in sharedUpdate area
  // get existing values of items selected and populate writeData
  constructor (props) {
    super (props);
    this.state = {
      // the keys to use to access the item
      touchSelected:{
        writer:"",
        reader:"",
        updater:""
      },
      // the kind of keys that can be used to share
      touchCollections:["reader","updater"],
      // the type of items that can be used for this page
      keyTypes:["shared","sharedUpdate"],
      // generalize some of the verbiage
      verb:"write",
      // where to put the results of the the update
      pageResults:"shared",
      // the method to use for writing 
      method:"POST",
      // the data to write
      writeData:"some data to be shared"
    };
  }


  /**
   * figures out the list of keys that can be used 
   * to share this item with
   */
  getPotentialKeys = (props, collections) => {
    const tutorial = this.props.tutorial;
    
    return collections.reduce ((p,c) => {
      p[c] = tutorial.past[c].reduce ((tp,tc) => {
        const keys = tc.data.keys || [tc.data.key];
        if (!keys) {
          console.log('coundnt find keys in ', tc);
        }
        tp.push(...keys);
        return tp;
      } ,[]).reverse();
      return p;
    } , {});
    
  }
  

  /**
   * we have some new props
   */
  componentWillReceiveProps (nextProps) {
   this.propsUpdated (nextProps);
  }

  componentDidMount () {
   this.propsUpdated (this.props);
  }
  /**
   * props are receeived and need to potentially adjust the components
   */
  propsUpdated = (nextProps) => {
    
    const keysOb = this.getPotentialKeys (nextProps ,this.state.touchCollections );
    const writer = this.getPotentialKeys (nextProps,["writer"]).writer;
    const con = {...keysOb,writer};
    
    const touchSelected = this.state.touchSelected;
    
    // set defaults for selected keys as they arrive.
    Object.keys (con)
    .forEach (function (d) {
        if (!touchSelected[d] && con[d] && con[d].length) {
          touchSelected[d] = con[d][0];
        }
    });
    this.setState ({touchSelected});
   
  }
  

  executeTouch = () => {
    
    const dispatch = this.props.dispatch;
    
    const ad = atWriteItem ({
      key:this.state.touchSelected.writer,
      method:this.state.method,
      data:this.state.writeData,
      pageResults:this.state.pageResults,
      params:{
        readers:this.state.touchSelected.reader,
        updaters:this.state.touchSelected.updater
      },
      add:true
    });

    if (ad) dispatch (ad);
  }
  


  handleTextChange = (event) => {

    this.setState ({
      writeData:event.target.value,
    });
    
  }  
  handleKeyChange = (value , keyType) => {
    const touchSelected = this.state.touchSelected;
    touchSelected[keyType] = value;
    this.setState({touchSelected});
  }
 
  render() {

    const props = this.props;
    const state = this.state;
    
    // keys of these types can be selected to share with
    const keyObs = this.getPotentialKeys(props,state.touchCollections);
    const writerObs = this.getPotentialKeys(props,["writer"]);
    
    // make a list for the writer key
    const writers = 
      <XSelect  
        options={writerObs ? writerObs.writer:null}
        label = {`A writer key to create item with`}
        value={this.state.touchSelected.writer} 
        onChange={value=>{this.handleKeyChange(value,"writer")}}
      />;
    
    // make a list for each type
    const selects = Object.keys(keyObs).map ((d,i) => {
      return <div key={i}>
        <XSelect  
          options={keyObs[d]}
          label = {`A ${d} key to share with`}
          value={this.state.touchSelected[d]} 
          onChange={value=>{this.handleKeyChange(value,d)}}
        />
      </div>;
    });
   
   const xcs=
    <XCard 
      initiallyExpanded = {true}
      title = {props.title}
      subtitle ={props.subtitle}
      content = { 
        <span> 
         <p>You'll be able to use the reader and updater key you select here to access the data item later.  An item can be shared
         by including readers or updaters optional parameters</p>
         {writers}
         {selects} 
          <div>  
            <XSelect 
                options={["POST","GET"]}
                label = {'http method'}
                value={this.state.method} 
                onChange={(value) => this.setState ({method:value})}
              />
          </div>
          <div>
            <TextField
              floatingLabelText={`Provide some data to write`}
              value = {this.state.writeData}
              disabled = {false}
              onChange = {this.handleTextChange}
              multiLine = {true}
              style={{width:"100%"}}
            /> 
          </div>
          
        </span>
      }
      cardActions = {[{
        name:this.state.verb,
        action:this.executeTouch,
        primary:true,
        disabled:!(this.state.writeData && Object.keys(this.state.touchSelected).every(d=>this.state.touchSelected[d]))
      }]}
    />;
    // this is where the page results will have been reduced to
    const pt = this.props.tutorial.pageResults;    
    const pageResults =  pt && pt[this.state.pageResults] ?   pt[this.state.pageResults] : null;
    
    return (

        <Article 
          title={"Shared data items"}
          content={
            <span>
              {xcs}

              <TAGenericResult pageResults={pageResults} />
              <TAGenericReference 
                requestUrl={`/writer/:writerkey`} 
                rows={[
                  ['data','If GET is used (rather than POST), this parameter can be used to specify the data to be written'],
                  ['readers',"A comma separated list of reader keys that can read this item. The writer key can also read the item and does not need to be on this list"],
                  ['updaters','A comma separated list of updater keys that can read or update this item. The writer key can also update the item and does not need to be on this list'],
                  ['lifetime','Lifetime in seconds of the data item, after which it will expire'],
                  ['callback','Provide a callback function name to request a JSONP response']
                ]}
              />
              
            </span>
            
            } 
          subtitle={`${this.state.verb} a shared data item`}
        />  

    );
   

  
  }
}
 