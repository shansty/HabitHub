import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { store } from './state/store.ts'
import { Provider } from 'react-redux'
import './index.css'


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <App />
    </Provider>
)
