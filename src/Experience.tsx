import { Canvas } from "@react-three/fiber"

import "./Experience.css"

import Scene from "./scene/Scene"

function Experience() {
  return (
    <div className="experience">
      <Canvas
        camera={{
          fov: 100,
          near: 0.1,
          far: 200,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default Experience
