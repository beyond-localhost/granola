import * as React from "react"
import { createStore } from "zustand"
import { useShallow } from "zustand/shallow"
import { useStoreWithEqualityFn } from "zustand/traditional"
import { type Bowl } from "#/domain/bowl/schema"
import { type Flake } from "#/domain/flake/schema"
import { type Todo } from "#/domain/todo/schema"
import { assert } from "./assert"

// All database model's id is int64
type Id = number

type BowlState = {
  map: Map<Id, Bowl>
  upsert: (bowl: Bowl) => void
  remove: (id: Id) => void
}

function createBowlStore(initialData: Bowl[]) {
  const map = new Map<Id, Bowl>()
  for (const bowl of initialData) {
    map.set(bowl.id, bowl)
  }

  return createStore<BowlState>()((set) => {
    return {
      map,
      upsert: (bowl: Bowl) => {
        set((state) => {
          const newMap = new Map(state.map)
          newMap.set(bowl.id, bowl)
          return {
            map: newMap,
          }
        })
      },
      remove: (id: Id) => {
        set((state) => {
          const newMap = new Map(state.map)
          newMap.delete(id)
          return {
            map: newMap,
          }
        })
      },
    }
  })
}

type BowlStore = ReturnType<typeof createBowlStore>
const BowlContext = React.createContext<null | BowlStore>(null)

function useBowlContext<T>(
  selector: (state: BowlState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = React.useContext(BowlContext)
  if (store === null) {
    throw new Error("useBowlContext should be called within BowlProvider")
  }
  return useStoreWithEqualityFn(store, useShallow(selector), equalityFn)
}

function BowlContextProvider(props: React.PropsWithChildren<{ initialData: Bowl[] }>) {
  const store = React.useRef(createBowlStore(props.initialData)).current
  return <BowlContext.Provider value={store}>{props.children}</BowlContext.Provider>
}

type FlakeState = {
  map: Map<Id, Flake>
  upsert: (flake: Flake) => void
  remove: (id: Id) => void
  removeByBowlId: (bowlId: Id) => void
}

function createFlakeStore(initialData: Flake[]) {
  const map = new Map<Id, Flake>()
  for (const flake of initialData) {
    map.set(flake.id, flake)
  }

  return createStore<FlakeState>()((set) => {
    return {
      map,
      upsert: (flake: Flake) => {
        set((state) => {
          const newMap = new Map(state.map)
          newMap.set(flake.id, flake)
          return {
            map: newMap,
          }
        })
      },
      remove: (id: Id) => {
        set((state) => {
          const newMap = new Map(state.map)
          newMap.delete(id)
          return {
            map: newMap,
          }
        })
      },
      removeByBowlId: (bowlId: Id) => {
        set((state) => {
          const filtered = Array.from(state.map.entries()).filter(
            ([_, value]) => value.bowlId !== bowlId
          )
          const newMap = new Map(filtered)
          return {
            map: newMap,
          }
        })
      },
    }
  })
}
type FlakeStore = ReturnType<typeof createFlakeStore>
const FlakeContext = React.createContext<null | FlakeStore>(null)

function FlakeContextProvider(props: React.PropsWithChildren<{ initialData: Flake[] }>) {
  const store = React.useRef(createFlakeStore(props.initialData)).current
  return <FlakeContext.Provider value={store}>{props.children}</FlakeContext.Provider>
}

function useFlakeContext<T>(
  selector: (state: FlakeState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = React.useContext(FlakeContext)
  if (store === null) {
    throw new Error("useBowlContext should be called within FlakeProvider")
  }
  return useStoreWithEqualityFn(store, useShallow(selector), equalityFn)
}

// YYYY-MM-DD
type DateKey =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

const predicateDateKey = (v: string): v is DateKey => DATE_REGEX.test(v)

const toDateKey = (d: Date): DateKey => {
  const ret = `${d.getFullYear().toString()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
  assert(predicateDateKey(ret), `the ${ret} is not YYYY-MM-DD format`)
  return ret
}

type TodoState = {
  map: Map<DateKey, Todo[]>
  upsert: (todo: Todo) => void
  remove: (todo: Todo) => void
  removeByFlakeId: (flakeId: Id) => void
}

function createTodoStore(initialData: Todo[]) {
  const map = new Map<DateKey, Todo[]>()

  for (const todo of initialData) {
    const dateKey = toDateKey(todo.scheduledAt)
    if (map.get(dateKey) === undefined) {
      map.set(dateKey, [])
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Because of the initialization, We can safe get the array
    const todoList = map.get(dateKey)!
    todoList.push(todo)
    todoList.sort((a, b) => a.id - b.id)
  }

  return createStore<TodoState>()((set) => {
    return {
      map,
      upsert: (todo: Todo) => {
        set((state) => {
          const newMap = new Map(state.map)
          const dateKey = toDateKey(todo.scheduledAt)
          if (newMap.get(dateKey) === undefined) {
            newMap.set(dateKey, [])
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Because of the initialization, We can safe get the array
          const list = newMap.get(dateKey)!.slice()
          const index = list.findIndex((existingTodo) => existingTodo.id === todo.id)
          if (index === -1) {
            list.push(todo)
            list.sort((a, b) => a.id - b.id)
          } else {
            list[index] = todo
          }

          newMap.set(dateKey, list)

          return {
            map: newMap,
          }
        })
      },
      remove: (todo: Todo) => {
        set((state) => {
          const newMap = new Map(state.map)
          const key = toDateKey(todo.scheduledAt)
          const todoList = newMap.get(key)
          assert(
            Array.isArray(todoList),
            `There is no existing todoList when deleting the todo: ${JSON.stringify(todo, null, 4)}`
          )
          const filtered = todoList.filter((t) => t.id !== todo.id)
          if (filtered.length === 0) {
            newMap.delete(key)
          } else {
            newMap.set(key, filtered)
          }
          return {
            map: newMap,
          }
        })
      },
      removeByFlakeId: (flakeId: Id) => {
        set((state) => {
          const newMap = new Map(state.map)
          for (const [key, todoList] of newMap) {
            newMap.set(
              key,
              todoList.filter((todo) => todo.flakeId !== flakeId)
            )
          }
          return {
            map: newMap,
          }
        })
      },
    }
  })
}

type TodoStore = ReturnType<typeof createTodoStore>
const TodoContext = React.createContext<null | TodoStore>(null)
function useTodoContext<T>(
  selector: (state: TodoState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = React.useContext(TodoContext)
  if (store === null) {
    throw new Error("useBowlContext should be called within FlakeProvider")
  }

  return useStoreWithEqualityFn(store, selector, equalityFn)
}

function TodoContextProvider(props: React.PropsWithChildren<{ initialData: Todo[] }>) {
  const store = React.useRef(createTodoStore(props.initialData)).current
  return <TodoContext.Provider value={store}>{props.children}</TodoContext.Provider>
}

export {
  BowlContextProvider,
  useBowlContext,
  FlakeContextProvider,
  useFlakeContext,
  TodoContextProvider,
  useTodoContext,

  // utils
  toDateKey,
}

export type { DateKey }
