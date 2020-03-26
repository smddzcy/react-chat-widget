/* eslint-disable no-cond-assign */
import React, { useContext } from 'react';
import QuickButton from '../components/Conversation/QuickButtons/components/QuickButton';
import { MESSAGES_TYPES, MESSAGE_SENDER, MESSAGE_BOX_SCROLL_DURATION } from '../constants';
import Message from '../components/Conversation/Message';
import Widgets from '../components/Conversation/Widgets';
import { setInputDisabled, setCustomComponentState } from '../store/dispatcher';
import GlobalContext from '../components/GlobalContext';
import DecorateWidget from '../components/Conversation/Widgets/components/DecorateWidget';

const Mention = ({ key, name }) => <span key={key} className="mention">@{name}</span>;

const WidgetPreview = () => {
  // TODO: specific labels for each widget type
  const { translation } = useContext(GlobalContext);
  return (<i>{translation.widget.interactiveElement}</i>);
};

export const DECORATE_METHOD = {
  HTML: 'html',
  TEXT: 'text', // return plain text instead of html
};

const parseWidgetProps = str => {
  let props = {};
  try { props = JSON.parse(decodeURIComponent(str) || '{}'); } catch (_) {}
  return props;
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
  },
  {
    matcher: /<widget\s+type=(?:["'])(.*?)(?:["'])\s+props=(?:["'])(.*?)(?:["'])\s*\/>/ig,
    decorate: (params, method) => {
      // inline widget
      if (method === DECORATE_METHOD.TEXT) {
        return <WidgetPreview type={params[1]} />;
      }
      let Component = Widgets[params[1]];
      if (Component) {
        Component = DecorateWidget(Component);
        const props = parseWidgetProps(params[2]);
        return <Component {...props} />;
      }
      // widget doesn't exist, just print the string
      return params[0];
    }
  }
];

export const decorate = (text, method = DECORATE_METHOD.HTML) => {
  let elements = [text];
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
    }).flat(1);
  });

  return elements;
};

const widgetMessageMatcher = /<widget\s+type=(?:["'])(.*?)(?:["'])\s+props=(?:["'])(.*?)(?:["'])\s*\/>/i;
export function createNewMessage(text, sender, time = Date.now()) {
  if (sender !== MESSAGE_SENDER.CLIENT) {
    const widgetMatch = text.match(widgetMessageMatcher);
    if (widgetMatch && Widgets[widgetMatch[1]]) {
      const [_, type, propsStr] = widgetMatch;
      const props = parseWidgetProps(propsStr);
      props.id = props.id || uuid();
      return createComponentMessage(Widgets[type], props, { insideBubble: !!props.insideBubble, showAvatar: !!props.showAvatar, icwWidget: true });
    }
  }

  return {
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text: String(text),
    time,
    sender,
    showAvatar: sender !== MESSAGE_SENDER.CLIENT,
  };
}

export function createComponentMessage(component, props, options) {
  if (options.insideBubble) {
    return {
      type: MESSAGES_TYPES.TEXT,
      component: Message,
      child: component,
      childProps: props,
      time: Date.now(),
      sender: MESSAGE_SENDER.RESPONSE,
      ...options,
    };
  }

  return {
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    ...options,
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

/**
 * Easing Functions
 * @param {*} t timestamp
 * @param {*} b begining
 * @param {*} c change
 * @param {*} d duration
 */
function sinEaseOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

/**
 *
 * @param {*} target scroll target
 * @param {*} scrollStart
 * @param {*} scroll scroll distance
 */
function scrollWithSlowMotion(target, scrollStart, scroll) {
  const raf = window.webkitRequestAnimationFrame || window.requestAnimationFrame;
  let start = null;
  const step = timestamp => {
    if (!start) {
      start = timestamp;
    }
    const stepScroll = sinEaseOut(timestamp - start, 0, scroll, MESSAGE_BOX_SCROLL_DURATION);
    const total = scrollStart + stepScroll;
    target.scrollTop = total;
    if (total < scrollStart + scroll) {
      raf(step);
    }
  };
  raf(step);
}

export function scrollToBottom(messagesDiv) {
  if (!messagesDiv) return;
  const screenHeight = messagesDiv.clientHeight;
  const { scrollTop } = messagesDiv;

  const scrollOffset = messagesDiv.scrollHeight - (scrollTop + screenHeight);

  scrollOffset && scrollWithSlowMotion(messagesDiv, scrollTop, scrollOffset);
}


export function createQuickButton(button) {
  return ({
    component: QuickButton,
    label: button.label,
    value: button.value
  });
}

export const uuid = () => {
  let uuid = ''; let i; let random;
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-';
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
};
