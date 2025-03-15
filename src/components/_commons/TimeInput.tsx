import React, { useState, useEffect } from "react";
import NInput from "./NInput";
import I18n from "./I18n";

interface HourMinuteInputProps {
  defaultSeconds?: number; // Giá trị mặc định (số giây)
  onChange?: (seconds: number) => void; // Hàm xử lý khi giá trị thay đổi (số giây)
}

const TimeInput: React.FC<HourMinuteInputProps> = ({
  defaultSeconds,
  onChange,
}) => {
  const [current, setCurrent] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    if (defaultSeconds !== undefined) {
      const h = Math.floor(defaultSeconds / 3600);
      const m = Math.floor((defaultSeconds % 3600) / 60);
      setHours(h);
      setMinutes(m);
    }
  }, [defaultSeconds]);

  useEffect(() => {
    const value = hours * 3600 + minutes * 60;
    if (onChange && value !== current) {
      onChange(value);
    }
    setCurrent(current);
  }, [hours, minutes]);

  const handleHoursChange = (num: number) => {
    setHours(Number(num));
  };

  const handleMinutesChange = (num: number) => {
    setMinutes(Number(num));
  };

  return (
    <div className="flex items-center gap-2">
      <NInput
        className="w-[100px]"
        type="number"
        align={"right"}
        value={hours}
        onValueChange={handleHoursChange}
      />
      <I18n i18key={"Hours"} />
      <NInput
        type="number"
        className="w-[100px]"
        align={"right"}
        value={minutes}
        onValueChange={handleMinutesChange}
      />
      <I18n i18key={"Minutes"} />
    </div>
  );
};

export default TimeInput;
