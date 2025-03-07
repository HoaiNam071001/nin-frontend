import React, { useState, ChangeEvent } from 'react';
import NInput from './NInput';

interface DatePickerProps {
  value?: string;
  onChange?: (dateString: string) => void;
  className?: string;
  placeholder?: string;
}

const NDatePicker: React.FC<DatePickerProps> = ({ value, onChange, className, placeholder }) => {
  const [date, setDate] = useState<string>(() => {
    if (value) {
      const dateObj = new Date(value);
      return dateObj.toISOString().split('T')[0];
    }
    return '';
  });

  const [time, setTime] = useState<string>(() => {
    if (value) {
      const dateObj = new Date(value);
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  });

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (onChange && time) {
      onChange(`${newDate}T${time}:00.000Z`);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (onChange && date) {
      onChange(`${date}T${newTime}:00.000Z`);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
     <NInput
        type="date"
        value={date}
        onValueChange={handleDateChange}
        className="border rounded p-2"
      />
      <NInput
        type="time"
        value={time}
        onValueChange={handleTimeChange}
        className="border rounded p-2"
      />
    </div>
  );
};

export default NDatePicker;