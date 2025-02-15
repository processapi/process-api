// deno-lint-ignore-file require-await
/**
 * @class MessagingModule
 * @description Messaging module provides the ability to send and receive messages
 * This is mostly accomplished by the PUBSUB pattern where you can subscribe to a topic
 * and publish messages to a topic.
 */

export class MessagingModule {
	/**
	 * @field name
	 * @description Name of the module
	 * @type {string}
	 * @static
	 */
	static name = Object.freeze("messaging");
	static subscribers = {};

	/**
	 * @method subscribe
	 * @description this method subscribes to a topic using the top name
	 * @param {Object} args
	 * @param {string} args.topic - the topic name
	 * @param {Function} args.callback - the callback function to call when a message is published to the topic
	 *
	 * @example
	 * MessagingModule.subscribe({
	 *     topic: "my-topic",
	 * 		callback: (message) => {
	 * 			console.log(message);
	 * 		}
	 * });
	 *
	 * @example
	 * await api.call("messaging", "subscribe", {
	 *     topic: "my-topic",
	 * 	   callback: (message) => {
	 * 	       console.log(message);
	 * 	   }
	 * });
	 */
	static async subscribe(args) {
		const { topic, callback } = args;

		if (!this.subscribers[topic]) {
			this.subscribers[topic] = [];
		}

		this.subscribers[topic].push(callback);
	}

	/**
	 * @method unsubscribe
	 * @description this method unsubscribes from a topic using the top name
	 * @param {Object} args
	 * @param {string} args.topic - the topic name
	 * @param {Function} args.callback - the callback function to remove from the subscribers list
	 *
	 * @example
	 * MessagingModule.unsubscribe({
	 *     topic: "my-topic",
	 *     callback: myCallback
	 * });
	 *
	 * @example
	 * await api.call("messaging", "unsubscribe", {
	 *     topic: "my-topic",
	 *     callback: myCallback
	 * });
	 */
	static async unsubscribe(args) {
		const { topic, callback } = args;

		if (!this.subscribers[topic]) {
			return;
		}

		const index = this.subscribers[topic].indexOf(callback);
		if (index > -1) {
			this.subscribers[topic].splice(index, 1);
		}
	}

	/**
	 * @method publish
	 * @description this method publishes a message to a topic
	 * @param {Object} args
	 * @param {string} args.topic - the topic name
	 * @param {Object} args.message - the message to publish
	 *
	 * @example
	 * MessagingModule.publish({
	 *    topic: "my-topic",
	 *    message: {
	 * 	      text: "Hello World"
	 *    }
	 * });
	 *
	 * @example
	 * await api.call("messaging", "publish", {
	 *     topic: "my-topic",
	 *     message: {
	 * 	       text: "Hello World"
	 *     }
	 * });
	 */
	static async publish(args) {
		const { topic, message } = args;

		if (!this.subscribers[topic]) {
			return;
		}

		this.subscribers[topic].forEach((callback) => {
			callback(message);
		});
	}
}
