var ObjectComponent = require('../core/ObjectComponent'),
    Node = require('../core/document/Node');

var Event_ = require('../core/event/Event'),
    NodeEvent = require('../core/document/NodeEvent'),
    ComponentEvent = require('../core/ComponentEvent');

function File(parent, object, value, params) {
    ObjectComponent.apply(this, arguments);

    params = params || {};
    params.onChange = params.onChange || this._onChange;
    this._onChange = params.onChange;

    var node = this._input = new Node(Node.INPUT_FILE);
    node.addEventListener(NodeEvent.CHANGE, this._onInputChange.bind(this));

    this._wrapNode.addChild(this._input);
}
File.prototype = Object.create(ObjectComponent.prototype);
File.prototype.constructor = File;

File.prototype.applyValue = function () {
    this.pushHistoryState();

    var obj = this._obj, key = this._key;
    obj[key] = this._input._element.files[0];

    if (obj[key]) {
        if (obj[key].type.match(/image.*/)) {
            this._loadImage(obj[key])
        }
    }
};

File.prototype._onInputChange = function (e) {
    this.applyValue();
};

File.prototype.onValueUpdate = function (e) {
};

File.prototype._loadImage = function (file, cb) {
    var reader = new FileReader();
    var url = null;
    var img = new Image();
    var _this = this;

    reader.onload = function (e) {
        img.onload = function () {
            url = e.target.result
            file.url = url
            file.img = img
            _this.dispatchEvent(new Event_(_this, ComponentEvent.VALUE_UPDATED, null));
            _this._onChange();
        };

        img.onerror = function () {
            console.error('An error occurred during loading the image.');
        };

        img.src = e.target.result;
    };

    reader.onerror = function () {
        console.error("An error occurred during loading the image.");
    };

    reader.readAsDataURL(file);
};

module.exports = File;