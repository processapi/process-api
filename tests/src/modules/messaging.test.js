import { assertEquals } from "jsr:@std/assert";
import { MessagingModule } from "../../../src/modules/messaging.js";

Deno.test("MessagingModule.publish - should call subscriber callbacks with the correct message", async () => {
	const callback = (message) => {
		assertEquals(message, { text: "Hello World" });
	};
	MessagingModule.subscribe({ topic: "my-topic", callback });

	await MessagingModule.publish({
		topic: "my-topic",
		message: { text: "Hello World" },
	});

	MessagingModule.unsubscribe({ topic: "my-topic", callback });
});

Deno.test("MessagingModule.publish - should do nothing when there are no subscribers for the topic", async () => {
	const callback = (message) => {
		throw new Error("This should not be called");
	};
	MessagingModule.subscribe({ topic: "another-topic", callback });

	await MessagingModule.publish({
		topic: "my-topic",
		message: { text: "Hello World" },
	});

	MessagingModule.unsubscribe({ topic: "another-topic", callback });
});
