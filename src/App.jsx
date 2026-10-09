import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
