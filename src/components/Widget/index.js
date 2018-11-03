import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { toggleChat, addUserMessage } from "@actions";

import WidgetLayout from "./layout";

class Widget extends Component {
  constructor(props) {
    super(props);
    this.toggleConversation = this.toggleConversation.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode) {
      this.props.dispatch(toggleChat());
    }
  }

  toggleConversation() {
    if (typeof this.props.onToggleChat === "function") {
      this.props.onToggleChat(this.props.showChat);
    }
    this.props.dispatch(toggleChat());
  }

  handleMessageSubmit(event) {
    event.preventDefault();
    const userInput = event.target.message.value;
    if (userInput) {
      this.props.dispatch(addUserMessage(userInput));
      this.props.handleNewUserMessage(userInput);
    }
    event.target.message.value = "";
  }

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        titleAvatar={this.props.titleAvatar}
        subtitle={this.props.subtitle}
        senderPlaceHolder={this.props.senderPlaceHolder}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        badge={this.props.badge}
        autofocus={this.props.autofocus}
        customLauncher={this.props.customLauncher}
        css={this.props.css}
        staticText={this.props.staticText}
      />
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
  titleAvatar: PropTypes.string,
  subtitle: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  senderPlaceHolder: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  autofocus: PropTypes.bool,
  customLauncher: PropTypes.func,
  onToggleChat: PropTypes.func, // called on toggle with the old showChat status
  css: PropTypes.string,
  staticText: PropTypes.string,
};

export default connect(store => ({
  showChat: store.behavior.get("showChat")
}))(Widget);
