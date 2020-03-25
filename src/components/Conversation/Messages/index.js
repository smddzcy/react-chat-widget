import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';

import { ReactComponent as BotIcon } from './bot.svg';

import './styles.scss';

const isEqual = (value, other) => {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (['[object String]', '[object Number]', '[object Boolean]'].indexOf(value) !== -1) return value === other;

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = function (item1, item2) {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else { // Otherwise, do a simple comparison
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else if (item1 !== item2) return false;
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i += 1) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

class Messages extends PureComponent {
  messagesCtrRef = React.createRef();

  componentDidMount() {
    // wait for animation to end
    setTimeout(() => {
      this.scrollToBottom();
    }, 200);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.messagesCtrRef.current) return;
    this.messagesCtrRef.current.scrollTop = this.messagesCtrRef.current.scrollHeight;
  }

  getComponentToRender = message => {
    const ComponentToRender = message.component;
    if (message.type === 'component') {
      return <ComponentToRender {...message.props} />;
    }
    return <ComponentToRender message={message} />;
  };

  render() {
    const { messages, typing } = this.props;
    return (
      <div
        id="messages"
        className="icw-messages-container"
        data-scroll-lock-scrollable
        ref={this.messagesCtrRef}
      >
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const showOnlyMessage = nextMessage
            && isEqual(nextMessage.sender, message.sender) // ayni kisi
            && (nextMessage.time - message.time) / 1000 < 60; // mesajlar ayni dakikada gelmis
          return (
            <div className={cx('icw-message', { 'only-message': showOnlyMessage })} key={index}>
              {message.showAvatar
                && (message.sender.photo
                  ? <div className="icw-avatar" style={{ backgroundImage: `url(${message.sender.photo})` }} />
                  : <BotIcon className="icw-avatar" />)}
              {this.getComponentToRender(message)}
            </div>
          );
        })}
        <Loader typing={typing} />
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
};

export default connect((store, ownProps) => ({
  messages: store.messages[ownProps.chatId || 'current'],
  typing: store.behavior.typing,
}))(Messages);
