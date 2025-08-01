import { ComfyApp, ComfyApi } from "@comfyorg/comfyui-frontend-types"

// @ts-expect-error external file
import { app } from "/scripts/app.js"
// @ts-expect-error external file
import { api } from "/scripts/api.js"

declare const app: ComfyApp
declare const api: ComfyApi

export { app, api }
