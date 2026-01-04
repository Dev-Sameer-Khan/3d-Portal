import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Stats,
  Text,
  useCursor,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Fish } from "./Fish";
import { Cactus } from "./Cactus";
import { Dragon } from "./Dragon";
import { useState } from "react";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect } from "react";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  const camera = useRef();

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      camera.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      camera.current.setLookAt(0, 0, 5, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <Stats />
      {/* <OrbitControls /> */}
      <CameraControls ref={camera} />
      <Environment preset="sunset" />
      <ambientLight intensity={1} />
      <color attach={"background"} args={["#111"]} />
      <Stage
        position-z={-0.5}
        name={"Fish"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
        color={"#188EBB"}
        texture={
          "/textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
      >
        <Fish position-y={-1} scale={0.7} hovered={hovered === "Fish"} />
      </Stage>
      <Stage
        position-x={4}
        rotation-y={-Math.PI / 10}
        name={"Cactus"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
        color={"#587F39"}
        texture={"/textures/anime_art_style_cactus_forest.jpg"}
      >
        <Cactus position-y={-1} scale={0.5} hovered={hovered === "Cactus"} />
      </Stage>
      <Stage
        name={"Dragon"}
        position-x={-4}
        rotation-y={Math.PI / 10}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
        color={"#CF6930"}
        texture={"/textures/anime_art_style_lava_world.jpg"}
      >
        <Dragon position-y={-1} scale={0.6} hovered={hovered === "Dragon"} />
      </Stage>
    </>
  );
};

const Stage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const mat = useRef();
  useFrame((_state, delta) => {
    let isOpen = active === name;
    easing.damp(mat.current, "blend", isOpen ? 1 : 0, 0.2, delta);
  });

  useCursor(hovered === name);

  return (
    <mesh {...props}>
      <Text fontSize={0.5} fontWeight={700} position={[0, -1.6, 0.1]}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[3, 4, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerOver={() => setHovered(name)}
        onPointerOut={() => setHovered(null)}
      >
        <MeshPortalMaterial side={2} ref={mat}>
          <Environment preset="sunset" />
          <ambientLight intensity={1} />
          <mesh>
            <sphereGeometry args={[10, 32, 32]} />
            <meshStandardMaterial side={THREE.BackSide} map={map} />
          </mesh>
          {children}
        </MeshPortalMaterial>
      </RoundedBox>
    </mesh>
  );
};
