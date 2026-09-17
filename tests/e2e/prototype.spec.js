import { test, expect } from '@playwright/test'

test('explores the BEEZARD material journey', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Passer l’introduction' }).click()
  await expect(page.getByRole('heading', { name: /transforme le vivant/i })).toBeVisible()
  await page.getByRole('button', { name: /explorer les matières/i }).click()
  await expect(page.getByRole('heading', { name: 'Les matières' })).toBeVisible()
  await page.getByRole('button', { name: /découvrir les poudres/i }).click()
  await expect(page.getByRole('dialog')).toContainText('Les poudres')
  await page.getByRole('button', { name: 'Fermer' }).click()
})
