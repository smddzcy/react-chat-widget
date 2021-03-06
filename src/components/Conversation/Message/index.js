import React from 'react';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import cx from 'classnames';
import isImageUrl from 'is-image-url';
import { length } from 'stringz';
import { MESSAGE_SENDER } from '../../../constants';
import { getTimeString, decorate } from '../../../utils/messages';

import './styles.scss';
// import markdownIt from 'markdown-it';
// import markdownItSup from 'markdown-it-sup';
// import markdownItSanitizer from 'markdown-it-sanitizer';
// import markdownItLinkAttributes from 'markdown-it-link-attributes';

const renderLink = (href, text, key) => <a key={key} href={href} target="_blank" rel="noopener noreferrer nofollow" title={text}>{text}</a>;

const renderTextMsg = text => {
  const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
  const isEmoji = emojiRegex.test(text);

  return (
    <div className={cx(`icw-message-text len-${length(text)}`, { 'is-emoji': isEmoji })}>
      <Linkify componentDecorator={renderLink}>{decorate(text)}</Linkify>
    </div>
  );
};

const renderImageMsg = url => (
  <a href={url} target="_blank" rel="nofollow noopener">
    <div className="icw-message-image" style={{ backgroundImage: `url(${url})` }}>
      <img src={url} alt="" />
    </div>
  </a>
);

const Message = React.memo(({ message }) => {
  const {
    text, child: Child, childProps, sender, time: msgTime,
  } = message;
  const senderClass = sender === MESSAGE_SENDER.CLIENT
    ? MESSAGE_SENDER.CLIENT
    : MESSAGE_SENDER.RESPONSE;

  const { name, title } = sender;
  const senderLabel = [name, title].filter(str => !!str).join(', ');
  const timeString = getTimeString(msgTime);

  return (
    <div className="icw-bubble-container">
      <div className={`icw-${senderClass}`}>
        {Child
          ? <Child {...childProps} />
          : (
            isImageUrl(text) ? renderImageMsg(text) : renderTextMsg(text)
          )}
      </div>
      <div className="icw-bubble-sub">{timeString} {senderLabel && `| ${senderLabel}`}</div>
    </div>
  );
});

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    sender: PropTypes.any,
  }),
};

export default Message;
