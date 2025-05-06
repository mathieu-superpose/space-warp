import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { generatePos } from "../utils/stars"

const STAR_COUNT = 100

function StarSystem() {
  const ref = useRef<THREE.InstancedMesh>(null)

  const starGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), [])
  const starMaterial = useMemo(() => new THREE.MeshNormalMaterial(), [])

  useEffect(() => {
    if (!ref?.current) {
      return
    }

    const temp = new THREE.Object3D()

    for (let i = 0; i < STAR_COUNT; i++) {
      temp.position.set(generatePos(), generatePos(), 0)
      temp.updateMatrix()
      ref.current.setMatrixAt(i, temp.matrix)
    }

    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group>
      <instancedMesh
        ref={ref}
        args={[starGeometry, starMaterial, STAR_COUNT]}
      />
    </group>
  )
}
export default StarSystem
