import createDebug from 'debug';
import { Knex } from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BaseClient = require("knex/lib/dialects/better-sqlite3");

const debug = createDebug('strapi::database');

const LibsqlClient = class LibsqlClient extends BaseClient {
  static strapiDialect = "sqlite";

  _driver() {
    // eslint-disable-next-line import/no-extraneous-dependencies
    return require("libsql");
  }

  async acquireRawConnection() {
    const options = this.connectionSettings.options || {};

    debug("Creating libsql connection");

    const Driver = this.driver;

    const db = new Driver(this.connectionSettings.filename, options);

    try {
      db.sync();
    } catch (_) {
      db.sync();
    }

    return db;
  }
} as unknown as typeof Knex.Client;

export default LibsqlClient;
