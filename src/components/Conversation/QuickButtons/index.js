import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuickButton from './components/QuickButton';

import './style.scss';

class QuickButtons extends Component {
  constructor(props) {
    super(props);
    this.getComponentToRender = this.getComponentToRender.bind(this);
  }

  getComponentToRender(button) {
    const ComponentToRender = button.component || QuickButton;
    return (
      <ComponentToRender
        onQuickButtonClicked={this.props.onQuickButtonClicked}
        button={button}
      />
    );
  }

  render() {
    if (!this.props.buttons.length) {
      return null;
    }

    return (
      <div className="quick-buttons-container">
        <ul className="quick-buttons">
          {
            this.props.buttons.map((button, index) => (
              <li className="quick-list-button" key={index}>
                {this.getComponentToRender(button)}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}


export default connect(store => ({
  buttons: store.quickButtons
}))(QuickButtons);
