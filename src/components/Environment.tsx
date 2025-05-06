function Environment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <color attach="background" args={[0x010912]} />
    </>
  )
}
export default Environment
