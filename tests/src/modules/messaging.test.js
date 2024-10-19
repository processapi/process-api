import { MessagingModule } from "../../../src/modules/messaging.js";
import { assertEquals, assertThrowsAsync} from "https://deno.land/std@0.55.0/testing/asserts.ts";

Deno.test("MessagingModule.publish - should throw an error if topic is not provided", async () => {
await assertThrowsAsync(
	() => MessagingModule.publish({ message: { text: "Hello World" } }),
	Error,
	"MessagingModule.publish: Argument topic is required",
);
});

Deno.test("MessagingModule.publish - should throw an error if message is not provided", async () => {
await assertThrowsAsync(
	() => MessagingModule.publish({ topic: "my-topic" }),
	Error,
	"MessagingModule.publish: Argument message is required",
);
});

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