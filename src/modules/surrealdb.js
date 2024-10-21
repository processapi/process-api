// https://surrealdb.com/docs/surrealdb/integration/http#accessing-endpoints-via-postman
import Surreal from "./surreal/cdn.js";
import { validateArgs } from "../validate/validate-args.js";

const DEFAULT_SERVER = "http://localhost:8000";

class SurrealDBModule {
	static name = Object.freeze("surrealdb");

	static async connect(args) {
		validateArgs(args, {
			username  : { type: "string", required: true },
			password  : { type: "string", required: true },
			url		  : { type: "string", required: false, default: DEFAULT_SERVER },
			namespace : { type: "string", required: false },
			database  : { type: "string", required: false },
		}, "SurrealDBModule.connect: ");

		if (this.db != null) {
			await this.disconnect();
		}

		this.db = new Surreal();

		const { username, password, url, namespace, database } = args;

		await this.db.connect( url );
		await this.db.signin({ username, password });
		await this.create_namespace({ namespace });
		await this.create_database({ namespace, database });
		await this.db.use({ namespace, database });
	}

	static async disconnect() {
		if (this.db != null) {
			await this.db.close();
			delete this.db;
		}
	}

	static async create_namespace(args) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.create_namespace: Database not connected");
		}

		validateArgs(args, {
			namespace : { type: "string", required: true },
		}, "SurrealDBModule.create_namespace: ");

		await this.db.query(`
            DEFINE NAMESPACE IF NOT EXISTS ${args.namespace};
        `);
	}

	static async create_database(args) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.create_database: Database not connected");
		}

		validateArgs(args, {
			namespace : { type: "string", required: true },
			database : { type: "string", required: true },
		}, "SurrealDBModule.create_database: ");

		await this.db.query(`
			USE NS ${args.namespace};
            DEFINE DATABASE IF NOT EXISTS ${args.database};
        `);
	}

	static async run_query(args) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.run_query: Database not connected");
		}

		return await this.db.query(args.query);
	}

	static async status() {
		if (this.db == null) {
			throw new Error("SurrealDBModule.status: Database not connected");
		}

		return await this.db.query("INFO FOR DB;");
	}

	static async signin(args = {}) {
		if (this.db == null) {
			throw new Error("SurrealDBModule.signin: Database not connected");
		}

		validateArgs(args, {
			username  : { type: "string", required: true },
			password  : { type: "string", required: true },
		}, "SurrealDBModule.signin: ");

		return await this.db.signin( args );
	}
}

export { SurrealDBModule };