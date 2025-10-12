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
import ContactManager from './Components/ContactManager/ContactManager';
import ContentManager from './Components/ContentManager/ContentManager';
import TestimonialsManager from './Components/TestimonialsManager/TestimonialsManager';
import ClassesManager from './Components/ClassesManager/ClassesManager';
import ScheduleManager from './Components/ScheduleManager/ScheduleManager';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import { GalleryProvider } from './contexts/GalleryContext';
import { CoachesProvider } from './contexts/CoachesContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContactProvider } from './contexts/ContactContext';
import { ContentProvider } from './contexts/ContentContext';
import { ClassesProvider } from './contexts/ClassesContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ContactProvider>
        <ContentProvider>
          <ClassesProvider>
            <ScheduleProvider>
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
                      <Route path="/admin/contact-manager" element={
                        <ProtectedRoute>
                          <ContactManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/content-manager" element={
                        <ProtectedRoute>
                          <ContentManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/testimonials-manager" element={
                        <ProtectedRoute>
                          <TestimonialsManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/classes-manager" element={
                        <ProtectedRoute>
                          <ClassesManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/schedule-manager" element={
                        <ProtectedRoute>
                          <ScheduleManager />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </BrowserRouter>
                </CoachesProvider>
              </GalleryProvider>
            </ScheduleProvider>
          </ClassesProvider>
        </ContentProvider>
      </ContactProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
