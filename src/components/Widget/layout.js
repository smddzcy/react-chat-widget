import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Frame from 'react-frame-component';

import Conversation from './components/Conversation';
import Launcher from './components/Launcher';
import './style.scss';

const WidgetLayout = props => {
  const initialFrameContent = `<!DOCTYPE html><html><head><style>body{margin:0;padding: 0;font-family:-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}${props.css}</style></head><body><div></div></body></html>`;
  return (
    <div className={`rcw-widget-container ${props.showChat ? 'rcw-opened' : ''}`}>
      <Frame initialContent={initialFrameContent} id="infoset-conv-frame">
        <style>{props.css}</style>
        {props.showChat &&
          <Conversation
            title={props.title}
            subtitle={props.subtitle}
            staticText={props.staticText}
            sendMessage={props.onSendMessage}
            senderPlaceHolder={props.senderPlaceHolder}
            toggleChat={props.onToggleConversation}
            showChat={props.showChat}
            showCloseButton={props.showCloseButton}
            disabledInput={props.disabledInput}
            titleAvatar={props.titleAvatar}
          />
        }
      </Frame>
      <Frame initialContent={initialFrameContent} id="infoset-btn-frame">
        {props.customLauncher ?
          props.customLauncher(props.onToggleConversation) :
          <Launcher
            toggle={props.onToggleConversation}
            badge={props.badge}
          />}
      </Frame>
    </div>
  );
};

WidgetLayout.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  onSendMessage: PropTypes.func,
  onToggleConversation: PropTypes.func,
  showChat: PropTypes.bool,
  senderPlaceHolder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  badge: PropTypes.number,
  customLauncher: PropTypes.func,
  css: PropTypes.string,
  staticText: PropTypes.string,
};

export default connect(store => ({
  showChat: store.behavior.get('showChat'),
  disabledInput: store.behavior.get('disabledInput')
}))(WidgetLayout);
