import { animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedNumber({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(v) {
        setValue(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <span>{value}</span>;
}
