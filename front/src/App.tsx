import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from './components/layout/Layout';
import LayoutAdmin from './components/layout/LayoutAdmin';
import ProtectedRouteAdmin from './routes/ProtectedRouteAdmin';
import AboutPage from './pages/open/AboutPage';
import PrivacyPolicy from './pages/open/PrivacyPolicy';
import SailorPage from './pages/open/SailorsPage';
import BiographyPage from './pages/open/BiographyPage';
import SailorAddPage from './pages/open/SailorsAddPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import SailorEditPage from './pages/admin/SailorEditPage';
import LoginPage from './pages/open/LoginPage';
import { AuthProvider } from './context/AuthContext';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import NotFoundPage from './pages/open/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AboutPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="sailors" element={<SailorPage />} />
            <Route path="biography/:id" element={<BiographyPage />} />
            <Route path="add-sailor" element={<SailorAddPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRouteAdmin>
                <LayoutAdmin />
              </ProtectedRouteAdmin>
            }
          >
            <Route index element={<Navigate to="sailors" replace />} />
            <Route path="add-sailor" element={<SailorAddPage />} />
            <Route path="feedback" element={<AdminFeedbackPage />} />
            <Route path="sailors" element={<SailorPage />} />
            <Route path="/admin/sailors/edit/:id" element={<SailorEditPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
