import { lazy } from "react";

export function lazyLoad(path, nameExport) {
  return lazy(async () => {
    const module = await import(path);
    return nameExport == null ? module : { default: module[nameExport] };
  });
}
