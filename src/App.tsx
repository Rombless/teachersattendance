import { HashRouter, Route, Routes } from 'react-router'
import { useEffect } from 'react'
import Home from './pages/Home'
import Login from './components/Login'
import { useDataStore } from './store/dataStore'
import { useAuthStore } from './store/authStore'
import { GlobalErrorProtection } from './components/GlobalErrorHandler'
import { enforceAllFunctions, enforceGlobalFunctions } from './utils/functionEnforcer'

export default function App() {
  const loadData = useDataStore(state => state.loadData)
  const { isAuthenticated, checkAuth } = useAuthStore()
  
  useEffect(() => {
    // Initialize function enforcement FIRST
    enforceAllFunctions();
    enforceGlobalFunctions();
    
    // Check authentication status
    checkAuth();
    
    // Then initialize data store
    loadData()
  }, [loadData, checkAuth])

  return (
    <GlobalErrorProtection>
      <HashRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        </Routes>
      </HashRouter>
    </GlobalErrorProtection>
  )
}
