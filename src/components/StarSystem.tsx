import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing"
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing"

import { generatePos } from "../utils/stars"

const STAR_COUNT = 100
const CHROMATIC_ABBERATION_OFFSET = 0.003

function StarSystem() {
  const starsRef = useRef<THREE.InstancedMesh>(null)
  const effectsRef = useRef<ChromaticAberrationEffect>(null)
  const clock = useMemo(() => new THREE.Clock(), [])

  const starGeometry = useMemo(
    () => new THREE.BoxGeometry(0.05, 0.05, 0.05),
    []
  )
  const starMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial()
    const color = new THREE.Color()
    color.r = 1.5
    color.g = 1.5
    color.b = 1.5
    material.color = color

    material.toneMapped = false
    return material
  }, [])

  const temp = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), [])
  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    if (!starsRef?.current) {
      return
    }

    const stars = starsRef.current

    const t = new THREE.Object3D()
    let j = 0

    for (let i = 0; i < STAR_COUNT * 3; i += 3) {
      t.position.set(generatePos(), generatePos(), generatePos())
      t.updateMatrix()

      stars.setMatrixAt(j++, t.matrix)
    }

    stars.instanceMatrix.needsUpdate = true
    clock.start()

    // restart the clock on click to reset the animation and accelerate the stars
    const handleClick = () => {
      clock.elapsedTime = 0
    }

    // change the cursor to a pointer
    document.body.style.cursor = "pointer"

    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("click", handleClick)
    }
  }, [])

  useFrame((_state, delta) => {
    if (!starsRef?.current) {
      return
    }

    const stars = starsRef.current
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.getMatrixAt(i, temp)

      // update scale
      tempScale.set(1, 1, Math.max(1, Math.pow(0.5, elapsedTime) * 10))

      // update position
      tempPos.setFromMatrixPosition(temp)

      // update and apply color
      if (tempPos.z > 0) {
        tempColor.r = tempColor.g = tempColor.b = 1
      } else {
        tempColor.r = tempColor.g = tempColor.b = 1 - tempPos.z / -10
      }

      stars.setColorAt(i, tempColor)

      if (tempPos.z > 10) {
        tempPos.z = -10
      } else {
        tempPos.z += Math.max(delta, Math.pow(0.5, elapsedTime))
      }

      // apply the new position and scale
      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z)
      tempObject.scale.set(tempScale.x, tempScale.y, tempScale.z)
      tempObject.updateMatrix()

      // set the new matrix
      stars.setMatrixAt(i, tempObject.matrix)
    }

    stars.instanceMatrix.needsUpdate = true
    if (stars.instanceColor) stars.instanceColor.needsUpdate = true

    // update post processing uniforms
    if (!effectsRef.current) return

    // check type of effectsRef
    effectsRef.current.offset.x = Math.max(
      0,
      Math.pow(0.5, elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    )
    effectsRef.current.offset.y = Math.max(
      0,
      Math.pow(0.5, elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    )
  })

  return (
    <>
      <instancedMesh
        ref={starsRef}
        args={[starGeometry, starMaterial, STAR_COUNT]}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur />
        <ChromaticAberration
          ref={effectsRef}
          blendFunction={BlendFunction.NORMAL}
          offset={
            new THREE.Vector2(
              CHROMATIC_ABBERATION_OFFSET,
              CHROMATIC_ABBERATION_OFFSET
            )
          }
        />
      </EffectComposer>
    </>
  )
}

export default StarSystem
