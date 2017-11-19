import React from "react";
import YouTube from 'react-youtube';
import TAWrap from '../components/layout/TAWrap';
import Article from '../components/Article';
import XPaper from '../components/XPaper';

export default class extends React.Component {

  // This will reselect the current item if the brower back is selected

  render() {

    return (
      <TAWrap location={this.props.location}>
          <Article 
            title={"Videos"}
            content={
              <span> 
              
                <XPaper>
                <p>
                  A demo of the Ephemeral exchange JSON editor and viewer
                </p>
                <YouTube 
                  videoId="mNEK7n-huOE"
                />
                </XPaper>

              
                <XPaper>
                <p>
                  This short video uses Ephemeral Exchange to allow Google Sheets, Docs and Microsoft Excel to share the same data with
                  a Google Maps Webapp
                </p>
                <YouTube 
                  videoId="Lxh180oqRNc"
                />
                </XPaper>
                
                <XPaper>
                <p>
                  This one builds on the map example and uses Ephemeral Exchange to allow Google Sheets, Docs and Slides to share the same data with
                  a Google Maps Webapp, Maps streetview and the Google Streetview static API. It also features a method for creating 
                  a slide deck using effex data and a Slides template.
                </p>
                <YouTube 
                  videoId="bYpEmKXRqBY"
                />
                 </XPaper>
                <XPaper>
                For more about implementing Ephemeral Exchange see <a href="http://ramblings.mcpher.com/Home/excelquirks/ephemeralexchange">here</a>
                </XPaper>
                
              </span>
            } 
            subtitle={`5 minute demos`}
          /> 
      </TAWrap>
    );
  }
}
