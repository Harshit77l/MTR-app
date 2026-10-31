import { BrowserRouter } from 'react-router-dom'
import AppShell from './components/common/AppShell'
import { BookingProvider } from './context/BookingContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </BookingProvider>
    </BrowserRouter>
  )
}
