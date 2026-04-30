import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeClosed } from "lucide-react";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
};

export default function InputPassword({ id, ...props }: InputPasswordProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        autoComplete="off"
        type={show ? "text" : "password"}
        {...props}
      ></Input>
      <Button
        type="button"
        variant="noShadow"
        size="icon"
        onClick={() => setShow(!show)}
        className="absolute right-0 top-0 bg-transparent border-none"
      >
        {show ? <EyeClosed /> : <Eye />}
      </Button>
    </div>
  );
}
