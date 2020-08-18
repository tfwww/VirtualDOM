"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var doc = document;
var nodePatchTypes = {
  CREATE: "create node",
  REMOVE: "remove node",
  REPLACE: "replace node",
  UPDATE: "update node"
};
var propPatchTypes = {
  REMOVE: "remove prop",
  UPDATE: "update prop"
};
var state = {
  num: 5
};
var timer;
var ATTR_KEY = "__preprops_";
var arr = [0, 1, 2, 3, 4];

var Component = /*#__PURE__*/function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(newState) {
      this.state = _objectSpread(_objectSpread({}, this.state), newState);
      var vdom = this.render();
      diff(this.dom, vdom, this.parent);
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error("component should define its own render method");
    }
  }]);

  return Component;
}();

function buildComponentFromVDom(dom, vdom, parent) {
  var cpnt = vdom.tag;

  if (!_typeof(cpnt) === "function") {
    throw new Error("vdom is not a component type");
  }

  var props = getVDomProps(vdom);
  var componentInst = dom && dom._component; // 创建组件

  if (componentInst == undefined) {
    try {
      componentInst = new cpnt(props);
      setTimeout(function () {
        componentInst.setState({
          name: "Dickens"
        });
      }, 5000);
    } catch (error) {
      throw new Error("component creation error: ".concat(cpnt.name));
    }
  } // 组件更新
  else {
      componentInst.props = props;
    }

  var componentVDom = componentInst.render();
  diff(dom, componentVDom, parent, componentInst);
}

function getVDomProps(vdom) {
  var props = vdom.props;
  props.children = vdom.children;
  return props;
}

var MyComp = /*#__PURE__*/function (_Component) {
  _inherits(MyComp, _Component);

  var _super = _createSuper(MyComp);

  function MyComp(props) {
    var _this;

    _classCallCheck(this, MyComp);

    _this = _super.call(this, props);
    _this.state = {
      name: "Tina"
    };
    return _this;
  }

  _createClass(MyComp, [{
    key: "render",
    value: function render() {
      return h("div", null, h("div", null, "This is My Component! ", this.props.count), h("div", null, "name: ", this.state.name));
    }
  }]);

  return MyComp;
}(Component);

function setState(newState) {
  state = _objectSpread(_objectSpread({}, state), newState);
}

function flatten(arr) {
  return [].concat.apply([], arr);
} // 生成vdom


function h(tag, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    props: props || {},
    children: flatten(children) || []
  };
}

function view() {
  var elm = arr.pop(); // 用于测试能不能正常删除元素

  if (state.num !== 9) arr.unshift(elm); // 用于测试能不能正常添加元素

  if (state.num === 12) arr.push(9);
  return h("div", null, "Hello World", h(MyComp, {
    count: state.num
  }), h("ul", {
    myText: "dickens"
  }, arr.map(function (i) {
    return h("li", {
      id: i,
      "class": "li-".concat(i),
      key: i
    }, "\u7B2C", i);
  })));
} // 创建dom元素


function createElement(vdom) {
  // 如果vdom是字符串或者数字类型，则创建文本节点，比如“Hello World”
  if (typeof vdom === "string" || typeof vdom === "number") {
    return doc.createTextNode(vdom);
  }

  var tag = vdom.tag,
      props = vdom.props,
      children = vdom.children; // 1. 创建元素

  var element = doc.createElement(tag); // 2. 属性赋值

  setProps(element, props); // 3. 创建子元素

  children.map(function (vchild) {
    diff(undefined, vchild, element);
  });
  return element;
} // 属性赋值


function setProps(element, props) {
  // 属性赋值
  element[ATTR_KEY] = props;

  for (var key in props) {
    element.setAttribute(key, props[key]);
  }
} // 比较props的变化


function diffProps(newVDom, element) {
  var newProps = _objectSpread({}, element[ATTR_KEY]);

  var allProps = _objectSpread(_objectSpread({}, newProps), newVDom.props); // 获取新旧所有属性名后，再逐一判断新旧属性值


  Object.keys(allProps).forEach(function (key) {
    var oldValue = newProps[key];
    var newValue = newVDom.props[key]; // 删除属性

    if (newValue == undefined) {
      element.removeAttribute(key);
      delete newProps[key];
    } // 更新属性
    else if (oldValue == undefined || oldValue !== newValue) {
        element.setAttribute(key, newValue);
        newProps[key] = newValue;
      }
  }); // 属性重新赋值

  element[ATTR_KEY] = newProps;
} // 比较children的变化


