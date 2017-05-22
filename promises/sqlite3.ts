import * as sqlite3 from "sqlite3";

export enum Mode {
  readonly = sqlite3.OPEN_READONLY,
  readwrite = sqlite3.OPEN_READWRITE,
  create = sqlite3.OPEN_CREATE
}

function handleNullError(resolve: () => void, reject: (error: Error) => void) {
  return function handleError(err: Error): void {
    if (err === null) {
      resolve();
    } else {
      reject(err);
    }
  }
}

class RunResult {
  constructor(public lastID: any, public changes: number) { }

  static handleNullError(resolve: (result: RunResult) => void, reject: (error: Error) => void) {
    return function handleError(err: Error): void {
      if (err === null) {
        resolve(new RunResult(this.lastID, this.changes));
      } else {
        reject(err);
      }
    }
  }
}

function handleNullErrorWithResult(resolve: (result: any) => void, reject: (error: Error) => void) {
  return function handleError(err: Error, result: any): void {
    if (err === null) {
      resolve(result);
    } else {
      reject(err);
    }
  }
}

export class Statement {
  constructor(private statement: sqlite3.Statement) { }

  run(params: {}): Promise<RunResult> {
    let statement = this.statement;

    return new Promise<RunResult>(function executor(resolve, reject) {
      statement.run(params, RunResult.handleNullError(resolve, reject));
    });
  }

  get(params: {}): Promise<any> {
    let statement = this.statement;

    return new Promise<any>(function executor(resolve, reject) {
      statement.get(params, handleNullErrorWithResult(resolve, reject));
    });
  }

  all(params: {}): Promise<any> {
    let statement = this.statement;

    return new Promise<any>(function executor(resolve, reject) {
      statement.all(params, handleNullErrorWithResult(resolve, reject));
    });
  }

  each(params: {}, callback: (err: Error, row: any) => void): Promise<number> {
    let statement = this.statement;

    return new Promise<number>(function executor(resolve, reject) {
      statement.each(params, callback, handleNullErrorWithResult(resolve, reject));
    });
  }
}

export class Database {
  database: sqlite3.Database | null;

  constructor() {
    this.database = null;
  }

  open(filename: string, mode?: Mode): Promise<Database> {
    let self = this;

    return new Promise<Database>(function executor(resolve, reject) {
      self.database = sqlite3.cached.Database(filename, mode, handleNullError(() => resolve(self), reject));
    });
  }

  close(): Promise<void> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database = this.database;

      return new Promise<void>(function executor(resolve, reject) {
        database.close(handleNullError(resolve, reject));
      });
    }

  }

  run(sql: string, params: {}): Promise<RunResult> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database = this.database;

      return new Promise<RunResult>(function executor(resolve, reject) {
        database.run(sql, params, RunResult.handleNullError(resolve, reject));
      });
    }
  }

  get(sql: string, params: {}): Promise<any> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database = this.database;

      return new Promise<any>(function executor(resolve, reject) {
        database.get(sql, params, handleNullErrorWithResult(resolve, reject));
      });
    }
  }

  all(sql: string, params: {}): Promise<any> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database = this.database;

      return new Promise<any>(function executor(resolve, reject) {
        database.all(sql, params, handleNullErrorWithResult(resolve, reject));
      });
    }
  }

  each(sql: string, params: {}, callback: (err: Error, row: any) => void): Promise<number> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database = this.database;

      return new Promise<number>(function executor(resolve, reject) {
        database.each(sql, params, callback, handleNullErrorWithResult(resolve, reject));
      });
    }
  }

  prepare(sql: string): Promise<Statement> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      let database: sqlite3.Database = this.database;
      let statement: sqlite3.Statement | null = null;

      return new Promise<Statement>(function executor(resolve, reject) {
        statement = database.prepare(sql, handleNullError(resolve, reject));
      }).then(function returnStatement(): Promise<Statement> {
        if (statement === null) {
          return Promise.reject(new Error("Failed to set statement"));
        } else {
          return Promise.resolve(new Statement(statement));
        }
      });
    }
  }

  serialize<T>(action: ((database: sqlite3.Database) => T)): Promise<T> {
    if (this.database === null) {
      return Promise.reject(new Error("datbase is not open"));
    } else {
      const database = this.database;
      return new Promise<T>(function executor(resolve, reject) {
        database.serialize(function serializeCallback() {
          try {
            resolve(action(database));
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }
}

export function open(filename: string, mode?: Mode): Promise<Database> {
  return new Database().open(filename, mode);
}
