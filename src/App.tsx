import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate, useNavigate, useParams, HashRouter} from "react-router-dom";
import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigator from './pages/Navigator';
import Home from "./pages/Home";
import Message from './pages/Message';
import Profile from './pages/Profile';
import Daily from './pages/home/Daily';
import Monthly from './pages/home/Monthly';
import Auth from './pages/Auth';
import {AuthContext} from './context/authContext';
import NotFound from "./pages/NotFound";

/* 
3 main pages:
  1) home: show tasks
    a) show tasks in this month
    b) show tasks in this week
    c) show tasks today
  2) message: show messages
  3) profile: display user's account
*/
function App() {
  const [email, setEmail] = useState("");
  return (
    <AuthContext.Provider value={{email: email, setEmail: setEmail}}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/grouptodo' element={<Navigator />}>
              {/*<Route path='/grouptodo' element={<Home />}>*/}
              {/*  <Route path='/grouptodo/monthly' element={<Monthly />}/>*/}
              {/*  <Route path='/grouptodo/daily' element={<Daily />}/>*/}
              {/*</Route>*/}
              <Route index element={<Home />}/>
              <Route path='/grouptodo/message' element={<Message />}/>
              {/*<Route path='/grouptodo/profile' element={<Profile />}/>*/}
              <Route path='/grouptodo/login' element={<Auth />}/>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path='/grouptodo/profile' element={<Profile />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
