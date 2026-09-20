import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Application settings and prototype resources."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demo resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link
              href="/demo"
              className="block font-medium text-text-primary hover:underline"
            >
              Demo script →
            </Link>
            <Link
              href="/architecture"
              className="block font-medium text-text-primary hover:underline"
            >
              Technical architecture →
            </Link>
            <Link
              href="/ai/architecture"
              className="block font-medium text-text-primary hover:underline"
            >
              AI architecture →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">User preferences</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary">
            User preferences and team configuration will be available in a future
            phase.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
