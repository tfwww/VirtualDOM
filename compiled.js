"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var preVDom;

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
  return h("ul", null, // 生成元素为0到n-1的数组
  _toConsumableArray(Array(state.num).keys()).map(function (i) {
    return h("li", {
      id: i,
      "class": "li-".concat(i)
    }, "\u7B2C", i * state.num);
  }));
}

function newView() {
  return h("div", null, "Hello World");
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

  children.map(createElement).forEach(element.appendChild.bind(element));
  return element;
} // 属性赋值


function setProps(element, props) {
  for (var key in props) {
    element.setAttribute(key, props[key]);
  }
}
/**
 * [{
 *      type,
 *      key,
 *      value
 * }]
 */
// 比较props的变化


function diffProps(oldVDom, newVDom) {
  var patches = [];

  var allProps = _objectSpread(_objectSpread({}, oldVDom.props), newVDom.props); // 获取新旧所有属性名后，再逐一判断新旧属性值


  Object.keys(allProps).forEach(function (key) {
    var oldValue = oldVDom.props[key];
    var newValue = newVDom.props[key]; // 删除属性

    if (newValue == undefined) {
      patches.push({
        type: propPatchTypes.REMOVE,
        key: key
      });
    } // 更新属性
    else if (oldValue == undefined || oldValue !== newValue) {
        patches.push({
          type: propPatchTypes.UPDATE,
          key: key,
          value: newValue
        });
      }
  });
  return patches;
} // 比较children的变化


function diffChildren(oldVDom, newVDom) {
  var patches = []; // 获取子元素最大长度

  var childLength = Math.max(oldVDom.children.length, newVDom.children.length); // 遍历并diff子元素

  for (var i = 0; i < childLength; i++) {
    patches.push(diff(oldVDom.children[i], newVDom.children[i]));
  }

  return patches;
}
/**
 * {
 *      type,
 *      vdom,
 *      props,
 *      children
 * }
 */


function diff(oldVDom, newVDom) {
  console.log('oldVDom', oldVDom, _typeof(oldVDom)); // 新建node

  if (oldVDom == undefined) {
    return {
      type: nodePatchTypes.CREATE,
      vdom: newVDom
    };
  } // 删除node


  if (newVDom == undefined) {
    return {
      type: nodePatchTypes.REMOVE
    };
  } // 替换node


  if (_typeof(oldVDom) !== _typeof(newVDom) || (typeof oldVDom === "string" || typeof oldVDom === "number") && oldVDom !== newVDom || oldVDom.tag !== newVDom.tag) {
    console.log('ddd');
    return {
      type: nodePatchTypes.REPLACE,
      vdom: newVDom
    };
  } // 更新node


  if (oldVDom.tag) {
    // 比较props的变化
    var propsDiff = diffProps(oldVDom, newVDom); // 比较children的变化

    var childrenDiff = diffChildren(oldVDom, newVDom); // 如果props或者children有变化，才需要更新

    if (propsDiff.length > 0 || childrenDiff.some(function (patchObj) {
      return patchObj !== undefined;
    })) {
      return {
        type: nodePatchTypes.UPDATE,
        props: propsDiff,
        children: childrenDiff
      };
    }
  }
} // 更新属性


function patchProps(element, props) {
  if (!props) {
    return;
  }

  props.forEach(function (patchObj) {
    // 删除属性
    if (patchObj.type === propPatchTypes.REMOVE) {
      element.removeAttribute(patchObj.key);
    } // 更新或新建属性
    else if (patchObj.type === propPatchTypes.UPDATE) {
        element.setAttribute(patchObj.key, patchObj.value);
      }
  });
} // 操作 DOM


function patch(parent, patchObj) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!patchObj) {
    return;
  } // 新建元素


  if (patchObj.type === nodePatchTypes.CREATE) {
    return parent.appendChild(createElement(patchObj.vdom));
  }

  var element = parent.childNodes[index]; // 删除元素

  if (patchObj.type === nodePatchTypes.REMOVE) {
    return parent.removeChild(element);
  } // 替换元素


  if (patchObj.type === nodePatchTypes.REPLACE) {
    return parent.replaceChild(createElement(patchObj.vdom), element);
  } // 更新元素


  if (patchObj.type === nodePatchTypes.UPDATE) {
    var props = patchObj.props,
        children = patchObj.children; // 更新属性

    patchProps(element, props); // 更新子元素

    children.forEach(function (patchObj, i) {
      // 更新子元素时，需要将子元素的序号传入
      patch(element, patchObj, i);
    });
  }
}

function tick(element) {
  if (state.num > 20) {
    clearTimeout(timer);
    return;
  }

  var newVDom = newView(); // 生成差异对象

  var patchObj = diff(preVDom, newVDom);
  console.log('patch obj', patchObj);
  preVDom = newVDom; // 给dom打个补丁

  patch(element, patchObj); // newDom = createElement(newVDom);
  // element.replaceChild(newDom, dom);
  // dom = newDom;
}

function render(element) {
  // 初始化的VD
  var vdom = view();
  preVDom = vdom;
  console.log(vdom);
  var dom = createElement(vdom);
  element.appendChild(dom); // 每500毫秒改变一次state，并生成VD
  // timer = setInterval(() => {
  //   state.num += 1;
  //   tick(element);
  // }, 500);
  // timer = setTimeout(() => {
  //   state.num += 1;
  //   tick(element);
  // }, 500);
}

window.onload = function name(params) {
  var btn = document.querySelector('#btn');
  btn.addEventListener('click', function (params) {
    var element = document.getElementById("main");
    state.num += 1;
    tick(element);
  });
};
