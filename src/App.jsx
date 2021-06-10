import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PrintIcon from '@material-ui/icons/Print';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import RestoreIcon from '@material-ui/icons/Restore';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import TuneIcon from '@material-ui/icons/Tune';
import Lex from './Lex';
import LL1 from './LL1'
import LR1 from './LR1'
import OPA from './OPA'
import LALR from './LALR'

const useStyles = makeStyles({
    root: {
      width: 500,
    },
  });

class App extends React.Component{

    constructor(props){
        super(props);
        this.state={
            value:0,
        }
    }

      
    render(){
        return (
            <div>
                <BottomNavigation value={this.state.value} 
                    onChange={(event, newValue) => {
                        console.log(newValue);
                        this.setState({
                            value:newValue
                        })
                    }}
                    showLabels
                >
                    <BottomNavigationAction label="Lex" icon={<PrintIcon />} />
                    <BottomNavigationAction label="LL1" icon={<AllInclusiveIcon />} />
                    <BottomNavigationAction label="LR1" icon={<RestoreIcon />} /> 
                    <BottomNavigationAction label="OPA" icon={<FilterCenterFocusIcon />} />
                    <BottomNavigationAction label="LALR" icon={<TuneIcon />} />
                </BottomNavigation>
                {(() => {
                    switch (this.state.value) {
                        case 0:
                            return <Lex />;
                        case 1:
                            return <LL1 />;
                        case 2:
                            return <LR1 />;
                        case 3:
                            return <OPA />;
                        case 4:
                            return <LALR />;
                        default:
                            return null;
                    }
                })()}
            </div>
            
        
          );
    }
}

export  default App
