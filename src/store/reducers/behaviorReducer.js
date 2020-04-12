import { createReducer } from '../../utils/store';

import * as actionTypes from '../actions/actionTypes';

const initialState = { showChat: false, disabledInput: false, typing: false };

const behaviorReducer = {
  [actionTypes.TOGGLE_CHAT]: state => ({ ...state, showChat: !state.showChat }),

  [actionTypes.TOGGLE_INPUT_DISABLED]: state => ({ ...state, disabledInput: !state.disabledInput }),

  [actionTypes.SET_INPUT_DISABLED]: (state, { payload }) => ({ ...state, disabledInput: payload }),

  [actionTypes.SET_TYPING]: (state, { payload }) => ({ ...state, typing: payload }),
  [actionTypes.ADD_NEW_RESPONSE_MESSAGE]: state => ({ ...state, typing: false }), // auto reset on a new response
  [actionTypes.ADD_COMPONENT_MESSAGE]: state => ({ ...state, typing: false }), // auto reset on a new response
};

export default (state = initialState, action) => createReducer(behaviorReducer, state, action);
