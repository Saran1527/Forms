import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Chip,
  Stack,
  MenuItem,
  Grow,
  Paper,
  Slide,
} from '@mui/material'
import { Field } from '../types'

export default function FieldEditor({
  field,
  onSave,
  onCancel,
  allFields,
}: {
  field: Field
  onSave: (f: Field) => void
  onCancel: () => void
  allFields: Field[]
}) {
  const [form, setForm] = useState<Field>(field)

  function set<K extends keyof Field>(k: K, v: Field[K]) {
    setForm((s) => ({ ...s, [k]: v }))
  }

  function addOption() {
    const opt = prompt('Option text')
    if (!opt) return
    set('options', [...(form.options || []), opt])
  }

  function removeOption(i: number) {
    set('options', (form.options || []).filter((_, idx) => idx !== i))
  }

  function toggleValidation(type: string) {
    const vs = form.validations || []
    if (vs.find((v) => v.type === (type as any))) {
      set('validations', vs.filter((v) => v.type !== (type as any)))
    } else {
      if (type === 'minLength') set('validations', [...vs, { type: 'minLength', value: 1 } as any])
      else if (type === 'maxLength') set('validations', [...vs, { type: 'maxLength', value: 100 } as any])
      else if (type === 'password') set('validations', [...vs, { type: 'password', rule: 'min 8 chars + number' } as any])
      else set('validations', [...vs, { type: type as any }])
    }
  }

  function save() {
    if (!form.label || form.label.trim() === '') return alert('Label required')
    onSave(form)
  }

  return (
    <Grow in timeout={500}>
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa, #e4ebf0)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Left Side */}
        <Slide direction="right" in timeout={500}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Label"
              value={form.label}
              onChange={(e) => set('label', e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              select
              label="Type"
              value={form.type}
              onChange={(e) => set('type', e.target.value as any)}
              fullWidth
              sx={{ mb: 1 }}
            >
              {['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={<Switch checked={!!form.required} onChange={(e) => set('required', e.target.checked)} />}
              label="Required"
            />

            <TextField
              label="Default value"
              value={form.defaultValue ?? ''}
              onChange={(e) => set('defaultValue', e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">Validations</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {['Not empty', 'Min length', 'Max length', 'Email format', 'Password rule'].map((label, idx) => {
                  const keys = ['required', 'minLength', 'maxLength', 'email', 'password']
                  return (
                    <Chip
                      key={idx}
                      label={label}
                      onClick={() => toggleValidation(keys[idx])}
                      clickable
                      color={(form.validations || []).find((v) => v.type === keys[idx]) ? 'primary' : 'default'}
                      sx={{ transition: 'all 0.2s' }}
                    />
                  )
                })}
              </Stack>
            </Box>

            {(form.type === 'select' || form.type === 'radio') && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">Options</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {(form.options || []).map((o, i) => (
                    <Chip
                      key={i}
                      label={o}
                      onDelete={() => removeOption(i)}
                      sx={{ backgroundColor: '#e3f2fd' }}
                    />
                  ))}
                  <Button variant="outlined" onClick={addOption}>Add option</Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Slide>

        {/* Right Side */}
        <Slide direction="left" in timeout={500}>
          <Box sx={{ width: 320 }}>
            <Typography variant="subtitle1" fontWeight="bold">Derived field</Typography>
            <Typography variant="caption" color="text.secondary">
              Make the field value computed from parent fields
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight="bold">Parents</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
                {allFields.map((af) => (
                  <Chip
                    key={af.id}
                    label={af.label}
                    onClick={() => {
                      const parents = new Set(form.derived?.parentIds || [])
                      if (parents.has(af.id)) parents.delete(af.id)
                      else parents.add(af.id)
                      set('derived', { ...(form.derived || { parentIds: [], formula: '' }), parentIds: Array.from(parents) })
                    }}
                    color={(form.derived?.parentIds || []).includes(af.id) ? 'primary' : 'default'}
                    sx={{ transition: 'all 0.2s' }}
                  />
                ))}
              </Stack>
            </Box>

            <TextField
              label="Formula"
              value={form.derived?.formula || ''}
              onChange={(e) => set('derived', { ...(form.derived || { parentIds: [], formula: '' }), formula: e.target.value })}
              fullWidth
              multiline
              rows={4}
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button variant="contained" onClick={save}>Save</Button>
              <Button variant="outlined" onClick={onCancel}>Cancel</Button>
            </Box>
          </Box>
        </Slide>
      </Paper>
    </Grow>
  )
}
