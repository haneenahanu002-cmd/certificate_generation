import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateCertificate from './pages/CreateCertificate'
import MyCertificate from './pages/MyCertificates'
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        
        <Route
          path="/create-certificate"
          element={<CreateCertificate />}
        />

        <Route
          path="/my-certificates"
          element={<MyCertificate />}
        />
        <Route
  path="/verify/:certificateId"
  element={<VerifyCertificate />}
/>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App