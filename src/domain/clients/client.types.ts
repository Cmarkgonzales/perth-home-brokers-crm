export type ClientType = 'First Home Buyer' | 'Investor' | 'Home Buyer'
export type ClientContactChannel = 'email' | 'sms' | 'call'

export interface Client {
  id: string
  name: string
  type: ClientType
  email: string
  phone: string
  budget: number
  deposit: number
  location: string
  preferredContact?: ClientContactChannel
  employment?: string
}
