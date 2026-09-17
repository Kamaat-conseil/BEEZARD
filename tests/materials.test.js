import { describe, expect, it } from 'vitest'
import { MATERIALS, getMaterialBySlug, validateProject } from '../src/data.js'

describe('material catalogue', () => {
  it('contains the three families shown in the prototype', () => {
    expect(MATERIALS.map(({ slug }) => slug)).toEqual(['cuirs', 'poudres', 'deshydrates'])
  })

  it('finds a material without mutating the catalogue', () => {
    const before = JSON.stringify(MATERIALS)
    expect(getMaterialBySlug('poudres')?.title).toBe('Les poudres')
    expect(JSON.stringify(MATERIALS)).toBe(before)
  })
})

describe('project form validation', () => {
  it('accepts a complete project request', () => {
    expect(validateProject({ name: 'Lou', email: 'lou@example.com', message: 'Une matière souple et translucide.' })).toEqual({})
  })

  it('returns useful errors for invalid input', () => {
    expect(validateProject({ name: '', email: 'non', message: 'court' })).toEqual({
      name: 'Indiquez votre nom.',
      email: 'Saisissez une adresse e-mail valide.',
      message: 'Décrivez votre idée en au moins 12 caractères.'
    })
  })
})
