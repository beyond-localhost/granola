import * as React from "react";
import ReactDOM from "react-dom";

import { assert } from "#/lib/assert";

type ReactNodeKey = string;
type ReactNodeMap = Map<ReactNodeKey, React.ReactNode>;

type OutletState = React.ReactNode;
type OutletAction = {
  append: (id: ReactNodeKey, node: React.ReactNode) => void;
  remove: (id: ReactNodeKey) => void;
};

const outletAction: OutletAction = {
  append: (id: ReactNodeKey, node: React.ReactNode) => {
    assert(
      false,
      `outletAction.append is called during render phase, this is not expected and the logic should be inside React.useEffect`
    );
  },
  remove: (id: ReactNodeKey) => {
    assert(
      false,
      `outletAction.remove is called during render phase, this is not expected and the logic should be inside React.useEffect`
    );
  },
};

const OutletContext = React.createContext<OutletState | null>(null);
const OutletSetterContext = React.createContext<OutletAction | null>(null);

function GlobalOutletProvider({ children }: { children: React.ReactNode }) {
  const nodeMap = React.useRef<ReactNodeMap>(new Map()).current;
  const [outlet, setOutlet] = React.useState<OutletState>(null);

  const append = React.useCallback(
    (id: ReactNodeKey, node: React.ReactNode) => {
      assert(
        nodeMap.get(id) == null,
        `The other ReactNode(${nodeMap.get(id)}) is using the ${id}. This is not expected`
      );
      nodeMap.set(id, node);
      setOutlet(
        <React.Fragment>{Array.from(nodeMap.values())}</React.Fragment>
      );
    },
    []
  );

  /**
   * @description It would not throw an error when any nodes is bound to the id.
   */
  const remove = React.useCallback((id: ReactNodeKey) => {
    nodeMap.delete(id);
    setOutlet(<React.Fragment>{Array.from(nodeMap.values())}</React.Fragment>);
  }, []);

  React.useLayoutEffect(() => {
    outletAction.append = append;
    outletAction.remove = remove;
  }, [append, remove]);

  const setter = React.useMemo(() => {
    return {
      append,
      remove,
    };
  }, [append, remove]);

  return (
    <OutletContext.Provider value={outlet}>
      <OutletSetterContext value={setter}>{children}</OutletSetterContext>
    </OutletContext.Provider>
  );
}

function GlobalOutlet() {
  const outlet = React.use(OutletContext);
  if (outlet == null) {
    throw new Error(`Globaloutlet should be within GlobalOutletProvider`);
  }
  return outlet;
}

function useGlobalOutletSetter() {
  const ctx = React.use(OutletSetterContext);
  if (ctx == null) {
    throw new Error(
      `useGlobalOutletSetter should be called within GlobalOutletProvider`
    );
  }
  return ctx;
}

function Portal({
  id,
  children,
  container = document.body,
}: {
  id: ReactNodeKey;
  children: React.ReactNode;
  container?: Element;
}) {
  const setter = useGlobalOutletSetter();
  React.useEffect(() => {
    setter.append(id, ReactDOM.createPortal(children, container));
    return () => {
      setter.remove(id);
    };
  }, [id, children, container, setter]);

  return null;
}

export { GlobalOutletProvider, GlobalOutlet, Portal, outletAction };
