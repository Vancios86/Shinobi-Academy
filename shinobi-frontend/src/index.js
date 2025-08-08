import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main';
import CampsPage from './Components/Camps/CampsPage/CampsPage';
import GalleryPage from './Components/Gallery/GalleryPage/GalleryPage';
import SchedulePage from './Components/ClassesPage/SchedulePage/SchedulePage';
import AdminPage from './Components/AdminPage/AdminPage';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import GalleryManager from './Components/GalleryManager/GalleryManager';
import CoachesManager from './Components/CoachesManager/CoachesManager';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import { GalleryProvider } from './contexts/GalleryContext';
import { CoachesProvider } from './contexts/CoachesContext';
import { AuthProvider } from './contexts/AuthContext';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <GalleryProvider>
        <CoachesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<Main />} />
              <Route path="/camps" element={<CampsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/gallery-manager" element={
                <ProtectedRoute>
                  <GalleryManager />
                </ProtectedRoute>
              } />
              <Route path="/admin/coaches-manager" element={
                <ProtectedRoute>
                  <CoachesManager />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </CoachesProvider>
      </GalleryProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
