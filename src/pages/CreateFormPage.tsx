import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import FieldEditor from '../components/FieldEditor'
import FieldList from '../components/FieldList'
import { Field, FormSchema } from '../types'
import { useDispatch } from 'react-redux'
import { addForm } from '../store/formsSlice'
import './CreateFormPage.css'

export default function CreateFormPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [editing, setEditing] = useState<Field | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const dispatch = useDispatch()

  function addNew(type: Field['type']) {
    const f: Field = {
      id: uuid().replace(/-/g, '_'),
      label: `${type} field`,
      type,
      required: false,
      defaultValue: '',
      options: type === 'select' || type === 'radio' ? ['Option 1'] : undefined,
      validations: [],
      derived: null,
    }
    setEditing(f)
    setShowEditor(true)
  }

  function saveField(field: Field) {
    setFields((s) => {
      const exists = s.find((x) => x.id === field.id)
      if (exists) return s.map((x) => (x.id === field.id ? field : x))
      return [...s, field]
    })
    setShowEditor(false)
    setEditing(null)
  }

  function editField(id: string) {
    const f = fields.find((x) => x.id === id)!
    setEditing(f)
    setShowEditor(true)
  }

  function deleteField(id: string) {
    setFields((s) => s.filter((x) => x.id !== id))
  }

  function reorder(from: number, to: number) {
    const copy = [...fields]
    const [m] = copy.splice(from, 1)
    copy.splice(to, 0, m)
    setFields(copy)
  }

  function saveForm() {
    const name = prompt('Enter form name')?.trim()
    if (!name) return alert('Form not saved: name required')
    const schema: FormSchema = {
      id: uuid(),
      name,
      createdAt: new Date().toISOString(),
      fields,
    }
    dispatch(addForm(schema))
    alert('Form saved to localStorage')
  }

  return (
    <Box
      sx={{
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)',
        p: 2,
      }}
    >
      <Grid container spacing={2} className="fade-in">
        
        {/* Left Panel */}
        <Grid item xs={12} md={4} className="slide-up">
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'block' }}>
              Add Field
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'].map((t) => (
                <Button
                  key={t}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' },
                  }}
                  onClick={() => addNew(t as any)}
                >
                  {t}
                </Button>
              ))}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  py: 1,
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #42a5f5, #ab47bc)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1e88e5, #8e24aa)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.25)',
                  },
                }}
                onClick={saveForm}
              >
                Save Form
              </Button>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 2,
              mt: 2,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}
            className="fade-in-delay"
          >
            <Typography variant="h6">Live Preview</Typography>
            <Typography variant="body2" color="text.secondary">
              Shows default values (quick check)
            </Typography>
            <Box sx={{ mt: 1 }}>
              {fields.length === 0 ? (
                <Typography variant="caption">No fields yet</Typography>
              ) : (
                fields.map((f) => (
                  <Box key={f.id} sx={{ mb: 1 }}>
                    <strong>{f.label}</strong>
                    <div style={{ color: '#666' }}>{f.type}</div>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={8} className="slide-up-delay">
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Fields
            </Typography>
            <FieldList
              fields={fields}
              onEdit={editField}
              onDelete={deleteField}
              onReorder={reorder}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Field Editor Dialog */}
      <Dialog open={showEditor} onClose={() => setShowEditor(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit field' : 'New field'}</DialogTitle>
        <DialogContent>
          {editing && (
            <FieldEditor
              field={editing}
              onSave={saveField}
              onCancel={() => setShowEditor(false)}
              allFields={fields}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
