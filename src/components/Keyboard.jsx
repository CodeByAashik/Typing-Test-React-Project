import { useState } from "react";

const keyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["Ctrl", "Alt", "Space", "alt", "ctrl"]
];

const keyWidthMap = {
  Backspace: "w-24",
  Tab: "w-16",
  Caps: "w-20",
  Enter: "w-24",
  Shift: "w-28",
  Space: "w-[400px]",
  Ctrl: "w-16",
  Alt: "w-16",
};

export default function Keyboard() {
  const [activeKey, setActiveKey] = useState(null);

  const handleKeyClick = (key) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 120);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl w-fit mx-auto select-none mt-4">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 mb-2">
          {row.map((key) => (
            <div
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`
                h-12 flex items-center justify-center
                rounded-md cursor-pointer
                text-sm font-semibold
                bg-zinc-800 text-zinc-200
                shadow-[0_4px_0_#18181b]
                transition-all duration-75
                ${
                  activeKey === key
                    ? "translate-y-1 shadow-[0_1px_0_#18181b] bg-zinc-700"
                    : "hover:bg-zinc-700"
                }
                ${keyWidthMap[key] || "w-12"}
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
