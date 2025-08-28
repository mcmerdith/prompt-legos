import { ToastMessageOptions } from "@comfyorg/comfyui-frontend-types";

import { app } from "@/utils/shims";

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

function success(title: string, message?: string, options?: PLToastOptions) {
  options ??= toastTimeoutOptions();
  console.log(title, message);
  toastImpl("success", title, message, options);
}

function warn(title: string, message?: string, options?: PLErrorToastOptions) {
  options ??= toastTimeoutOptions();
  console.warn(title, message);
  if (options?.error) console.warn(options.error);
  toastImpl("warn", title, message, options);
}

function error(title: string, message?: string, options?: PLErrorToastOptions) {
  options ??= toastTimeoutOptions();
  console.error(title, message);
  if (options?.error) console.error(options.error);
  toastImpl("error", title, message, options);
}

function fatal(
  title: string,
  message?: string,
  options?: PLToastOptions,
): never {
  console.error(title, message);
  toastImpl("error", title, message, options);
  throw new Error(message);
}

function toastImpl(
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

export const toast = {
  success,
  warn,
  error,
  fatal,
  toast: toastImpl,
};
