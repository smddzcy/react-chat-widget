import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Widget from './components/Widget';
import store from '../src/store/store';

Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

const ConnectedWidget = props =>
  <Provider store={store}>
    <Widget
      title={props.title}
      titleAvatar={props.titleAvatar}
      subtitle={props.subtitle}
      handleNewUserMessage={props.handleNewUserMessage}
      senderPlaceHolder={props.senderPlaceHolder}
      showCloseButton={props.showCloseButton}
      fullScreenMode={props.fullScreenMode}
      badge={props.badge}
      autofocus={props.autofocus}
      customLauncher={props.launcher}
      staticText={props.staticText}
      onToggleChat={props.onToggleChat}
      css={props.css}
    />
  </Provider>;

ConnectedWidget.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  senderPlaceHolder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  autofocus: PropTypes.bool,
  launcher: PropTypes.func,
  onToggleChat: PropTypes.func,
  css: PropTypes.string
};

ConnectedWidget.defaultProps = {
  title: '',
  subtitle: '',
  senderPlaceHolder: 'Mesajınızı yazın ve enter\'a basın',
  showCloseButton: true,
  fullScreenMode: false,
  badge: 0,
  autofocus: true
};

export default ConnectedWidget;
