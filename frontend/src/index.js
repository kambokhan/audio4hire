import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { store } from './app/store';
import { Provider } from 'react-redux';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import CreateListing from './features/listings/CreateListing';
import UserPage from './features/users/UserPage';
import ListingPage from './features/listings/ListingPage';
import EditListing from './features/listings/EditListing';
import EditUser from './features/users/EditUser';
import PersistLogin from './features/auth/PersistLogin';
import Homepage from './components/Homepage';
import NotFoundPage from './components/NotFoundPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listings/:listingId' element={<ListingPage />} />
          <Route path='/users/:userId' element={<UserPage />} />
          <Route path='/register' element={<Register />} />
          <Route element={<PersistLogin />}>
            <Route path='/listings' element={<CreateListing />} />
            <Route path='/listings/edit/:listingId' element={<EditListing />} />
            <Route path='/users/edit/:userId' element={<EditUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);