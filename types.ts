/** Supported dialects */
export type DBDialects = "pg" | "mysql" | "sqlite3";

/** Exposed object in migration files. available in `up`/`down` methods.
 * queryBuilder is available when passing `exposeQueryBuilder: true` to the config file.
 */
export type Info<T = undefined> = {
  dialect: DBDialects;
  connection: QueryHandler;
  queryBuilder: T;
};

/** `up`/`down` methods in migration files. */
export type Migration<T = undefined> = (
  info: Info<T>,
) => string | string[] | Promise<string | string[]>;
/** `run` method in seed files. */
export type Seed = () => string | string[] | Promise<string | string[]>;
/** Logger function. */
export type LoggerFn = (output?: any, title?: string) => void;
/** Handy type to cover printf. */
export type QueryWithString = (string: string) => string;
/** Amount type for migrations. */
export type AmountMigrateT = number | undefined;
/** Amount type for rollbacks. */
export type AmountRollbackT = AmountMigrateT | "all";
/** Query type. */
export type QueryT = string | string[];
/** Qhuery handler function. */
export type QueryHandler = (query: QueryT) => Promise<any>;
/** Type for migration files. */
export type MigrationFile = {
  up: Migration;
  down: Migration;
};

/** Client interface. Is to be implemented by every client. */
export interface ClientI {
  /** The current dialect, given by the Client e.g. pg, mysql, sqlite3 */
  dialect: string;
  /** Migration folder given from the config file */
  migrationFolder: string;
  /** Seed folder given from the config file */
  seedFolder: string;
  /** Migration files read from the migration folder */
  migrationFiles: Deno.DirEntry[];
  /** Seed files read from the seed folder */
  seedFiles: Deno.DirEntry[];
  /** Toggle for whether or not the qb should be exposed in migration methods */
  exposeQueryBuilder: boolean;
  /** Prepares the db connection */
  prepare: () => Promise<void>;
  /** Closes the db connection */
  close: () => Promise<void>;
  /** Handles the migration */
  migrate: (amount: AmountMigrateT) => Promise<void>;
  /** Handles the rollback */
  rollback: (amount: AmountRollbackT) => Promise<void>;
  /** Handles the seeding */
  seed: (matcher?: string) => Promise<void>;
  /** Universal wrapper for db query execution */
  query: QueryHandler;
  /** Sets the logger. Used by State */
  setLogger: LoggerFn;
}

/** Nessie config options. */
export interface NessieConfig {
  client: ClientI;
  exposeQueryBuilder?: boolean;
}

/** Client config options. */
export interface ClientOptions {
  migrationFolder?: string;
  seedFolder?: string;
  [option: string]: any;
}
