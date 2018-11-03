import { List } from 'immutable';

import { createReducer } from '@utils/store';
import { createNewMessage, createLinkSnippet, createComponentMessage } from '@utils/messages';
import { MESSAGE_SENDER } from '@constants';

import * as actionTypes from '../actions/actionTypes';

const initialState = List([]);

const messagesReducer = {
  [actionTypes.ADD_NEW_USER_MESSAGE]: (state, { text, time = Date.now() }) =>
    state.push(createNewMessage(text, MESSAGE_SENDER.CLIENT, time)),

  [actionTypes.ADD_NEW_RESPONSE_MESSAGE]: (state, { payload }) =>
    state.push(createNewMessage(payload.msg, payload.agent || {}, payload.time)),

  [actionTypes.ADD_NEW_LINK_SNIPPET]: (state, { link }) =>
    state.push(createLinkSnippet(link, MESSAGE_SENDER.RESPONSE)),

  [actionTypes.ADD_COMPONENT_MESSAGE]: (state, { component, props, showAvatar }) =>
    state.push(createComponentMessage(component, props, showAvatar)),

  [actionTypes.DROP_MESSAGES]: () => List([]),

  [actionTypes.HIDE_AVATAR]: (state, { index }) =>
    state.update(index, message => message.set('showAvatar', false))
}

export default (state = initialState, action) => createReducer(messagesReducer, state, action);
