// External libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Internal 
import LoginPage from './pages/Auth/LoginForm';
import RegistrationForm from './pages/Auth/RegistrationForm';
import Unauthorized from './pages/BlankPages/Unauthorised';
import PageNotFound from './pages/BlankPages/PageNotFound';
import ProtectedRoute from './utilities/ProtectedRoute';
import Profile from './pages/SharedPages/ProfilePage';
import ManageUsers from './pages/AdminPages/Users';
import Dashboard from './pages/AdminPages/Dashboard/Dashboard';
import Buildings from './pages/AdminPages/Buildings/Buildings';
import ServiceTypes from './pages/AdminPages/ServiceTypes/ServiceTypes';
import NavigationFrame from './utilities/NavFrame';
import AllRequests from './pages/AdminPages/Requests/Requests';
import BuildingView from './pages/AdminPages/Buildings/BuildingView';
import RequestView from './pages/AdminPages/Requests/RequestView'
import FrequentlyAskedQuestionsRegular from './pages/RegularPages/FAQ/FrequentlyAskedQuestions';
import MyRequests from './pages/RegularPages/MyRequests/MyRequests';
import NotBuildingsSetup from './pages/BlankPages/NoBuildingsSetup';
import NoBuildingsAssigned from './pages/BlankPages/NoBuildingsAssigned';
import Home from './pages/RegularPages/Home/Home';
import FrequentlyAskedQuestionsAdmin from './pages/AdminPages/FAQ/FrequentlyAskedQuestions';

// contexts
import { UserProvider, useUser } from './contexts/UserContext';
import { LoadingProvider } from './contexts/LoadingContext';
// pages

// utils
import ScrollToTop from './utilities/ScrollToTop';
import './App.css';



const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <LoadingProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/unavailable" element={<NotBuildingsSetup />} />
            <Route path="/no-buildings" element={<NoBuildingsAssigned />} />
            <Route path="/" element={<ProtectedRoute roles={['admin', 'regular']}><NavigationFrame /></ProtectedRoute>}>
              <Route index element={<DefaultRoute />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-requests" element={<ProtectedRoute roles={['admin', 'regular']}><MyRequests /></ProtectedRoute>} />
              <Route path="my-requests/:raise" element={<ProtectedRoute roles={['admin', 'regular']}><MyRequests /></ProtectedRoute>} />
              <Route path="help-faq" element={<FrequentlyAskedQuestionsRegular />} />
              <Route path="buildings" element={<ProtectedRoute roles={['admin']}><Buildings /></ProtectedRoute>} />
              <Route path="buildings/:id" element={<ProtectedRoute roles={['admin']}><BuildingView /></ProtectedRoute>} />
              <Route path="service-types" element={<ProtectedRoute roles={['admin']}><ServiceTypes /></ProtectedRoute>} />
              <Route path="requests" element={<ProtectedRoute roles={['admin']}><AllRequests /></ProtectedRoute>} />
              <Route path="requests/:id" element={<ProtectedRoute roles={['admin', 'regular']}><RequestView /></ProtectedRoute>} />
              <Route path="manage-users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="help-faqs" element={<ProtectedRoute roles={['admin']}><FrequentlyAskedQuestionsAdmin /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </UserProvider>
      </LoadingProvider>
    </Router>
  );
};

const DefaultRoute = () => {
  const { hasRole } = useUser();

  if (hasRole('admin')) {
    return <Dashboard />;
  } else {
    return <Home />;
  }
};

export default App;
