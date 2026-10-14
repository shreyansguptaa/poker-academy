import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './modules/progress/HomePage'
import { AcademyPage } from './modules/academy/AcademyPage'
import { LessonPage } from './modules/academy/LessonPage'
import { MathLabPage } from './modules/math-lab/MathLabPage'
import { RangesPage } from './modules/ranges/RangesPage'
import { QuizzesPage } from './modules/quizzes/QuizzesPage'
import { GlossaryPage } from './modules/glossary/GlossaryPage'
import { PlayPage } from './modules/play/PlayPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/academy/:id" element={<LessonPage />} />
          <Route path="/words" element={<GlossaryPage />} />
          <Route path="/lab" element={<MathLabPage />} />
          <Route path="/ranges" element={<RangesPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
