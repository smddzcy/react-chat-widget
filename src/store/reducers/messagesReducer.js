import { createReducer } from '@utils/store';
import { createNewMessage, createComponentMessage } from '@utils/messages';
import { MESSAGE_SENDER } from '@constants';

import * as actionTypes from '../actions/actionTypes';

const initialState = [];

const messagesReducer = {
  [actionTypes.ADD_NEW_USER_MESSAGE]: (state, { text, time = Date.now() }) => state.concat(createNewMessage(text, MESSAGE_SENDER.CLIENT, time)),

  [actionTypes.ADD_NEW_RESPONSE_MESSAGE]: (state, { payload }) => state.concat(createNewMessage(payload.msg, payload.agent || {}, payload.time)),

  [actionTypes.ADD_COMPONENT_MESSAGE]: (state, {
    component, props, showAvatar, insideBubble,
  }) => state.concat(createComponentMessage(component, props, showAvatar, insideBubble)),

  [actionTypes.DROP_MESSAGES]: () => [],
};

export default (state = initialState, action) => createReducer(messagesReducer, state, action);
