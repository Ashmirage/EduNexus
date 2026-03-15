"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ReviewButtonsProps = {
  onKnow: () => void;
  onDontKnow: () => void;
  disabled?: boolean;
};

export function ReviewButtons({ onKnow, onDontKnow, disabled }: ReviewButtonsProps) {
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }
      if (event.key === "ArrowRight") {
        onKnow();
      }
      if (event.key === "ArrowLeft") {
        onDontKnow();
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [disabled, onDontKnow, onKnow]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          className="h-12 w-full border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          onClick={onDontKnow}
          disabled={disabled}
        >
          不认识 (←)
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={onKnow}
          disabled={disabled}
        >
          认识 (→)
        </Button>
      </motion.div>
    </div>
  );
}
