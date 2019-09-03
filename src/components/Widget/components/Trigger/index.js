import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Trigger = ({ content, innerRef }) => (
  <div className="icw-trigger-content" dangerouslySetInnerHTML={{ __html: content }} ref={innerRef} />
);

Trigger.propTypes = {
  content: PropTypes.string,
  innerRef: PropTypes.func,
};

export default Trigger;
