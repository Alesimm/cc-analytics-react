import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Layout from './components/Layout';

// vistas internas con carga diferida por ruta
const Dashboard = lazy(() => import('./views/Dashboard'));
const Plantel = lazy(() => import('./views/Plantel'));
const Rendimiento = lazy(() => import('./views/Rendimiento'));
const Formaciones = lazy(() => import('./views/Formaciones'));
const Calendario = lazy(() => import('./views/Calendario'));
const CentroMedico = lazy(() => import('./views/CentroMedico'));
const Soporte = lazy(() => import('./views/Soporte'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* la raiz manda al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login, no lleva menu */}
        <Route path="/login" element={<Login />} />

        {/* pantallas internas, el suspense vive dentro del layout */}
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
