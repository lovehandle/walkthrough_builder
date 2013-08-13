(function() {
  var PathGenerator;

  window.PathGenerator = PathGenerator = (function() {
    function PathGenerator() {}

    PathGenerator.prototype.getPath = function(el, path) {
      path = path || [];
      if (!el || (this.getNodeName(el) === "html")) {
        return path.join(" > ");
      }
      path.unshift(this.getChildSelector(el));
      return this.getPath(el.parentNode, path);
    };

    PathGenerator.prototype.getChildSelector = function(el) {
      var i, parentNode, selector, sibling, siblings, _i, _len;
      parentNode = el.parentNode;
      if (!parentNode) {
        return "";
      }
      selector = [];
      if (this.getNodeName(el) !== "body") {
        siblings = this.getSiblingsWithoutTextNodes(el);
        i = 1;
        for (_i = 0, _len = siblings.length; _i < _len; _i++) {
          sibling = siblings[_i];
          if (sibling === el) {
            break;
          }
          if (sibling.nodeType === 9) {
            break;
          }
          selector.push(this.getElSelector(sibling));
          i += 1;
          if (i === siblings.length) {
            selector.push("+");
          } else {
            selector.push("~");
          }
        }
      }
      selector.push(this.getElSelector(el));
      return selector.join(" ");
    };

    PathGenerator.prototype.getElSelector = function(el) {
      var selector;
      selector = [];
      selector.push(this.getNodeName(el));
      selector.push(this.getIdSelector(el));
      selector.push(this.getClassSelector(el));
      selector.push(this.getNthChildSelector(el));
      selector = selector.filter(function(chunk) {
        return !!chunk;
      });
      selector = selector.join("");
      return selector.trim();
    };

    PathGenerator.prototype.getNodeName = function(el) {
      return el.nodeName.toLowerCase();
    };

    PathGenerator.prototype.getClassSelector = function(el) {
      var class_names;
      if (el.className) {
        class_names = el.className.split(" ");
        class_names = class_names.map(function(class_name) {
          return "." + class_name;
        });
        return class_names.join("");
      }
    };

    PathGenerator.prototype.getIdSelector = function(el) {
      if (el.id) {
        return "#" + el.id;
      }
    };

    PathGenerator.prototype.getNthChildSelector = function(el) {
      var index;
      index = this.getIndex(el);
      if (!!~index) {
        return ":nth-child(" + index + ")";
      }
    };

    PathGenerator.prototype.getIndex = function(el) {
      var current, index;
      current = el.previousSibling;
      index = 1;
      while (current && current.nodeType !== 9) {
        if (current.nodeType === 1) {
          index += 1;
        }
        current = current.previousSibling;
      }
      return index;
    };

    PathGenerator.prototype.getSiblingsWithoutTextNodes = function(el) {
      var filtered, parentNode, sibling, siblings, _i, _len;
      parentNode = el.parentNode;
      siblings = parentNode.childNodes;
      filtered = [];
      for (_i = 0, _len = siblings.length; _i < _len; _i++) {
        sibling = siblings[_i];
        if (sibling.nodeName.substring(0, 1) !== '#') {
          filtered.push(sibling);
        }
      }
      return filtered;
    };

    return PathGenerator;

  })();

}).call(this);
