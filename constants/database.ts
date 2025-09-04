import { CheckStatus, ActionType } from '@/types/database'

export const CHECK_STATUS: Record<CheckStatus, { label: string; color: string }> = {
  NONE: {
    label: '正常',
    color: 'text-gray-600'
  },
  YELLOW: {
    label: '警告',
    color: 'text-yellow-600'
  },
  RED: {
    label: '危険',
    color: 'text-red-600'
  }
} as const

export const ACTION_TYPE: Record<ActionType, { label: string; color: string }> = {
  CHECK_YELLOW: {
    label: '黄色チェック',
    color: 'text-yellow-600'
  },
  CHECK_RED: {
    label: '赤チェック', 
    color: 'text-red-600'
  },
  UNCHECK: {
    label: 'チェック解除',
    color: 'text-green-600'
  }
} as const