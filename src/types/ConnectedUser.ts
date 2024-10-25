/* eslint-disable @typescript-eslint/no-unused-vars */
import { read } from 'fs'

export class ConnectedUser {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly ip: string
  ) {}

  /**
   * Send a message to the user from the server.
   * @param message The message to send.
   */
  async sendMessage(message: Record<string, unknown>): Promise<void> {}

  /**
   * Disconnect the user.
   * @param message The message to send to the user.
   * @param code If provided the disconnection is treated as an error, and this is the error code.
   */
  async disconnect(message: string, code?: number): Promise<void> {}
}
