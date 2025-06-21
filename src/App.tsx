import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from "./Dashboard"
import ErrorBoundary from './features/ErrorBoundary'
import DispenseMedicine from './features/DispenseMedicine'
import './App.css'

function App() {
  return (
      <main >
        <Router>
          <ErrorBoundary>
            <Routes>
               <Route path="/" element={<Dashboard />} />
              <Route path="/dispense" element={<DispenseMedicine />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </main>
  )
}

export default App
