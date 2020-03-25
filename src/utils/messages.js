/* eslint-disable no-cond-assign */
import React from 'react';
import flatten from 'lodash/flatten';
import { MESSAGES_TYPES, MESSAGE_SENDER } from '../constants';
import Message from '../components/Conversation/Message';

const Mention = ({ key, name }) => <span key={key} className="mention">@{name}</span>;

export const DECORATE_METHOD = {
  HTML: 'html',
  TEXT: 'text', // return plain text instead of html
};

const decorators = [
  {
    matcher: /<span class="mention" data-id="(.*?)">(.*?)<\/span>/ig,
    decorate: (params, method) => {
      if (method === DECORATE_METHOD.TEXT) {
        return `@${params[2]}`;
      }
      return <Mention name={params[2]} />;
    }
  }
];

export const decorate = (text, method = DECORATE_METHOD.HTML) => {
  let elements = [text];
  const lastIndex = 0;
  decorators.forEach(decorator => {
    elements = elements.map(str => {
      if (typeof str !== 'string') return str; // already decorated component, skip

      const subElements = [];
      let lastIndex = 0;
      let match;
      while ((match = decorator.matcher.exec(str)) != null) {
        if (match.index > lastIndex) {
          subElements.push(str.substring(lastIndex, match.index));
        }

        const decorated = decorator.decorate(match, method);
        subElements.push(decorated);

        lastIndex = match.index + match[0].length;
      }

      // push remaining text if there is any
      if (str.length > lastIndex) {
        subElements.push(str.substring(lastIndex));
      }
      return subElements;
    });
  });

  return flatten(elements);
};

export function createNewMessage(text, sender, time = Date.now()) {
  return {
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text: String(text),
    time,
    sender,
    showAvatar: sender !== MESSAGE_SENDER.CLIENT,
  };
}

export function createComponentMessage(component, props, showAvatar, insideBubble) {
  if (insideBubble) {
    return {
      type: MESSAGES_TYPES.TEXT,
      component: Message,
      child: component,
      childProps: props,
      time: Date.now(),
      sender: MESSAGE_SENDER.RESPONSE,
      showAvatar,
    };
  }
  return {
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    showAvatar,
  };
}

export function getTimeString(msgTime) {
  const time = new Date(msgTime);
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
  return timeString;
}
