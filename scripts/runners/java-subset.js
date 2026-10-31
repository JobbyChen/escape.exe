// Bounded Java teaching interpreter. No eval, Function constructor, host objects or network APIs.
// Supports the documented integer/String/boolean/array/static-method subset, not a JVM.
export function runJava(source, task = {}) {
  if (/\bimport\s/.test(source))
    throw Error(
      "Unsupported in this teaching runner: imports and external classes.",
    );
  const raw =
    source.match(
      /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])'|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|%=|[{}()[\];,:.+\-*\/%<>=!]/g,
    ) || [];
  if (raw.join("") !== source)
    throw Error("Unsupported Java token. Use the documented teaching subset.");
  const tokens = raw.filter(
    (token) => !/^\s|^\/\//.test(token) && !token.startsWith("/*"),
  );
  let p = 0;
  const peek = () => tokens[p],
    take = () => tokens[p++];
  const need = (t) => {
    if (take() !== t) throw Error("Expected " + t + " near token " + p);
  };
  const types = new Set(["int", "boolean", "String", "char", "void"]);
  const modifiers = new Set([
    "public",
    "private",
    "protected",
    "static",
    "final",
  ]);
  const precedence = {
    "=": 1,
    "+=": 1,
    "-=": 1,
    "*=": 1,
    "/=": 1,
    "%=": 1,
    "||": 2,
    "&&": 3,
    "==": 4,
    "!=": 4,
    "<": 5,
    ">": 5,
    "<=": 5,
    ">=": 5,
    "+": 6,
    "-": 6,
    "*": 7,
    "/": 7,
    "%": 7,
  };
  const type = () => {
    const value = take();
    if (!types.has(value)) throw Error("Unsupported Java type " + value);
    let name = value;
    while (peek() === "[") {
      take();
      need("]");
      name += "[]";
    }
    return name;
  };
  function expr(min = 1) {
    let node;
    const token = take();
    if (token === undefined) throw Error("Expected an expression.");
    if (["!", "-", "+", "++", "--"].includes(token))
      node = { kind: "unary", op: token, value: expr(8) };
    else if (token === "(") {
      node = expr();
      need(")");
    } else if (token === "{") {
      const values = [];
      if (peek() !== "}")
        do {
          values.push(expr());
          if (peek() !== ",") break;
          take();
        } while (true);
      need("}");
      node = { kind: "array", values };
    } else if (token === "new") {
      const name = take();
      if (!types.has(name))
        throw Error(
          "Only primitive/String arrays can be constructed in this teaching runner.",
        );
      need("[");
      if (peek() === "]") {
        take();
        node = expr(8);
      } else {
        const size = expr();
        need("]");
        node = {
          kind: "new-array",
          size,
          fill:
            name === "String"
              ? null
              : name === "boolean"
                ? false
                : name === "char"
                  ? "\0"
                  : 0,
        };
      }
    } else if (/^"/.test(token))
      node = { kind: "literal", value: JSON.parse(token) };
    else if (/^'/.test(token))
      node = { kind: "literal", value: token.slice(1, -1) };
    else if (/^\d/.test(token))
      node = { kind: "literal", value: Number(token) };
    else if (["true", "false", "null"].includes(token))
      node = {
        kind: "literal",
        value: token === "null" ? null : token === "true",
      };
    else if (/^[A-Za-z_]\w*$/.test(token)) node = { kind: "name", name: token };
    else throw Error("Unsupported expression: " + token);
    while (true) {
      if (peek() === "(") {
        take();
        const args = [];
        if (peek() !== ")")
          do {
            args.push(expr());
            if (peek() !== ",") break;
            take();
          } while (true);
        need(")");
        node = { kind: "call", callee: node, args };
        continue;
      }
      if (peek() === ".") {
        take();
        node = { kind: "member", object: node, name: take() };
        continue;
      }
      if (peek() === "[") {
        take();
        const index = expr();
        need("]");
        node = { kind: "index", object: node, index };
        continue;
      }
      if (["++", "--"].includes(peek())) {
        node = { kind: "postfix", op: take(), value: node };
        continue;
      }
      const op = peek(),
        rank = precedence[op];
      if (!rank || rank < min) break;
      take();
      node = {
        kind: "binary",
        op,
        left: node,
        right: expr(rank + (rank === 1 ? 0 : 1)),
      };
    }
    return node;
  }
  function declaration(end = true) {
    const dataType = type(),
      name = take();
    if (!/^[A-Za-z_]\w*$/.test(name || ""))
      throw Error("Expected a variable name.");
    const value = peek() === "=" ? (take(), expr()) : null;
    if (end) need(";");
    return { kind: "declare", name, dataType, value };
  }
  function statement() {
    if (peek() === "{") {
      take();
      const body = [];
      while (peek() !== "}") {
        if (!peek()) throw Error("Missing closing brace.");
        body.push(statement());
      }
      take();
      return { kind: "block", body };
    }
    if (peek() === ";") {
      take();
      return { kind: "empty" };
    }
    if (peek() === "if") {
      take();
      need("(");
      const condition = expr();
      need(")");
      const yes = statement(),
        no = peek() === "else" ? (take(), statement()) : null;
      return { kind: "if", condition, yes, no };
    }
    if (peek() === "while") {
      take();
      need("(");
      const condition = expr();
      need(")");
      return { kind: "while", condition, body: statement() };
    }
    if (peek() === "for") {
      take();
      need("(");
      let init;
      if (types.has(peek())) {
        const saved = p;
        type();
        const name = take();
        if (peek() === ":") {
          take();
          const values = expr();
          need(")");
          return { kind: "foreach", name, values, body: statement() };
        }
        p = saved;
        init = declaration(false);
      } else
        init = peek() === ";" ? null : { kind: "expression", value: expr() };
      need(";");
      const condition =
        peek() === ";" ? { kind: "literal", value: true } : expr();
      need(";");
      const update = peek() === ")" ? null : expr();
      need(")");
      return { kind: "for", init, condition, update, body: statement() };
    }
    if (peek() === "return") {
      take();
      const value = peek() === ";" ? null : expr();
      need(";");
      return { kind: "return", value };
    }
    if (["break", "continue"].includes(peek())) {
      const kind = take();
      need(";");
      return { kind };
    }
    if (types.has(peek())) return declaration();
    const value = expr();
    need(";");
    return { kind: "expression", value };
  }
  const functions = new Map(),
    root = [];
  function program(inClass = false) {
    while (p < tokens.length && (!inClass || peek() !== "}")) {
      while (modifiers.has(peek())) take();
      if (peek() === "class") {
        take();
        take();
        need("{");
        program(true);
        need("}");
        continue;
      }
      const saved = p;
      if (types.has(peek())) {
        const returnType = type();
        const name = take();
        if (peek() === "(") {
          take();
          const params = [];
          if (peek() !== ")")
            do {
              const dataType = type();
              params.push({ name: take(), dataType });
              if (peek() !== ",") break;
              take();
            } while (true);
          need(")");
          const body = statement();
          functions.set(name, { params, body, returnType });
          continue;
        }
      }
      p = saved;
      root.push(statement());
    }
  }
  program();
  let steps = 0,
    cells = 0,
    depth = 0;
  const output = [];
  const unassigned = Symbol("unassigned");
  const arrayTypes = new WeakMap();
  const checkType = (value, type) => {
    if (type === "void") return;
    if (type.endsWith("[]")) {
      if (!Array.isArray(value))
        throw Error("Expected array value for " + type);
      value.forEach((item) => checkType(item, type.slice(0, -2)));
      arrayTypes.set(value, type.slice(0, -2));
      return;
    }
    const valid =
      type === "int"
        ? Number.isSafeInteger(value)
        : type === "boolean"
          ? typeof value === "boolean"
          : type === "String"
            ? typeof value === "string" || value === null
            : type === "char"
              ? typeof value === "string" && value.length === 1
              : false;
    if (!valid) throw Error("Type mismatch: expected " + type);
  };
  const tick = () => {
    if (++steps > 30000)
      throw Error(
        "Execution limit: use a terminating algorithm (30,000 steps).",
      );
  };
  const bounded = (value) => {
    if (typeof value === "string" && value.length > 16000)
      throw Error("String/output size limit exceeded.");
    return value;
  };
  const allocate = (n) => {
    if (!Number.isInteger(n) || n < 0 || n > 2000 || (cells += n) > 30000)
      throw Error("Array memory limit exceeded.");
  };
  const global = {
    values: Object.assign(Object.create(null), task.context || {}),
    parent: null,
  };
  const binding = (env, name) => {
    for (let scope = env; scope; scope = scope.parent)
      if (Object.hasOwn(scope.values, name)) return scope;
    throw Error("Unknown variable " + name);
  };
  const boolean = (value) => {
    checkType(value, "boolean");
    return value;
  };
  const get = (env, name) => {
    const value = binding(env, name).values[name];
    if (value === unassigned)
      throw Error("Variable " + name + " must be initialized before use.");
    return value;
  };
  const set = (node, value, env) => {
    bounded(value);
    if (node.kind === "name") {
      const scope = binding(env, node.name);
      if (scope.types?.[node.name]) checkType(value, scope.types[node.name]);
      scope.values[node.name] = value;
      return value;
    }
    if (node.kind === "index") {
      const array = evaluate(node.object, env),
        i = evaluate(node.index, env);
      if (
        !Array.isArray(array) ||
        !Number.isInteger(i) ||
        i < 0 ||
        i >= array.length
      )
        throw Error("Array index out of bounds.");
      if (arrayTypes.has(array)) checkType(value, arrayTypes.get(array));
      array[i] = value;
      return value;
    }
    throw Error("Invalid assignment target.");
  };
  const chain = (node) =>
    node.kind === "name"
      ? node.name
      : node.kind === "member"
        ? chain(node.object) + "." + node.name
        : "";
  function call(name, args) {
    if (++depth > 64) throw Error("Recursion limit exceeded.");
    try {
      const fn = functions.get(name);
      if (!fn) throw Error("Unknown method " + name);
      if (args.length !== fn.params.length)
        throw Error("Wrong argument count for " + name);
      const env = {
        values: Object.create(null),
        types: Object.create(null),
        parent: global,
      };
      fn.params.forEach((param, i) => {
        checkType(args[i], param.dataType);
        env.values[param.name] = args[i];
        env.types[param.name] = param.dataType;
      });
      const signal = execute(fn.body, env);
      if (fn.returnType !== "void") checkType(signal?.value, fn.returnType);
      return signal?.value;
    } finally {
      depth--;
    }
  }
  function evaluate(node, env) {
    tick();
    switch (node.kind) {
      case "literal":
        return node.value;
      case "name":
        return get(env, node.name);
      case "array":
        allocate(node.values.length);
        return node.values.map((value) => evaluate(value, env));
      case "new-array": {
        const n = evaluate(node.size, env);
        allocate(n);
        return Array(n).fill(node.fill);
      }
      case "member": {
        const value = evaluate(node.object, env);
        if (
          node.name === "length" &&
          (Array.isArray(value) || typeof value === "string")
        )
          return value.length;
        throw Error("Unsupported field " + node.name);
      }
      case "index": {
        const value = evaluate(node.object, env),
          i = evaluate(node.index, env);
        if (
          !Array.isArray(value) ||
          !Number.isInteger(i) ||
          i < 0 ||
          i >= value.length
        )
          throw Error("Array index out of bounds.");
        return value[i];
      }
      case "unary": {
        const value = evaluate(node.value, env);
        if (node.op === "!") return !boolean(value);
        if (node.op === "-") return -value;
        if (node.op === "+") return +value;
        return set(node.value, value + (node.op === "++" ? 1 : -1), env);
      }
      case "postfix": {
        const value = evaluate(node.value, env);
        set(node.value, value + (node.op === "++" ? 1 : -1), env);
        return value;
      }
      case "binary": {
        if (node.op === "=")
          return set(node.left, evaluate(node.right, env), env);
        const a = evaluate(node.left, env);
        if (node.op === "&&" && !boolean(a)) return false;
        if (node.op === "||" && boolean(a)) return true;
        const b = evaluate(node.right, env);
        let value;
        const op =
          node.op.length === 2 &&
          ["+=", "-=", "*=", "/=", "%="].includes(node.op)
            ? node.op[0]
            : node.op;
        if (op === "+")
          value =
            typeof a === "string" || typeof b === "string"
              ? bounded(String(a) + String(b))
              : a + b;
        else if (op === "-") value = a - b;
        else if (op === "*") value = a * b;
        else if (op === "/") {
          if (b === 0) throw Error("Division by zero.");
          value =
            Number.isInteger(a) && Number.isInteger(b)
              ? Math.trunc(a / b)
              : a / b;
        } else if (op === "%") value = a % b;
        else if (op === "<") value = a < b;
        else if (op === ">") value = a > b;
        else if (op === "<=") value = a <= b;
        else if (op === ">=") value = a >= b;
        else if (op === "==") value = a === b;
        else if (op === "!=") value = a !== b;
        else if (op === "&&") value = boolean(a) && boolean(b);
        else if (op === "||") value = boolean(a) || boolean(b);
        else throw Error("Unsupported operator " + op);
        return op !== node.op ? set(node.left, value, env) : bounded(value);
      }
      case "call": {
        const args = node.args.map((arg) => evaluate(arg, env));
        const path = chain(node.callee);
        if (path === "System.out.println" || path === "System.out.print") {
          if (output.join("").length > 12000)
            throw Error("Output limit exceeded.");
          output.push(
            args.map((value) => String(value)).join("") +
              (path.endsWith("println") ? "\n" : ""),
          );
          return null;
        }
        if (["Math.abs", "Math.min", "Math.max"].includes(path))
          return Math[path.split(".")[1]](...args);
        if (path === "Arrays.sort") {
          if (!Array.isArray(args[0]))
            throw Error("Arrays.sort needs an array.");
          args[0].sort((a, b) => a - b);
          return null;
        }
        if (
          ["System.", "Math.", "Arrays.", "Integer."].some((prefix) =>
            path.startsWith(prefix),
          )
        )
          throw Error("Unsupported system method " + path);
        if (node.callee.kind === "name") return call(path, args);
        if (node.callee.kind === "member") {
          const value = evaluate(node.callee.object, env),
            name = node.callee.name;
          if (name === "equals") return value === args[0];
          if (typeof value === "string") {
            if (name === "length") return value.length;
            if (name === "charAt") {
              if (args[0] < 0 || args[0] >= value.length)
                throw Error("String index out of bounds.");
              return value[args[0]];
            }
            if (name === "substring") return value.substring(...args);
            if (name === "toLowerCase") return value.toLowerCase();
            if (name === "toUpperCase") return value.toUpperCase();
            if (name === "indexOf") return value.indexOf(args[0]);
            if (name === "isEmpty") return value.length === 0;
          }
        }
        throw Error("Unsupported method " + path);
      }
    }
    throw Error("Unsupported expression node.");
  }
  function execute(node, env) {
    tick();
    if (node.kind === "empty") return;
    if (node.kind === "block") {
      const local = { values: Object.create(null), parent: env };
      for (const child of node.body) {
        const signal = execute(child, local);
        if (signal) return signal;
      }
      return;
    }
    if (node.kind === "declare") {
      env.types ??= Object.create(null);
      env.types[node.name] = node.dataType;
      const value = node.value ? evaluate(node.value, env) : unassigned;
      if (value !== unassigned) checkType(value, node.dataType);
      env.values[node.name] = value;
      return;
    }
    if (node.kind === "expression") {
      evaluate(node.value, env);
      return;
    }
    if (node.kind === "return")
      return {
        kind: "return",
        value: node.value ? evaluate(node.value, env) : null,
      };
    if (node.kind === "break" || node.kind === "continue")
      return { kind: node.kind };
    if (node.kind === "if")
      return boolean(evaluate(node.condition, env))
        ? execute(node.yes, env)
        : node.no
          ? execute(node.no, env)
          : undefined;
    if (node.kind === "foreach") {
      const values = evaluate(node.values, env);
      if (!Array.isArray(values))
        throw Error("Enhanced for requires an array.");
      const local = { values: Object.create(null), parent: env };
      for (const value of values) {
        tick();
        local.values[node.name] = value;
        const signal = execute(node.body, local);
        if (signal?.kind === "return") return signal;
        if (signal?.kind === "break") break;
      }
      return;
    }
    if (node.kind === "while" || node.kind === "for") {
      const local = { values: Object.create(null), parent: env };
      if (node.init) execute(node.init, local);
      while (boolean(evaluate(node.condition, local))) {
        tick();
        const signal = execute(node.body, local);
        if (signal?.kind === "return") return signal;
        if (signal?.kind === "break") break;
        if (node.update) evaluate(node.update, local);
      }
      return;
    }
  }
  for (const node of root) execute(node, global);
  let value;
  if (task.entry) value = call(task.entry, task.args || []);
  else if (functions.has("main")) call("main", [[]]);
  return { value, output: output.join("").replace(/\n$/, ""), steps };
}
