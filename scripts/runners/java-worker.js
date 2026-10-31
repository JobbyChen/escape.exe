import { runJava } from "./java-subset.js";
self.postMessage({ ready: true });
self.onmessage = ({ data }) => {
  try {
    self.postMessage({ result: runJava(data.source, data) });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
