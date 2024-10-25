import { ConnectedUser } from '../types/ConnectedUser'
import { ModifiableData } from '../types/ModifiableData'

export type ServerEvents = {
  serverUserPreConnect: {
    ip: string
    headers: Record<string, string | string[]>
    payload: Record<string, unknown>
    name: ModifiableData<string>
  }
  serverUserConnect: ConnectedUser
  serverUserDisconnect: {
    user: ConnectedUser
    message: string
    code?: number
  }
  serverUserRawInput: {
    user: ConnectedUser
    payload: Record<string, unknown>
  }
  serverUserRawOutput: {
    user: ConnectedUser
    message: ModifiableData<Record<string, unknown>>
  }
  serverStatusRequest: {
    ip: string
    response: ModifiableData<Record<string, unknown>>
  }
  serverGameStateUpdate: null
  serverAcceptingConnections: {
    ips: string[]
    localIp: string
    publicIp: string
    port: number
  }
}
