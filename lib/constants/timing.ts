/**
 * アプリケーション全体で使用するタイミング定数
 */

// ストレージ操作関連
export const STORAGE_DELETE_DELAY = 100 // ms - 削除完了を保証するための待機時間

// UI操作関連  
export const MODAL_TRANSITION_DELAY = 300 // ms - モーダルの表示/非表示トランジション
export const DEBOUNCE_DELAY = 500 // ms - 検索入力のデバウンス
export const TOAST_DISPLAY_DURATION = 3000 // ms - トースト通知の表示時間
export const LONG_PRESS_DURATION = 800 // ms - 長押し判定時間

// API関連
export const REQUEST_TIMEOUT = 30000 // ms - APIリクエストタイムアウト
export const RETRY_DELAY = 1000 // ms - リトライまでの待機時間

// データベースクエリ関連
export const COMPLETED_HISTORY_LIMIT = 20 // 完了済み履歴の取得件数上限
export const HISTORY_SEARCH_LIMIT = 1 // 履歴検索の取得件数上限