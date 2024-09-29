import React from "react";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import Home from "./pagesAdmin/home/Home";
import User from "./pagesAdmin/user/User";
import UserList from "./pagesAdmin/userList/UserList";
import LinkStats from "./pagesAdmin/LinkStats/LinkStats.jsx";
import DownloadList from "./pagesAdmin/downloadList/downloadList.jsx";
import { UserContextProvider } from "./UserContext";
import { SearchProvider } from "./SearchContext.jsx";
import PrivateRoute from "./PrivateRoute";

import axios from "axios";
//axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = "http://tnttest.ru:4000/api/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account/register" element={<RegisterPage />} />
            <Route
              path="/account"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route
              path="/account/places"
              element={<PrivateRoute element={<PlacesPage />} />}
            />
            <Route
              path="/account/places/new"
              element={<PrivateRoute element={<PlacesFormPage />} />}
            />
            <Route
              path="/account/places/:id"
              element={<PrivateRoute element={<PlacesFormPage />} />}
            />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route
              path="/account/bookings"
              element={<PrivateRoute element={<BookingsPage />} />}
            />
            <Route
              path="/account/bookings/:id"
              element={<PrivateRoute element={<BookingPage />} />}
            />
            <Route
              path="/statistics"
              element={<PrivateRoute element={<Home />} />}
            />
            <Route
              path="/statistics/links"
              element={<PrivateRoute element={<LinkStats />} />}
            />
            <Route
              path="/reports"
              element={<PrivateRoute element={<UserList />} />}
            />
            <Route
              path="/download-list"
              element={<PrivateRoute element={<DownloadList />} />}
            />
            <Route
              path="/admin/:userId"
              element={<PrivateRoute element={<User />} />}
            />
          </Route>
        </Routes>
      </SearchProvider>
    </UserContextProvider>
  );
}

export default App;
