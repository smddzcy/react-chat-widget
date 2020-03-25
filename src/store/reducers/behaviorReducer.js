import { createReducer } from '../../utils/store';

import * as actionTypes from '../actions/actionTypes';

const initialState = { showChat: false, disabledInput: false, msgLoader: false };

const behaviorReducer = {
  [actionTypes.TOGGLE_CHAT]: state => ({ ...state, showChat: !state.showChat }),

  [actionTypes.TOGGLE_INPUT_DISABLED]: state => ({ ...state, disabledInput: !state.disabledInput }),

  [actionTypes.SET_INPUT_DISABLED]: (state, { payload }) => ({ ...state, disabledInput: payload }),

  [actionTypes.TOGGLE_MSG_LOADER]: state => ({ ...state, msgLoader: !state.msgLoader }),
};

export default (state = initialState, action) => createReducer(behaviorReducer, state, action);
