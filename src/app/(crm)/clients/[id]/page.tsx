import { notFound } from 'next/navigation'
import { getClientById } from '@/data/demo'
import { ClientProfile } from '@/components/clients/client-profile'

export default async function ClientDetailPage ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = getClientById(id)

  if (!client) {
    notFound()
  }

  return <ClientProfile client={client} />
}
