/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEventMap } from '../events/BaseEventMap'
import { BaseGameState } from '../types/GameState'
import { ServerBase } from '../types/ServerBase'
import { BaseGameStateTypes } from '../types/StateEnum'

type O = Record<string, any>

/**
 * Represents a listener function for a specific event.
 * @template P The payload type.
 * @template G The game state type.
 * @param {ServerBase<G>} server The server instance.
 * @param {P} payload The payload of the event.
 * @returns {void | boolean | Promise<void | boolean>}
 */
export type ListenerFunction<P, G extends O> = (
  server: ServerBase<G>,
  payload: P
) => undefined | boolean | Promise<undefined | boolean>

/**
 * Represents a listener with an id, callback, and priority.
 * @template P The payload type.
 * @template G The game state type.
 */
interface Listener<P, G extends O> {
  id: number
  callback: ListenerFunction<P, G>
  priority: number
}

/**
 * Represents an event registration for a plugin.
 * @template T The record mapping event names to their payload types.
 * @template K The specific event name.
 * @template G The game state type.
 */
export interface EventRegistration<
  T extends O,
  K extends keyof T,
  G extends O,
> {
  /**
   * The name of the event to listen for.
   */
  eventName: K

  /**
   * The listener function that will be invoked when the event is emitted.
   */
  listener: ListenerFunction<T[K], G>

  /**
   * The priority of the listener. Higher priority listeners are executed first.
   * Listeners with the same priority are executed concurrently.
   * @default 0
   */
  priority?: number
}

/**
 * Creates an event registration object.
 * @template T The record mapping event names to their payload types.
 * @template K The specific event name.
 * @template G The game state type.
 * @param eventName The name of the event to listen for.
 * @param listener The listener function that will be invoked when the event is emitted.
 * @param priority The priority of the listener. Higher priority listeners are
 * @returns {EventRegistration<T, K, G>} The created event registration object.
 */
export function createEventRegistration<
  T extends O,
  K extends keyof T,
  G extends O,
>(
  eventName: K,
  listener: ListenerFunction<T[K], G>,
  priority?: number
): EventRegistration<T, K, G> {
  return { eventName, listener, priority }
}

/**
 * Creates a simple event registration object.
 * @template K The specific event name.
 * @param eventName The name of the event to listen for.
 * @param listener The listener function that will be invoked when the event is emitted.
 * @param priority The priority of the listener. Higher priority listeners are
 * @returns {EventRegistration<BaseEventMap, K, BaseGameState<BaseGameStateTypes>>} The created event registration object.
 */
export function createSimpleEventRegistration<K extends keyof BaseEventMap>(
  eventName: K,
  listener: ListenerFunction<
    BaseEventMap[K],
    BaseGameState<BaseGameStateTypes>
  >,
  priority?: number
): EventRegistration<BaseEventMap, K, BaseGameState<BaseGameStateTypes>> {
  return { eventName, listener, priority }
}

/**
 * EventBus class for managing event listeners and dispatching events.
 * @template T A record mapping event names to their payload types.
 * @template G The game state type.
 */
export class EventBus<T extends O, G extends O> {
  private listeners: { [K in keyof T]?: Array<Listener<T[K], G>> } = {}
  private idCounter: number = 0

  /**
   * Adds a listener for a specific event.
   * @param {K} eventName The name of the event to listen for.
   * @param {ListenerFunction<T[K]>} listener The callback function.
   * @param {number} [priority=0] The priority of the listener. Higher priority listeners are executed first.
   * @returns {number} A unique identifier for the listener.
   */
  public on<K extends keyof T>(
    eventName: K,
    listener: ListenerFunction<T[K], G>,
    priority: number = 0
  ): number {
    const id = this.idCounter++
    const listenerObj: Listener<T[K], G> = { id, callback: listener, priority }
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }
    this.listeners[eventName]!.push(listenerObj)
    return id
  }

  /**
   * Removes a listener for a specific event.
   * Can remove by listener function or by listener id.
   * @param {K} eventName The name of the event.
   * @param {ListenerFunction<T[K]> | number} listenerOrId The listener function or its unique identifier.
   */
  public off<K extends keyof T>(
    eventName: K,
    listenerOrId: ListenerFunction<T[K], G> | number
  ): void {
    if (!this.listeners[eventName]) return
    this.listeners[eventName] = this.listeners[eventName]!.filter((l) => {
      if (typeof listenerOrId === 'number') {
        return l.id !== listenerOrId
      }
      return l.callback !== listenerOrId
    })
  }

  /**
   * Dispatches an event to all registered listeners.
   * Listeners with the same priority are executed concurrently.
   * Propagation stops if any listener returns `false`.
   * @template K The event name type.
   * @param {K} eventName The name of the event to emit.
   * @param {ServerBase<G>} server The server instance.
   * @param {T[K]} payload The data associated with the event.
   * @returns {Promise<boolean>} A promise that resolves to `true` if all listeners returned `true`, or `false` otherwise.
   */
  public async emit<K extends keyof T>(
    eventName: K,
    server: ServerBase<G>,
    payload: T[K]
  ): Promise<boolean> {
    if (!this.listeners[eventName]) return true
    const listeners = this.listeners[eventName]!

    // Group listeners by priority
    const priorityMap = new Map<number, Listener<T[K], G>[]>()
    listeners.forEach((listener) => {
      if (!priorityMap.has(listener.priority)) {
        priorityMap.set(listener.priority, [])
      }
      priorityMap.get(listener.priority)!.push(listener)
    })

    // Sort priorities in descending order
    const sortedPriorities = Array.from(priorityMap.keys()).sort(
      (a, b) => b - a
    )

    // Execute listeners concurrently at each priority level
    for (const p of sortedPriorities) {
      const listenersAtPriority = priorityMap.get(p)!
      const results = await Promise.all(
        listenersAtPriority.map((listener) =>
          listener.callback(server, payload)
        )
      )

      if (results.some((result) => result === false)) return false
    }
    return true
  }
}
