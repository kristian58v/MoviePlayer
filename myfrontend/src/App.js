import React from 'react';
import './App.css';
import {PageRouter} from "./pages/PageRouter";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import {AuthProvider} from "./context/AuthContext";

const clientId = "680391911110-ni5pf2h1bih6ljnumfccob0nip6su1mg.apps.googleusercontent.com";

function App() {
  return (
      <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
              <BrowserRouter>
                  <div className="App">
                      <PageRouter />
                  </div>
              </BrowserRouter>
          </AuthProvider>
      </GoogleOAuthProvider>
  );
}

export default App;
