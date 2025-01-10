import { create, StoreApi, UseBoundStore } from "zustand";
import * as model from "@/go/models";
import { assert } from "./assert";

// All database model's id is int64
type Id = number;

type Bowl = model.bowls.Bowl;

type BowlStore = {
  map: Map<Id, Bowl>;
  add: (bowl: Bowl) => void;
  update: (id: Id, update: Bowl) => void;
  remove: (id: Id) => void;
};

const useBowlStore = create<BowlStore>()((set) => {
  return {
    map: new Map(),
    add: (bowl: Bowl) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.set(bowl.id, bowl);
        return {
          map: newMap,
        };
      }),
    update: (id: Id, update: Bowl) =>
      set((state) => {
        const newMap = new Map(state.map);
        const bowl = newMap.get(id);
        assert(bowl != undefined, `The bowl(${id}) should not be nullable`);
        newMap.set(update.id, update);
        return {
          map: newMap,
        };
      }),
    remove: (id: Id) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.delete(id);
        return {
          map: newMap,
        };
      }),
  };
});

type Flake = model.flakes.Flake & {
  bowlId: Id;
};
type FlakeStore = {
  map: Map<Id, Flake>;
  add: (flake: Flake) => void;
  update: (id: Id, update: Flake) => void;
  remove: (id: Id) => void;
  removeByBowlId: (bowlId: Id) => void;
};

const useFlakeStore = create<FlakeStore>()((set) => {
  return {
    map: new Map(),
    add: (flake: Flake) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.set(flake.id, flake);
        return {
          map: newMap,
        };
      }),
    update: (id: Id, update: Flake) =>
      set((state) => {
        const newMap = new Map(state.map);
        const flake = newMap.get(id);
        assert(flake != undefined, `The flake(${id}) should not be nullable`);
        newMap.set(update.id, update);
        return {
          map: newMap,
        };
      }),
    remove: (id: Id) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.delete(id);
        return {
          map: newMap,
        };
      }),
    removeByBowlId: (bowlId: Id) =>
      set((state) => {
        const filtered = Array.from(state.map.entries()).filter(
          ([_, value]) => value.bowlId !== bowlId
        );
        const newMap = new Map(filtered);
        return {
          map: newMap,
        };
      }),
  };
});

type Todo = model.todos.Todo & {
  // need to FlakeName?
  flakeId: Id;
};
type TodoStore = {
  map: Map<Id, Todo>;
  add: (todo: Todo) => void;
  setDone: (id: Id, next: boolean) => void;
  remove: (id: Id) => void;
  removeByFlakeId: (flakeId: Id) => void;
};

const useTodoStore = create<TodoStore>()((set) => {
  return {
    map: new Map(),
    add: (todo: Todo) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.set(todo.id, todo);
        return {
          map: newMap,
        };
      }),
    setDone: (id: Id, next: boolean) =>
      set((state) => {
        const newMap = new Map(state.map);
        const todo = newMap.get(id);
        assert(todo != undefined, `The todo(${id}) should not be nullable`);
        const newTodo = new model.todos.Todo();
        newTodo.id = todo.id;
        newTodo.flakeId = todo.flakeId;
        newTodo.done = next;
        newTodo.scheduledAt = todo.scheduledAt;
        newMap.set(newTodo.id, newTodo);
        return {
          map: newMap,
        };
      }),
    remove: (id: Id) =>
      set((state) => {
        const newMap = new Map(state.map);
        newMap.delete(id);
        return {
          map: newMap,
        };
      }),
    removeByFlakeId: (flakeId: Id) =>
      set((state) => {
        const filtered = Array.from(state.map.entries()).filter(
          ([_, value]) => value.flakeId !== flakeId
        );
        const newMap = new Map(filtered);
        return {
          map: newMap,
        };
      }),
  };
});

type Store<T> = UseBoundStore<StoreApi<T>>;

const _removeBowlById =
  (_todoStore: Store<TodoStore>) =>
  (_flakeStore: Store<FlakeStore>) =>
  (_bowlStore: Store<BowlStore>) =>
  (bowlId: Id) => {
    const flakeStore = _flakeStore();
    const todoStore = _todoStore();
    const bowlStore = _bowlStore();

    assert(
      bowlStore.map.get(bowlId) != null,
      `The bowl instance of id(${bowlId}) does not exist.`
    );

    const flakesByBowlId = Array.from(flakeStore.map.entries()).filter(
      ([_, value]) => value.bowlId === bowlId
    );

    for (const [flakeId] of flakesByBowlId) {
      todoStore.removeByFlakeId(flakeId);
    }

    flakeStore.removeByBowlId(bowlId);
    bowlStore.remove(bowlId);
  };

const removeBowlById =
  _removeBowlById(useTodoStore)(useFlakeStore)(useBowlStore);

const _removeFlakeById =
  (_todoStore: Store<TodoStore>) =>
  (_flakeStore: Store<FlakeStore>) =>
  (flakeId: Id) => {
    const todoStore = _todoStore();
    const flakeStore = _flakeStore();

    assert(
      flakeStore.map.get(flakeId) != null,
      `The flake instance of id(${flakeId}) does not exist.`
    );

    // 먼저 하위의 todos를 삭제
    todoStore.removeByFlakeId(flakeId);

    // 그 다음 flake 삭제
    flakeStore.remove(flakeId);
  };

const removeFlakeById = _removeFlakeById(useTodoStore)(useFlakeStore);

export {
  useBowlStore,
  useFlakeStore,
  useTodoStore,
  removeBowlById,
  removeFlakeById,
};
