importScripts("../../vendor/sql-wasm.js");
let engine;
onmessage = async ({ data }) => {
  let db;
  try {
    if (!engine) {
      engine = await initSqlJs({
        locateFile: () =>
          new URL("../../vendor/sql-wasm.wasm", location.href).href,
      });
      postMessage({ ready: true });
    }
    db = new engine.Database();
    const fixtures = data.fixtures || { [data.table]: data.rows };
    for (const [table, rows] of Object.entries(fixtures)) {
      if (!/^[a-z_][a-z_0-9]*$/i.test(table) || !rows.length)
        throw Error("Invalid fixture.");
      const columns = Object.keys(rows[0]);
      db.run(
        `CREATE TABLE "${table}" (${columns.map((column) => '"' + column + '"').join(",")});`,
      );
      const insert = db.prepare(
        `INSERT INTO "${table}" VALUES (${columns.map(() => "?").join(",")})`,
      );
      for (const row of rows) insert.run(columns.map((column) => row[column]));
      insert.free();
    }
    db.run(
      "PRAGMA query_only=ON; PRAGMA max_page_count=256; PRAGMA hard_heap_limit=16777216; PRAGMA temp_store=MEMORY;",
    );
    const statement = db.prepare(data.source);
    const rows = [];
    let cells = 0;
    while (statement.step()) {
      const values = statement.get();
      cells += values.length;
      if (cells > 10000 || JSON.stringify(values).length > 16000)
        throw Error("Result size limit exceeded.");
      rows.push(values);
    }
    const columns = statement.getColumnNames();
    statement.free();
    postMessage({ result: { columns, rows } });
  } catch (error) {
    postMessage({ error: String(error.message || error) });
  } finally {
    db?.close();
  }
};
