import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, getByRole, getByText } from '@testing-library/dom'
import { initApp } from '../src/app.js'

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
  initApp(document.querySelector('#app'))
})

describe('BEEZARD prototype', () => {
  it('opens and closes a material detail', () => {
    fireEvent.click(getByText(document.body, 'Les cuirs'))
    expect(getByRole(document.body, 'dialog')).toBeTruthy()
    fireEvent.click(getByRole(document.body, 'button', { name: 'Fermer' }))
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('confirms a valid project request locally', () => {
    fireEvent.input(getByRole(document.body, 'textbox', { name: 'Votre nom' }), { target: { value: 'Lou' } })
    fireEvent.input(getByRole(document.body, 'textbox', { name: 'Votre e-mail' }), { target: { value: 'lou@example.com' } })
    fireEvent.input(getByRole(document.body, 'textbox', { name: 'Votre idée' }), { target: { value: 'Je veux tester une matière translucide.' } })
    fireEvent.click(getByRole(document.body, 'button', { name: 'Envoyer le projet' }))
    expect(getByText(document.body, 'Merci Lou. Votre idée est prête à être explorée.')).toBeTruthy()
  })
})
