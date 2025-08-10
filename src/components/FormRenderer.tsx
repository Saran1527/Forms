import React, { useEffect, useMemo, useState } from 'react'
import { Field } from '../types'
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  FormHelperText,
  Grow,
  Paper,
  Typography
} from '@mui/material'
import { evalFormula } from '../utils/formula'
import './formAnimations.css'

function validateField(field: Field, value: any) {
  const errors: string[] = []
  if (field.required && (value === undefined || value === null || String(value).trim() === ''))
    errors.push('Required')
  for (const v of field.validations || []) {
    if (v.type === 'minLength' && typeof value === 'string' && value.length < (v as any).value)
      errors.push(`Min length ${(v as any).value}`)
    if (v.type === 'maxLength' && typeof value === 'string' && value.length > (v as any).value)
      errors.push(`Max length ${(v as any).value}`)
    if (v.type === 'email' && typeof value === 'string' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
      errors.push('Invalid email')
    if (
      v.type === 'password' &&
      typeof value === 'string' &&
      !(value.length >= 8 && /\d/.test(value))
    )
      errors.push('Password must be >=8 chars and include a number')
  }
  return errors
}

export default function FormRenderer({
  fields,
  onChange
}: {
  fields: Field[]
  onChange?: (values: Record<string, any>) => void
}) {
  const initialValues = useMemo(() => {
    const v: Record<string, any> = {}
    for (const f of fields) v[f.id] = f.defaultValue ?? ''
    return v
  }, [fields])

  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const newValues = { ...values }
    for (const f of fields) {
      if (f.derived) {
        const val = evalFormula(f.derived.formula, newValues)
        newValues[f.id] = val
      }
    }
    setValues(newValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)])

  useEffect(() => {
    const errs: Record<string, string[]> = {}
    for (const f of fields) {
      const res = validateField(f, values[f.id])
      if (res.length) errs[f.id] = res
    }
    setErrors(errs)
    onChange?.(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  function handleChange(id: string, v: any) {
    setValues((s) => ({ ...s, [id]: v }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 2
      }}
    >
      {fields.map((f, index) => {
        const fieldErrors = errors[f.id] || []
        const errorClass = fieldErrors.length > 0 ? 'error-shake' : ''
        const delay = index * 120

        return (
          <Grow in timeout={500 + delay} key={f.id}>
            <Paper
              elevation={3}
              className={`animated-field ${errorClass}`}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: '#fafafa',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
              style={{ animationDelay: `${delay}ms` }}
            >
              <Box>
                {(() => {
                  switch (f.type) {
                    case 'text':
                    case 'number':
                      return (
                        <TextField
                          label={f.label}
                          type={f.type === 'number' ? 'number' : 'text'}
                          value={values[f.id] ?? ''}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          helperText={fieldErrors.join(', ')}
                          error={fieldErrors.length > 0}
                          fullWidth
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      )
                    case 'textarea':
                      return (
                        <TextField
                          label={f.label}
                          multiline
                          rows={4}
                          value={values[f.id] ?? ''}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          helperText={fieldErrors.join(', ')}
                          error={fieldErrors.length > 0}
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )
                    case 'select':
                      return (
                        <TextField
                          select
                          label={f.label}
                          value={values[f.id] ?? ''}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          helperText={fieldErrors.join(', ')}
                          error={fieldErrors.length > 0}
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                          {(f.options || []).map((o) => (
                            <MenuItem key={o} value={o}>
                              {o}
                            </MenuItem>
                          ))}
                        </TextField>
                      )
                    case 'radio':
                      return (
                        <FormControl error={fieldErrors.length > 0}>
                          <FormLabel sx={{ fontWeight: 500 }}>{f.label}</FormLabel>
                          <RadioGroup
                            value={values[f.id] ?? ''}
                            onChange={(e) => handleChange(f.id, e.target.value)}
                          >
                            {(f.options || []).map((o) => (
                              <FormControlLabel
                                key={o}
                                value={o}
                                control={<Radio />}
                                label={o}
                              />
                            ))}
                          </RadioGroup>
                          <FormHelperText>{fieldErrors.join(', ')}</FormHelperText>
                        </FormControl>
                      )
                    case 'checkbox':
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!values[f.id]}
                              onChange={(e) => handleChange(f.id, e.target.checked)}
                            />
                          }
                          label={<Typography fontWeight={500}>{f.label}</Typography>}
                        />
                      )
                    case 'date':
                      return (
                        <TextField
                          label={f.label}
                          type="date"
                          value={values[f.id] ?? ''}
                          onChange={(e) => handleChange(f.id, e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          helperText={fieldErrors.join(', ')}
                          error={fieldErrors.length > 0}
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )
                    default:
                      return null
                  }
                })()}
              </Box>
            </Paper>
          </Grow>
        )
      })}
    </Box>
  )
}
