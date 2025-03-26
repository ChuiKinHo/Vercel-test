import { useState } from "react";

const CustomSlider = ({ min, max, step, initialValue = 300, onValueChange, unit }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-s5 opacity-60">{min}</span>
        <span className="text-xs font-bold text-s6">{`${value} ${unit}`}</span>
        <span className="text-xs text-s5 opacity-60">{max}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-s1 rounded-lg appearance-none cursor-pointer focus:outline-none accent-blue-600"
        // style={{
        //   background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
        //     ((value - min) / (max - min)) * 100
        //   }%, #e5e7eb ${((value - min) / (max - min)) * 100}%,rgb(255, 255, 255) 100%)`,
        // }}
      />
    </div>
  );
};

export default CustomSlider;
