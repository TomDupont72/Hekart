import { AlertCircleIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

type ErrorAlertProps = {
  error: string | null;
  className?: string;
  setErrorToNull: () => void;
};

export default function ErrorAlert({
  error,
  className,
  setErrorToNull,
}: ErrorAlertProps) {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="error"
        className={className}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25 }}
      >
        <Alert variant="destructive" className="relative max-w-md pr-10">
          <Button
            size="icon"
            variant="noShadow"
            className="absolute right-2 top-2 size-5 bg-background rounded-sm"
            onClick={setErrorToNull}
          >
            <X />
          </Button>
          <AlertCircleIcon />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
