import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main';
import CampsPage from './Components/Camps/CampsPage/CampsPage';
import GalleryPage from './Components/Gallery/GalleryPage/GalleryPage';
import SchedulePage from './Components/ClassesPage/SchedulePage/SchedulePage';
import AdminPage from './Components/AdminPage/AdminPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage/WelcomePage';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Main />} />
        <Route path="/camps" element={<CampsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
