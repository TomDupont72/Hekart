import { useEffect, useState } from "react";

type TimerProps = React.InputHTMLAttributes<HTMLInputElement> & {
  endTime: number;
  totalSeconds: number;
};

export default function Timer({ endTime, totalSeconds, ...props }: TimerProps) {
  const [seconds, setSeconds] = useState(
    Math.max(0, Math.round((endTime - Date.now()) / 1000)),
  );
  const [remainingMs, setRemainingMs] = useState(endTime - Date.now());

  const FPS = 1000 / 30;

  const radius = 30;
  const stroke = 5;
  const borderStroke = stroke + 4;
  const normalizedRadius = radius - borderStroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = remainingMs / (totalSeconds * 1000);
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setRemainingMs(remaining);
      setSeconds(Math.ceil(remaining / 1000));
    }, FPS);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="var(--foreground)"
          fill="transparent"
          strokeWidth={borderStroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="var(--secondary-background)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="var(--main)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-25 ease-linear"
        />
      </svg>

      <p className="absolute text-2xl">{seconds}</p>
    </div>
  );
}
