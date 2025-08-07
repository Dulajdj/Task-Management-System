// frontend/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import AddTask from './AddTask.jsx';
import EditTask from './EditTask.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks/add" element={<AddTask />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);