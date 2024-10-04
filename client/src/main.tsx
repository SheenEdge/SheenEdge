import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Landing from './Landing.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



createRoot(document.getElementById('root')!).render(
  <Router>
  <Routes>
    <Route path="/" element={<Landing />} />

  </Routes>
</Router>
)
