// src/components/PlanOrYearSelector.jsx 
import React from 'react'; 
import './estilosDocumentacion.css';
const PlanOrYearSelector = ({ modalidad, handleChange }) => { 
    if (modalidad === 'Presencial') { 
        return ( 
            <div className="form-groupA"> 
                <label>Año:</label> 
                <select name="planAnio" onChange={handleChange} required  
                    className="small-select"> 
                <option value="">Seleccionar Año</option> 
                <option value="1er Año">1er Año</option> 
                <option value="2do Año">2do Año</option> 
                <option value="3er Año">3er Año</option> </select> 
            </div> );
        } else if (modalidad === 'Semipresencial') { 
            return ( 
            <div className="form-groupA"> 
                <label>Plan:</label> 
                <select name="planAnio" onChange={handleChange} required  
                    className="small-select"> 
                    <option value="">Seleccionar Plan</option> 
                    <option value="Plan A">Plan A</option> 
                    <option value="Plan B">Plan B</option> 
                    <option value="Plan C">Plan C</option> 
                    </select>
            </div> ); } 
        return null; }; 
            
export default PlanOrYearSelector;