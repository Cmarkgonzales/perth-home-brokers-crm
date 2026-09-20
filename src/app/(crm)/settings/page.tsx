import { PageHeader } from '@/components/layout/page-header'
import { SettingsWorkspace } from '@/components/settings/settings-workspace'

export default function SettingsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Appearance and notifications."
      />
      <SettingsWorkspace />
    </div>
  )
}
