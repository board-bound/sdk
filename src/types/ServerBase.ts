/* eslint-disable @typescript-eslint/no-explicit-any */
import type pino from 'pino'
import type * as semver from 'semver'
import type { v4 as uuidV4 } from 'uuid'
import type axios from 'axios'
import { ConnectedUser } from './ConnectedUser'

export class ServerBase<G extends Record<string, any>> {
  /**
   * The current version of the server.
   */
  readonly version: string

  /**
   * The logger for the server.
   */
  protected readonly logger: pino.Logger

  /**
   * The UUID generator.
   */
  protected readonly uuid: typeof uuidV4

  /**
   * The semver library.
   */
  protected readonly semver: typeof semver

  /**
   * The axios library.
   */
  protected readonly axios: typeof axios

  /**
   * The connected users.
   */
  protected readonly connectedUsers: ConnectedUser[] = []

  /**
   * The game state.
   */
  protected gameState: G

  /**
   * Get the game state.
   */
  async getGameState(): Promise<G> {
    return this.gameState
  }

  /**
   * Set the game state.
   * @param {G} gameState The new game state.
   */
  async setGameState(gameState: G): Promise<void> {
    this.gameState = gameState
  }

  /**
   * Get the logger.
   */
  getLogger(plugin?: string): pino.Logger {
    return plugin ? this.logger.child({ plugin }) : this.logger
  }

  /**
   * Get a new UUIDv4.
   */
  getUuid(): ReturnType<typeof uuidV4> {
    return this.uuid()
  }

  /**
   * Get the semver library.
   */
  getSemver(): typeof semver {
    return this.semver
  }

  /**
   * Get the axios library.
   */
  getAxios(): typeof axios {
    return this.axios
  }

  /**
   * Get the connected users.
   */
  getConnectedUsers(): ConnectedUser[] {
    return this.connectedUsers
  }

  /**
   * Add a connected user.
   * @param {ConnectedUser} user The connected user.
   */
  addConnectedUser(user: ConnectedUser): void {
    this.connectedUsers.push(user)
  }

  /**
   * Remove a connected user.
   * @param {ConnectedUser} user The connected user.
   */
  removeConnectedUser(user: ConnectedUser): void {
    const index = this.connectedUsers.indexOf(user)
    if (index !== -1) this.connectedUsers.splice(index, 1)
  }
}
