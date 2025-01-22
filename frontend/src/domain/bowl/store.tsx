import * as React from "react"
import { createStore } from "zustand"
import { useStoreWithEqualityFn } from "zustand/traditional"
import { useShallow } from "zustand/shallow"
import { type Bowl } from "#/domain/bowl/schema"
import { type Id } from "#/domain/common"

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

export { BowlContextProvider, useBowlContext }
