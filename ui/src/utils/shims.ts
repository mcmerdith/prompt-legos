// @ts-expect-error external file
import { api } from "/scripts/api.js"
// @ts-expect-error external file
import { app } from "/scripts/app.js"
// @ts-expect-error my types are ruined :'(
import type { LGraphNode as LGraphNodeAugment } from "@/lib/litegraph/src/litegraph"
import { ComfyApi, ComfyApp } from "@comfyorg/comfyui-frontend-types"

import type { LGraphNode as LGraphNodeBase } from "@comfyorg/litegraph"

export type LGraphNode = LGraphNodeBase & LGraphNodeAugment
export type { NodeId } from "@comfyorg/litegraph"

declare const app: ComfyApp
declare const api: ComfyApi

export { app, api }