function diffChildren(newVDom, parent) {
  // 有key的子元素
  var nodesWithKey = {};
  var nodesWithKeyCount = 0; // 没key的子元素

  var nodesWithoutKey = [];
  var nodesWithoutKeyCount = 0;
  var childNodes = parent.childNodes,
      nodeLength = childNodes.length;
  var vChildren = newVDom.children,
      vLength = vChildren.length; // 用于优化没key子元素的数组遍历

  var min = 0; // 将子元素分成有key和没key两组

  for (var i = 0; i < nodeLength; i++) {
    var child = childNodes[i],
        props = child[ATTR_KEY];

    if (props !== undefined && props.key !== undefined) {
      nodesWithKey[props.key] = child;
      nodesWithKeyCount++;
    } else {
      nodesWithoutKey[nodesWithoutKeyCount++] = child;
    }
  } // 遍历vdom的所有子元素


  for (var _i = 0; _i < vLength; _i++) {
    var vChild = vChildren[_i],
        vProps = vChild.props;
    var dom = void 0;
    var vKey = vProps !== undefined ? vProps.key : undefined; // 根据key来查找对应元素

    if (vKey !== undefined) {
      if (nodesWithKeyCount && nodesWithKey[vKey] !== undefined) {
        dom = nodesWithKey[vKey];
        nodesWithKey[vKey] = undefined;
        nodesWithKeyCount--;
      }
    } // 如果没有key字段，则找一个类型相同的元素出来做比较
    else if (min < nodesWithoutKeyCount) {
        for (var j = 0; j < nodesWithoutKeyCount; j++) {
          var node = nodesWithoutKey[j];

          if (node !== undefined && isSameType(node, vChild)) {
            dom = node;
            nodesWithoutKey[j] = undefined;
            if (j === min) min++;
            if (j === nodesWithoutKeyCount - 1) nodesWithoutKeyCount--;
            break;
          }
        }
      } // diff返回是否更新元素


    var isUpdate = diff(dom, vChild, parent); // 如果是更新元素，且不是同一个dom元素，则移动到原先的dom元素之前

    if (isUpdate) {
      var originChild = childNodes[_i];

      if (originChild !== dom) {
        parent.insertBefore(dom, originChild);
      }
    }
  } // 清理剩下的未使用的dom元素


  if (nodesWithKeyCount) {
    for (var key in nodesWithKey) {
      var _node = nodesWithKey[key];

      if (_node !== undefined) {
        _node.parentNode.removeChild(_node);
      }
    }
  } // 清理剩下的未使用的dom元素


  while (min <= nodesWithoutKeyCount) {
    var _node2 = nodesWithoutKey[nodesWithoutKeyCount--];

    if (_node2 !== undefined) {
      _node2.parentNode.removeChild(_node2);
    }
  }
}

function diff(dom, newVDom, parent, componentInst) {
  if (_typeof(newVDom) == "object" && typeof newVDom.tag == "function") {
    buildComponentFromVDom(dom, newVDom, parent);
    return false;
  } // 新建node


  if (dom == undefined) {
    var _dom = createElement(newVDom); // 自定义组件


    if (componentInst) {
      _dom._component = componentInst;
      _dom._componentConstructor = componentInst.constructor;
      componentInst.dom = _dom;
    }

    parent.appendChild(_dom);
    return false;
  } // 删除node


  if (newVDom == undefined) {
    parent.removeChild(dom);
    return false;
  } // 替换node


  if (!isSameType(dom, newVDom)) {
    parent.replaceChild(createElement(newVDom), dom);
    return false;
  } // 更新node


  if (dom.nodeType === Node.ELEMENT_NODE) {
    // 比较props的变化
    diffProps(newVDom, dom); // 比较children的变化

    diffChildren(newVDom, dom);
  }

  return true;
} // 比较元素类型是否相同


function isSameType(element, newVDom) {
  if (typeof newVDom.tag == "function") {
    return element._componentConstructor == newVDom.tag;
  }

  var elmType = element.nodeType;

  var vdomType = _typeof(newVDom); // 当dom元素是文本节点的情况


  if (elmType === Node.TEXT_NODE && (vdomType === "string" || vdomType === "number") && element.nodeValue == newVDom) {
    return true;
  } // 当dom元素是普通节点的情况


  if (elmType === Node.ELEMENT_NODE && element.tagName.toLowerCase() == newVDom.tag) {
    return true;
  }

  return false;
}

function tick(element) {
  if (state.num > 10) {
    clearTimeout(timer);
    return;
  }

  var newVDom = view();
  var dom = element.firstChild; // 比较并更新节点

  diff(dom, newVDom, element);
}

function render(element) {
  // 初始化的VD
  var vdom = view();
  console.log(vdom);
  var dom = createElement(vdom);
  element.appendChild(dom); // 每500毫秒改变一次state，并生成VD

  timer = setInterval(function () {
    state.num += 1;
    tick(element);
  }, 500);
}
