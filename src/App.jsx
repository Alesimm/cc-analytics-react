import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Plantel from './components/Plantel';
import Rendimiento from './components/Rendimiento';
import Formaciones from './components/Formaciones';
import Calendario from './components/Calendario';
import CentroMedico from './components/CentroMedico';

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
        </Route>

        {/* cualquier ruta inexistente vuelve al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
