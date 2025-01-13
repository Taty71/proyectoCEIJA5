import React from 'react';
import './alerta.css';

const AlertaMens = ({ text, variant }) => {
    console.log(`Rendering AlertaMens with text: ${text} and variant: ${variant}`); // Debug log
    return (
        <div className={`alert ${variant}`}>
            {text}
        </div>
    );
};

export default AlertaMens;
