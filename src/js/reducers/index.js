import {
  combineReducers
}
from 'redux';

import AuthReducer from './authReducer';
import AccountReducer from './accountReducer';
import TutorialReducer from './tutorialReducer';
import MenuReducer from './menuReducer';
import StatsReducer from './statsReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  accounts: AccountReducer,
  tutorial:TutorialReducer,
  menu:MenuReducer,
  stats:StatsReducer
});

export default rootReducer;
