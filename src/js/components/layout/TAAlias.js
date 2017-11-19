import React from "react";
import Article from "../Article";
import TAGenericReference from './TAGenericReference';
import TAGenericResult from './TAGenericResult';
import XCard from '../XCard';
import XSelect from '../XSelect';
import { atRegisterAlias  }  from '../../actions/tutorial';  
import TextField from 'material-ui/TextField';

export default class  extends React.Component {
  
 constructor (props) {
    super (props);
    this.state = {

      //writer key to use for the selected item
      writer:"",
      // the key to assign the alias to
      touchSelected:"",
      // the kind of keys that can be found in the item to use
      touchCollections:["updaters","writer","readers"],
      // the type of items that can be used for this page
      keyTypes:["sharedUpdate","item","shared"],       
      // the selected item key to use
      keyValue:"",
      // a list of keys that have been derived as able to touch the item
      touchers:[],

      // alias name to assign
      aliasName:"myalias-"+new Date().getTime().toString(32).slice(-4),
      // the method to use for writing
      method:"GET",
      // where to put the results of the the update
      pageResults:"alias",
      // a list of item objects that are able to be selected from 
      items:[],
      // where to to put the results of temporary get
      tempResults:"tempResults"
    };
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

  handleAlias = () => {

    const ad = atRegisterAlias({
      writer:this.state.writer,
      id:this.state.keyValue,
      key:this.state.touchSelected,
      pageResults:this.state.pageResults,
      alias:this.state.aliasName,
      add:true,
      dupCheck:"alias"
    });

    if (ad) this.props.dispatch (ad);
  }
  
  
  componentWillReceiveProps (nextProps) {
    this.gotNewStuff (nextProps);
  }
  
  componentDidMount () {
    this.gotNewStuff (this.props);
  }
  
  gotNewStuff = (props) => {
    
    // any of these can be aliased
    const items = this.getPotentialItems(props , this.state);
    // and set these  for later
    this.setState ({
      items
    });
    
    // next if there is a selected item, make sure it still exists
    let keyValue = this.state.keyValue;
    if (!keyValue && items.length && items[0].data && items[0].data.ok) {
      keyValue = items[0].data.id;
    }
    else {
      // check that its still an existing key for this item
      if (!items.some(d=>d && d.data && d.data.ok && d.data.id === keyValue) ) {
        keyValue = "";
      }
    }
    this.setState ({
      keyValue
    });
    
    // refind the item that's selected
    const item = items.length ? items.filter (d=>d.data && d.data.ok && d.data.id === keyValue)[0] : null;
    
    // and then add the touchers of that item
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

    
    // sort out the selected key value
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
    
    // finally we need the writer key
    this.setState ({
      writer:item ? item.data.writer : ""
    });
  }
 
  
  handleItemChange = (value) => {
    
    this.setState ({
      keyValue:value
    }, 
    ()=> {
      this.gotNewStuff  (this.props);
    });
    
  }
  
  handleAliasChange = (event) => {
    
    this.setState ({
      aliasName:event.target.value
    });
  }
  
  render() {

    const props = this.props;
    const itemList = this.state.items
    .filter (d=>d.data && d.data.ok)
    .map(d=>d.data.id)
    .reverse();
 
    const xcs = <XCard 
      initiallyExpanded = {true}
      title = {props.title}
      subtitle ={props.subtitle}
      content = { 
        <span> 
          <p>{props.intro}</p>
          
          <div>
            <XSelect 
              options={itemList}
              label = {`Select an item to alias`}
              value={this.state.keyValue} 
              onChange={this.handleItemChange}
            />
          </div>

          <div>
            <XSelect
              options={this.state.touchers}
              label={`Select a key to assign to`}
              onChange={(value) => this.setState ({touchSelected:value})}
              value = {this.state.touchSelected}
            />
          </div>

          <div>
            <TextField
              floatingLabelText={`Provide an alias name`}
              value = {this.state.aliasName}
              disabled = {false}
              onChange = {this.handleAliasChange}
            />
          </div>
          
          <div>
            <TextField
              floatingLabelText={`Writer key to authorize alias`}
              value = {this.state.writer}
              disabled = {true}
            />
          </div>
          
        </span>
      }
      cardActions = {[{
        name:'make alias',
        action:this.handleAlias,
        primary:true,
        disabled:!(this.state.aliasName && this.state.keyValue && this.state.touchSelected && this.state.writer)
      }]}
    />;
       
        
    // this is where the page results will have been reduced to
    const pt = this.props.tutorial.pageResults;    
    const pageResults =  pt && pt[this.state.pageResults] ? pt[this.state.pageResults] : null;
    
    return <Article 
      title={"Aliases"}
      content={
        <span>
          {xcs}

          <TAGenericResult pageResults={pageResults} />
          <TAGenericReference 
              requestUrl={`/:writerkey/:key/alias/:alias/:id`} 
              rows={[
                ['seconds','Key liftetime in seconds (specify either the seconds or the days parameter)'],
                ['days','Key lifetime in days (specify either the seconds or the days parameter'],
                ['callback','Provide a callback function name to request a JSONP response']
              ]}
          />
              
          </span>
            
        } 
        subtitle={`aliases for data items`}
      /> ;

  }
}
 