"use client";

import { convertSecondsToHMS } from "@/helpers/date";
import React, { useEffect, useState } from "react";
import I18n from "./I18n";

interface HMSDisplayProps {
  seconds: number;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  mode?: HMSDisplayMode;
}
export enum HMSDisplayMode {
  full = "full",
  short = "short",
}

const HMSDisplay = ({
  seconds,
  showHour = true,
  showMinute = true,
  showSecond = true,
  mode = HMSDisplayMode.full, // Default to full mode
}: HMSDisplayProps) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const hms = convertSecondsToHMS(seconds);
    setValue(hms);
  }, [seconds]);

  if (!value) {
    return null; // or loading state, etc.
  }

  return (
    <span>
      <>
        {showHour && value.h > 0 && (
          <>
            {value.h}
            {mode === HMSDisplayMode.full ? <>{" "}<I18n i18key={"Hours"} /></> : "h"}
          </>
        )}
        {showMinute && value.m > 0 && (
          <>
            {showHour && " "}
            {value.m}
            {mode === HMSDisplayMode.full ? <>{" "}<I18n i18key={"Minutes"} /></>  : "m"}
          </>
        )}

        {showSecond && value.s > 0 && (
          <>
            {(showHour || showMinute) && " "}
            {value.s}
            {mode === HMSDisplayMode.full ? <>{" "}<I18n i18key={"Seconds"} /></> : "s"}
          </>
        )}
      </>
    </span>
  );
};

export default HMSDisplay;
