export type CommunicationChannel = 'email' | 'sms' | 'call'

export interface Communication {
  id: string
  clientId: string
  dealId?: string
  channel: CommunicationChannel
  date: string
  subject: string
  summary: string
  direction: 'inbound' | 'outbound'
}
