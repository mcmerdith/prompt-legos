import { app } from "@/utils/shims";
import { ToastMessageOptions } from "@comfyorg/comfyui-frontend-types";

type PLToastOptions = Omit<
  ToastMessageOptions,
  "severity" | "detail" | "summary"
>;
type PLErrorToastOptions = PLToastOptions & { error?: Error };

function toastTimeoutOptions(): PLToastOptions {
  return {
    life: 5000,
  };
}

export function success(
  title: string,
  message?: string,
  options?: PLToastOptions,
) {
  options ??= toastTimeoutOptions();
  console.warn(title, message);
  toast("success", title, message, options);
}

export function warn(
  title: string,
  message?: string,
  options?: PLErrorToastOptions,
) {
  options ??= toastTimeoutOptions();
  console.warn(title, message);
  if (options?.error) console.warn(options.error);
  toast("warn", title, message, options);
}

export function error(
  title: string,
  message?: string,
  options?: PLErrorToastOptions,
) {
  options ??= toastTimeoutOptions();
  console.error(title, message);
  if (options?.error) console.error(options.error);
  toast("error", title, message, options);
}

export function fatal(
  title: string,
  message?: string,
  options?: PLToastOptions,
): never {
  console.error(title, message);
  toast("error", title, message, options);
  throw new Error(message);
}

export function toast(
  severity: ToastMessageOptions["severity"],
  title: string,
  message?: string,
  options?: PLToastOptions,
) {
  app.extensionManager.toast.add({
    severity: severity,
    summary: title,
    detail: message,
    ...options,
  });
}
