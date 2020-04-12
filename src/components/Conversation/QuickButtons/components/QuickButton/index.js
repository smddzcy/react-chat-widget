import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class QuickButton extends PureComponent {
  render() {
    return (
      <button
        className="quick-button"
        type="button"
        onClick={event => this.props.onQuickButtonClicked(event, this.props.button.value)}
      >
        {this.props.button.label}
      </button>
    );
  }
}

export default QuickButton;
