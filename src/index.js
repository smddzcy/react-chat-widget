import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import store from './store/store';

Date.prototype.getWeekNumber = function () {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const ConnectedWidget = props => (
  <Provider store={store}>
    <Widget {...props} />
  </Provider>
);

ConnectedWidget.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  senderPlaceholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  badge: PropTypes.number,
  launcher: PropTypes.func,
  onToggleChat: PropTypes.func,
  css: PropTypes.string,
};

ConnectedWidget.defaultProps = {
  title: '',
  subtitle: '',
  showCloseButton: true,
  badge: 0,
};

export default ConnectedWidget;
