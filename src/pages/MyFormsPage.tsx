import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { List, ListItem, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteForm } from '../store/formsSlice'
import { useNavigate } from 'react-router-dom'

export default function MyFormsPage() {
  const forms = useSelector((s: RootState) => s.forms.forms)
  const dispatch = useDispatch()
  const nav = useNavigate()

  return (
    <List>
      {forms.map((f) => (
        <ListItem key={f.id} secondaryAction={
          <IconButton onClick={() => dispatch(deleteForm(f.id))}>
            <DeleteIcon />
          </IconButton>
        } button onClick={() => nav(`/preview/${f.id}`)}>
          <ListItemText primary={f.name} secondary={new Date(f.createdAt).toLocaleString()} />
        </ListItem>
      ))}
    </List>
  )
}