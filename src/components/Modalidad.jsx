// src/components/Modalidad.jsx
import React, { useState } from 'react';
import ModalidadModal from './modalidadModal';
import './Modal.css';

const Modalidad = ({ onClose }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalidad, setModalidad] = useState('');

    const handleModalOpen = (modalidadSeleccionada) => {
        setModalidad(modalidadSeleccionada);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>✖</button>
                <h2>Elija una Modalidad</h2>
                <button onClick={() => handleModalOpen('Presencial')} className="modalidad-button">Presencial</button> 
                <button onClick={() => handleModalOpen('Semipresencial')} className="modalidad-button">Semipresencial</button> 
                {showModal && <ModalidadModal modalidad={modalidad} onClose={handleModalClose} />}
            </div>
        </div>
    );
};

export default Modalidad;
