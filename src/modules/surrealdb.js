// https://surrealdb.com/docs/surrealdb/integration/http#accessing-endpoints-via-postman

import { validateArgs } from "../validate/validate-args.js";

const DEFAULT_SERVER = "http://localhost:8000";

class SurrealDBModule {
    static name = Object.freeze("surrealdb");

    static async connect(args) {
        validateArgs(args, {
            url: { type: "string", required: false },
            namespace: { type: "string", required: true },
            db: { type: "string", required: true },
        }, "SurrealDBModule.connect: ");

        const { url, namespace, db } = args;

        this.url = url ?? DEFAULT_SERVER;
        this.namespace = namespace;
        this.db = db;
    }

    static async disconnect() {
        this.url = null;
        this.namespace = null;
        this.db = null;
    }

    static async status() {
        const result = await callServer(`${this.url}/status`, "GET");
        return result ?? { status: "ok" };
    }

    static async version() {
        return await callServer(`${this.url}/version`, "GET");
    }

    static async signin(args = {}) {
        validateArgs(args, {
            ns: { type: "string", required: false },
            db: { type: "string", required: false },
            user: { type: "string", required: false },
            pass: { type: "string", required: false }
        });

        let { ns, db, user, pass } = args;
        user ||= "root";
        pass ||= "root";

        const body = {
            user,
            pass
        }

        if (ns) {
            body.ns = ns;
        }

        if (db) {
            body.db = db;
        }

        const result = await callServer(`${this.url}/signin`, "POST", { ns, db, user, pass });
        return result ?? { status: "ok" };
    }
}

async function callServer(url, method, body) {
    let response;
    try {
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        };

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