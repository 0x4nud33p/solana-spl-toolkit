import Home from './components/Home'
import AnalysisResults from './components/AnalysisResults'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/stats' element={<AnalysisResults />}/>
      </Routes>
    </>
  )
}

export default App
