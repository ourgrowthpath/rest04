import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Videos from './pages/Videos'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Board from './pages/Board'
import BoardDetail from './pages/BoardDetail'
import BoardWrite from './pages/BoardWrite'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Navigate to="/videos/ai" replace />} />
          <Route path="/videos/:category" element={<Videos />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/write" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />
          <Route path="/board/edit/:id" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
