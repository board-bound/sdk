/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventRegistration, EventBus } from '../tools/EventBus'
import { BaseGameState } from './GameState'
import { BaseGameStateTypes } from './StateEnum'
import { BaseEventMap } from '../events/BaseEventMap'
import type pino from 'pino'

type O = Record<string, any>
export type SimpleServerPlugin<C extends O | void> = ServerPlugin<
  BaseEventMap,
  BaseGameState<BaseGameStateTypes>,
  C
>

/**
 * Creates a server plugin.
 * @template C The configuration type for the plugin.
 * @param {ServerPlugin<DefaultPlugin>} plugin The plugin to create.
 * @returns {ServerPlugin<DefaultPlugin>} The created plugin.
 */
export function createSimplePlugin<C extends O | void>(
  plugin: SimpleServerPlugin<C>
): SimpleServerPlugin<C> {
  return plugin
}

/**
 * Creates a server plugin.
 * @template T The server events, a record mapping event names to their payload types.
 * @template G The game state, a record mapping defining the types of the game state object.
 * @template C The configuration type for the plugin.
 * @param {ServerPlugin<T, G, C>} plugin The plugin to create.
 * @returns {ServerPlugin<T, G, C>} The created plugin.
 */
export function createServerPlugin<
  T extends O,
  G extends O,
  C extends O | void,
>(plugin: ServerPlugin<T, G, C>): ServerPlugin<T, G, C> {
  return plugin
}

/**
 * Represents a server plugin.
 * @template T The server events, a record mapping event names to their payload types.
 * @template G The game state, a record mapping defining the types of the game state object.
 * @template C The configuration type for the plugin.
 */
export interface ServerPlugin<T extends O, G extends O, C extends O | void> {
  /**
   * The name of the plugin.
   */
  readonly name: string

  /**
   * The author of the plugin.
   */
  readonly author: string

  /**
   * The version of the plugin, following the semver specification.
   * @link https://semver.org/
   */
  readonly version: string

  /**
   * A valid semver range that specifies the version of the server that the plugin is compatible with.
   * @example ">=1.0.0 <2.0.0"
   * @link https://www.npmjs.com/package/semver
   */
  readonly serverVersion: string

  /**
   * Git repository URL for the plugin.
   */
  readonly repository?: string

  /**
   * Dependencies for the plugin. If a dependency is not met, the plugin will not be loaded.
   * This will influence the order in which plugins are loaded.
   * @example { "other-plugin": ">=1.0.0 <2.0.0" }
   */
  readonly dependencies?: Record<string, string>

  /**
   * The default configuration for the plugin.
   */
  readonly defaultConfig?: C

  /**
   * An array of event registrations that the plugin listens to.
   */
  readonly events?: Array<EventRegistration<T, keyof T, G>>

  /**
   * An function that is called when the plugin is enabled.
   * @param {C} cfg The current configuration loaded from the configuration file.
   * @param {EventBus<T, G>} bus The event bus.
   * @param {pino.Logger} logger The logger.
   */
  readonly onEnable?: (cfg: C, bus: EventBus<T, G>, logger: pino.Logger) => Promise<void> | void

  /**
   * An function that is called when the plugin is disabled.
   * @returns {Promise<C|null>} The configuration to save or null if no configuration should be saved.
   * @param {EventBus<T, G>} bus The event bus.
   * @param {pino.Logger} logger The logger.
   */
  readonly onDisable?: (bus: EventBus<T, G>, logger: pino.Logger) => Promise<C | null> | C | null
}
