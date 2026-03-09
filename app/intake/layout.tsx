import { IntakeProvider } from '@/lib/intake-context'

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <IntakeProvider>{children}</IntakeProvider>
}