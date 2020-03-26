import { createReducer } from '../../utils/store';
import { createNewMessage, createComponentMessage } from '../../utils/messages';
import { MESSAGE_SENDER, MESSAGES_TYPES } from '../../constants';

import * as actionTypes from '../actions/actionTypes';

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
