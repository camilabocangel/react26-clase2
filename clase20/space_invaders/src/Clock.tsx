import { useState, useEffect } from "react";

export default function Clock() {
  const [seconds, setSeconds] = useState<number>(0);
  useEffect(() => {
    const clock: number = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => {
      clearInterval(clock);
    };
  }, []);

  return <p>Seconds: {seconds}</p>;
}