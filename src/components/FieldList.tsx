import React from 'react'
import { IconButton, List, ListItem, ListItemText, Collapse } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Field } from '../types'

export default function FieldList({
  fields,
  onEdit,
  onDelete,
  onReorder,
}: {
  fields: Field[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
  return (
    <List>
      {fields.map((f, idx) => (
        <Collapse key={f.id} in={true} timeout={300}>
          <ListItem
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => onEdit(f.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => onDelete(f.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`${f.label} (${f.type})`}
              secondary={f.derived ? `Derived from ${f.derived.parentIds.join(', ')}` : ''}
            />
          </ListItem>
        </Collapse>
      ))}
    </List>
  )
}
