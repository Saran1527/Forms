import './App.css'; // Import the new styles
import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import CreateFormPage from './pages/CreateFormPage'
import PreviewPage from './pages/PreviewPage'
import MyFormsPage from './pages/MyFormsPage'
import './App.css'; 

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Form Builder
          </Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>
      <PageWrapper />
    </BrowserRouter>
  )
}

function PageWrapper() {
  const location = useLocation()
  return (
    <Container key={location.pathname} className="page-transition" sx={{ mt: 3 }}>
      <Routes location={location}>
        <Route path="/" element={<CreateFormPage />} />
        <Route path="/create" element={<CreateFormPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/preview/:formId" element={<PreviewPage />} />
        <Route path="/myforms" element={<MyFormsPage />} />
      </Routes>
    </Container>
  )
}
