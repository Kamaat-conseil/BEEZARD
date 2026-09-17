import './intro.css'

const SEEN_KEY = 'beezard-dream-v1'
const DURATION = 8200

function remembered() {
  try { return localStorage.getItem(SEEN_KEY) === 'seen' } catch { return false }
}

function remember() {
  try { localStorage.setItem(SEEN_KEY, 'seen') } catch { /* Private browsing still permits entry. */ }
}

// A procedural noise field dissolves the actual photograph into translucent wisps.
const fragment = `precision mediump float;
varying vec2 uv;
uniform sampler2D photo;
uniform vec2 size;
uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return noise(p)*.55+noise(p*2.03)*.27+noise(p*4.01)*.13+noise(p*8.02)*.05;}
void main(){
vec2 p=uv; float aspect=size.x/size.y;
vec2 cover=vec2(min(1.,aspect/1.777),min(1.,1.777/aspect));
float progress=smoothstep(2.3,6.3,time);
vec2 flow=vec2(fbm(p*4.+vec2(time*.13,-time*.09)),fbm(p*4.+vec2(7.,time*.12)))-.5;
p+=flow*(.018+progress*.18);
p=(p-.5)*cover*(.91-time*.007)+.5;
vec3 color=texture2D(photo,p).rgb;
float field=fbm(uv*vec2(aspect,1.)*4.+flow*2.+vec2(0.,time*.17));
float edge=field-progress*1.55+.25;
float alpha=smoothstep(-.1,.13,edge);
float glow=exp(-abs(edge)*24.)*progress;
color+=vec3(.8,.27,.06)*glow;
color*=.78+.22*smoothstep(0.,1.5,time);
gl_FragColor=vec4(color,alpha);
}`

function animatePhoto(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl) return () => {}
  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable')
    return shader
  }
  let frame = 0
  let stopped = false
  const image = new Image()
  try {
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}'))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program unavailable')
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    const time = gl.getUniformLocation(program, 'time')
    const size = gl.getUniformLocation(program, 'size')
    const start = performance.now()
    image.onload = () => {
      if (stopped) return
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      canvas.classList.add('ready')
      const draw = (now) => {
        if (stopped) return
        const width = Math.min(innerWidth, 1600)
        const height = Math.round(width * innerHeight / innerWidth)
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform2f(size, canvas.width, canvas.height)
        gl.uniform1f(time, (now-start)/1000)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        frame = requestAnimationFrame(draw)
      }
      frame = requestAnimationFrame(draw)
    }
    image.src = '/assets/beezard-hero.png'
  } catch { canvas.remove() }
  return () => {
    stopped = true
    image.onload = null
    cancelAnimationFrame(frame)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

export function mountIntro(root, { force = false } = {}) {
  if (document.querySelector('.dream-intro')) return
  if (!force && remembered()) return
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  if (motion.matches) { remember(); return }
  const previousFocus = document.activeElement
  const overlay = document.createElement('section')
  overlay.className = 'dream-intro'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'Bienvenue dans l’univers BEEZARD')
  overlay.innerHTML = `<div class="dream-fallback"></div><canvas class="dream-canvas" aria-hidden="true"></canvas><div class="dream-vignette"></div><div class="dream-orbit" aria-hidden="true"></div><p class="dream-whisper">Le vivant a d’autres rêves.</p><div class="dream-logo"><span aria-hidden="true">✣</span><strong>BEEZARD</strong><small>LA MATIÈRE S’ÉVEILLE</small></div><p class="dream-caption">Une autre nature prend forme.</p><button class="dream-skip">Passer l’introduction <span aria-hidden="true">↗</span></button><div class="dream-progress" aria-hidden="true"></div>`
  document.body.append(overlay)
  root.inert = true
  document.body.classList.add('dream-playing')
  let stop = () => {}
  try { stop = animatePhoto(overlay.querySelector('canvas')) } catch { /* CSS fallback remains playable. */ }
  const finish = () => {
    clearTimeout(timer)
    stop()
    remember()
    root.inert = false
    overlay.remove()
    document.body.classList.remove('dream-playing')
    document.removeEventListener('keydown', onKey)
    motion.removeEventListener('change', finish)
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
  }
  const onKey = (event) => {
    if (event.key === 'Escape') finish()
    if (event.key === 'Tab') { event.preventDefault(); overlay.querySelector('button').focus() }
  }
  const timer = setTimeout(finish, DURATION)
  overlay.querySelector('button').addEventListener('click', finish)
  overlay.querySelector('button').focus({ preventScroll: true })
  document.addEventListener('keydown', onKey)
  motion.addEventListener('change', finish)
}
