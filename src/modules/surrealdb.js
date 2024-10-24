// https://surrealdb.com/docs/surrealdb/integration/http#accessing-endpoints-via-postman
import Surreal from "./surreal/cdn.js";
import { validateArgs } from "../validate/validate-args.js";

const DEFAULT_SERVER = "http://localhost:8000";

/**
 * The SurrealDBModule is a module that provides database capabilities to the application.
 * It is used to connect to a SurrealDB server and perform operations on the database.
 */
class SurrealDBModule {
	/**
	 * @field name
	 * @description Name of the module
	 * @type {string}
	 * @static
	 * @readonly
	 */
	static name = Object.freeze("surrealdb");

	/**
	 * @method connect
	 * @description connect to the SurrealDB server using:
	 * @param args
	 * @param args.username {string} - The username to use for the connection
	 * @param args.password {string} - The password to use for the connection
	 * @param args.url {string} - The url to use for the connection
	 * @param args.namespace {string} - The namespace to use for the connection
	 * @param args.database {string} - The database to use for the connection
	 * @returns {Promise<void>}
	 */
	static async connect(args) {
		validateArgs(args, {
			username: { type: "string", required: true },
			password: { type: "string", required: true },
			url: { type: "string", required: false, default: DEFAULT_SERVER },
			namespace: { type: "string", required: false },
			database: { type: "string", required: false },
		}, "SurrealDBModule.connect: ");

		if (this.db != null) {
			await this.disconnect();
		}

		this.db = new Surreal();

		const { username, password, url, namespace, database } = args;

		await this.db.connect(url);
		await this.db.signin({ username, password });
		await this.create_namespace({ namespace });
		await this.create_database({ namespace, database });
		await this.db.use({ namespace, database });
	}

	/**
	 * @method disconnect
	 * @description disconnect from the SurrealDB server
	 * @returns {Promise<void>}
	 */
	static async disconnect() {
		if (this.db != null) {
			await this.db.close();
			delete this.db;
		}
	}

	/**
	 * @method create_namespace
	 * @description Create a namespace in the database
	 * @param args
	 * @param args.namespace {string} - The name of the namespace to create
	 * @returns {Promise<void>}
	 */
	static async create_namespace(args) {
		if (this.db == null) {
			throw new Error(
				"SurrealDBModule.create_namespace: Database not connected",
			);
		}

		validateArgs(args, {
			namespace: { type: "string", required: true },
		}, "SurrealDBModule.create_namespace: ");

		await this.db.query(`
            DEFINE NAMESPACE IF NOT EXISTS ${args.namespace};
        `);
	}

	/**
	 * @method create_database
	 * @description Create a database in the namespace
	 * @param args
	 * @param args.namespace {string} - The namespace to create the database in
	 * @param args.database {string} - The name of the database to create
	 * @returns {Promise<void>}
	 */
	static async create_database(args) {
		if (this.db == null) {
			throw new Error(
				"SurrealDBModule.create_database: Database not connected",
			);
		}

		validateArgs(args, {
			namespace: { type: "string", required: true },
			database: { type: "string", required: true },
		}, "SurrealDBModule.create_database: ");

		await this.db.query(`
			USE NS ${args.namespace};
            DEFINE DATABASE IF NOT EXISTS ${args.database};
        `);
	}

	/**
	 * @method run_query
	 * @description Run a query on the database
	 * This is mused to perform most all actions from creating tables to inserting data
	 * If your query has multiple statements you will get back multiple results
	 * @param args
	 * @returns {Promise<LockManagerSnapshot|PermissionStatus>}
	 */
	static async run_query(args) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.run_query: Database not connected");
		}

		return await this.db.query(args.query);
	}

	/**
	 * @method info
	 * @description Get information about the database
	 * This will return a snapshot of the database structure including tables, functions, users ...
	 * @returns {Promise<LockManagerSnapshot|PermissionStatus>}
	 */
	static async info() {
		if (this.db == null) {
			throw new Error("SurrealDBModule.info: Database not connected");
		}

		return await this.db.query("INFO FOR DB;");
	}

	/**
	 * @method signin
	 * @description Sign in to the database
	 * Before performing this action you should be connected to the database so ensure you call connect first
	 * @param args
	 * @param args.username {string} - The username to sign in with
	 * @param args.password {string} - The password to sign in with
	 * @returns {Promise<*>}
	 */
	static async signin(args = {}) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.signin: Database not connected");
		}

		validateArgs(args, {
			username: { type: "string", required: true },
			password: { type: "string", required: true },
		}, "SurrealDBModule.signin: ");

		return await this.db.signin(args);
	}
}

export { SurrealDBModule };
