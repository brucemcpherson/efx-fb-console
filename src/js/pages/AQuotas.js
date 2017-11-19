import React from "react";
import TAQuotas from '../components/layout/TAQuotas';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAQuotas
          keyType = {"quotas"}
          title={"Service quotas"} 
          subtitle = {
            `The API can be used to find out which quotas it enforces`
          }
          intro = {
            `Quotas are applied across an account, so each account you create has its own usage statistics and quota limitations.
            Each plan has a different set of quotas. The free plan (a) is the only one generally available for now, but 
            more options may be available later. You'll notice that
            activity is measured over different periods to allow for short, uninterupted bursts of usage. 
            If you do happen to bust a quota during use, the API response 
            will show you the usage for each measurement and which one(s) have been 
            exceeded.`
          }
        />
      </TAWrap>
    );
  }
}

      