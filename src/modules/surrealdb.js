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
        const result = await performGet(`${this.url}/status`);
        return result ?? { status: "ok" };
    }

    static async version() {
        return await performGet(`${this.url}/version`);
    }
}

async function performGet(url) {
    let response;
    try {
        response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        throw new Error(`Failed to get: ${error}`);
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