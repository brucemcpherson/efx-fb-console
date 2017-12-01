/**
 * handy things
 */
import React from "react";
const Handy = (function(ns) {
    
    // populate store with initial values (there are none)
    ns.sortKeys = (data, reverse) => {
      return Object.keys(data || {}).sort ((a,b)=>(a > b ? 1 : (a < b ? -1 : 0))*(reverse ? -1 : 1));
    };

    ns.ah = (link, text) => {
      const l = link ;
      const t = text || link;
      return <span><a target="_blank" href={l}>{t}</a></span>;
    };
    
    return ns;
})({});

export default Handy;
 
