// @ts-expect-error external file
import { api } from "/scripts/api.js";
// @ts-expect-error external file
import { app } from "/scripts/app.js";
import { ComfyApi, ComfyApp } from "@comfyorg/comfyui-frontend-types";

export type NodeId = string | number;

declare const app: ComfyApp;
declare const api: ComfyApi;

export { app, api };
