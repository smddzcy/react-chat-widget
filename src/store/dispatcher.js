import store from './store';
import * as actions from './actions';

export function addUserMessage(text) {
  store.dispatch(actions.addUserMessage(text));
}

export function addResponseMessage(payload) {
  store.dispatch(actions.addResponseMessage(payload));
}

export function addLinkSnippet(link) {
  store.dispatch(actions.addLinkSnippet(link));
}

export function renderCustomComponent(component, props, showAvatar = false) {
  store.dispatch(actions.renderCustomComponent(component, props, showAvatar));
}

export function toggleWidget() {
  store.dispatch(actions.toggleChat());
}

export function toggleInputDisabled() {
  store.dispatch(actions.toggleInputDisabled());
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}

export function isWidgetOpened() {
  return store.getState().behavior.get('showChat');
}
