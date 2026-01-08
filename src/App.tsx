import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import Games from './pages/Games'
import Manga from './pages/Manga'
import MangaDetail from './pages/MangaDetail'
import ChapterReader from './pages/ChapterReader'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="experience" element={<Experience />} />
          <Route path="contact" element={<Contact />} />
          <Route path="games" element={<Games />} />
          <Route path="manga" element={<Manga />} />
          <Route path="manga/:id" element={<MangaDetail />} />
          <Route path="manga/:id/chapter/:chapterId" element={<ChapterReader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

