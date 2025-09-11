import { redirect } from 'next/navigation'
import { getUser } from '@/actions/users'
import { UserProfile } from '@/components/features/user/UserProfile'

export default async function UserPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <UserProfile user={user} />
    </div>
  )
}