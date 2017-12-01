import React from "react";
import JsonEditorKeys from './JsonEditorKeys';
import JsonEditorPanel from './JsonEditorPanel';
import TAGenericResult from './TAGenericResult';

import XCard from '../XCard';
import XClipboard from '../XClipboard';
import {  atReadJsonItem  , atJsonKeys , atGetSomeKeys, atWriteJsonItem, atUpdateJsonItem, atRemoveJsonItem }  from '../../actions/tutorial';
import cs from '../../constants/params';
import NotLoggedIn from './NotLoggedIn';


export default class  extends React.Component {
  

  /// waiting for 0.4 - that might fix this problem and make this work properly
  componentDidMount = () => {
    // if lint is set to true before component mounts, it fails, so wait till it mounts before setting the option
    this.setDefaults (this.props);
  }
  
  generateKeys = () => {
    
    const dispatch = this.props.dispatch;
    // see if we can dispatch
   
    const ad = atGetSomeKeys ({
      boss:this.props.tutorial.jsonKeys.boss,
      pageResults:"jsonKeyResults"
    });
    if (ad) {
      dispatch (ad);
    }
    
    
  }
  
  changeKey = (pack) => {
    
    const dispatch = this.props.dispatch;
    // see if we can dispatch
   
    const ad = atJsonKeys(pack);
    if (ad) {
      dispatch (ad);
    }
    
  }
  
  executeRead = () => {
    
    const dispatch = this.props.dispatch;
    const jk = this.props.tutorial.jsonKeys;
    const ad = atReadJsonItem ({
      id:jk.alias || jk.item,
      key:jk.reader.split(",")[0] || jk.updater.split(",")[0] || jk.writer,
      pageResults:"jsonItemResults"
    });
    if (ad) {
      dispatch (ad);
    }
    
  }
  
  executeRemove = () => {
    
    const dispatch = this.props.dispatch;
    const jk = this.props.tutorial.jsonKeys;
    const ad = atRemoveJsonItem ({
      id:jk.alias || jk.item,
      key:jk.writer,
      pageResults:"jsonItemResults"
    });
    if (ad) {
      dispatch (ad);
    }
    
  }
  
  executeUpdate= () => {
    
    const dispatch = this.props.dispatch;
    const jk = this.props.tutorial.jsonKeys;
    // see if we can dispatch
    var ar = {
      id:jk.alias || jk.item,
      key:jk.updater.split(",")[0] || jk.writer,
      pageResults:"jsonItemResults",
      data:this.props.tutorial.jsonKeys.code
    };

    const ad = atUpdateJsonItem (ar);
    if (ad) {
      dispatch (ad);
    }

    
  }
  
  executeWrite = () => {
    
    const dispatch = this.props.dispatch;
    // see if we can dispatch
    var ar = {
      alias:this.props.tutorial.jsonKeys.alias,
      key:this.props.tutorial.jsonKeys.writer,
      pageResults:"jsonItemResults",
      data:this.props.tutorial.jsonKeys.code,
    };
    var params = {};
    if (this.props.tutorial.jsonKeys.updater) {
      params.updaters = this.props.tutorial.jsonKeys.updater;
    }
    if (this.props.tutorial.jsonKeys.reader) {
      params.readers = this.props.tutorial.jsonKeys.reader;
    }
    if (Object.keys(params).length) {
      ar.params = params;
    }
    const ad = atWriteJsonItem (ar);
    if (ad) {
      dispatch (ad);
    }
    
  }
  
