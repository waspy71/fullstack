import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ContextProvider } from './reducers/DataContext'

import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ContextProvider>
      <Router>
        <App />
      </Router>
    </ContextProvider>
  </QueryClientProvider>
)
