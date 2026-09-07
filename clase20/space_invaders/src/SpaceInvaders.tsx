import { useEffect, useRef, useState } from "react";

export default function SpaceInvaders() {
  const gameRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const shipPosition = useRef(0);
  const [shipX, setShipX] = useState(0);
  const [bulletX, setBulletX] = useState<number | null>(null);
  const [bulletY, setBulletY] = useState<number | null>(null);
  const [enemyX, setEnemyX] = useState<number | null>(null);
  const [enemyBulletX, setEnemyBulletX] = useState<number | null>(null);
  const [enemyBulletY, setEnemyBulletY] = useState<number | null>(null);
  const pressedKeys = useRef(new Set<string>());
  const [enemyList, setEnemyList] = useState<
    { x: number; type: string }[]
  >([]);

  useEffect(() => {
    const updatePositions = () => {
      const game = gameRef.current;
      const ship = shipRef.current;
      const enemy = enemyRef.current;

      if (!game || !ship || !enemy) return;

      const gameWidth = game.clientWidth;
      const enemyWidth = enemy.offsetWidth;
      const centeredShip = gameWidth / 2;
      const randomEnemyX =
        enemyWidth / 2 + Math.random() * (gameWidth - enemyWidth);

      shipPosition.current = centeredShip;
      setShipX(centeredShip);
      setBulletX(centeredShip);
      setBulletY(ship.offsetHeight);
      setEnemyX(randomEnemyX);
      setEnemyBulletX(randomEnemyX);
      setEnemyBulletY(enemy.offsetTop + enemy.offsetHeight);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const movement = setInterval(() => {
      const game = gameRef.current;
      const ship = shipRef.current;

      if (!game || !ship) return;

      const minimumX = ship.offsetWidth / 2;
      const maximumX = game.clientWidth - minimumX;
      let nextX = shipPosition.current;

      if (pressedKeys.current.has("ArrowLeft")) {
        nextX -= 8;
      }
      if (pressedKeys.current.has("ArrowRight")) {
        nextX += 8;
      }

      nextX = Math.max(minimumX, Math.min(maximumX, nextX));
      shipPosition.current = nextX;
      setShipX(nextX);
    }, 300);

    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movement);
    };
  }, []);

  useEffect(() => {
    const bulletMovement = setInterval(() => {
      const gameHeight = gameRef.current?.clientHeight ?? 0;

      setBulletY((currentY) => {
        if (currentY === null) return null;
        const nextY = currentY + 40;
        return nextY >= gameHeight ? null : nextY;
      });

      setEnemyBulletY((currentY) => {
        if (currentY === null) return null;
        const nextY = currentY + 40;
        return nextY >= gameHeight ? null : nextY;
      });
    }, 500);

    return () => clearInterval(bulletMovement);
  }, []);

  useEffect(() => {
    const createEnemies = () => {
      const game = gameRef.current;
      const enemy = enemyRef.current;

      if (!game || !enemy) return;

      const gameWidth = game.clientWidth;
      const enemyWidth = enemy.offsetWidth;

      const types = ["A", "B", "C"];
      const enemies: { x: number; type: string }[] = [];

      for (let i = 0; i < 5; i++) {
        const randomType = types[Math.floor(Math.random() * 3)];
        const randomX =
          enemyWidth / 2 + Math.random() * (gameWidth - enemyWidth);
        enemies.push({ x: randomX, type: randomType });
      }

      setEnemyList(enemies);
    };

    createEnemies();
    window.addEventListener("resize", createEnemies);

    return () => window.removeEventListener("resize", createEnemies);
  }, []);

  return (
    <div className="game" ref={gameRef}>
      <h1>Space Invaders</h1>
      {enemyBulletX !== null && enemyBulletY !== null && (
        <div
          className="enemy_bullet"
          style={{ left: `${enemyBulletX}px`, top: `${enemyBulletY}px` }}
        ></div>
      )}
      {bulletX !== null && bulletY !== null && (
        <div
          className="bullet"
          style={{ left: `${bulletX}px`, bottom: `${bulletY}px` }}
        ></div>
      )}
      <div className="ship" ref={shipRef} style={{ left: `${shipX}px` }}></div>
      <div
        className="enemy_ship"
        ref={enemyRef}
        style={{ left: enemyX === null ? "50%" : `${enemyX}px` }}
      ></div>
      {enemyList.map((enemy, index) => (
        <div
          key={index}
          className="enemy_ship"
          style={{
            left: `${enemy.x}px`,
            top: `${14 + Math.floor(index / 3) * 6}rem`,
          }}
        >
          {enemy.type}
        </div>
      ))}
    </div>
  );
}