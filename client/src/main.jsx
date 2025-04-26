import { StrictMode } from 'react';
import './index.css'
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './route/index.jsx'; // Verify this path is correct.
import {Provider} from 'react-redux'
import { store } from './store/store.js';
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  // </StrictMode>,
)