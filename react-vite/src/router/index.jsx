import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import TripPage from '../components/TripPage/TripPage';
import CreateTrip from '../components/TripPage/TripFormPage';
import TripDetails from '../components/TripPage/TripDetails';
import EditTripPage from "../components/TripPage/EditTripPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "trips",
        element: <TripPage />,
      },
      {
        path: "create-trip",
        element: <CreateTrip />,
      },
      {
        path: "trips/:id",
        element: <TripDetails />,
      },
      {
        path: "/trips/edit/:id",
        element: <EditTripPage />,
      },
    ],
  },
]);