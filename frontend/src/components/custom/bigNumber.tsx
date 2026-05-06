type NumberProps = {
  number: number | null;
};

export default function BigNumber({ number, ...props }: NumberProps) {
  const names: Record<number, string> = {
    2: "million",
    3: "milliard",
    4: "billion",
    5: "billiard",
    6: "trillion",
    7: "trilliard",
    8: "quadrillon",
    9: "quadrillard",
  };

  console.log(number);

  const exponentDict =
    number != null ? Math.floor(Math.log10(number) / 3) : null;

  const exponent = number != null ? Math.floor(Math.log10(number)) : null;

  let numberDec: number | null;

  if (number != null && exponentDict != null && exponentDict < 2) {
    numberDec = number;
  } else {
    numberDec =
      number != null && exponent != null
        ? Math.round(number * Math.pow(10, 2 - exponent)) /
          Math.pow(10, 2 - (exponent % 3))
        : null;
  }

  console.log(numberDec);

  return (
    <span>
      {numberDec ? numberDec.toLocaleString() : "Pas de réponse"}
      {!exponentDict || exponentDict < 2 ? null : ` ${names[exponentDict]}`}
      {numberDec && exponentDict && exponentDict >= 2 && numberDec >= 2
        ? "s"
        : null}
    </span>
  );
}
