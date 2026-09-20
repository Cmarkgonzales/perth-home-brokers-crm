export type ClientType = 'First Home Buyer' | 'Investor' | 'Home Buyer'

export interface Client {
  id: string
  name: string
  type: ClientType
  email: string
  phone: string
  budget: number
  deposit: number
  location: string
}
