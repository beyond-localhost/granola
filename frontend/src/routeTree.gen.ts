/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as CalendarImport } from './routes/calendar'
import { Route as BowlsImport } from './routes/bowls'
import { Route as IndexImport } from './routes/index'
import { Route as BowlsAddImport } from './routes/bowls.add'
import { Route as BowlsBowlIdImport } from './routes/bowls.$bowlId'
import { Route as BowlsBowlIdFlakesAddImport } from './routes/bowls_.$bowlId.flakes.add'

// Create/Update Routes

const CalendarRoute = CalendarImport.update({
  id: '/calendar',
  path: '/calendar',
  getParentRoute: () => rootRoute,
} as any)

const BowlsRoute = BowlsImport.update({
  id: '/bowls',
  path: '/bowls',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const BowlsAddRoute = BowlsAddImport.update({
  id: '/add',
  path: '/add',
  getParentRoute: () => BowlsRoute,
} as any)

const BowlsBowlIdRoute = BowlsBowlIdImport.update({
  id: '/$bowlId',
  path: '/$bowlId',
  getParentRoute: () => BowlsRoute,
} as any)

const BowlsBowlIdFlakesAddRoute = BowlsBowlIdFlakesAddImport.update({
  id: '/bowls_/$bowlId/flakes/add',
  path: '/bowls/$bowlId/flakes/add',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/bowls': {
      id: '/bowls'
      path: '/bowls'
      fullPath: '/bowls'
      preLoaderRoute: typeof BowlsImport
      parentRoute: typeof rootRoute
    }
    '/calendar': {
      id: '/calendar'
      path: '/calendar'
      fullPath: '/calendar'
      preLoaderRoute: typeof CalendarImport
      parentRoute: typeof rootRoute
    }
    '/bowls/$bowlId': {
      id: '/bowls/$bowlId'
      path: '/$bowlId'
      fullPath: '/bowls/$bowlId'
      preLoaderRoute: typeof BowlsBowlIdImport
      parentRoute: typeof BowlsImport
    }
    '/bowls/add': {
      id: '/bowls/add'
      path: '/add'
      fullPath: '/bowls/add'
      preLoaderRoute: typeof BowlsAddImport
      parentRoute: typeof BowlsImport
    }
    '/bowls_/$bowlId/flakes/add': {
      id: '/bowls_/$bowlId/flakes/add'
      path: '/bowls/$bowlId/flakes/add'
      fullPath: '/bowls/$bowlId/flakes/add'
      preLoaderRoute: typeof BowlsBowlIdFlakesAddImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface BowlsRouteChildren {
  BowlsBowlIdRoute: typeof BowlsBowlIdRoute
  BowlsAddRoute: typeof BowlsAddRoute
}

const BowlsRouteChildren: BowlsRouteChildren = {
  BowlsBowlIdRoute: BowlsBowlIdRoute,
  BowlsAddRoute: BowlsAddRoute,
}

const BowlsRouteWithChildren = BowlsRoute._addFileChildren(BowlsRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/bowls': typeof BowlsRouteWithChildren
  '/calendar': typeof CalendarRoute
  '/bowls/$bowlId': typeof BowlsBowlIdRoute
  '/bowls/add': typeof BowlsAddRoute
  '/bowls/$bowlId/flakes/add': typeof BowlsBowlIdFlakesAddRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/bowls': typeof BowlsRouteWithChildren
  '/calendar': typeof CalendarRoute
  '/bowls/$bowlId': typeof BowlsBowlIdRoute
  '/bowls/add': typeof BowlsAddRoute
  '/bowls/$bowlId/flakes/add': typeof BowlsBowlIdFlakesAddRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/bowls': typeof BowlsRouteWithChildren
  '/calendar': typeof CalendarRoute
  '/bowls/$bowlId': typeof BowlsBowlIdRoute
  '/bowls/add': typeof BowlsAddRoute
  '/bowls_/$bowlId/flakes/add': typeof BowlsBowlIdFlakesAddRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/bowls'
    | '/calendar'
    | '/bowls/$bowlId'
    | '/bowls/add'
    | '/bowls/$bowlId/flakes/add'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/bowls'
    | '/calendar'
    | '/bowls/$bowlId'
    | '/bowls/add'
    | '/bowls/$bowlId/flakes/add'
  id:
    | '__root__'
    | '/'
    | '/bowls'
    | '/calendar'
    | '/bowls/$bowlId'
    | '/bowls/add'
    | '/bowls_/$bowlId/flakes/add'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  BowlsRoute: typeof BowlsRouteWithChildren
  CalendarRoute: typeof CalendarRoute
  BowlsBowlIdFlakesAddRoute: typeof BowlsBowlIdFlakesAddRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  BowlsRoute: BowlsRouteWithChildren,
  CalendarRoute: CalendarRoute,
  BowlsBowlIdFlakesAddRoute: BowlsBowlIdFlakesAddRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/bowls",
        "/calendar",
        "/bowls_/$bowlId/flakes/add"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/bowls": {
      "filePath": "bowls.tsx",
      "children": [
        "/bowls/$bowlId",
        "/bowls/add"
      ]
    },
    "/calendar": {
      "filePath": "calendar.tsx"
    },
    "/bowls/$bowlId": {
      "filePath": "bowls.$bowlId.tsx",
      "parent": "/bowls"
    },
    "/bowls/add": {
      "filePath": "bowls.add.tsx",
      "parent": "/bowls"
    },
    "/bowls_/$bowlId/flakes/add": {
      "filePath": "bowls_.$bowlId.flakes.add.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
