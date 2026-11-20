export interface ColorScheme {
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  border: string;
  borderLight: string;
  card: string;
  cardHighlight: string;
  indicatorInactive: string;
  chipBackground: string;
  chipSelected: string;
  tabBar: string;
  tabBarBorder: string;
}

export const lightColors: ColorScheme = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  card: '#FFFFFF',
  cardHighlight: '#F8FAFC',
  indicatorInactive: '#CBD5E1',
  chipBackground: '#F1F5F9',
  chipSelected: '#2563EB',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export const darkColors: ColorScheme = {
  background: '#0A0E18',
  surface: '#1E293B',
  surfaceElevated: '#243247',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  primary: '#3B82F6',
  primaryLight: '#1E3A8A',
  primaryDark: '#2563EB',
  success: '#10B981',
  successLight: '#064E3B',
  error: '#F43F5E',
  errorLight: '#881337',
  warning: '#F59E0B',
  warningLight: '#78350F',
  border: '#334155',
  borderLight: '#1E293B',
  card: '#1E293B',
  cardHighlight: '#283548',
  indicatorInactive: '#475569',
  chipBackground: '#1E293B',
  chipSelected: '#3B82F6',
  tabBar: '#0F172A',
  tabBarBorder: '#1E293B',
};
