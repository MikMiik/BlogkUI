import { lazy } from "react";

export function lazyLoad(path, nameExport = null) {
  return lazy(async () => {
    const module = await import(/* @vite-ignore */ path);
    return nameExport == null ? module : { default: module[nameExport] };
  });
}
