import * as actions from './actionTypes';

export function toggleChat() {
  return {
    type: actions.TOGGLE_CHAT,
  };
}

export function toggleInputDisabled() {
  return {
    type: actions.TOGGLE_INPUT_DISABLED,
  };
}

export function setInputDisabled(payload) {
  return {
    type: actions.SET_INPUT_DISABLED,
    payload,
  };
}

export function setMessages(payload) {
  return {
    type: actions.SET_MESSAGES,
    payload,
  };
}

export function addUserMessage(text) {
  return {
    type: actions.ADD_NEW_USER_MESSAGE,
    text,
  };
}

export function setTyping(payload) {
  return {
    type: actions.SET_TYPING,
    payload
  };
}

export function addResponseMessage(payload) {
  return {
    type: actions.ADD_NEW_RESPONSE_MESSAGE,
    payload,
  };
}

export function renderCustomComponent(component, props, showAvatar, insideBubble = false) {
  return {
    type: actions.ADD_COMPONENT_MESSAGE,
    component,
    props,
    showAvatar,
    insideBubble,
  };
}

export function dropMessages() {
  return {
    type: actions.DROP_MESSAGES,
  };
}

export function setQuickButtons(buttons) {
  return {
    type: actions.SET_QUICK_BUTTONS,
    buttons
  };
}
