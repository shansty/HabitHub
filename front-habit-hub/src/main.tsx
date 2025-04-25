import { createRoot } from 'react-dom/client'
import { store } from './state/store.ts'
import { Provider } from 'react-redux'
import App from './app.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>
)
