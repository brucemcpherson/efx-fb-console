import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();


const muiTheme = getMuiTheme({
  fontFamily: 'Noto sans, Roboto, sans-serif',
  contentFontFamily: 'Noto sans, Roboto, sans-serif'
});

class App extends React.Component {


  render() {
    var props = this.props;
    let children = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, props);
    });
    return ( 

     <MuiThemeProvider muiTheme={muiTheme}>
        <span>
        {children}
        </span>
      </MuiThemeProvider>

    );
  }
}

export default App;