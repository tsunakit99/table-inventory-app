export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            メールを確認してください
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            確認リンクを含むメールを送信しました。<br />
            メールのリンクをクリックしてアカウントを有効化してください。
          </p>
          <a 
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            ログインページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}