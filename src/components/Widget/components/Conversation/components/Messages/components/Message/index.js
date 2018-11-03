import React, { PureComponent } from 'react';
import markdownIt from 'markdown-it';
import markdownItSup from 'markdown-it-sup';
import markdownItSanitizer from 'markdown-it-sanitizer';
import markdownItLinkAttributes from 'markdown-it-link-attributes';


import { PROP_TYPES, MESSAGE_SENDER } from '@constants';

import './styles.scss';

class Message extends PureComponent {
  render() {
    const { message} = this.props;
    const sanitizedHTML = markdownIt()
    .use(markdownItSup)
    .use(markdownItSanitizer)
    .use(markdownItLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
    .render(message.get('text'));
    
    const senderClass = message.get('sender') === MESSAGE_SENDER.CLIENT
      ? MESSAGE_SENDER.CLIENT
      : MESSAGE_SENDER.RESPONSE;
    
    const { name, title } = message.get('sender');
    const senderLabel = [name, title].filter(str => !!str).join(', ');
    const time = new Date(message.get('time'));
    const hourMin = time.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    const now = new Date();
    let timeString;
    if (time.toDateString() === now.toDateString()) {
      // today, just show time
      timeString = hourMin;
    } else if (time.getFullYear() === now.getFullYear()) {
      // this year, just show day
      const monthDay = time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      timeString = `${monthDay}, ${hourMin}`;
    } else {
      // show the date
      timeString = time.toLocaleDateString();
    }

    return (
      <div className="rcw-bubble-container">
        <div className={`rcw-${senderClass}`}>
          <div className="rcw-message-text" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </div>
        <div className="rcw-bubble-sub">{timeString} {senderLabel && `| ${senderLabel}`}</div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PROP_TYPES.MESSAGE
};

export default Message;
