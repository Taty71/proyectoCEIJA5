import { useState } from 'react';
import { useUserContext } from '../context/UserContextFile'; // Make sure the path is correct
import { NavLink } from 'react-router-dom';
import Modalidad from '../components/ModalidadAdm';
import BotonCargando from '../components/BotonCargando';
import '../estilos/dashboard.css';
const Dashboard = () => {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Accessing the user from the context
    console.log('User en dashboard:', user); // Debug log
  if (!user) {
    return <BotonCargando loading={true} />;   // Or show some loading indicator if there is no user
  }
 
 
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
      <h1>Bienvenido, {user.nombre}</h1>
      <p>Rol: {user.rol}</p>
      {/* Aquí puedes agregar más contenido del dashboard */}

      </div>
      <div className="dashboard-content">
       <ul>
          <li>
          <button onClick={handleOpenModal}>Gestión Estudiante</button>
            
          </li>
          <li>
          <button onClick={handleOpenModal}>Estudio de Equivalencias</button>
          </li>
          <li>
            <NavLink to="/plan-a-b-c">Plan A - B - C</NavLink>
          </li>
        </ul>
       </div>
       <Modalidad isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;
