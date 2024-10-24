import { assert, assertEquals, assertExists } from "jsr:@std/assert";
import { SurrealDBModule } from "../../../src/modules/surrealdb.js";

SurrealDBModule.url = "http://127.0.0.1:8000";

Deno.test("SurrealDBModule - info", async () => {
	await SurrealDBModule.connect({
		username: "root",
		password: "root",
		namespace: "test",
		database: "test",
	});

	const info = await SurrealDBModule.info();
	assertExists(info);
});

Deno.test("SurrealDBModule - signin", async () => {
	await SurrealDBModule.connect({
		username: "root",
		password: "root",
		namespace: "test",
		database: "test",
	});

	const result = await SurrealDBModule.signin({
		username: "root",
		password: "root",
	});
	assertExists(result);
});

Deno.test("SurrealDBModule - create", async () => {
	await SurrealDBModule.connect({
		username: "root",
		password: "root",
		namespace: "test",
		database: "test",
	});

	const table_query = `
        DEFINE TABLE IF NOT EXISTS person;
        DEFINE FIELD IF NOT EXISTS firstName ON TABLE person TYPE string;
        DEFINE FIELD IF NOT EXISTS lastName ON TABLE person TYPE string;
        
        CREATE person SET
            firstName = "John",
            lastName = "Doe";
    `;

	const result = await SurrealDBModule.run_query({
		query: table_query,
	});

	assert(result.length > 0);

	const searchResult = await SurrealDBModule.run_query({
		namespace: "test",
		database: "test",
		query: "SELECT * FROM person;",
	});

	const people = searchResult[0];
	assert(people.length > 0);
	assertEquals(people[0].firstName, "John");
	assertEquals(people[0].lastName, "Doe");
});
