// https://surrealdb.com/docs/surrealdb/integration/http#accessing-endpoints-via-postman

import { validateArgs } from "../validate/validate-args.js";

const DEFAULT_SERVER = "http://localhost:8000";

class SurrealDBModule {
    static name = Object.freeze("surrealdb");

    static async create_namespace(args) {
        if (this.token == null) {
            throw new Error("You must sign in first.");
        }

        validateArgs(args, {
            ns: { type: "string", required: true }
        });

        const query = `DEFINE NAMESPACE IF NOT EXISTS ${args.ns};`
        return await this.run_query({ query });
    }

    static async create_database(args) {
        if (this.token == null) {
            throw new Error("You must sign in first.");
        }

        validateArgs(args, {
            ns: { type: "string", required: true },
            db: { type: "string", required: true }
        });

        const query = `
            DEFINE DATABASE IF NOT EXISTS ${args.db};
        `
        return await this.run_query({ query });
    }

    static async run_query(args) {
        if (this.token == null) {
            throw new Error("You must sign in first.");
        }

        validateArgs(args, {
            ns: { type: "string", required: false },
            db: { type: "string", required: false },
            query: { type: "string", required: true }
        });

        const body = {
            query: args.query
        }

        return await callServer(`${this.url}/sql`, "POST", body, `Bearer ${this.token}`, args.ns, args.db);
    }

    static async status() {
        const result = await callServer(`${this.url}/status`, "GET");
        return result ?? { status: "OK" };
    }

    static async version() {
        return await callServer(`${this.url}/version`, "GET");
    }

    static async signin(args = {}) {
        validateArgs(args, {
            ns: { type: "string", required: false },
            db: { type: "string", required: false },
            user: { type: "string", required: true },
            pass: { type: "string", required: true }
        });

        const auth = btoa(`${args.user}:${args.pass}`);
        const body = createBody(args)
        const result = await callServer(`${this.url}/signin`, "POST", body, `Basic ${auth}`, args.ns, args.db);

        this.token = result.token;

        if (result.code === 200) {
            return { status: "OK" };
        }
    }

    static async signup(args) {
        validateArgs(args, {
            ns: { type: "string", required: true },
            db: { type: "string", required: true },
            user: { type: "string", required: true },
            pass: { type: "string", required: true }
        });

        const body = createBody(args)
        const result = await callServer(`${this.url}/signup`, "POST", body);
        return result ?? { status: "OK" };
    }
}

function createBody(args) {
    let { ns, db, user, pass } = args;

    const body = {
        user,
        pass
    }

    if (ns != null) {
        body.ns = ns;
    }

    if (db != null) {
        body.db = db;
    }

    return body;
}

async function callServer(url, method, body, auth, ns, db) {
    let response;

    try {
        const options = {
            method: method,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
        };

        if (auth) {
            options.headers.Authorization = auth;
        }

        if (ns) {
            options.headers.ns = ns;
        }

        if (db) {
            options.headers.db = db;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        response = await fetch(url, options);
    } catch (error) {
        throw new Error(`Failed to call ${url}: ${error}`);
    }

    return await processResponse(response, url);
}

async function processResponse(response, url) {
    if (!response.ok) {
        throw new Error(`Failed to call ${url}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType) {
        await response.body?.cancel();
        return;
    }

    if (contentType.includes("application/json")) {
        return await response.json();
    }

    if (contentType.includes("text/plain")) {
        return await response.text();
    }

    if (contentType.includes("application/octet-stream")) {
        return await response.blob();
    }
}

export { SurrealDBModule };