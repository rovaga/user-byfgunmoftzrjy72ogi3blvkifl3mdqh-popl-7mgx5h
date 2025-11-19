import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <canvas id="wedding-canvas"></canvas>
  <section class="hud">
    <div class="hud__header">
      <h1>El Payaso del Rodeo</h1>
      <p class="status" data-status>¡Baila al mismo ritmo!</p>
    </div>
    <div class="game-stats">
      <div class="stat">
        <span class="stat-label">Vidas:</span>
        <span class="stat-value" id="lives">3</span>
      </div>
      <div class="stat">
        <span class="stat-label">Ritmo:</span>
        <span class="stat-value" id="rhythm">0%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Puntuación:</span>
        <span class="stat-value" id="score">0</span>
      </div>
    </div>
    <p data-tip>Usa las flechas o WASD para moverte. Mantén el ritmo con todos los bailarines.</p>
    <ul class="actions">
      <li><strong>Flechas/WASD</strong> Mover jugador</li>
      <li><strong>Mouse</strong> Rotar cámara</li>
      <li><strong>Rueda</strong> Acercar/Alejar</li>
    </ul>
  </section>
`

const canvas = document.getElementById('wedding-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a0f0a)
scene.fog = new THREE.Fog(0x1a0f0a, 30, 80)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
)
camera.position.set(15, 12, 15)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 3, 0)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 1.8
controls.minDistance = 5
controls.maxDistance = 40

// Iluminación cálida para el salón
const ambientLight = new THREE.AmbientLight(0xfff5e1, 0.4)
scene.add(ambientLight)

// Luces principales del salón
const mainLight = new THREE.DirectionalLight(0xfff5e1, 0.8)
mainLight.position.set(0, 15, 0)
mainLight.castShadow = true
mainLight.shadow.mapSize.set(2048, 2048)
mainLight.shadow.camera.left = -25
mainLight.shadow.camera.right = 25
mainLight.shadow.camera.top = 25
mainLight.shadow.camera.bottom = -25
mainLight.shadow.camera.near = 0.1
mainLight.shadow.camera.far = 50
scene.add(mainLight)

// Luces de color para ambiente festivo
const redLight = new THREE.PointLight(0xff4444, 0.6, 20)
redLight.position.set(-8, 8, -8)
scene.add(redLight)

const greenLight = new THREE.PointLight(0x44ff44, 0.6, 20)
greenLight.position.set(8, 8, 8)
scene.add(greenLight)

const whiteLight = new THREE.PointLight(0xffffff, 0.8, 15)
whiteLight.position.set(0, 10, 0)
scene.add(whiteLight)

// Crear el salón de eventos
const hallSize = 40
const wallHeight = 12
const wallThickness = 0.5

// Piso del salón
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x3a2a1f,
  roughness: 0.7,
  metalness: 0.1
})
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(hallSize, hallSize),
  floorMaterial
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Pista de baile central (ampliada para el juego)
const danceFloorSize = 20  // Ampliada de 12 a 20
const danceFloorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a1a0f,
  roughness: 0.3,
  metalness: 0.2
})
const danceFloor = new THREE.Mesh(
  new THREE.CircleGeometry(danceFloorSize / 2, 32),
  danceFloorMaterial
)
danceFloor.rotation.x = -Math.PI / 2
danceFloor.position.y = 0.01
danceFloor.receiveShadow = true
scene.add(danceFloor)

// Paredes del salón
const wallMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xf5e6d3,
  roughness: 0.8
})

// Pared frontal (donde está el escenario)
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(hallSize, wallHeight, wallThickness),
  wallMaterial
)
frontWall.position.set(0, wallHeight / 2, -hallSize / 2)
frontWall.receiveShadow = true
scene.add(frontWall)

// Pared trasera
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(hallSize, wallHeight, wallThickness),
  wallMaterial
)
backWall.position.set(0, wallHeight / 2, hallSize / 2)
backWall.receiveShadow = true
scene.add(backWall)

// Pared izquierda
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, hallSize),
  wallMaterial
)
leftWall.position.set(-hallSize / 2, wallHeight / 2, 0)
leftWall.receiveShadow = true
scene.add(leftWall)

// Pared derecha
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, hallSize),
  wallMaterial
)
rightWall.position.set(hallSize / 2, wallHeight / 2, 0)
rightWall.receiveShadow = true
scene.add(rightWall)

// Techo
const ceilingMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xe8dcc8,
  roughness: 0.9
})
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(hallSize, hallSize),
  ceilingMaterial
)
ceiling.rotation.x = Math.PI / 2
ceiling.position.y = wallHeight
ceiling.receiveShadow = true
scene.add(ceiling)

// Escenario para el grupo versátil (frente a la pista de baile)
const stageWidth = 8
const stageDepth = 3
const stageHeight = 0.3
const stageMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8b4513,
  roughness: 0.6
})

const stage = new THREE.Mesh(
  new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth),
  stageMaterial
)
stage.position.set(0, stageHeight / 2, -danceFloorSize / 2 - stageDepth / 2 - 2)
stage.castShadow = true
stage.receiveShadow = true
scene.add(stage)

// Borde del escenario
const stageBorder = new THREE.Mesh(
  new THREE.BoxGeometry(stageWidth + 0.2, 0.1, stageDepth + 0.2),
  new THREE.MeshStandardMaterial({ color: 0x654321 })
)
stageBorder.position.set(0, stageHeight + 0.05, stage.position.z)
scene.add(stageBorder)

// Crear grupo versátil (músicos)
const createMusician = (x, instrumentColor = 0x4a4a4a) => {
  const group = new THREE.Group()
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  body.position.y = 0.6
  body.castShadow = true
  group.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  head.position.y = 1.5
  head.castShadow = true
  group.add(head)
  
  // Instrumento (guitarra o teclado)
  const instrument = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: instrumentColor })
  )
  instrument.position.set(0.4, 0.8, 0)
  instrument.castShadow = true
  group.add(instrument)
  
  group.position.set(x, stageHeight, stage.position.z)
  return group
}

// Crear varios músicos
const musicians = []
const musicianPositions = [-2.5, -0.8, 0.8, 2.5]
const instrumentColors = [0x8b4513, 0x2c2c2c, 0x654321, 0x4a4a4a]

musicianPositions.forEach((x, i) => {
  const musician = createMusician(x, instrumentColors[i])
  musicians.push(musician)
  scene.add(musician)
})

// Micrófonos en el escenario
const createMicrophone = (x) => {
  const micGroup = new THREE.Group()
  
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  )
  stand.position.y = 0.75
  micGroup.add(stand)
  
  const mic = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  )
  mic.position.y = 1.5
  micGroup.add(mic)
  
  micGroup.position.set(x, stageHeight, stage.position.z - 0.5)
  return micGroup
}

const mic1 = createMicrophone(-1.2)
const mic2 = createMicrophone(1.2)
scene.add(mic1)
scene.add(mic2)

// Altavoces en el escenario
const createSpeaker = (x, side) => {
  const speaker = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  )
  speaker.position.set(x, stageHeight + 0.6, stage.position.z + side * 0.3)
  speaker.castShadow = true
  return speaker
}

scene.add(createSpeaker(-3.5, -1))
scene.add(createSpeaker(3.5, -1))

// Mesas alrededor de la pista de baile
const createTable = (x, z) => {
  const tableGroup = new THREE.Group()
  
  // Mesa
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  )
  tableTop.position.y = 0.75
  tableTop.castShadow = true
  tableTop.receiveShadow = true
  tableGroup.add(tableTop)
  
  // Base de la mesa
  const tableBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  tableBase.position.y = 0.35
  tableBase.castShadow = true
  tableGroup.add(tableBase)
  
  // Mantel decorativo (colores mexicanos)
  const tablecloth = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 0.02, 16),
    new THREE.MeshStandardMaterial({ 
      color: Math.random() > 0.5 ? 0xff0000 : 0x00ff00,
      roughness: 0.9
    })
  )
  tablecloth.position.y = 0.72
  tableGroup.add(tablecloth)
  
  // Centro de mesa (flores)
  const centerpiece = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  )
  centerpiece.position.y = 0.9
  centerpiece.castShadow = true
  tableGroup.add(centerpiece)
  
  // Pétalos de flores
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xff1493 : 0xff6347 
      })
    )
    const angle = (i / 6) * Math.PI * 2
    petal.position.set(
      Math.cos(angle) * 0.2,
      0.95,
      Math.sin(angle) * 0.2
    )
    tableGroup.add(petal)
  }
  
  tableGroup.position.set(x, 0, z)
  return tableGroup
}

// Crear mesas alrededor de la pista
const tablePositions = [
  [-8, 6], [0, 6], [8, 6],
  [-8, -6], [0, -6], [8, -6],
  [-10, 0], [10, 0]
]

tablePositions.forEach(([x, z]) => {
  const table = createTable(x, z)
  scene.add(table)
})

// Sillas alrededor de las mesas
const createChair = (x, z, rotation) => {
  const chairGroup = new THREE.Group()
  
  // Asiento
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.1, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  seat.position.y = 0.4
  seat.castShadow = true
  chairGroup.add(seat)
  
  // Respaldo
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x654321 })
  )
  back.position.set(0, 0.7, -0.2)
  back.castShadow = true
  chairGroup.add(back)
  
  // Patas
  const legGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.05)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f1b })
  const legPositions = [
    [-0.2, 0.2, -0.2],
    [0.2, 0.2, -0.2],
    [-0.2, 0.2, 0.2],
    [0.2, 0.2, 0.2]
  ]
  
  legPositions.forEach(([px, py, pz]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial)
    leg.position.set(px, py, pz)
    leg.castShadow = true
    chairGroup.add(leg)
  })
  
  chairGroup.position.set(x, 0, z)
  chairGroup.rotation.y = rotation
  return chairGroup
}

// Agregar sillas alrededor de cada mesa
tablePositions.forEach(([tx, tz]) => {
  const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
  angles.forEach((angle, i) => {
    const distance = 1.5
    const chairX = tx + Math.cos(angle) * distance
    const chairZ = tz + Math.sin(angle) * distance
    const chair = createChair(chairX, chairZ, angle + Math.PI)
    scene.add(chair)
  })
})

// Decoraciones de papel picado (banderines mexicanos)
const createPapelPicado = (startX, endX, y, z, color) => {
  const group = new THREE.Group()
  const count = 8
  const step = (endX - startX) / count
  
  for (let i = 0; i < count; i++) {
    const x = startX + i * step
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.6),
      new THREE.MeshStandardMaterial({ 
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      })
    )
    flag.position.set(x, y, z)
    flag.rotation.y = Math.PI / 2
    group.add(flag)
  }
  
  return group
}

// Papel picado en colores mexicanos (verde, blanco, rojo)
const papelPicado1 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 9, -hallSize/2 + 1, 0xff0000)
scene.add(papelPicado1)

const papelPicado2 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 8.5, -hallSize/2 + 1, 0xffffff)
scene.add(papelPicado2)

const papelPicado3 = createPapelPicado(-hallSize/2 + 2, hallSize/2 - 2, 8, -hallSize/2 + 1, 0x00ff00)
scene.add(papelPicado3)

// Luces decorativas colgantes
const createHangingLight = (x, z, color) => {
  const group = new THREE.Group()
  
  // Cable
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  )
  cable.position.y = wallHeight - 1
  group.add(cable)
  
  // Lámpara
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshStandardMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.5
    })
  )
  lamp.position.y = wallHeight - 2
  group.add(lamp)
  
  // Luz puntual
  const light = new THREE.PointLight(color, 0.5, 5)
  light.position.set(0, wallHeight - 2, 0)
  group.add(light)
  
  group.position.set(x, 0, z)
  return group
}

// Luces decorativas alrededor del salón
const lightPositions = [
  [-12, -12, 0xff4444],
  [12, -12, 0x44ff44],
  [-12, 12, 0xffff44],
  [12, 12, 0xff44ff],
  [0, -15, 0xffffff]
]

lightPositions.forEach(([x, z, color]) => {
  const light = createHangingLight(x, z, color)
  scene.add(light)
})

// Arreglos florales en las esquinas
const createFlowerArrangement = (x, z) => {
  const group = new THREE.Group()
  
  // Maceta
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.25, 0.4, 16),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  )
  pot.position.y = 0.2
  group.add(pot)
  
  // Tallos y flores
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x228b22 })
    )
    stem.position.set(
      Math.cos(angle) * 0.15,
      0.6,
      Math.sin(angle) * 0.15
    )
    group.add(stem)
    
    // Flor
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xff1493 : 0xff6347 
      })
    )
    flower.position.set(
      Math.cos(angle) * 0.15,
      1.0,
      Math.sin(angle) * 0.15
    )
    group.add(flower)
  }
  
  group.position.set(x, 0, z)
  return group
}

// Arreglos florales en las esquinas del salón
const flowerPositions = [
  [-hallSize/2 + 1, -hallSize/2 + 1],
  [hallSize/2 - 1, -hallSize/2 + 1],
  [-hallSize/2 + 1, hallSize/2 - 1],
  [hallSize/2 - 1, hallSize/2 - 1]
]

flowerPositions.forEach(([x, z]) => {
  const flowers = createFlowerArrangement(x, z)
  scene.add(flowers)
})

// ========== SISTEMA DE JUEGO ==========

// Estado del juego
let gameState = {
  lives: 3,
  score: 0,
  rhythm: 0,
  gameOver: false
}

// Actualizar HUD
const updateHUD = () => {
  document.getElementById('lives').textContent = gameState.lives
  document.getElementById('rhythm').textContent = Math.round(gameState.rhythm) + '%'
  document.getElementById('score').textContent = Math.floor(gameState.score)
}

// Crear personaje (jugador)
const createPlayer = () => {
  const playerGroup = new THREE.Group()
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 1, 8),
    new THREE.MeshStandardMaterial({ color: 0xff0000 }) // Rojo para destacar
  )
  body.position.y = 0.5
  body.castShadow = true
  playerGroup.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  head.position.y = 1.2
  head.castShadow = true
  playerGroup.add(head)
  
  // Sombrero de payaso
  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  )
  hat.position.y = 1.5
  playerGroup.add(hat)
  
  // Brazos
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  leftArm.position.set(-0.3, 0.7, 0)
  leftArm.rotation.z = Math.PI / 4
  playerGroup.add(leftArm)
  
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  )
  rightArm.position.set(0.3, 0.7, 0)
  rightArm.rotation.z = -Math.PI / 4
  playerGroup.add(rightArm)
  
  // Piernas
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  leftLeg.position.set(-0.15, 0, 0)
  leftLeg.castShadow = true
  playerGroup.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  rightLeg.position.set(0.15, 0, 0)
  rightLeg.castShadow = true
  playerGroup.add(rightLeg)
  
  playerGroup.position.set(0, 0, 0)
  
  // Agregar userData para animación
  playerGroup.userData = {
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    body,
    head,
    phase: 0,
    speed: 1
  }
  
  return playerGroup
}

// Crear bailarín (NPC)
const createDancer = (age = 'adult', skinTone = 0xffdbac, clothingColor = 0x4a90e2) => {
  const dancerGroup = new THREE.Group()
  
  // Escalar según edad
  let scale = 1
  if (age === 'child') scale = 0.7
  if (age === 'elder') scale = 0.9
  
  // Cuerpo
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.9 * scale, 8),
    new THREE.MeshStandardMaterial({ color: clothingColor })
  )
  body.position.y = 0.45 * scale
  body.castShadow = true
  dancerGroup.add(body)
  
  // Cabeza
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18 * scale, 16, 16),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  head.position.y = 1.1 * scale
  head.castShadow = true
  dancerGroup.add(head)
  
  // Sombrero variado
  const hatTypes = ['none', 'cowboy', 'cap']
  const hatType = hatTypes[Math.floor(Math.random() * hatTypes.length)]
  
  if (hatType === 'cowboy') {
    const hat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25 * scale, 0.3 * scale, 0.2 * scale, 16),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    )
    hat.position.y = 1.35 * scale
    dancerGroup.add(hat)
  } else if (hatType === 'cap') {
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 * scale, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    )
    cap.position.y = 1.3 * scale
    cap.scale.y = 0.5
    dancerGroup.add(cap)
  }
  
  // Brazos
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.5 * scale, 8),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  leftArm.position.set(-0.25 * scale, 0.6 * scale, 0)
  dancerGroup.add(leftArm)
  
  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.5 * scale, 8),
    new THREE.MeshStandardMaterial({ color: skinTone })
  )
  rightArm.position.set(0.25 * scale, 0.6 * scale, 0)
  dancerGroup.add(rightArm)
  
  // Piernas
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  leftLeg.position.set(-0.1 * scale, 0, 0)
  leftLeg.castShadow = true
  dancerGroup.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c2c2c })
  )
  rightLeg.position.set(0.1 * scale, 0, 0)
  rightLeg.castShadow = true
  dancerGroup.add(rightLeg)
  
  dancerGroup.scale.set(scale, scale, scale)
  dancerGroup.userData = {
    age,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    body,
    head,
    phase: Math.random() * Math.PI * 2, // Fase aleatoria para variación
    speed: 0.5 + Math.random() * 0.5, // Velocidad de baile variada
    moveAngle: Math.random() * Math.PI * 2, // Ángulo de movimiento
    moveSpeed: 0.02 + Math.random() * 0.03, // Velocidad de movimiento
    baseRadius: 3 + Math.random() * (danceFloorSize / 2 - 3) // Radio base
  }
  
  return dancerGroup
}

// Crear 30 bailarines diversos
const dancers = []
const dancerCount = 30
const skinTones = [0xffdbac, 0xf4c2a1, 0xd4a574, 0x8d5524, 0x654321]
const clothingColors = [0x4a90e2, 0xe24a4a, 0x4ae24a, 0xe2e24a, 0xe24ae2, 0x4ae2e2]
const ages = ['child', 'adult', 'elder']

for (let i = 0; i < dancerCount; i++) {
  const age = ages[Math.floor(Math.random() * ages.length)]
  const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)]
  const clothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)]
  
  const dancer = createDancer(age, skinTone, clothingColor)
  
  // Posicionar inicialmente en círculo alrededor de la pista
  const angle = (i / dancerCount) * Math.PI * 2
  dancer.position.set(
    Math.cos(angle) * dancer.userData.baseRadius,
    0,
    Math.sin(angle) * dancer.userData.baseRadius
  )
  
  dancers.push(dancer)
  scene.add(dancer)
}

// Crear jugador
const player = createPlayer()
player.position.set(0, 0, 0)
scene.add(player)

// Inicializar HUD
updateHUD()

// Controles del jugador
const playerVelocity = new THREE.Vector3()
const playerSpeed = 0.15
const keys = {}

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true
})

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false
})

// Actualizar movimiento del jugador
const updatePlayerMovement = (delta) => {
  playerVelocity.set(0, 0, 0)
  
  if (keys['w'] || keys['arrowup']) playerVelocity.z -= 1
  if (keys['s'] || keys['arrowdown']) playerVelocity.z += 1
  if (keys['a'] || keys['arrowleft']) playerVelocity.x -= 1
  if (keys['d'] || keys['arrowright']) playerVelocity.x += 1
  
  playerVelocity.normalize().multiplyScalar(playerSpeed)
  
  // Limitar movimiento dentro de la pista
  const newX = player.position.x + playerVelocity.x
  const newZ = player.position.z + playerVelocity.z
  const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ)
  
  if (distanceFromCenter < danceFloorSize / 2 - 0.5) {
    player.position.x = newX
    player.position.z = newZ
  }
}

// Animación del baile del payaso del rodeo
const animateRodeoClownDance = (dancer, time, delta, isPlayer = false) => {
  const { leftArm, rightArm, leftLeg, rightLeg, body, phase, speed, moveAngle, moveSpeed, baseRadius } = dancer.userData
  
  // Ritmo del baile (más rápido para el payaso del rodeo)
  const danceTime = time * speed * 2 + phase
  
  // Movimiento de brazos (como payaso del rodeo - movimientos amplios)
  if (leftArm && rightArm) {
    leftArm.rotation.x = Math.sin(danceTime) * 0.8
    leftArm.rotation.z = Math.sin(danceTime * 1.2) * 0.5
    rightArm.rotation.x = -Math.sin(danceTime) * 0.8
    rightArm.rotation.z = -Math.sin(danceTime * 1.2) * 0.5
  }
  
  // Movimiento de piernas (pasos de baile)
  if (leftLeg && rightLeg) {
    leftLeg.rotation.x = Math.sin(danceTime) * 0.3
    rightLeg.rotation.x = -Math.sin(danceTime) * 0.3
    
    // Levantamiento alternado de piernas
    leftLeg.position.y = Math.max(0, Math.sin(danceTime) * 0.1)
    rightLeg.position.y = Math.max(0, -Math.sin(danceTime) * 0.1)
  }
  
  // Movimiento del cuerpo (balanceo)
  if (body) {
    body.rotation.z = Math.sin(danceTime * 0.8) * 0.1
    body.rotation.x = Math.sin(danceTime * 0.6) * 0.05
  }
  
  // Salto ocasional (característico del payaso del rodeo)
  if (Math.sin(danceTime * 0.5) > 0.8) {
    dancer.position.y = Math.sin(danceTime * 2) * 0.1
  } else {
    dancer.position.y = 0
  }
  
  // Movimiento circular alrededor de la pista (solo para NPCs)
  if (!isPlayer) {
    // Cambiar dirección ocasionalmente
    if (Math.random() < 0.001) {
      dancer.userData.moveAngle += Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 4
    }
    
    // Actualizar ángulo de movimiento
    dancer.userData.moveAngle += moveSpeed * delta * 60 // Normalizado a 60fps
    
    // Mover en círculo con variación de radio
    const radius = baseRadius + Math.sin(time * 0.5 + phase) * 1.5
    const maxRadius = danceFloorSize / 2 - 0.8
    const clampedRadius = Math.min(radius, maxRadius)
    
    dancer.position.x = Math.cos(dancer.userData.moveAngle) * clampedRadius
    dancer.position.z = Math.sin(dancer.userData.moveAngle) * clampedRadius
    
    // Rotar hacia la dirección del movimiento
    dancer.rotation.y = dancer.userData.moveAngle + Math.PI / 2
  }
}

// Detección de colisiones (pisadas)
const checkCollisions = () => {
  const playerRadius = 0.5
  const dancerRadius = 0.4
  
  dancers.forEach((dancer) => {
    const distance = player.position.distanceTo(dancer.position)
    
    if (distance < playerRadius + dancerRadius) {
      // Colisión detectada - perder vida
      if (!dancer.userData.hitCooldown || dancer.userData.hitCooldown < Date.now()) {
        gameState.lives--
        dancer.userData.hitCooldown = Date.now() + 1000 // Cooldown de 1 segundo
        updateHUD()
        
        if (gameState.lives <= 0) {
          gameState.gameOver = true
          document.querySelector('[data-status]').textContent = '¡Game Over! Presiona F5 para reiniciar'
        }
      }
    }
  })
}

// Sistema de ritmo
const updateRhythm = (time) => {
  if (gameState.gameOver) return
  
  // Calcular qué tan sincronizado está el jugador con los demás
  let syncCount = 0
  const playerPhase = time * 2 % (Math.PI * 2)
  
  dancers.forEach((dancer) => {
    const dancerPhase = (time * dancer.userData.speed * 2 + dancer.userData.phase) % (Math.PI * 2)
    const phaseDiff = Math.abs(playerPhase - dancerPhase)
    const normalizedDiff = Math.min(phaseDiff, Math.PI * 2 - phaseDiff) / Math.PI
    
    if (normalizedDiff < 0.3) { // Dentro del 30% de diferencia de fase
      syncCount++
    }
  })
  
  gameState.rhythm = (syncCount / dancers.length) * 100
  
  // Aumentar puntuación si está sincronizado
  if (gameState.rhythm > 50) {
    gameState.score += 0.1
  }
  
  updateHUD()
}

// Animación de los músicos (movimiento sutil)
const clock = new THREE.Clock()

const animateMusicians = (delta) => {
  musicians.forEach((musician, index) => {
    // Movimiento sutil de balanceo al ritmo de la música
    const time = clock.getElapsedTime()
    musician.rotation.z = Math.sin(time * 2 + index) * 0.05
    musician.position.y = stageHeight + Math.sin(time * 3 + index) * 0.1
  })
}

// Animación de las luces (parpadeo suave)
const animateLights = (delta) => {
  const time = clock.getElapsedTime()
  
  // Hacer que las luces de color pulsen suavemente
  redLight.intensity = 0.4 + Math.sin(time * 2) * 0.2
  greenLight.intensity = 0.4 + Math.sin(time * 2 + Math.PI / 2) * 0.2
  whiteLight.intensity = 0.6 + Math.sin(time * 1.5) * 0.2
}

const animate = () => {
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  requestAnimationFrame(animate)
  
  if (!gameState.gameOver) {
    // Actualizar movimiento del jugador
    updatePlayerMovement(delta)
    
    // Animar baile del jugador
    animateRodeoClownDance(player, time, delta, true)
    
    // Animar todos los bailarines
    dancers.forEach((dancer) => {
      animateRodeoClownDance(dancer, time, delta, false)
    })
    
    // Verificar colisiones
    checkCollisions()
    
    // Actualizar ritmo
    updateRhythm(time)
  }
  
  animateMusicians(delta)
  animateLights(delta)
  
  controls.update()
  renderer.render(scene, camera)
}

animate()

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

window.addEventListener('resize', handleResize)
