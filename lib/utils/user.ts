/**
 * ユーザー名からイニシャルを生成する
 * @param name - ユーザー名
 * @returns 大文字のイニシャル（最大2文字）
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}