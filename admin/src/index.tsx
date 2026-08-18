import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
// i18n shu yerda ishga tushiriladi. Ilgari u tasodifan bitta sahifa faylidan
// import qilingani uchun yuklanardi — o'sha import olib tashlansa, butun
// admin tarjimasiz (kalitlar ko'rinib) qolardi.
import './configs/i18n'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { queryClient } from './utils/queryClient'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
