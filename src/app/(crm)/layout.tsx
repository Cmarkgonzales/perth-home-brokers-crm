import { AppShell } from '@/components/layout/app-shell'
import { CrmProviders } from '@/components/providers/crm-providers'

export default function CrmLayout ({ children }: LayoutProps<'/'>) {
  return (
    <CrmProviders>
      <AppShell>{children}</AppShell>
    </CrmProviders>
  )
}
