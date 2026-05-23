import { useState, useEffect, useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  debounceMs?: number;
}

export default function RangeSlider({ min, max, value, onChange, step, debounceMs = 300 }: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if external value changes (e.g. reset filters)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setLocalValue(v); // instant visual update
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), debounceMs);
  }

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step ?? "any"}
      value={localValue}
      onChange={handleChange}
      className="slider-thumb"
    />
  );
}
