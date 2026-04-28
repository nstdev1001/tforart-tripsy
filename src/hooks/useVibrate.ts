export const useVibrate = () => {
  const vibrate = (pattern: number | number[] = 50) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.debug("Vibration not available:", error);
      }
    }
  };

  const vibrateShort = () => vibrate(30);
  const vibrateMedium = () => vibrate(50);
  const vibrateLong = () => vibrate(100);
  const vibrateDouble = () => vibrate([30, 50, 30]);
  const vibrateSuccess = () => vibrate([50, 30, 100]);

  return {
    vibrate,
    vibrateShort,
    vibrateMedium,
    vibrateLong,
    vibrateDouble,
    vibrateSuccess,
  };
};
