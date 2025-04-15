function reportError({ type, error, errorInfo }: any) {
  // The specific implementation is up to you.
  // `console.error()` is only used for demonstration purposes.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error: any, errorInfo: any) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error: any, errorInfo: any) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error: any, errorInfo: any) {
  reportError({ type: "Recoverable", error, errorInfo });
}
