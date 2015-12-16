import React from 'react';
import { render } from 'react-dom';
import App from 'components/app';

export default function() {
    React.render(
        <App />,
        document.getElementById('app')
    );
}
