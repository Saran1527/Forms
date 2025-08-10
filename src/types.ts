export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export type ValidationRule =
  | { type: 'required' }
  | { type: 'minLength'; value: number }
  | { type: 'maxLength'; value: number }
  | { type: 'email' }
  | { type: 'password'; rule: string } // human-readable rule

export type Field = {
  id: string
  label: string
  type: FieldType
  required?: boolean
  defaultValue?: any
  options?: string[] // for select, radio, checkbox
  validations?: ValidationRule[]
  derived?: {
    parentIds: string[]
    formula: string // expression using `fields['<id>']` or variable names
  } | null
}

export type FormSchema = {
  id: string
  name: string
  createdAt: string
  fields: Field[]
}