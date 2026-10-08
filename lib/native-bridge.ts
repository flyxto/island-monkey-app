/**
 * React Native WebView Bridge Utilities
 * Handles communication between island-monkey-app and the hosting React Native shell.
 */

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export type NativeMessage =
  | { type: "OPEN_QR_SCANNER" }
  | { type: "CLOSE_QR_SCANNER" }
  | { type: "HAPTIC_FEEDBACK"; payload?: "light" | "medium" | "heavy" | "success" | "error" }
  | { type: "QR_SCANNED"; qrCode: string };

/**
 * Check if running inside a React Native WebView container
 */
export function isReactNativeWebView(): boolean {
  return typeof window !== "undefined" && Boolean(window.ReactNativeWebView?.postMessage);
}

/**
 * Send a message across the bridge to React Native
 */
export function sendToNative(message: NativeMessage): void {
  if (isReactNativeWebView() && window.ReactNativeWebView) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } catch (err) {
      console.warn("Failed to post message to ReactNativeWebView:", err);
    }
  }
}

/**
 * Trigger device haptic feedback if running in native app
 */
export function triggerNativeHaptic(type: "light" | "medium" | "heavy" | "success" | "error" = "light"): void {
  sendToNative({ type: "HAPTIC_FEEDBACK", payload: type });
}

/**
 * Request the React Native host app to open native camera barcode scanner
 */
export function requestNativeQRScanner(): void {
  sendToNative({ type: "OPEN_QR_SCANNER" });
}

/**
 * Subscribe to messages dispatched from React Native into the WebView
 */
export function subscribeToNativeMessages(callback: (message: NativeMessage) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data && typeof data.type === "string") {
        callback(data as NativeMessage);
      }
    } catch {
      // Non-JSON message, ignore
    }
  };

  // Both standard window message and document message (for Android WebView variations)
  window.addEventListener("message", handleMessage);
  document.addEventListener("message", handleMessage as any);

  return () => {
    window.removeEventListener("message", handleMessage);
    document.removeEventListener("message", handleMessage as any);
  };
}
