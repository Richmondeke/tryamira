/**
 * Haptic feedback utilities using the Vibration API.
 * Gracefully degrades on devices/browsers that don't support it.
 */

const canVibrate = typeof window !== 'undefined' && 'vibrate' in navigator;

/** Light tap — buttons, toggles, selections */
export function hapticLight() {
  if (canVibrate) navigator.vibrate(10);
}

/** Medium tap — navigation, confirmations */
export function hapticMedium() {
  if (canVibrate) navigator.vibrate(20);
}

/** Heavy tap — destructive actions, important confirmations */
export function hapticHeavy() {
  if (canVibrate) navigator.vibrate([30, 50, 20]);
}

/** Success pattern — completion feedback */
export function hapticSuccess() {
  if (canVibrate) navigator.vibrate([10, 30, 10, 30, 10]);
}
