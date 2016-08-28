import React from 'react';
import ReactDOM from 'react-dom';

import App from './src/App';
import stateUtilities from './src/state-utilities';
import imageUtilities from './src/image-utilities';
import transformUtilities from './src/transform-utilities';

(function () {

  function doRender(container, extras) {
    return new Promise((resolve) => {
      let props = Object.assign({}, extras),
        element = React.createElement(App, props);

      ReactDOM.render(element, container, resolve);
      resolve();
    });
  }

  window.Snappy = {
    render: doRender,
    stateUtilities: stateUtilities,
    imageUtilities: imageUtilities,
    transformUtilities: transformUtilities
  };
}());


