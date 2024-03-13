import type { Database } from '..';
import Dialect from './dialect';
import PostgresClass from './postgresql';
import MysqlClass from './mysql';
import SqliteClass from './sqlite';

/**
 * Require our dialect-specific code
 */
const getDialectClass = (dialect: string): typeof Dialect => {
  switch (dialect) {
    case 'postgres':
      return PostgresClass;
    case 'mysql':
      return MysqlClass;
    case 'sqlite':
      return SqliteClass;
    default:
      throw new Error(`Unknown dialect ${dialect}`);
  }
};

type ClientClass = { strapiDialect?: string };

/**
 * Get the dialect of a database client
 */
const getDialectName = (client: unknown) => {
  let clientName: string = "";

  if (typeof client === 'undefined') {
    throw new Error('Database client not found');
  }

  if (typeof client === 'string') {
    clientName = client;
  }

  const clientAsClass = client as ClientClass;

  if (typeof clientAsClass.strapiDialect === "string") {
    clientName = clientAsClass.strapiDialect;
  }

  switch (clientName) {
    case 'postgres':
      return 'postgres';
    case 'mysql':
    case 'mysql2':
      return 'mysql';
    case 'libsql':
    case 'sqlite':
    case 'sqlite-legacy':
      return 'sqlite';
    default:
      throw new Error(`Unknown client typee "${clientName}"`);
  }
};

const getDialect = (db: Database) => {
  const { client } = db.config.connection;
  const dialectName = getDialectName(client);

  const constructor = getDialectClass(dialectName);
  const dialect = new constructor(db, dialectName);

  return dialect;
};

export { Dialect, getDialect };
