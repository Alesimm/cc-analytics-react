import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Plantel from './views/Plantel';
import Rendimiento from './views/Rendimiento';
import Formaciones from './views/Formaciones';
import Calendario from './views/Calendario';
import CentroMedico from './views/CentroMedico';
import Soporte from './views/Soporte';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* la raiz manda al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login, no lleva menu lateral */}
        <Route path="/login" element={<Login />} />

        {/* pantallas internas, todas con el menu lateral */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plantel" element={<Plantel />} />
          <Route path="/rendimiento" element={<Rendimiento />} />
          <Route path="/formaciones" element={<Formaciones />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/medico" element={<CentroMedico />} />
          <Route path="/soporte" element={<Soporte />} />
        </Route>

        {/* cualquier ruta inexistente vuelve al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
