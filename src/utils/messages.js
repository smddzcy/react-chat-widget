import { MESSAGES_TYPES, MESSAGE_SENDER } from '@constants';

import Message from '@messagesComponents/Message';

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

export function createComponentMessage(component, props, showAvatar) {
  return {
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    showAvatar,
  };
}
