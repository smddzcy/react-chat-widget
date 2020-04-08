import uuid from 'uuid/v4';
import { createReducer } from '../../utils/store';
import { MESSAGE_SENDER, MESSAGES_TYPES } from '../../constants';

import * as actionTypes from '../actions/actionTypes';
import Widgets from '../../components/Conversation/Widgets';
import { parseWidgetProps } from '../../utils/generic';

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

const initialState = { current: [], widgetState: {} };

const messagesReducer = {
  [actionTypes.ADD_NEW_USER_MESSAGE]: (state, { text, time = Date.now() }) => ({
    ...state,
    current: state.current.concat(createNewMessage(text, MESSAGE_SENDER.CLIENT, time))
  }),

  [actionTypes.ADD_NEW_RESPONSE_MESSAGE]: (state, { payload }) => ({
    ...state,
    current: state.current.concat(createNewMessage(payload.msg, payload.agent || {}, payload.time))
  }),

  [actionTypes.ADD_COMPONENT_MESSAGE]: (state, {
    component, props, options,
  }) => ({
    ...state,
    current: state.current.concat(createComponentMessage(component, props, options))
  }),

  [actionTypes.SET_COMPONENT_MESSAGE_STATE]: (state, {
    id, state: componentState,
  }) => ({
    ...state,
    widgetState: { ...state.widgetState, [id]: { ...state.widgetState[id], ...componentState } },
  }),

  [actionTypes.SET_MESSAGES]: (state, { payload }) => {
    // TODO: show component messages.
    // In order to do this, we must store component info in DB.
    // We don't do that yet.

    // TODO: show initial bot message. either trigger or welcome message.
    const newMessages = payload.messages.map(msg => (
      createNewMessage(msg.msg, msg.isFromAgent ? (msg.agent || {}) : MESSAGE_SENDER.CLIENT, msg.time)
    ));
    return { ...state, [payload.chatId]: newMessages };
  },

  [actionTypes.DROP_MESSAGES]: () => ({ current: [] }),
};

export default (state = initialState, action) => createReducer(messagesReducer, state, action);
