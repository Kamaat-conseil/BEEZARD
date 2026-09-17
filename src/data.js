export const MATERIALS = Object.freeze([
  Object.freeze({ slug: 'cuirs', title: 'Les cuirs', number: '01', tone: 'coral', detail: 'Souples, translucides ou denses, nos cuirs végétaux explorent la peau du vivant sans l’imiter.', tags: ['souple', 'thermoformable', 'translucide'] }),
  Object.freeze({ slug: 'poudres', title: 'Les poudres', number: '02', tone: 'sage', detail: 'Des pigments et charges à incorporer, presser ou révéler. Chaque grain conserve la mémoire de son origine.', tags: ['pigment', 'charge', 'granuleux'] }),
  Object.freeze({ slug: 'deshydrates', title: 'Les déshydratés', number: '03', tone: 'sand', detail: 'Fragments, fibres et surfaces brutes : le végétal séché devient texture, motif et structure.', tags: ['fibre', 'relief', 'léger'] })
])

export const getMaterialBySlug = (slug) => MATERIALS.find((material) => material.slug === slug)

export function validateProject(input) {
  const errors = {}
  if (!input.name?.trim()) errors.name = 'Indiquez votre nom.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email ?? '')) errors.email = 'Saisissez une adresse e-mail valide.'
  if ((input.message?.trim().length ?? 0) < 12) errors.message = 'Décrivez votre idée en au moins 12 caractères.'
  return errors
}
