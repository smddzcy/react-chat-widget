import { MESSAGES_TYPES, MESSAGE_SENDER } from '../constants';
import Message from '../components/Conversation/Message';

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
