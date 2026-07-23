import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './store/AppContext';
import Layout from './components/Layout';
import LocalizationBridge from './components/LocalizationBridge';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import AlbumPage from './pages/AlbumPage';
import UserProfilePage from './pages/UserProfilePage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import PlaylistsPage from './pages/PlaylistsPage';
import ArtistStudioPage from './pages/ArtistStudioPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function RouteGate() {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  if (location.pathname === '/auth') return <Navigate to="/" replace />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/albums/:id" element={<AlbumPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/artists/:id" element={<ArtistProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/studio" element={<ArtistStudioPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <LocalizationBridge />
      <RouteGate />
    </>
  );
}
