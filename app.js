import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3, Color3 } from '@babylonjs/core/Maths/math'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { PointLight } from '@babylonjs/core/Lights/pointLight'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { MorphTargetManager } from '@babylonjs/core/Morph/morphTargetManager'
import { MorphTarget } from '@babylonjs/core/Morph/morphTarget'
import { Animation } from '@babylonjs/core/Animations/animation'
import "@babylonjs/core/Loading/Plugins/babylonFileLoader"
import "@babylonjs/core/Materials/standardMaterial"

let currentAnim = 0
let tick = 0

// Basic setup
const canvas = document.querySelector('#app')
const engine = new Engine(canvas, true, null, true)
const scene = new Scene(engine)

window.addEventListener('resize', () => engine.resize())
engine.runRenderLoop(() => scene.render())

// Lights
const hemisphericLight = new HemisphericLight('HemisphericLight', new Vector3(1, 1, 0), scene)
const pointLight00 = new PointLight('pointLight00', new Vector3(3, 3, -3), scene)
pointLight00.diffuse = new Color3(0.1, 0.5, 0.4)

const pointLight01 = new PointLight('pointLight01', new Vector3(3, 3, -3), scene)
pointLight01.diffuse = new Color3(0.6, 0.1, 0.3)

SceneLoader.ImportMeshAsync(['Sphere Default', 'Sphere Morph'], '/', 'morph.babylon', scene).then(() => {

  const test = scene.getMeshByName('Sphere Default')
  test.convertToFlatShadedMesh()
  test.position = Vector3.Zero()

  const test01 = scene.getMeshByName('Sphere Morph')
  test01.convertToFlatShadedMesh()
  test01.setEnabled(false)

  /*
   * Animations
   */
  const anim = new Animation('InfluenceAnimation', 'influence', 10, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_RELATIVE)
  const keyframes = []
  keyframes.push({ frame: 0, value: 0 })
  keyframes.push({ frame: 10, value: 1 })
  anim.setKeys(keyframes)

  const testMorphTarget = new MorphTarget.FromMesh(test01, 'test01', 0)
  const testManager = new MorphTargetManager()
  testManager.addTarget(testMorphTarget)
  test.morphTargetManager = testManager
  testMorphTarget.animations.push(anim)

  /*
   * Triggers
   */
  window.addEventListener('keyup', e => {
    if (e.code !== 'KeyD') return

    currentAnim++
    if (currentAnim === 2) currentAnim = 0

    switch(currentAnim) {
      case 0:
        scene.beginAnimation(testMorphTarget, 10, 0)
        break
      case 1:
        scene.beginAnimation(testMorphTarget, 0, 10)
        break
      default:
        break
    }
  })
})

// Camera
const camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), scene)
camera.attachControl(canvas)

// scene.registerAfterRender(() => {
//   tick += 0.01
//   pointLight00.position.x = Math.cos(tick) * 5
//   pointLight00.position.z = Math.sin(tick) * 4
//   pointLight00.position.y = Math.sin(tick) * 9

//   pointLight01.position.x = Math.sin(tick) * 8
//   pointLight01.position.z = Math.cos(tick) * 7
//   pointLight01.position.y = Math.sin(tick) * 4
// })
