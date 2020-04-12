import { createReducer } from '../../utils/store';
import * as actionTypes from '../actions/actionTypes';

export function createQuickButton(button) {
  return ({
    label: button.label,
    value: button.value
  });
}

const initialState = [];

const quickButtonsReducer = {
  [actionTypes.SET_QUICK_BUTTONS]: (state, action) => action.buttons.map(button => createQuickButton(button)),
  [actionTypes.ADD_NEW_USER_MESSAGE]: () => [], // auto reset on a new message
};

export default (state = initialState, action) => createReducer(quickButtonsReducer, state, action);
