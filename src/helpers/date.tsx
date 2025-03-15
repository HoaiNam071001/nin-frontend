import { DATE_FORMATS } from "@/constants";
import moment from "moment";

export function formatDate(dateString: string, format = DATE_FORMATS.SHORT_DATE_VERBOSE): string {
  const date = moment(dateString);

  if (!date.isValid()) {
    return dateString;
  }

  return date.format(format);
}

export function convertSecondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    h: hours,
    m: minutes,
    s: secs,
  };
}


export function formatSecondsToHHMM(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

export const convertHHMMtoSeconds = (time: string | number): number => {
  if (typeof time === 'number') {
    return time;
  }
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};