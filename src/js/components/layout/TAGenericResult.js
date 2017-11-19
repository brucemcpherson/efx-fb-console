import React from "react";

import TAResponse from './TAResponse';
import TAResponseError from './TAResponseError';
import TARequestConfig from './TARequestConfig';
import TARequest from './TARequest';
import StatusDecorate from '../StatusDecorate';

export default class extends React.Component {


  render() {

    const props = this.props;
    const pr = props.pageResults;
    const commentary = pr && pr.ready ? pr.commentary : null;
    const success = commentary && commentary.ok;
    const hcs =  commentary ? (
      <StatusDecorate ok = {success} >
       <span>Request {success ? 'succeeded':'failed'} - see below for details</span>
      </StatusDecorate>
      
      ) :
      <div>{`Request and response will be shown below`}</div>;

    const xcs = <div>
        <h4>{hcs}</h4>
        <TARequest pageResults ={props.pageResults}/>
        <TARequestConfig pageResults ={props.pageResults}/>
        <TAResponse pageResults ={props.pageResults}/>
        <TAResponseError pageResults ={props.pageResults}/>
      </div>;
      
    return xcs;
 
  }
}
