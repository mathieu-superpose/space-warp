import Environment from "../components/Environment"
import { OrbitControls } from "@react-three/drei"

function Scene() {
  return (
    <>
      <Environment />
      <OrbitControls />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  )
}
export default Scene
