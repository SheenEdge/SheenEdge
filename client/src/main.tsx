import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Landing from './Landing.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Signup.tsx'
import Login from './components/login.tsx'
import Codo from './Codo.tsx'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";



createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
  <Router>
  <Routes>
  <Route index element={<Landing />} />
  <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={<Landing />} />
    <Route path="/signUp" element={<SignUp/>} />
    <Route path="/codo/:id" element={<Codo/>} />
  </Routes>
</Router>
</ChakraProvider>
)
