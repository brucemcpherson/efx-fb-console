import React from "react";
import YouTube from 'react-youtube';
import Handy from '../utils/handy';
import Article from '../components/Article';
import XPaper from '../components/XPaper';
import Locations from '../components/layout/Locations';
import MenuWrapper from '../components/layout/MenuWrapper';

export default class extends React.Component {

  // This will reselect the current item if the brower back is selected

  render() {

    return (
      <MenuWrapper location={this.props.location}>
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
                <p>
                  This one builds on the map example and uses Ephemeral Exchange to work with Google Cloud functions, Google Maps 
                  and Apps Script to demonstrate efx push notification capability. It creates random pub crawls in various areas.
                </p>
                <YouTube 
                  videoId="-NrWbeGkKIk"
                />
                
                 </XPaper>
                 <XPaper>
                 <p>
                  This one builds on the map example and uses Ephemeral Exchange to work with Google Cloud functions, Google Maps 
                  and Apps Script to demonstrate efx push notification capability. It creates random pub crawls in various areas.
                  
                </p>

                <YouTube 
                  videoId="nWZ8Bgt2U5c"
                />
                </XPaper>

                <XPaper>
                  <Locations />
                 </XPaper>
           

                 
                <XPaper>
                For more about implementing Ephemeral Exchange see {Handy.ah ("http://ramblings.mcpher.com/Home/excelquirks/ephemeralexchange","here")}

                </XPaper>
                
              
                
              </span>
            } 
            subtitle={`5 minute demos`}
          /> 
      </MenuWrapper>
    );
  }
}
