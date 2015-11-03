/**
 * @fileoverview Contains the BindingView component definition.
 */

'use strict';

/**
 * BindingView extends the base View class, and renders the binding data
 * associated with the regulatory Binding.
 * @param {string} viewName Name of the view.
 * @param {!Object} params Additional parameters.
 * @extends {View}
 * @constructor
 */
function BindingView(viewName, params) {
  BindingView.base.constructor.call(this, viewName);

  this.container.addClass('binding');

  /** @protected {BindingLoader} */
  this.loader = new BindingLoader(this.data);

  /** @protected {BindingPanel} */
  this.panel = new BindingPanel(this.data);

  /** @protected {BindingRenderer} */
  this.renderer = new BindingRenderer(this.container, this.data);

  // Set up data loading callbacks.
  $(this.container).on('genotet.ready', function() {
    this.loader.load(params.gene, params.chr);
  }.bind(this));
}

BindingView.prototype = Object.create(View.prototype);
BindingView.prototype.constructor = BindingView;
BindingView.base = View.prototype;

/** @override */
BindingView.prototype.defaultWidth = function() {
  return $(window).width();
};

/** @override */
BindingView.prototype.defaultHeight = function() {
  return 200;
};