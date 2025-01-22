import * as React from "react"
import { assert } from "#/lib/assert"

type ReactNodeKey = string
type ReactNodeMap = Map<ReactNodeKey, React.ReactNode>

type OutletState = React.ReactNode
type OutletAction = {
  append: (id: ReactNodeKey, node: React.ReactNode) => void
  remove: (id: ReactNodeKey) => void
}

const outletAction: OutletAction = {
  append: (_: ReactNodeKey, __: React.ReactNode) => {
    assert(
      false,
      `outletAction.append is called during render phase, this is not expected and the logic should be inside React.useEffect`
    )
  },
  remove: (_: ReactNodeKey) => {
    assert(
      false,
      `outletAction.remove is called during render phase, this is not expected and the logic should be inside React.useEffect`
    )
  },
}

const OutletContext = React.createContext<OutletState | null>(null)
const OutletSetterContext = React.createContext<OutletAction | null>(null)

function GlobalOutletProvider({ children }: { children: React.ReactNode }) {
  const nodeMap = React.useRef<ReactNodeMap>(new Map()).current
  const [outlet, setOutlet] = React.useState<OutletState>(null)

  const append = React.useCallback(
    (id: ReactNodeKey, node: React.ReactNode) => {
      assert(
        nodeMap.get(id) === undefined,
        `The other ReactNode is using the ${id}. This is not expected`
      )
      nodeMap.set(id, node)
      setOutlet(
        <>
          {Array.from(nodeMap.entries()).map(([key, renderedNode]) => {
            return <React.Fragment key={key}>{renderedNode}</React.Fragment>
          })}
        </>
      )
    },
    [nodeMap]
  )

  const remove = React.useCallback(
    (id: ReactNodeKey) => {
      nodeMap.delete(id)
      setOutlet(
        <>
          {Array.from(nodeMap.entries()).map(([key, node]) => {
            return <React.Fragment key={key}>{node}</React.Fragment>
          })}
        </>
      )
    },
    [nodeMap]
  )

  React.useLayoutEffect(() => {
    outletAction.append = append
    outletAction.remove = remove
  }, [append, remove])

  const setter = React.useMemo(() => {
    return {
      append,
      remove,
    }
  }, [append, remove])

  return (
    <OutletContext.Provider value={outlet}>
      <OutletSetterContext.Provider value={setter}>
        {children}
      </OutletSetterContext.Provider>
    </OutletContext.Provider>
  )
}

function GlobalOutlet() {
  const outlet = React.useContext(OutletContext)
  return outlet
}

function useGlobalOutletSetter() {
  const ctx = React.useContext(OutletSetterContext)
  if (ctx === null) {
    throw new Error(`useGlobalOutletSetter should be called within GlobalOutletProvider`)
  }
  return ctx
}

export { GlobalOutletProvider, GlobalOutlet, outletAction, useGlobalOutletSetter }
