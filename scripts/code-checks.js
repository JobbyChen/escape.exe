// Live asynchronous API: checkCode(language, exercise, source, includeTransfer = false).
// Returns Promise<{ ok, kind?, message }>; execution happens in browser workers.
export {
  gradeBehavior,
  gradeBehavior as checkCode,
} from "./behavior-grading.js";
