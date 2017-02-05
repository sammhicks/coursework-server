import * as sqlite3 from "sqlite3";

enum Mode {
  readonly = sqlite3.OPEN_READONLY,
  readwrite = sqlite3.OPEN_READWRITE,
  create = sqlite3.OPEN_CREATE
}

function handleNullError(resolve: () => void, reject: (Error) => void) {
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

  static handleNullError(resolve: (RunResult) => void, reject: (Error) => void) {
    return function handleError(err: Error): void {
      if (err === null) {
        resolve(new RunResult(this.lastID, this.changes));
      } else {
        reject(err);
      }
    }
  }
}

function handleNullErrorWithResult(resolve: (any) => void, reject: (Error) => void) {
  return function handleError(err: Error, result: any): void {
    if (err === null) {
      resolve(result);
    } else {
      reject(err);
    }
  }
}

class Statement {
  constructor(public _statement: sqlite3.Statement) { }

  run(params: {}): Promise<RunResult> {
    let statement = this._statement;

    return new Promise<RunResult>(function executor(resolve, reject) {
      statement.run(params, RunResult.handleNullError(resolve, reject));
    });
  }

  get(params: {}): Promise<any> {
    let statement = this._statement;

    return new Promise<any>(function executor(resolve, reject) {
      statement.get(params, handleNullErrorWithResult(resolve, reject));
    });
  }

  all(params: {}): Promise<any> {
    let statement = this._statement;

    return new Promise<any>(function executor(resolve, reject) {
      statement.all(params, handleNullErrorWithResult(resolve, reject));
    });
  }

  each(params: {}, callback: (err: Error, row: any) => void): Promise<number> {
    let statement = this._statement;

    return new Promise<number>(function executor(resolve, reject) {
      statement.each(params, callback, handleNullErrorWithResult(resolve, reject));
    });
  }
}

class Database {
  _database: sqlite3.Database;

  constructor() {
    this._database = null;
  }

  open(filename: string, mode?: Mode): Promise<Database> {
    let self = this;

    return new Promise<Database>(function executor(resolve, reject) {
      this.database = new sqlite3.Database(filename, mode, handleNullError(() => resolve(self), reject));
    });
  }

  close(): Promise<void> {
    let database = this._database;

    return new Promise<void>(function executor(resolve, reject) {
      database.close(handleNullError(resolve, reject));
    });
  }

  run(sql: string, params: {}): Promise<RunResult> {
    let database = this._database;

    return new Promise<RunResult>(function executor(resolve, reject) {
      database.run(sql, params, RunResult.handleNullError(resolve, reject));
    });
  }

  get(sql: string, params: {}): Promise<any> {
    let database = this._database;

    return new Promise<any>(function executor(resolve, reject) {
      database.get(sql, params, handleNullErrorWithResult(resolve, reject));
    });
  }

  all(sql: string, params: {}): Promise<any> {
    let database = this._database;

    return new Promise<any>(function executor(resolve, reject) {
      database.all(sql, params, handleNullErrorWithResult(resolve, reject));
    });
  }

  each(sql: string, params: {}, callback: (err: Error, row: any) => void): Promise<number> {
    let database = this._database;

    return new Promise<number>(function executor(resolve, reject) {
      database.each(sql, params, callback, handleNullErrorWithResult(resolve, reject));
    });
  }

  prepare(sql: string): Promise<Statement> {
    let database = this._database;
    let statement = null;

    return new Promise<void>(function executor(resolve, reject) {
      statement = database.prepare(sql, handleNullError(resolve, reject));
    }).then(() => new Statement(statement));
  }
}

export function open(filename: string, mode?: Mode): Promise<Database> {
  return new Database().open(filename, mode);
}