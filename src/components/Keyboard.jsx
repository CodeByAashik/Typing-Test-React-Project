import { useState } from "react";

const keyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["Ctrl", "Alt", "Space", "slt", "ctrl"]
];

const keyWidthMap = {
  Backspace: "w-16 sm:w-20 md:w-24",
  Tab: "w-12 sm:w-14 md:w-16",
  Caps: "w-14 sm:w-16 md:w-20",
  Enter: "w-16 sm:w-20 md:w-24",
  Shift: "w-20 sm:w-24 md:w-28",
  shift: "w-20 sm:w-24 md:w-28",
  Space: "w-32 sm:w-48 md:w-64 lg:w-[400px]",
  Ctrl: "w-12 sm:w-14 md:w-16",
  ctrl: "w-12 sm:w-14 md:w-16",
  Alt: "w-12 sm:w-14 md:w-16",
  alt: "w-12 sm:w-14 md:w-16",
};

export default function Keyboard() {
  const [activeKey, setActiveKey] = useState(null);

  const handleKeyClick = (key) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
  };

  return (
    <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl w-full max-w-4xl mx-auto select-none mt-4">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-1.5 md:mb-2 justify-center">
          {row.map((key) => (
            <div
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`
                h-10 sm:h-11 md:h-12 flex items-center justify-center
                rounded-md cursor-pointer
                text-xs sm:text-sm font-semibold
                bg-zinc-800 text-zinc-200
                shadow-[0_4px_0_#18181b]
                transition-all duration-75
                ${key === "Space" ? "px-2" : "px-1 sm:px-1.5 md:px-2"}
                ${keyWidthMap[key] || "w-8 sm:w-9 md:w-12"}
                ${
                  activeKey === key
                    ? "translate-y-1 shadow-[0_1px_0_#18181b] bg-zinc-700"
                    : "hover:bg-zinc-700 active:translate-y-1 active:shadow-[0_1px_0_#18181b] active:bg-zinc-700"
                }
              `}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
