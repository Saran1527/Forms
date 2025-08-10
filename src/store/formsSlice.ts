import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormSchema } from '../types'

const LS_KEY = 'upliance_forms_v1'

function loadFromStorage(): FormSchema[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FormSchema[]
  } catch (e) {
    return []
  }
}

function saveToStorage(forms: FormSchema[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(forms))
}

const initialState: { forms: FormSchema[] } = {
  forms: loadFromStorage(),
}

const slice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm(state, action: PayloadAction<FormSchema>) {
      state.forms.push(action.payload)
      saveToStorage(state.forms)
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.forms = state.forms.filter((f) => f.id !== action.payload)
      saveToStorage(state.forms)
    },
  },
})

export const { addForm, deleteForm } = slice.actions
export default slice.reducer