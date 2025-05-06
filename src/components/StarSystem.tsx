import { use, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { generatePos } from "../utils/stars"
import { useFrame } from "@react-three/fiber"

const STAR_COUNT = 100

function StarSystem() {
  const starsRef = useRef<THREE.InstancedMesh>(null)

  const starGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), [])
  const starMaterial = useMemo(() => new THREE.MeshNormalMaterial(), [])

  const temp = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])

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

  useFrame((_state, delta) => {
    if (!starsRef?.current) {
      return
    }

    const stars = starsRef.current

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.getMatrixAt(i, temp)
      tempPos.setFromMatrixPosition(temp)

      if (tempPos.z > 5) {
        tempPos.z = -5
      } else {
        tempPos.z += delta
      }

      temp.setPosition(tempPos)

      stars.setMatrixAt(i, temp)
    }

    stars.instanceMatrix.needsUpdate = true
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
