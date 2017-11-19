import React from "react";
import XCard from '../XCard';

import { ResponsiveContainer,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; 
import {  extent as d3Extent, max as d3Max } from 'd3-array';
import {  scaleLinear as d3ScaleLinear,  scaleTime as d3ScaleTime} from 'd3-scale'; 
import {  format as d3Format } from 'd3-format';

export default class extends React.Component {



  render() {
    
    const props = this.props;

    // we'll use the selected account later
    const place = props.accounts.pageResults.accounts;
    const selectedAccount = place.selectedItems ? place.selectedItems[0] : "";
    const slotPlace = props.stats.pageResults.stats;
    const slotData = slotPlace ? slotPlace.slotData : [];
    
    let theChart;
    if (slotData && slotData.length) {

      // get the d3 domain, so we can make nice labels
      const domain = d3Extent (slotData, d=>new Date(d.start)); 
      const tScale = d3ScaleTime().domain(domain).range([0, 1]);
      const tickFormat = tScale.tickFormat();

      
      // do the same thing for the kb scale
      const kbDomain = [0, d=>d3Max([d.setsize,d.getsize])];
      const kbScale = d3ScaleLinear().domain(kbDomain).range([0, 1]);
      const kbTickFormat = kbScale.tickFormat(5,d3Format(".1f"));
    
     
      theChart = <div style={{width:"100%",height:400}}>
      <ResponsiveContainer>
      < LineChart 
        data = {slotData}
        margin = {{top: 20,right: 30,left: 20, bottom: 5}} >
        
          < XAxis 
            dataKey = "start"
            tickFormatter = {tickFormat}
          /> 
  
          < YAxis 
            label ={"Operations"}
            yAxisId = "left"
            orientation = "left"
            stroke = "#9E9E9E" 
          / >
  
          < YAxis 
            label ={"Volume"}
            yAxisId = "right"
            orientation = "right"
            stroke = "#9E9E9E" 
            tickFormatter = {kbTickFormat}
            
          / >
  
          < CartesianGrid strokeDasharray = "3 3" / >
          < Tooltip / >
          < Legend / >
  
          < Line 
              type = "monotone"
              yAxisId = "left"
              dataKey = "get"
              stroke = "#795548" 
              name = "reads"
          />
  
  				< Line 
              type = "monotone"
              yAxisId = "left"
              dataKey = "set"
              stroke = "#FF5722" 
              name = "writes"
          />
  
          < Line 
              type = "monotone"
              yAxisId = "left"
              dataKey = "remove"
              stroke = "#4CAF50" 
              name = "removes"
          />
  
          < Line 
              type = "monotone"
              yAxisId = "right"
              dataKey = "getsize"
              stroke = "#795548"
              strokeDasharray="3 4 5 2"
              name="KB read"
          />
          
          < Line 
              type = "monotone"
              yAxisId = "right"
              dataKey = "setsize"
              stroke = "#FF5722" 
              strokeDasharray="3 4 5 2"
              name="KB written"
          />      
        < /LineChart></ResponsiveContainer></div>;
    }
    else {
      theChart=<span></span>;
    }

    const chartJsx = <span>
      {theChart}
    </span>;
   
    // now render  .. this calls a generalized version so there are quite a few props
    return  ( 
      <XCard
        title = {`Api usage for account ${selectedAccount}`}
        subtitle = {`all access keys`}
        content = {chartJsx}
        initiallyExpanded={true}
    />);
  }
}