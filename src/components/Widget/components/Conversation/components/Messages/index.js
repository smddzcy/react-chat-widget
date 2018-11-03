import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import PersonIcon from './man.svg';

import { hideAvatar } from '@actions';

import './styles.scss';

class Messages extends Component {
  constructor(props, context) {
    super(props, context);
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.scrollContainer) return;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
  }

  getComponentToRender = message => {
    const ComponentToRender = message.get('component');
    const previousMessage = this.props.messages.get()
    if (message.get('type') === 'component') {
      return <ComponentToRender {...message.get('props')} />;
    }
    return <ComponentToRender message={message} />;
  };

  shouldRenderAvatar = (message, index) => {
    const previousMessage = this.props.messages.get(index - 1);
    if (message.get('showAvatar') && previousMessage.get('showAvatar')) {
      this.props.dispatch(hideAvatar(index));
    }
  }

  render() {
    const { messages } = this.props;
    return (
      <div id="messages" className="rcw-messages-container" ref={node => this.scrollContainer = node}>
        {messages.map((message, index) => {
          const sender = message.get('sender');
          return (
            <div className="rcw-message" key={index}>
              {message.get('showAvatar') &&
                <div className="rcw-avatar" style={{ backgroundImage: `url(${sender.photo || PersonIcon})` }} />
              }
              {this.getComponentToRender(message)}
            </div>
          );
        })}
      </div>
    );
  }
}

Messages.propTypes = {
  messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
};

export default connect(store => ({
  messages: store.messages
}))(Messages);
