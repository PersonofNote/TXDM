import React, {useEffect, useState} from 'react';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// App pages
import TissueInputPage from './pages/TissueInputPage';
import CompanyDashboard from './pages/CompanyDashboard'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ErrorPage from './pages/ErrorPage'

// Layout components
import Header from './components/Header'

import sampleData from './data.json'

function App() {


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

// TODO: Is this the best way to do this?
  useEffect(() => {
    user === null && setUser(JSON.parse(localStorage.getItem('PMMUser')), setLoading(false));
  },[user])


  return (
    <div>
      <BrowserRouter>
      <div>
        <Header user={user} setUser={setUser} leftLinks={sampleData.header_links} textColor={'white'} />
        {!loading &&(
          <Routes>
            <Route path="/" element={<TissueInputPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin setUser={setUser} user={user} />} />
            <Route path="/test" element={<CompanyDashboard />} />
            <Route path="/dashboard/:id" element={<CompanyDashboard user={user}/>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        )}
      </div>
     </BrowserRouter>
  </div>
  );
}

export default App;
