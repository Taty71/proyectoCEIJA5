import { useState } from 'react';
import { useUserContext } from '../context/useUserContext';
/*import { NavLink } from 'react-router-dom';*/
import Modalidad from '../components/Modalidad';
import BotonCargando from '../components/BotonCargando';
import '../estilos/dashboard.css';

const Dashboard = () => {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <BotonCargando loading={true} />;
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
      </div>
      <div className="dashboard-content">
        <div className="dashboard-buttons">
          <button onClick={handleOpenModal}>Gestión Estudiante</button>
          <button onClick={handleOpenModal}>Estudio de Equivalencias</button>
          <button>Plan A - B - C</button>
          {/*<NavLink to="/plan-a-b-c" className="dashboard-link">Plan A - B - C</NavLink>*/}
        </div>
      </div>
      <Modalidad isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;
