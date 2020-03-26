import './public-path';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  toggleChat, addUserMessage, setInputDisabled, setMessages
} from '../../store/actions';

import WidgetLayout from './layout';
import GlobalContext from '../GlobalContext';

class Widget extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = { showPreviousChatId: null };
  }

  componentDidMount() {
    // send initial input status
    this.props.dispatch(setInputDisabled(this.props.isInputDisabled));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isInputDisabled !== this.props.isInputDisabled) {
      this.props.dispatch(setInputDisabled(this.props.isInputDisabled));
    }
  }

  toggleChat = () => {
    if (typeof this.props.onToggleChat === 'function') {
      this.props.onToggleChat(this.props.showChat);
    }
    this.props.dispatch(toggleChat());
  }

  handleMessageSubmit = (event, isFile) => {
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

  openConversation = chatId => {
    const conversation = this.props.prevConversations.find(conv => conv.chatId === chatId);
    this.props.dispatch(setMessages({ chatId, messages: conversation.messages }));
    this.setState({ showPreviousChatId: chatId });
    this.props.switchToPage('previous_conversation');
  }

  handleQuickButtonClick = (event, value) => {
    event.preventDefault();
    if (this.props.handleQuickButtonClick) {
      this.props.handleQuickButtonClick(value);
    }
  }

  render() {
    const ctxValues = {
      showEmojiButton: this.props.showEmojiButton,
      showAttachmentButton: this.props.showAttachmentButton,
      badge: this.props.badge,
      translation: this.props.translation,
      language: this.props.language,
      sendMessage: this.props.handleNewUserMessage,
      openUrl: this.props.openUrl,
      SharedWidget: this.props.SharedWidget,
    };
    return (
      <GlobalContext.Provider value={ctxValues}>
        <WidgetLayout
          toggleChat={this.toggleChat}
          onSendMessage={this.handleMessageSubmit}
          title={this.props.title}
          subtitle={this.props.subtitle}
          disabledPlaceholder={this.props.disabledPlaceholder}
          onQuickButtonClicked={this.handleQuickButtonClick}
          showCloseButton={this.props.showCloseButton}
          customLauncher={this.props.customLauncher}
          css={this.props.css}
          staticText={this.props.staticText}
          triggerContent={this.props.triggerContent}
          showTrigger={this.props.showTrigger}
          switchToPage={this.props.switchToPage}
          homepage={this.props.homepage}
          showPage={this.props.showPage}
          showUrl={this.props.showUrl}
          closeUrl={this.props.closeUrl}
          openConversation={this.openConversation}
          prevConversations={this.props.prevConversations}
          showPreviousChatId={this.state.showPreviousChatId}
        />
      </GlobalContext.Provider>
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  handleQuickButtonClick: PropTypes.func,
  translation: PropTypes.object,
  language: PropTypes.string,
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
  homepage: PropTypes.object,
  showPage: PropTypes.string,
  showUrl: PropTypes.string,
  openUrl: PropTypes.func,
  closeUrl: PropTypes.func,
  switchToPage: PropTypes.func,
  prevConversations: PropTypes.array,
  SharedWidget: PropTypes.object,
};

export default connect(store => ({
  showChat: store.behavior.showChat,
}))(Widget);
