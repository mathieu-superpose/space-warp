import { OrbitControls } from "@react-three/drei"

import Environment from "../components/Environment"
import StarSystem from "../components/StarSystem"

function Scene() {
  return (
    <>
      <Environment />
      <OrbitControls />

      <StarSystem />
    </>
  )
}
export default Scene
