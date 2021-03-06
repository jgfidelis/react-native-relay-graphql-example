import React from 'react';
import { StackNavigator } from 'react-navigation';

import PeopleListNavigator from './src/navigators/PeopleListNavigator';
import PersonDetailNavigator from './src/navigators/PersonDetailNavigator';

// Fix for Android - It wasn't fetching the data properly when NOT in debug mode
// https://github.com/facebook/relay/issues/1704
(function(PolyfillSet) {
  if (!PolyfillSet) {
    return;
  }
  var testSet = new PolyfillSet();
  if (testSet.size === undefined) {
    if (testSet._c.size === 0) {
      Object.defineProperty(PolyfillSet.prototype, 'size', {
        get: function() {
          return this._c.size;
        },
      });
    }
  }
})(require('babel-runtime/core-js/set').default);

const SWCharactersApp = StackNavigator(
  {
    PeopleListNavigator: { screen: PeopleListNavigator },
    PersonDetailNavigator: { screen: PersonDetailNavigator },
  },
  {
    initialRouteName: 'PeopleListNavigator',
  },
);

export default () => <SWCharactersApp />;
