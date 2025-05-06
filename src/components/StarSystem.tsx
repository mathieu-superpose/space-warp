import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { generatePos } from "../utils/stars"
import { useFrame } from "@react-three/fiber"

const STAR_COUNT = 100

function StarSystem() {
  const starsRef = useRef<THREE.InstancedMesh>(null)

  const starGeometry = useMemo(
    () => new THREE.BoxGeometry(0.05, 0.05, 0.05),
    []
  )
  const starMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    []
  )

  const temp = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  //   const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), [])
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
  }, [])

  useFrame(({ clock }, delta) => {
    if (!starsRef?.current) {
      return
    }

    const stars = starsRef.current
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.getMatrixAt(i, temp)

      // update scale
      tempObject.scale.set(1, 1, Math.max(1, Math.pow(0.5, elapsedTime) * 10))

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

      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z)
      tempObject.updateMatrix()
      stars.setMatrixAt(i, tempObject.matrix)
    }

    stars.instanceMatrix.needsUpdate = true
    if (stars.instanceColor) stars.instanceColor.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh
        ref={starsRef}
        args={[starGeometry, starMaterial, STAR_COUNT]}
      />
    </group>
  )
}

export default StarSystem
