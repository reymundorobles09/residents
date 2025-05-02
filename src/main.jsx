import router from './router';
import React, { Suspense } from 'react';
import LoadingSpinner from './layout/LoadingSpinner';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ContextProvider } from './context/ContextProvider';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';
import './flags.css';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ContextProvider>
  </React.StrictMode>
)
