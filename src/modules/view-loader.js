/**
 * @class ViewLoaderModule
 * @description Module for loading views
 * Each view is a web component that is loaded into the view container
 * The best practice for a container is to have a HTMLMainElement that is the parent of all views
 * Since the view is a web component, it can be loaded into any container using the custom element tag
 * This also makes the view self contained and reusable
 * Because it is a web component, it can also have its own state and methods
 * It is reconmended that you use shadow dom for the view to prevent css conflicts
 * Initialize all your view related code in the connectedCallback
 * Cleanup all your view related code in the disconnectedCallback
 *
 * The view loader simply finds the right view and loads it into the container
 * It also provides a way to load the view with arguments
 * The view must have a method called load that takes in the data as an argument
 *
 * The view should export it's class as default and also have a static "tag" field that defines the custom element tag
 *
 * @example
 * export default class ExampleView extends HTMLElement {
 *   static tag = "example-view";
 *
 *   load(data) {
 *    console.log(data);
 *   }
 * }
 *
 * customElements.define(ExampleView.tag, ExampleView);
 *
 * By default it is assumed that the views location in the app folder is the same as the view name.
 * If you want to load the view from a different location, you can pass the path as a argument to the view loader.
 *
 * In the above example you can see that the view is responsible for registering itself as a custom element.
 * This makes it more reusable and self contained.
 *
 * @example folder structure
 * app
 * - home-view
 *  - home-view.js
 *  - home-view.html
 *  - home-view.css
 *
 * @example
 * await api.call("view_loader", 'load', {
 *     view: 'home-view',
 *     data: { key: 'value' },
 *     container: mainElement
 * });
 */

import { validateArgs } from "../validate/validate-args.js";

class ViewLoaderModule {
  static name = Object.freeze("view_loader");

  /**
   * @method load
   * @description Load a view into a container by crateing the view element and appending it to the container
   * @param args {object} arguments for the view loader
   * @param args.view {string} name of the view - this must correlate with the file name convention
   * @param args.data {object} data to pass to the view if the view has a load method
   * @param args.container {HTMLElement} container to load the view into, recommended to use a HTMLMainElement
   * @param args.rootFolder {string} root folder of the view, default is "app"
   * @returns {Promise<void>}
   *
   * @example
   * await api.call("view_loader", 'load', {
   *     view: 'home-view',
   *     data: { key: 'value' },
   *     container: mainElement
   * });
   */
  static async load(args) {
    validateArgs(args, {
      view: { type: "string", required: true },
      container: { type: "HTMLElement", required: true },
      rootFolder: { type: "string", required: false },
    });

    const rootFolder = args.rootFolder || "app";
    const view = args.view;
    const data = args.data;
    const container = args.container;

    const module = await import(`/${rootFolder}/${view}/${view}.js`);
    const tag = module.default.tag;

    const viewElement = document.createElement(tag);
    container.innerHTML = "";
    container.appendChild(viewElement);

    if (viewElement.load) {
      viewElement.load(data);
    }
  }
}

export { ViewLoaderModule };
