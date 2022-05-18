var r = require("1.js").swap;

module.exports = [ {
    name: "冒泡排序",
    code: '<pre><code class="language-js">function bubbleSort(arr) {\n  for (var i = 0; i < arr.length - 1; i++) {\n    for (var j = arr.length - 1-i; j >i; j--) {\n      if (arr[j] < arr[j-1]) {\n        var temp = arr[j-1];\n        arr[j-1] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n  return arr;\n}\n</code></pre>',
    description: "<table>\n<tbody>\n<td>时间复杂度</td>\n<td>最坏O(N^2),平均O(N^2),最好O(N)</td>\n</tr>\n<tr>\n<td>空间复杂度</td>\n<td>O(1)</td>\n</tr>\n<tr>\n<td>特点</td>\n<td>不稳定</td>\n</tr>\n</tbody>\n</table>",
    init: function(r) {
        return {
            min: 0,
            i: 0,
            j: r.length - 1,
            array: r
        };
    },
    lines: 12,
    run: function(a) {
        var e = a.variable.array.length;
        if (a.variable.i === e - 1) return a.success(), a.draw(a.variable.array, -1, -1, e), 
        a.point(11), void (a.timer && (a.setData({
            isPause: !0
        }), clearInterval(a.timer), a.timer = null));
        a.timer && a.data.isPause ? clearInterval(a.timer) : (a.variable.j <= a.variable.i ? (a.variable.i++, 
        a.variable.j = a.variable.array.length - 1, a.point(2)) : (a.variable.array[a.variable.j] < a.variable.array[a.variable.j - 1] ? (r(a.variable.array, a.variable.j, a.variable.j - 1), 
        a.point(5)) : a.point(3), a.variable.j--), a.draw(a.variable.array, a.variable.j, a.variable.j - 1, a.variable.i));
    }
}, {
    name: "选择排序",
    code: '<pre><code class="language-js">function selectionSort(arr) {\n  var minIndex;\n  for (var i = 0; i < arr.length - 1; i++) {\n    minIndex = i;\n    for (var j = i + 1; j < arr.length; j++) {\n      if (arr[j] < arr[minIndex]) {\n        minIndex = j;\n      }\n    }\n    let temp = arr[i];\n    arr[i] = arr[minIndex];\n    arr[minIndex] = temp;\n  }\n  return arr;\n}\n</code></pre>',
    description: "<table>\n<tbody>\n<tr>\n<td>时间复杂度</td>\n<td>最坏O(N^2),平均O(N^2),最好O(N^2)</td>\n</tr>\n<tr>\n<td>空间复杂度</td>\n<td>O(1)</td>\n</tr>\n<tr>\n<td>特点</td>\n<td>不稳定</td>\n</tr>\n</tbody>\n</table>",
    init: function(r) {
        return {
            min: 0,
            i: 0,
            j: 1,
            array: r
        };
    },
    lines: 15,
    run: function(a) {
        var e = a.variable.array.length;
        if (a.variable.i === e) return a.success(), a.draw(a.variable.array, -1, -1, e), 
        a.point(14), void (a.timer && (a.setData({
            isPause: !0
        }), clearInterval(a.timer), a.timer = null));
        a.timer && a.data.isPause ? clearInterval(a.timer) : (a.variable.j === a.variable.array.length ? (r(a.variable.array, a.variable.min, a.variable.i++), 
        a.variable.min = a.variable.i, a.variable.j = a.variable.i + 1, a.point(10)) : (a.variable.array[a.variable.j] <= a.variable.array[a.variable.min] ? (a.variable.min = a.variable.j, 
        a.point(7)) : a.point(5), a.variable.j++), a.draw(a.variable.array, a.variable.min, a.variable.j, a.variable.i));
    }
}, {
    name: "插入排序",
    code: '<pre><code class="language-js">function insertionSort(arr) {\n  var len = arr.length;\n  for (var i = 1; i < len; i++) {\n    var current = arr[i];\n    for (var j = i - 1; j >= 0 && arr[j] > current; j--) {\n      arr[j + 1] = arr[j];\n    }\n    arr[j + 1] = current;\n  }\n  return arr;\n}\n</code></pre>',
    description: "<table>\n<tbody>\n<tr>\n<td>时间复杂度</td>\n<td>最坏O(N^2),平均O(N^2),最好O(N^2)</td>\n</tr>\n<tr>\n<td>空间复杂度</td>\n<td>O(1)</td>\n</tr>\n<tr>\n<td>特点</td>\n<td>不稳定</td>\n</tr>\n</tbody>\n</table>",
    init: function(r) {
        return {
            i: 1,
            j: 0,
            current: r[1],
            array: r
        };
    },
    lines: 11,
    run: function(r) {
        var a = r.variable.array.length;
        if (r.variable.i === a) return r.success(), r.draw(r.variable.array, -1, -1, a), 
        r.point(10), void (r.timer && (r.setData({
            isPause: !0
        }), clearInterval(r.timer), r.timer = null));
        r.timer && r.data.isPause ? clearInterval(r.timer) : (r.variable.j < 0 || r.variable.array[r.variable.j] < r.variable.current ? (r.variable.array[r.variable.j + 1] = r.variable.current, 
        r.variable.j = ++r.variable.i - 1, r.variable.current = r.variable.array[r.variable.i], 
        r.point(8)) : (r.variable.array[r.variable.j + 1] = r.variable.array[r.variable.j], 
        r.variable.array[r.variable.j--] = r.variable.current, r.point(6)), r.draw(r.variable.array, r.variable.j + 1, r.variable.j, r.variable.j));
    }
}, {
    name: "希尔排序",
    code: '<pre><code class="language-js">function shellSort(arr) {\n  var len = arr.length;\n  for (var step = Math.floor(len / 2); step > 0; step = Math.floor(step / 2)) {\n    for (var i = step; i < len; i++) {\n      var current = arr[i];\n      for (var j = i - step; j >= 0 && arr[j] > current; j -= step) {\n        arr[j + step] = arr[j];\n      }\n      arr[j + step] = current;\n    }\n  }\n  return arr;\n}</code></pre>',
    description: "<table>\n<tbody>\n<tr>\n<td>时间复杂度</td>\n<td>最坏O(n^2),平均O(n^1.3),最好O(n)</td>\n</tr>\n<tr>\n<td>空间复杂度</td>\n<td>O(1)</td>\n</tr>\n<tr>\n<td>特点</td>\n<td>不稳定</td>\n</tr>\n</tbody>\n</table>",
    init: function(r) {
        return {
            i: r.length / 2,
            j: 0,
            step: r.length / 2,
            current: r[r.length / 2],
            array: r
        };
    },
    lines: 13,
    run: function(r) {
        var a = r.variable.array.length;
        if (r.variable.step <= 0) return r.success(), r.draw(r.variable.array, -1, -1, a), 
        r.point(12), void (r.timer && (r.setData({
            isPause: !0
        }), clearInterval(r.timer), r.timer = null));
        r.timer && r.data.isPause ? clearInterval(r.timer) : (r.variable.i >= a ? (r.variable.step = Math.floor(r.variable.step / 2), 
        r.variable.i = r.variable.step, r.variable.j = 0, r.variable.current = r.variable.array[r.variable.i], 
        r.point(3)) : r.variable.j < 0 || r.variable.array[r.variable.j] <= r.variable.current ? (r.variable.array[r.variable.j + r.variable.step] = r.variable.current, 
        r.variable.j = ++r.variable.i - r.variable.step, r.variable.current = r.variable.array[r.variable.i], 
        r.point(9)) : (r.variable.array[r.variable.j + r.variable.step] = r.variable.array[r.variable.j], 
        r.variable.array[r.variable.j] = r.variable.current, r.variable.j -= r.variable.step, 
        r.point(7)), r.draw(r.variable.array, r.variable.j + r.variable.step, r.variable.j, r.variable.j));
    }
} ];