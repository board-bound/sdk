import { BaseGameStateTypes } from './StateEnum'

export type BaseGameState<T extends BaseGameStateTypes> = {
  /**
   * The current player.
   */
  currentPlayer: number

  /**
   * The current state of the game.
   */
  state: T
}
