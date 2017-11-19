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
import {  atUpdateItem , atReadItem , atClearResult}  from '../../actions/tutorial';  
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
      // the key to use to access the item
      touchSelected:"",
      // the kind of keys that can be found in the item to use
      touchCollections:["updaters","writer","key"],
      // the type of items that can be used for this page
      keyTypes:["sharedUpdate","aliassharedUpdate","aliasitem"],
      // the selected item key to use
      keyValue:"",
      // a list of keys that have been derived as able to touch the item
      touchers:[],
      // generalize some of the verbiage
      verb:"update",
      // the data that has to be written back
      writeData:"",
      // the method to use for writing
      method:"POST",
      // where to put the results of the the update
      pageResults:"sharedUpdate",
      // a list of item objects that are able to be selected from
      items:[],
      // the key of the last item that was used to provide default values to writeData
      writeValueApplied:"",
      // where to to put the results of gettin the default value for writeData
      tempResults:"tempResults"
    };
  }

  componentDidMount () {
    this.propsUpdated (this.props);
    this.getCurrentValue();
  }
  
  componentWillUnmount () {

    // clear the last tempresult so we dont use it again
    const ad = atClearResult({
      pageResults:this.state.tempResults
    });
    if (ad) {
      this.props.dispatch(ad);
    }
    // and make sure we get a new one
    this.setState ({
      writeValueApplied:""
    });
  }
  componentDidUpdate (prevProps, prevState){
    // if the selected item has changed, go and get its current value
    if (this.state.keyValue !== prevState.keyValue) {
      this.getCurrentValue();
    }
  }

  /**
   * figures out the list of items that could be displayed for this
   */
  getPotentialItems = (props, state) => {
    const tutorial = this.props.tutorial;
    return state.keyTypes.reduce ((p,c) => {
      p.push (...tutorial.past[c]);
      return p;
    } , []);
  }
  

  /**
   * we have some new props
   */
  componentWillReceiveProps (nextProps) {
    
   this.propsUpdated (nextProps);
   
   // and we also need to set the writeData if we have a new incoming item
   const nt = nextProps.tutorial.pageResults[this.state.tempResults];
   const nextId =  (nt && nt.ready && nt.things.data && nt.things.data.id) ? nt.things.data.id : "";
   if (nextId && nextId !== this.state.writeValueApplied ) {
     this.setState({
       writeData:nt.things.data.value,
       writeValueApplied:nextId
     });
   }
  }

  /**
   * props are receeived and need to potentially adjust the components
   */
  propsUpdated = (nextProps) => {

    // first set up the potential items
    const items = this.getPotentialItems(nextProps , this.state);
    // and set these  for later
    this.setState ({
      items
    });
    
    // next if there is a selected item, make sure it still exists
    let keyValue = this.state.keyValue;
    if (!keyValue && items.length && items[0].data && items[0].data.ok) {
      keyValue = items[0].data.alias || items[0].data.id;
    }
    else {
      // check that its still an existing key for this item
      if (!items.some(d=>d && d.data && d.data.ok && (d.data.alias === keyValue || d.data.id === keyValue)) ) {
        keyValue = "";
      }
    }
    
    this.setState ({
      keyValue
    });

    const item = items.length ? items.filter (d=>d.data && d.data.ok && (d.data.alias === keyValue || d.data.id === keyValue))[0] : null;
    
    // and then add the touchers
    let touchers;
    if (!item) {
      this.setState ({
        keyValue:""
      });
      touchers = [];
    }
    else {
      touchers = this.state.touchCollections.reduce ((p,c) => {
        const keys = item.data[c];
        if (keys) {
          p.push (... Array.isArray(keys) ? keys : [keys]);
        }
        return p;
      },[]);
    }
    
    // hold that thought
    this.setState ({
      touchers
    });

    // sort out the selected value
    let touchSelected = this.state.touchSelected;
    
    //maybe its no longer valid
    if (touchers.indexOf(touchSelected) === -1) {
      touchSelected = "";
    }
    
    // set it to default if its no good now
    if (!touchSelected && touchers.length) {
      touchSelected = touchers[0];
    }


    // hold that though too
    this.setState ({
      touchSelected
    });
  }
  
  /**
   * called when the item changes
   * need to go off and get the new set of keys that can touch
   */
  handleItemChange = (value) => {
    this.setState ({keyValue:value} , ()=>{
      this.propsUpdated (this.props);
      this.setState ({
        writeValue:""
      });
    });
  }
  
  /**
   * get the current value of the seleced dataitem
   */
  getCurrentValue =() =>{
    
    // see if we can dispatch
    if (this.state.keyValue && this.state.touchSelected) {
      const ad = atReadItem ({
        id:this.state.keyValue,
        key:this.state.touchSelected,
        pageResults:this.state.tempResults
      });
      if (ad) {
        this.props.dispatch (ad);
      }
    }
  }

  handleTextChange = (event) => {

    this.setState ({
      writeData:event.target.value,
    });
    
  }


  executeTouch = () => {
    
    const dispatch = this.props.dispatch;
    
    const ad = atUpdateItem ({
      id:this.state.keyValue,
      key:this.state.touchSelected,
      method:this.state.method,
      data:this.state.writeData,
      pageResults:this.state.pageResults
    });

    if (ad) dispatch (ad);
  }
  
 
  
 
  render() {

    const props = this.props;
    const itemList = this.getPotentialItems (this.props, this.state);
    
    // generate any options from the past that can be used for this
    // reduce to id
    const options = itemList.filter(d=>d.data && d.data.ok)
    .map(d=>d.data.alias || d.data.id) 
    .slice()
    .reverse();
    
    const xcs = 
      
        <XCard 
          initiallyExpanded = {true}
          title = {props.title}
          subtitle ={props.subtitle}
          content = { 
            <span> 
              <p>{props.intro}</p>
              <div>
                <XSelect 
                  options={options}
                  label = {`Select an item key to ${this.state.verb}`}
                  value={this.state.keyValue} 
                  onChange={this.handleItemChange}
                />
              </div>

              <div>
                <XSelect
                  options={this.state.touchers}
                  label={`Select a key to ${this.state.verb} it with`}
                  onChange={(value) => this.setState ({touchSelected:value})}
                  value = {this.state.touchSelected}
                />

              </div>
              
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
                  floatingLabelText={`Provide some data to ${this.state.verb}`}
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
            disabled:!(this.state.writeData && this.state.keyValue && this.state.touchSelected)
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
                requestUrl={`/updater/:key/:itemid`} 
                rows={[
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
 