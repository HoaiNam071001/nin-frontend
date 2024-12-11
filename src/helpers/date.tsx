import { DATE_FORMATS } from "@/constants";
import moment from "moment";

export function formatDate(dateString: string, format = DATE_FORMATS.SHORT_DATE_VERBOSE): string {
  const date = moment(dateString);

  if (!date.isValid()) {
    return dateString;
  }

  return date.format(format);
}
