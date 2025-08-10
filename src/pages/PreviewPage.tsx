import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useParams } from 'react-router-dom'
import { Paper, Typography, Button, Box } from '@mui/material'
import FormRenderer from '../components/FormRenderer'
import './PreviewPage.css' 

export default function PreviewPage() {
  const { formId } = useParams()
  const forms = useSelector((s: RootState) => s.forms.forms)
  const schema = formId ? forms.find((f) => f.id === formId) : undefined

  const fields = schema ? schema.fields : (forms[forms.length - 1]?.fields || [])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        className="fade-in"
        sx={{
          p: 3,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 600
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            animation: 'slideDown 0.8s ease'
          }}
        >
          Preview {schema ? `— ${schema.name}` : '(Current)'}
        </Typography>

        {fields.length === 0 ? (
          <Typography variant="body2" align="center" color="text.secondary">
            No fields to render
          </Typography>
        ) : (
          <div className="form-animate">
            <FormRenderer fields={fields} />
          </div>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '12px',
            background: 'linear-gradient(45deg, #42a5f5, #ab47bc)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #1e88e5, #8e24aa)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.25)',
              transform: 'translateY(-3px)'
            }
          }}
          onClick={() => alert('Form submitted (demo)')}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  )
}
