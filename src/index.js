import React from 'react';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import store from './store/store';

// NOTE: In case of a wrong "React hook" error, just run:
// npm link ../chat-widget/node_modules/react
// see: https://github.com/facebook/react/issues/15315#issuecomment-479802153

const ConnectedWidget = props => (
  <Provider store={store}>
    <Widget {...props} />
  </Provider>
);

ConnectedWidget.defaultProps = {
  title: '',
  subtitle: '',
  showCloseButton: true,
  badge: 0,
};

ConnectedWidget.store = store;

export default ConnectedWidget;
