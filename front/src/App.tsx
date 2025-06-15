import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LayoutAdmin from './components/layout/LayoutAdmin';
import ProtectedRouteAdmin from './routes/ProtectedRouteAdmin';
import AboutPage from './pages/open/AboutProject/AboutProject';
import PrivacyPolicy from './pages/open/PrivacyPolicy/PrivacyPolicy';
import Sailors from './pages/combined/Sailors/Sailors';
import Biography from './pages/open/Biography/Biography';
import SailorCreate from './pages/combined/SailorCreate/SailorCreate'
import Feedbacks from './pages/admin/Feedbacks/Feedbacks';
import SailorEdit from './pages/admin/SailorEdit/SailorEdit'
import Login from './pages/open/LoginPage';
import { AuthProvider } from './context/AuthContext';
import SailorCreateRequests from './pages/admin/SailorCreateRequests/SailorCreateRequests';
import NotFound from './pages/open/NotFound/NotFound';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<AboutPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="sailors" element={<Sailors />} />
              <Route path="biography/:id" element={<Biography />} />
              <Route path="add-sailor" element={<SailorCreate />} />
              <Route path="login" element={<Login />} />
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
              <Route path="sailors" element={<Sailors />} />
              <Route path="add-sailor" element={<SailorCreate />} />
              <Route path="feedback" element={<Feedbacks />} />
              <Route path="/admin/sailors/edit/:id" element={<SailorEdit />} />
              <Route path="/admin/requests" element={<SailorCreateRequests />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
