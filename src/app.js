import { MATERIALS, getMaterialBySlug, validateProject } from './data.js'
import './styles.css'

const materialCards = () => MATERIALS.map((material) => `
  <article class="material-card ${material.tone}" data-material="${material.slug}">
    <span class="material-number">${material.number}</span>
    <div>
      <p class="eyebrow">Matière brute</p>
      <h3>${material.title}</h3>
      <p>${material.detail}</p>
    </div>
    <button class="round-link" aria-label="Découvrir ${material.title.toLowerCase()}">↗</button>
  </article>`).join('')

const template = `
  <header class="hero" id="accueil">
    <nav class="nav" aria-label="Navigation principale">
      <a href="#accueil" class="brand" aria-label="BEEZARD, accueil"><span class="brand-mark">✣</span>BEEZARD</a>
      <div class="nav-links"><a href="#matieres">Matières</a><a href="#studio">Le studio</a><a href="#contact">Contact</a></div>
      <button class="menu-button" aria-label="Ouvrir le menu">Menu</button>
    </nav>
    <div class="hero-copy">
      <p class="eyebrow light">Biofabrication — Paris</p>
      <h1>BeeZard transforme<br>le vivant en matières brutes<br>de création.</h1>
      <button class="primary" data-scroll="matieres">Explorer les matières <span>↓</span></button>
    </div>
    <p class="hero-note">Peaux, poudres et fragments issus de ressources délaissées.</p>
  </header>

  <main>
    <section class="manifesto reveal" id="studio">
      <p class="section-index">01 — MANIFESTE</p>
      <h2>Créer avec ce qui existe déjà.</h2>
      <div class="manifesto-grid"><p>Nous développons des matières singulières à partir de coproduits agricoles et de ressources organiques. Des surfaces sensibles, imparfaites, conçues pour les créateurs.</p><p>Chaque recette est une collaboration entre la matière, le geste et le temps. Notre rôle : rendre le vivant désirable sans effacer son origine.</p></div>
    </section>

    <section class="materials reveal" id="matieres">
      <div class="section-heading"><div><p class="section-index">02 — COLLECTION</p><h2>Les matières</h2></div><p>Cliquez sur une famille pour l’explorer.</p></div>
      <div class="material-grid">${materialCards()}</div>
    </section>

    <section class="lab reveal" aria-labelledby="lab-title">
      <div class="lab-visual"><div class="sample sample-a"></div><div class="sample sample-b"></div><div class="sample sample-c"></div></div>
      <div class="lab-copy"><p class="section-index">03 — LABORATOIRE</p><h2 id="lab-title">Papiers-matières</h2><p>Fibres, liants naturels et pigments se rencontrent en petites séries. Survolez les échantillons pour en éprouver la lumière.</p><div class="chips"><span>formats sur mesure</span><span>petites séries</span><span>R&amp;D collaborative</span></div></div>
    </section>

    <section class="process reveal">
      <p class="section-index">04 — PROCESSUS</p><h2>Textures, formats,<br>associations.</h2>
      <div class="process-steps"><article><span>1</span><h3>Observer</h3><p>Comprendre la ressource, sa saison et ses contraintes.</p></article><article><span>2</span><h3>Transformer</h3><p>Tester, presser, sécher et documenter chaque recette.</p></article><article><span>3</span><h3>Composer</h3><p>Adapter la matière au geste et à l’usage du projet.</p></article></div>
    </section>

    <section class="contact reveal" id="contact">
      <div><p class="section-index">05 — COLLABORER</p><h2>Une idée ?</h2><p>Parlez-nous d’une texture, d’un usage ou simplement d’une intuition. Ce formulaire reste local dans ce prototype.</p></div>
      <form novalidate><label>Votre nom<input name="name" aria-label="Votre nom" autocomplete="name"></label><small data-error="name"></small><label>Votre e-mail<input name="email" type="email" aria-label="Votre e-mail" autocomplete="email"></label><small data-error="email"></small><label>Votre idée<textarea name="message" aria-label="Votre idée" rows="4"></textarea></label><small data-error="message"></small><button class="primary dark" type="submit" aria-label="Envoyer le projet">Envoyer le projet <span>↗</span></button><p class="form-status" role="status"></p></form>
    </section>
  </main>

  <footer><a href="#accueil" class="brand"><span class="brand-mark">✣</span>BEEZARD</a><p>Merci d’avoir partagé votre projet avec nous.</p><a href="#accueil">Retour en haut ↑</a></footer>
  <div class="modal-root"></div>`

function openMaterial(root, slug) {
  const material = getMaterialBySlug(slug)
  if (!material) return
  const modalRoot = root.querySelector('.modal-root')
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="material-modal ${material.tone}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" aria-label="Fermer">×</button><p class="eyebrow">Collection ${material.number}</p><h2 id="modal-title">${material.title}</h2><p>${material.detail}</p><div class="modal-swatch"></div><div class="chips">${material.tags.map((tag) => `<span>${tag}</span>`).join('')}</div></section></div>`
  modalRoot.querySelector('.modal-close').focus()
}

function onSubmit(root, event) {
  event.preventDefault()
  const form = event.currentTarget
  const values = Object.fromEntries(new FormData(form))
  const errors = validateProject(values)
  root.querySelectorAll('[data-error]').forEach((node) => { node.textContent = errors[node.dataset.error] ?? '' })
  if (Object.keys(errors).length > 0) return
  form.reset()
  form.querySelector('.form-status').textContent = `Merci ${values.name.trim()}. Votre idée est prête à être explorée.`
}

export function initApp(root) {
  if (!root) throw new Error('Le conteneur de l’application est introuvable.')
  root.innerHTML = template
  root.addEventListener('click', (event) => {
    const materialButton = event.target.closest('[data-material]')
    if (materialButton) openMaterial(root, materialButton.dataset.material)
    if (event.target.closest('.modal-close') || event.target.classList.contains('modal-backdrop')) root.querySelector('.modal-root').innerHTML = ''
    const scrollButton = event.target.closest('[data-scroll]')
    if (scrollButton) root.querySelector(`#${scrollButton.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' })
  })
  root.querySelector('form').addEventListener('submit', (event) => onSubmit(root, event))
  if ('IntersectionObserver' in globalThis) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: 0.12 })
    root.querySelectorAll('.reveal').forEach((section) => observer.observe(section))
  } else root.querySelectorAll('.reveal').forEach((section) => section.classList.add('is-visible'))
}