  /**
   * this will set up some tutorial keys
   * for demo purposes
   */
  setDefaults = (props) => {
    // shortcuts
    const pt = props.tutorial;

    // see if we want to use defaults -- they'll only be applied once
    if (!pt.usedDefaults && pt.past.aliassharedUpdate) {
      const au = pt.past.aliassharedUpdate[0];

      // if we dont have any key data, then use tutorial stuff
      if (au && au.data && au.data.ok && !Object.keys(pt.jsonKeys).some (k=>pt.jsonKeys[k])){
        this.changeKey ({type:'usedDefaults', value:true});
        this.changeKey ({type:'writer',value:au.data.writer});
        this.changeKey ({type:'reader',value:au.data.key});
        this.changeKey ({type:'updater',value:au.data.key});
        this.changeKey ({type:'item',value:au.data.id});
        this.changeKey ({type:'alias',value:au.data.alias});
      }

    }
    
  }
  
  
  render() {

    // shortcuts
    const props = this.props;

    if (props.auth.status !== cs.status.AUTH_LOGGED_IN) {
      return <NotLoggedIn place="dashboard"/>;
    }
    
    const pt = props.tutorial;

    // this is where the page results will have been reduced to
    const pr = pt.pageResults;   
    const pageResults =  pr && pr.jsonItemResults || null;
    

    // careful not to render until component is mounted else it will fail
    const xed = <JsonEditorPanel
      editorCode={pt.jsonKeys.code}
      updateCode={(code)=>this.changeKey ({type:'code',value:code})}
    />;
    
    // the code to render & keys to use
    const data = pt.jsonKeys.code;
    const keys = pt.jsonKeys;
    
    // some handy to read this with
    
    // get the data item if all was ok and latest operation was not a delete
    const bd = pageResults && pageResults.things && pageResults.things.data && 
      pageResults.things.data.ok && pageResults.things.data.code !== 204 && pageResults.things.data ;
   
    const idWith =  bd && (bd.alias || bd.id);
    const baseUrl = pageResults && pageResults.things && pageResults.things.config && pageResults.things.config.baseURL;
    const st = {verticalAlign:"middle"};
    
    const linkWith =  ['reader','updater','writer'].map ((d,i)=>{
      let k = idWith && baseUrl &&  keys[d].split(",")[0];
      return k ? <tr key={i} ><td style={st}>{d}</td><td style={st}><XClipboard content={`${baseUrl}/reader/${k}/${idWith}`} /></td></tr>: "";
    }).filter (d=>d);
    
    const links = linkWith.length ?
      <XCard
        title={"Links"}
        subtitle={"Copy these links to access your item"}
        content={<table><tbody>{linkWith}</tbody></table>}
      /> : "";
   
    return <span>

      <table style={{width:"100%"}}><tbody>
        <tr>
        
          
          <td style={{width:"%50",verticalAlign:"top"}}>
            <XCard 
              initiallyExpanded = {true}
              title = {"JSON editor and validator"}
              subtitle ={"Prepare or read store data here"}
              content = {xed} 
              cardActions = {[{
                  name:'read',
                  action:this.executeRead,
                  primary:true,
                  disabled: !( keys.reader && (keys.item || keys.alias) ) || (pageResults&&pageResults.active)
                },{
                  name:'write',
                  action:this.executeWrite,
                  primary:true,
                  disabled:(!data || !keys.writer ) || (pageResults&&pageResults.active)
                },
                {
                  name:'update',
                  action:this.executeUpdate,
                  primary:true,
                  disabled:(!data || !(keys.updater && (keys.item || keys.alias) )) || (pageResults&&pageResults.active)
                },
                {
                  name:'remove',
                  action:this.executeRemove,
                  secondary:true,
                  disabled:(!( keys.writer && (keys.item || keys.alias) )) || (pageResults&&pageResults.active)
                }
              ]}
            />
          </td>
          
          <td style={{width:"50%",verticalAlign:"top"}}>
            <JsonEditorKeys 
              title ={"Keys to access store"} 
              subtitle={"Use existing access keys, or generate some here"}
              jsonKeys = {props.tutorial.jsonKeys}
              changeKey = {this.changeKey}
              accounts= {props.accounts}
              dispatch = {props.dispatch}
              stats = {props.stats}
              generateKeys = {this.generateKeys}
              pageResults = {props.tutorial.pageResults.jsonKeyResults}
              handleAccountSelection = {props.handleAccountSelection}
            /> 
          </td>
          
        </tr>
      </tbody></table>
      {links}
      <TAGenericResult pageResults={pageResults} />
    </span>;
  }
}
 