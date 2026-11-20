import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

/**
 * Computes a bulletproof top safe area offset that prevents content
 * from colliding with Android status bar cutouts/punch-holes or iOS Dynamic Island.
 */
export const getHeaderTopInset = (insets: EdgeInsets, extraOffset: number = 16): number => {
  if (Platform.OS === 'android') {
    return Math.max(RNStatusBar.currentHeight || 0, insets.top, 28) + extraOffset;
  }
  return Math.max(insets.top, 44) + Math.max(extraOffset - 4, 8);
};
