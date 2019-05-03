import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import Message from '@messagesComponents/Message';

import BotIcon from './bot.svg';

import './styles.scss';

class Messages extends PureComponent {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onScrollContainerScroll = ev => {
    const $this = this.scrollContainer;
    const { scrollTop, scrollHeight } = $this;
    const height = $this.clientHeight;
    const delta = -ev.nativeEvent.deltaY;
    if (!delta || Number.isNaN(delta)) return;
    const up = delta > 0;

    const prevent = () => {
      ev.stopPropagation();
      ev.preventDefault();
      ev.returnValue = false;
      return false;
    };

    if (!up && -delta > scrollHeight - height - scrollTop) {
      // srolling down, but this will take us past the bottom
      $this.scrollTop = scrollHeight;
      return prevent();
    } if (up && delta > scrollTop) {
      // scrolling up, but this will take us past the top
      $this.scrollTop = 0;
      return prevent();
    }
  }

  scrollToBottom() {
    if (!this.scrollContainer) return;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  getComponentToRender = message => {
    const ComponentToRender = message.component;
    if (message.type === 'component') {
      return <ComponentToRender {...message.props} />;
    }
    return <ComponentToRender message={message} />;
  };

  render() {
    const { messages } = this.props;
    return (
      <div id="messages" className="icw-messages-container" ref={node => this.scrollContainer = node} onWheel={this.onScrollContainerScroll}>
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const showOnlyMessage = nextMessage
            && isEqual(nextMessage.sender, message.sender) // ayni kisi
            && (nextMessage.time - message.time) / 1000 < 60; // mesajlar ayni dakikada gelmis
          return (
            <div className={cx('icw-message', { 'only-message': showOnlyMessage })} key={index}>
              {message.showAvatar
                && <div className="icw-avatar" style={{ backgroundImage: `url(${message.sender.photo || BotIcon})` }} />
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
  messages: PropTypes.arrayOf(PropTypes.object),
};

export default connect(store => ({
  messages: store.messages,
}))(Messages);
