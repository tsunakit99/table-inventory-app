export interface ErrorHandlerOptions {
  showUserMessage?: boolean
  logToConsole?: boolean
  userMessage?: string
  logLevel?: 'error' | 'warn' | 'info'
}

export function handleError(
  error: unknown,
  context: string,
  options: ErrorHandlerOptions = {}
): string {
  const {
    showUserMessage = true,
    logToConsole = true,
    userMessage,
    logLevel = 'error'
  } = options

  // Extract error message
  let errorMessage: string
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    errorMessage = 'Unknown error occurred'
  }

  // Log to console if enabled
  if (logToConsole) {
    const logMessage = `[${context}] ${errorMessage}`
    switch (logLevel) {
      case 'error':
        console.error(logMessage, error)
        break
      case 'warn':
        console.warn(logMessage, error)
        break
      case 'info':
        console.info(logMessage, error)
        break
    }
  }

  // Determine user-facing message
  const displayMessage = userMessage || getDefaultUserMessage(context)

  // Show user message if enabled
  if (showUserMessage) {
    alert(displayMessage)
  }

  return displayMessage
}

function getDefaultUserMessage(context: string): string {
  const contextMessages: Record<string, string> = {
    'category-add': 'カテゴリの追加に失敗しました',
    'category-delete': 'カテゴリの削除に失敗しました',
    'product-add': '商品の追加に失敗しました',
    'product-delete': '商品の削除に失敗しました',
    'check-submit': 'チェックの登録に失敗しました',
    'history-complete': '完了処理に失敗しました',
    'user-profile-update': 'プロフィールの更新に失敗しました',
    'avatar-upload': '画像のアップロードに失敗しました',
    'logout': 'ログアウトに失敗しました',
    'data-fetch': 'データの取得に失敗しました',
    'data-refresh': 'データの更新に失敗しました',
    'login': 'ログインに失敗しました',
    'signup': 'アカウント作成に失敗しました'
  }

  return contextMessages[context] || '操作に失敗しました'
}

// For React Hook Form integration
export function handleFormError(
  error: unknown,
  context: string,
  setError: (name: 'root', error: { message: string }) => void,
  options: Omit<ErrorHandlerOptions, 'showUserMessage'> = {}
): void {
  const message = handleError(error, context, {
    ...options,
    showUserMessage: false
  })

  setError('root', { message })
}

// For non-critical errors that should only be logged
export function logWarning(
  error: unknown,
  context: string,
  fallbackMessage?: string
): string {
  return handleError(error, context, {
    showUserMessage: false,
    logLevel: 'warn',
    userMessage: fallbackMessage
  })
}