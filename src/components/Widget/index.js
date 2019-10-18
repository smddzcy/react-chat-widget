import './public-path';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleChat, addUserMessage, setInputDisabled } from '@actions';

import WidgetLayout from './layout';

class Widget extends PureComponent {
  constructor(props) {
    super(props);
    this.toggleConversation = this.toggleConversation.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isInputDisabled !== this.props.isInputDisabled) {
      this.props.dispatch(setInputDisabled(this.props.isInputDisabled));
    }
  }

  toggleConversation() {
    if (typeof this.props.onToggleChat === 'function') {
      this.props.onToggleChat(this.props.showChat);
    }
    this.props.dispatch(toggleChat());
  }

  handleMessageSubmit(event, isFile) {
    let userInput;
    if (event.target) {
      event.preventDefault();
      userInput = event.target.message.value;
      event.target.message.value = '';
    } else {
      userInput = event;
    }
    if (userInput) {
      this.props.dispatch(addUserMessage(userInput));
      this.props.handleNewUserMessage(userInput, isFile);
    }
  }

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        titleAvatar={this.props.titleAvatar}
        subtitle={this.props.subtitle}
        senderPlaceholder={this.props.senderPlaceholder}
        disabledPlaceholder={this.props.disabledPlaceholder}
        showCloseButton={this.props.showCloseButton}
        badge={this.props.badge}
        customLauncher={this.props.customLauncher}
        css={this.props.css}
        staticText={this.props.staticText}
        triggerContent={this.props.triggerContent}
        showTrigger={this.props.showTrigger}
        showEmojiButton={this.props.showEmojiButton}
        showAttachmentButton={this.props.showAttachmentButton}
      />
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  senderPlaceholder: PropTypes.string,
  disabledPlaceholder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  badge: PropTypes.number,
  customLauncher: PropTypes.func,
  onToggleChat: PropTypes.func, // called on toggle with the old showChat status
  css: PropTypes.string,
  staticText: PropTypes.string,
  isInputDisabled: PropTypes.bool,
  triggerContent: PropTypes.string,
  showTrigger: PropTypes.bool,
  showEmojiButton: PropTypes.bool,
  showAttachmentButton: PropTypes.bool,
};

export default connect(store => ({
  showChat: store.behavior.showChat,
}))(Widget);
