import store from './store';
import * as actions from './actions';

export function addUserMessage(text) {
  store.dispatch(actions.addUserMessage(text));
}

export function addResponseMessage(payload) {
  store.dispatch(actions.addResponseMessage(payload));
}

export function renderCustomComponent(component, props, options) {
  store.dispatch(actions.renderCustomComponent(component, props, options));
}

export function setCustomComponentState(id, state) {
  store.dispatch(actions.setCustomComponentState(id, state));
}

export function setTyping(payload) {
  store.dispatch(actions.setTyping(payload));
}

export function toggleWidget() {
  store.dispatch(actions.toggleChat());
}

export function toggleInputDisabled() {
  store.dispatch(actions.toggleInputDisabled());
}

export function setInputDisabled(payload) {
  store.dispatch(actions.setInputDisabled(payload));
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}

export function isWidgetOpened() {
  return store.getState().behavior.showChat;
}

export function setQuickButtons(buttons) {
  store.dispatch(actions.setQuickButtons(buttons));
}
