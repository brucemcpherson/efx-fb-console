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
 

export default class  extends React.Component {

  // get all the updater and writer keys for
  // a given data item
  // get any data items that have been created for shared update
  // store result of update in sharedUpdate area
  // get existing values of items selected and populate writeData
  constructor (props) {
    super (props);
    this.state = props.initialState;
    
  }

  componentDidMount () {

    this.propsUpdated (this.props);
  }
  

  /**
   * figures out the list of items that could be displayed for this
   */
  getPotentialItems = (props, state) => {
    const tutorial = this.props.tutorial;
    return state.keyTypes.reduce ((p,c) => {
      if (tutorial.past[c])p.push (...tutorial.past[c]);
      return p;
    } , []);
  }
  

  /**
   * we have some new props
   */
  componentWillReceiveProps (nextProps) {
    
   this.propsUpdated (nextProps);
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
      if (!items.some(d=>d && d.data && d.data.ok && (d.data.id === keyValue || d.data.alias === keyValue)) ) {
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
    });
  }



  executeTouch = () => {
    
    const dispatch = this.props.dispatch;
    // see if we can dispatch
   
    const ad = this.state.dispatchAction ({
      id:this.state.keyValue,
      key:this.state.touchSelected,
      pageResults:this.state.pageResults
    });
    if (ad) {
      dispatch (ad);
    }
    

  }

 
  render() {

    const props = this.props;
    const itemList = this.getPotentialItems (this.props, this.state);
    
    // generate any options from the past that can be used for this
    // reduce to id
    const options = itemList.filter(d=>d.data && d.data.ok)
    .map(d=> (d.data.alias ||d.data.id)) 
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

            </span>
          }
          cardActions = {[{
            name:this.state.verb,
            action:this.executeTouch,
            primary:true,
            disabled:!( this.state.keyValue && this.state.touchSelected)
          }]}
        />;
        
    // this is where the page results will have been reduced to
    const pt = this.props.tutorial.pageResults;    
    const pageResults =  pt && pt[this.state.pageResults] ?   pt[this.state.pageResults] : null;
   
    return (

        <Article 
          title={this.props.itemTitle}
          content={
            <span>
              {xcs}

              <TAGenericResult pageResults={pageResults} />
              <TAGenericReference 
                requestUrl={this.state.requestUrl} 
                rows={[
                  ['callback','Provide a callback function name to request a JSONP response']
                ]}
              />
              
            </span>
            
            } 
          subtitle={`${this.state.verb} ${this.props.itemSubtitle}`}
        />  

    );
  }
}
 