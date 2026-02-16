import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Saved from './pages/Saved';
import Digest from './pages/Digest';
import Settings from './pages/Settings';
import Proof from './pages/Proof';
import TestChecklist from './pages/TestChecklist';
import Ship from './pages/Ship';
import ProofFinal from './pages/ProofFinal';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="saved" element={<Saved />} />
        <Route path="digest" element={<Digest />} />
        <Route path="settings" element={<Settings />} />
        <Route path="proof" element={<Proof />} />
        <Route path="jt/07-test" element={<TestChecklist />} />
        <Route path="jt/08-ship" element={<Ship />} />
        <Route path="jt/proof" element={<ProofFinal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
