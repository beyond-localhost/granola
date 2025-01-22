import * as React from "react"
import { createStore } from "zustand"
import { useStoreWithEqualityFn } from "zustand/traditional"
import { useShallow } from "zustand/shallow"
import { type Flake } from "#/domain/flake/schema"
import { type Id } from "#/domain/common"

// ...existing code...

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

export { FlakeContextProvider, useFlakeContext }
