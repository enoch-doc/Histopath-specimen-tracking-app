// src/constants/theme.js

export const COLORS = {
  // Primary colors
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  
  // Status colors
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#EF4444',
  info: '#06B6D4',
  
  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background
  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
  
  // Priority colors
  stat: '#EF4444',
  urgent: '#F97316',
  routine: '#3B82F6',
};

export const SIZES = {
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusFull: 999,
  
  // Button heights
  buttonHeight: 50,
  buttonHeightSm: 40,
  
  // Input heights
  inputHeight: 50,
};

// SIMPLIFIED SHADOWS - Android compatible
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const STAGES = {
  RECEPTION: 'reception',
  GROSSING: 'grossing',
  PROCESSING: 'processing',
  EMBEDDING: 'embedding',
  SECTIONING: 'sectioning',
  STAINING: 'staining',
  SLIDE_LABELING: 'slide_labeling',
  SLIDE_DISPATCH: 'slide_dispatch',
  REPORTING: 'reporting',
  TYPING: 'typing',
  DISPATCH: 'dispatch',
};

export const STAGE_LABELS = {
  [STAGES.RECEPTION]: 'Reception/Registration',
  [STAGES.GROSSING]: 'Grossing/Tissue Selection',
  [STAGES.PROCESSING]: 'Tissue Processing',
  [STAGES.EMBEDDING]: 'Embedding',
  [STAGES.SECTIONING]: 'Sectioning/Microtomy',
  [STAGES.STAINING]: 'Staining',
  [STAGES.SLIDE_LABELING]: 'Slide Labeling',
  [STAGES.SLIDE_DISPATCH]: 'Slide Dispatch to Pathologist',
  [STAGES.REPORTING]: 'Reporting',
  [STAGES.TYPING]: 'Typing/Verification',
  [STAGES.DISPATCH]: 'Report Dispatch/Collection',
};

export const ROLES = {
  RECEPTIONIST: 'receptionist',
  LAB_TECH: 'lab_technician',
  LAB_SCIENTIST: 'lab_scientist',
  PATHOLOGIST: 'pathologist',
  SECRETARY: 'secretary',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.RECEPTIONIST]: 'Receptionist',
  [ROLES.LAB_TECH]: 'Medical Lab Technician',
  [ROLES.LAB_SCIENTIST]: 'Medical Lab Scientist',
  [ROLES.PATHOLOGIST]: 'Pathologist',
  [ROLES.SECRETARY]: 'Secretary/Typist',
  [ROLES.ADMIN]: 'Administrator',
};

export const PRIORITY = {
  STAT: 'stat',
  URGENT: 'urgent',
  ROUTINE: 'routine',
};

export const PRIORITY_LABELS = {
  [PRIORITY.STAT]: 'STAT',
  [PRIORITY.URGENT]: 'Urgent',
  [PRIORITY.ROUTINE]: 'Routine',
};

export const SPECIMEN_TYPES = [
  'Biopsy',
  'Cytology',
  'Fine Needle Aspiration',
  'Excision',
  'Resection',
  'Curettage',
  'Other',
];