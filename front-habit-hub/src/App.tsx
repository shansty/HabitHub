import MainPage from './views/mainPage/MainPage'
import { Route, BrowserRouter, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
