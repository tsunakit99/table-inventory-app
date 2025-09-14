import { ApprovalWrapper } from '@/components/auth/ApprovalWrapper'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ApprovalWrapper>
      {children}
    </ApprovalWrapper>
  )
}