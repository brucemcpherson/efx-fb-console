import React from "react";

import Article from '../Article';
import XPaper from '../XPaper';
import XTable from '../XTable';
import Handy from '../../utils/handy';
export default class extends React.Component {

  // This will reselect the current item if the brower back is selected

  render() {
    
    // short cut for href maker
    const ah = Handy.ah;

    const rows = [
      ["node client", "npm install effex-api-client", ah("https://github.com/brucemcpherson/efx-fb-api-client")],
      ["latest js client", "https://efxapi.com/scripts/efx.min.js", ah("https://github.com/brucemcpherson/efx-fb-api-client")],
      ["rest api endpoint", "https://efxapi.com/v2", ah("https://github.com/brucemcpherson/efx-fb-api-client")],
      ["api documentation", ah("https://github.com/brucemcpherson/efx-fb-api-client/blob/master/README.md","api docs"), 
        ah("https://github.com/brucemcpherson/efx-fb-api-client")],
      ["apps script library", "19rhki6VDTWk4v1RDb6u1d5E-nNaQq8sXCnRnFzUpp4V4lmZ9Z6R_PP9n", 
      ah("https://github.com/brucemcpherson/cEffexApiClient")],
      ["vba client", "tba", "tba"],
      ["more info","articles and videos" , ah("http://ramblings.mcpher.com/Home/excelquirks/ephemeralexchange","blogpost")]
    ];
    
    const tsx = <XTable
      header = {["what","where","github"]}
      rows = {rows}
      displayRowCheckbox = {false}
      selectedRows = {[]}
      multiSelectable={false} 
      selectable={false}
     /> ;
     
    return (

      <Article 
        title={"Useful locations"}
        subtitle={"api client software and info"}
        content={<XPaper>{tsx}</XPaper>}
    /> 
  );
}
}
