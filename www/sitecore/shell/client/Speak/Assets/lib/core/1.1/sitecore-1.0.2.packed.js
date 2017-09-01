/*! jQuery v2.1.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function (a, b) { "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) { if (!a.document) throw new Error("jQuery requires a window with a document"); return b(a) } : b(a) }("undefined" != typeof window ? window : this, function (a, b) {
  var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = {}, l = a.document, m = "2.1.1", n = function (a, b) { return new n.fn.init(a, b) }, o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, p = /^-ms-/, q = /-([\da-z])/gi, r = function (a, b) { return b.toUpperCase() }; n.fn = n.prototype = { jquery: m, constructor: n, selector: "", length: 0, toArray: function () { return d.call(this) }, get: function (a) { return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this) }, pushStack: function (a) { var b = n.merge(this.constructor(), a); return b.prevObject = this, b.context = this.context, b }, each: function (a, b) { return n.each(this, a, b) }, map: function (a) { return this.pushStack(n.map(this, function (b, c) { return a.call(b, c, b) })) }, slice: function () { return this.pushStack(d.apply(this, arguments)) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, eq: function (a) { var b = this.length, c = +a + (0 > a ? b : 0); return this.pushStack(c >= 0 && b > c ? [this[c]] : []) }, end: function () { return this.prevObject || this.constructor(null) }, push: f, sort: c.sort, splice: c.splice }, n.extend = n.fn.extend = function () { var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1; for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--) ; i > h; h++) if (null != (a = arguments[h])) for (b in a) c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d)); return g }, n.extend({ expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) { throw new Error(a) }, noop: function () { }, isFunction: function (a) { return "function" === n.type(a) }, isArray: Array.isArray, isWindow: function (a) { return null != a && a === a.window }, isNumeric: function (a) { return !n.isArray(a) && a - parseFloat(a) >= 0 }, isPlainObject: function (a) { return "object" !== n.type(a) || a.nodeType || n.isWindow(a) ? !1 : a.constructor && !j.call(a.constructor.prototype, "isPrototypeOf") ? !1 : !0 }, isEmptyObject: function (a) { var b; for (b in a) return !1; return !0 }, type: function (a) { return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a }, globalEval: function (a) { var b, c = eval; a = n.trim(a), a && (1 === a.indexOf("use strict") ? (b = l.createElement("script"), b.text = a, l.head.appendChild(b).parentNode.removeChild(b)) : c(a)) }, camelCase: function (a) { return a.replace(p, "ms-").replace(q, r) }, nodeName: function (a, b) { return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase() }, each: function (a, b, c) { var d, e = 0, f = a.length, g = s(a); if (c) { if (g) { for (; f > e; e++) if (d = b.apply(a[e], c), d === !1) break } else for (e in a) if (d = b.apply(a[e], c), d === !1) break } else if (g) { for (; f > e; e++) if (d = b.call(a[e], e, a[e]), d === !1) break } else for (e in a) if (d = b.call(a[e], e, a[e]), d === !1) break; return a }, trim: function (a) { return null == a ? "" : (a + "").replace(o, "") }, makeArray: function (a, b) { var c = b || []; return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c }, inArray: function (a, b, c) { return null == b ? -1 : g.call(b, a, c) }, merge: function (a, b) { for (var c = +b.length, d = 0, e = a.length; c > d; d++) a[e++] = b[d]; return a.length = e, a }, grep: function (a, b, c) { for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]); return e }, map: function (a, b, c) { var d, f = 0, g = a.length, h = s(a), i = []; if (h) for (; g > f; f++) d = b(a[f], f, c), null != d && i.push(d); else for (f in a) d = b(a[f], f, c), null != d && i.push(d); return e.apply([], i) }, guid: 1, proxy: function (a, b) { var c, e, f; return "string" == typeof b && (c = a[b], b = a, a = c), n.isFunction(a) ? (e = d.call(arguments, 2), f = function () { return a.apply(b || this, e.concat(d.call(arguments))) }, f.guid = a.guid = a.guid || n.guid++, f) : void 0 }, now: Date.now, support: k }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) { h["[object " + b + "]"] = b.toLowerCase() }); function s(a) { var b = a.length, c = n.type(a); return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a } var t = function (a) { var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + -new Date, v = a.document, w = 0, x = 0, y = gb(), z = gb(), A = gb(), B = function (a, b) { return a === b && (l = !0), 0 }, C = "undefined", D = 1 << 31, E = {}.hasOwnProperty, F = [], G = F.pop, H = F.push, I = F.push, J = F.slice, K = F.indexOf || function (a) { for (var b = 0, c = this.length; c > b; b++) if (this[b] === a) return b; return -1 }, L = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", M = "[\\x20\\t\\r\\n\\f]", N = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", O = N.replace("w", "w#"), P = "\\[" + M + "*(" + N + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + M + "*\\]", Q = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + P + ")*)|.*)\\)|)", R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"), S = new RegExp("^" + M + "*," + M + "*"), T = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"), U = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]", "g"), V = new RegExp(Q), W = new RegExp("^" + O + "$"), X = { ID: new RegExp("^#(" + N + ")"), CLASS: new RegExp("^\\.(" + N + ")"), TAG: new RegExp("^(" + N.replace("w", "w*") + ")"), ATTR: new RegExp("^" + P), PSEUDO: new RegExp("^" + Q), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"), bool: new RegExp("^(?:" + L + ")$", "i"), needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i") }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"), db = function (a, b, c) { var d = "0x" + b - 65536; return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320) }; try { I.apply(F = J.call(v.childNodes), v.childNodes), F[v.childNodes.length].nodeType } catch (eb) { I = { apply: F.length ? function (a, b) { H.apply(a, J.call(b)) } : function (a, b) { var c = a.length, d = 0; while (a[c++] = b[d++]); a.length = c - 1 } } } function fb(a, b, d, e) { var f, h, j, k, l, o, r, s, w, x; if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], !a || "string" != typeof a) return d; if (1 !== (k = b.nodeType) && 9 !== k) return []; if (p && !e) { if (f = _.exec(a)) if (j = f[1]) { if (9 === k) { if (h = b.getElementById(j), !h || !h.parentNode) return d; if (h.id === j) return d.push(h), d } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) return d.push(h), d } else { if (f[2]) return I.apply(d, b.getElementsByTagName(a)), d; if ((j = f[3]) && c.getElementsByClassName && b.getElementsByClassName) return I.apply(d, b.getElementsByClassName(j)), d } if (c.qsa && (!q || !q.test(a))) { if (s = r = u, w = b, x = 9 === k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) { o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length; while (l--) o[l] = s + qb(o[l]); w = ab.test(a) && ob(b.parentNode) || b, x = o.join(",") } if (x) try { return I.apply(d, w.querySelectorAll(x)), d } catch (y) { } finally { r || b.removeAttribute("id") } } } return i(a.replace(R, "$1"), b, d, e) } function gb() { var a = []; function b(c, e) { return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e } return b } function hb(a) { return a[u] = !0, a } function ib(a) { var b = n.createElement("div"); try { return !!a(b) } catch (c) { return !1 } finally { b.parentNode && b.parentNode.removeChild(b), b = null } } function jb(a, b) { var c = a.split("|"), e = a.length; while (e--) d.attrHandle[c[e]] = b } function kb(a, b) { var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || D) - (~a.sourceIndex || D); if (d) return d; if (c) while (c = c.nextSibling) if (c === b) return -1; return a ? 1 : -1 } function lb(a) { return function (b) { var c = b.nodeName.toLowerCase(); return "input" === c && b.type === a } } function mb(a) { return function (b) { var c = b.nodeName.toLowerCase(); return ("input" === c || "button" === c) && b.type === a } } function nb(a) { return hb(function (b) { return b = +b, hb(function (c, d) { var e, f = a([], c.length, b), g = f.length; while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e])) }) }) } function ob(a) { return a && typeof a.getElementsByTagName !== C && a } c = fb.support = {}, f = fb.isXML = function (a) { var b = a && (a.ownerDocument || a).documentElement; return b ? "HTML" !== b.nodeName : !1 }, m = fb.setDocument = function (a) { var b, e = a ? a.ownerDocument || a : v, g = e.defaultView; return e !== n && 9 === e.nodeType && e.documentElement ? (n = e, o = e.documentElement, p = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function () { m() }, !1) : g.attachEvent && g.attachEvent("onunload", function () { m() })), c.attributes = ib(function (a) { return a.className = "i", !a.getAttribute("className") }), c.getElementsByTagName = ib(function (a) { return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length }), c.getElementsByClassName = $.test(e.getElementsByClassName) && ib(function (a) { return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length }), c.getById = ib(function (a) { return o.appendChild(a).id = u, !e.getElementsByName || !e.getElementsByName(u).length }), c.getById ? (d.find.ID = function (a, b) { if (typeof b.getElementById !== C && p) { var c = b.getElementById(a); return c && c.parentNode ? [c] : [] } }, d.filter.ID = function (a) { var b = a.replace(cb, db); return function (a) { return a.getAttribute("id") === b } }) : (delete d.find.ID, d.filter.ID = function (a) { var b = a.replace(cb, db); return function (a) { var c = typeof a.getAttributeNode !== C && a.getAttributeNode("id"); return c && c.value === b } }), d.find.TAG = c.getElementsByTagName ? function (a, b) { return typeof b.getElementsByTagName !== C ? b.getElementsByTagName(a) : void 0 } : function (a, b) { var c, d = [], e = 0, f = b.getElementsByTagName(a); if ("*" === a) { while (c = f[e++]) 1 === c.nodeType && d.push(c); return d } return f }, d.find.CLASS = c.getElementsByClassName && function (a, b) { return typeof b.getElementsByClassName !== C && p ? b.getElementsByClassName(a) : void 0 }, r = [], q = [], (c.qsa = $.test(e.querySelectorAll)) && (ib(function (a) { a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && q.push("[*^$]=" + M + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + M + "*(?:value|" + L + ")"), a.querySelectorAll(":checked").length || q.push(":checked") }), ib(function (a) { var b = e.createElement("input"); b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + M + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:") })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ib(function (a) { c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", Q) }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) { var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode; return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d))) } : function (a, b) { if (b) while (b = b.parentNode) if (b === a) return !0; return !1 }, B = b ? function (a, b) { if (a === b) return l = !0, 0; var d = !a.compareDocumentPosition - !b.compareDocumentPosition; return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === v && t(v, a) ? -1 : b === e || b.ownerDocument === v && t(v, b) ? 1 : k ? K.call(k, a) - K.call(k, b) : 0 : 4 & d ? -1 : 1) } : function (a, b) { if (a === b) return l = !0, 0; var c, d = 0, f = a.parentNode, g = b.parentNode, h = [a], i = [b]; if (!f || !g) return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : k ? K.call(k, a) - K.call(k, b) : 0; if (f === g) return kb(a, b); c = a; while (c = c.parentNode) h.unshift(c); c = b; while (c = c.parentNode) i.unshift(c); while (h[d] === i[d]) d++; return d ? kb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0 }, e) : n }, fb.matches = function (a, b) { return fb(a, null, null, b) }, fb.matchesSelector = function (a, b) { if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) try { var d = s.call(a, b); if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d } catch (e) { } return fb(b, n, null, [a]).length > 0 }, fb.contains = function (a, b) { return (a.ownerDocument || a) !== n && m(a), t(a, b) }, fb.attr = function (a, b) { (a.ownerDocument || a) !== n && m(a); var e = d.attrHandle[b.toLowerCase()], f = e && E.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0; return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null }, fb.error = function (a) { throw new Error("Syntax error, unrecognized expression: " + a) }, fb.uniqueSort = function (a) { var b, d = [], e = 0, f = 0; if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) { while (b = a[f++]) b === a[f] && (e = d.push(f)); while (e--) a.splice(d[e], 1) } return k = null, a }, e = fb.getText = function (a) { var b, c = "", d = 0, f = a.nodeType; if (f) { if (1 === f || 9 === f || 11 === f) { if ("string" == typeof a.textContent) return a.textContent; for (a = a.firstChild; a; a = a.nextSibling) c += e(a) } else if (3 === f || 4 === f) return a.nodeValue } else while (b = a[d++]) c += e(b); return c }, d = fb.selectors = { cacheLength: 50, createPseudo: hb, match: X, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function (a) { return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4) }, CHILD: function (a) { return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || fb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fb.error(a[0]), a }, PSEUDO: function (a) { var b, c = !a[6] && a[2]; return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3)) } }, filter: { TAG: function (a) { var b = a.replace(cb, db).toLowerCase(); return "*" === a ? function () { return !0 } : function (a) { return a.nodeName && a.nodeName.toLowerCase() === b } }, CLASS: function (a) { var b = y[a + " "]; return b || (b = new RegExp("(^|" + M + ")" + a + "(" + M + "|$)")) && y(a, function (a) { return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "") }) }, ATTR: function (a, b, c) { return function (d) { var e = fb.attr(d, a); return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0 } }, CHILD: function (a, b, c, d, e) { var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b; return 1 === d && 0 === e ? function (a) { return !!a.parentNode } : function (b, c, i) { var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h; if (q) { if (f) { while (p) { l = b; while (l = l[p]) if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1; o = p = "only" === a && !o && "nextSibling" } return !0 } if (o = [g ? q.firstChild : q.lastChild], g && s) { k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n]; while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) if (1 === l.nodeType && ++m && l === b) { k[a] = [w, n, m]; break } } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1]; else while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) break; return m -= e, m === d || m % d === 0 && m / d >= 0 } } }, PSEUDO: function (a, b) { var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fb.error("unsupported pseudo: " + a); return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? hb(function (a, c) { var d, f = e(a, b), g = f.length; while (g--) d = K.call(a, f[g]), a[d] = !(c[d] = f[g]) }) : function (a) { return e(a, 0, c) }) : e } }, pseudos: { not: hb(function (a) { var b = [], c = [], d = h(a.replace(R, "$1")); return d[u] ? hb(function (a, b, c, e) { var f, g = d(a, null, e, []), h = a.length; while (h--) (f = g[h]) && (a[h] = !(b[h] = f)) }) : function (a, e, f) { return b[0] = a, d(b, null, f, c), !c.pop() } }), has: hb(function (a) { return function (b) { return fb(a, b).length > 0 } }), contains: hb(function (a) { return function (b) { return (b.textContent || b.innerText || e(b)).indexOf(a) > -1 } }), lang: hb(function (a) { return W.test(a || "") || fb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(), function (b) { var c; do if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType); return !1 } }), target: function (b) { var c = a.location && a.location.hash; return c && c.slice(1) === b.id }, root: function (a) { return a === o }, focus: function (a) { return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex) }, enabled: function (a) { return a.disabled === !1 }, disabled: function (a) { return a.disabled === !0 }, checked: function (a) { var b = a.nodeName.toLowerCase(); return "input" === b && !!a.checked || "option" === b && !!a.selected }, selected: function (a) { return a.parentNode && a.parentNode.selectedIndex, a.selected === !0 }, empty: function (a) { for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1; return !0 }, parent: function (a) { return !d.pseudos.empty(a) }, header: function (a) { return Z.test(a.nodeName) }, input: function (a) { return Y.test(a.nodeName) }, button: function (a) { var b = a.nodeName.toLowerCase(); return "input" === b && "button" === a.type || "button" === b }, text: function (a) { var b; return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase()) }, first: nb(function () { return [0] }), last: nb(function (a, b) { return [b - 1] }), eq: nb(function (a, b, c) { return [0 > c ? c + b : c] }), even: nb(function (a, b) { for (var c = 0; b > c; c += 2) a.push(c); return a }), odd: nb(function (a, b) { for (var c = 1; b > c; c += 2) a.push(c); return a }), lt: nb(function (a, b, c) { for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d); return a }), gt: nb(function (a, b, c) { for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d); return a }) } }, d.pseudos.nth = d.pseudos.eq; for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) d.pseudos[b] = lb(b); for (b in { submit: !0, reset: !0 }) d.pseudos[b] = mb(b); function pb() { } pb.prototype = d.filters = d.pseudos, d.setFilters = new pb, g = fb.tokenize = function (a, b) { var c, e, f, g, h, i, j, k = z[a + " "]; if (k) return b ? 0 : k.slice(0); h = a, i = [], j = d.preFilter; while (h) { (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({ value: c, type: e[0].replace(R, " ") }), h = h.slice(c.length)); for (g in d.filter) !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({ value: c, type: g, matches: e }), h = h.slice(c.length)); if (!c) break } return b ? h.length : h ? fb.error(a) : z(a, i).slice(0) }; function qb(a) { for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value; return d } function rb(a, b, c) { var d = b.dir, e = c && "parentNode" === d, f = x++; return b.first ? function (b, c, f) { while (b = b[d]) if (1 === b.nodeType || e) return a(b, c, f) } : function (b, c, g) { var h, i, j = [w, f]; if (g) { while (b = b[d]) if ((1 === b.nodeType || e) && a(b, c, g)) return !0 } else while (b = b[d]) if (1 === b.nodeType || e) { if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) return j[2] = h[2]; if (i[d] = j, j[2] = a(b, c, g)) return !0 } } } function sb(a) { return a.length > 1 ? function (b, c, d) { var e = a.length; while (e--) if (!a[e](b, c, d)) return !1; return !0 } : a[0] } function tb(a, b, c) { for (var d = 0, e = b.length; e > d; d++) fb(a, b[d], c); return c } function ub(a, b, c, d, e) { for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h)); return g } function vb(a, b, c, d, e, f) { return d && !d[u] && (d = vb(d)), e && !e[u] && (e = vb(e, f)), hb(function (f, g, h, i) { var j, k, l, m = [], n = [], o = g.length, p = f || tb(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : ub(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q; if (c && c(q, r, h, i), d) { j = ub(r, n), d(j, [], h, i), k = j.length; while (k--) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l)) } if (f) { if (e || a) { if (e) { j = [], k = r.length; while (k--) (l = r[k]) && j.push(q[k] = l); e(null, r = [], j, i) } k = r.length; while (k--) (l = r[k]) && (j = e ? K.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l)) } } else r = ub(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : I.apply(g, r) }) } function wb(a) { for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = rb(function (a) { return a === b }, h, !0), l = rb(function (a) { return K.call(b, a) > -1 }, h, !0), m = [function (a, c, d) { return !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d)) }]; f > i; i++) if (c = d.relative[a[i].type]) m = [rb(sb(m), c)]; else { if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) { for (e = ++i; f > e; e++) if (d.relative[a[e].type]) break; return vb(i > 1 && sb(m), i > 1 && qb(a.slice(0, i - 1).concat({ value: " " === a[i - 2].type ? "*" : "" })).replace(R, "$1"), c, e > i && wb(a.slice(i, e)), f > e && wb(a = a.slice(e)), f > e && qb(a)) } m.push(c) } return sb(m) } function xb(a, b) { var c = b.length > 0, e = a.length > 0, f = function (f, g, h, i, k) { var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || .1, x = u.length; for (k && (j = g !== n && g) ; q !== x && null != (l = u[q]) ; q++) { if (e && l) { m = 0; while (o = a[m++]) if (o(l, g, h)) { i.push(l); break } k && (w = v) } c && ((l = !o && l) && p--, f && r.push(l)) } if (p += q, c && q !== p) { m = 0; while (o = b[m++]) o(r, s, g, h); if (f) { if (p > 0) while (q--) r[q] || s[q] || (s[q] = G.call(i)); s = ub(s) } I.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && fb.uniqueSort(i) } return k && (w = v, j = t), r }; return c ? hb(f) : f } return h = fb.compile = function (a, b) { var c, d = [], e = [], f = A[a + " "]; if (!f) { b || (b = g(a)), c = b.length; while (c--) f = wb(b[c]), f[u] ? d.push(f) : e.push(f); f = A(a, xb(e, d)), f.selector = a } return f }, i = fb.select = function (a, b, e, f) { var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a); if (e = e || [], 1 === o.length) { if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) { if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) return e; n && (b = b.parentNode), a = a.slice(j.shift().value.length) } i = X.needsContext.test(a) ? 0 : j.length; while (i--) { if (k = j[i], d.relative[l = k.type]) break; if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && ob(b.parentNode) || b))) { if (j.splice(i, 1), a = f.length && qb(j), !a) return I.apply(e, f), e; break } } } return (n || h(a, o))(f, b, !p, e, ab.test(a) && ob(b.parentNode) || b), e }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ib(function (a) { return 1 & a.compareDocumentPosition(n.createElement("div")) }), ib(function (a) { return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href") }) || jb("type|href|height|width", function (a, b, c) { return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2) }), c.attributes && ib(function (a) { return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value") }) || jb("value", function (a, b, c) { return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue }), ib(function (a) { return null == a.getAttribute("disabled") }) || jb(L, function (a, b, c) { var d; return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null }), fb }(a); n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains; var u = n.expr.match.needsContext, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^.[^:#\[\.,]*$/; function x(a, b, c) { if (n.isFunction(b)) return n.grep(a, function (a, d) { return !!b.call(a, d, a) !== c }); if (b.nodeType) return n.grep(a, function (a) { return a === b !== c }); if ("string" == typeof b) { if (w.test(b)) return n.filter(b, a, c); b = n.filter(b, a) } return n.grep(a, function (a) { return g.call(b, a) >= 0 !== c }) } n.filter = function (a, b, c) { var d = b[0]; return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) { return 1 === a.nodeType })) }, n.fn.extend({ find: function (a) { var b, c = this.length, d = [], e = this; if ("string" != typeof a) return this.pushStack(n(a).filter(function () { for (b = 0; c > b; b++) if (n.contains(e[b], this)) return !0 })); for (b = 0; c > b; b++) n.find(a, e[b], d); return d = this.pushStack(c > 1 ? n.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d }, filter: function (a) { return this.pushStack(x(this, a || [], !1)) }, not: function (a) { return this.pushStack(x(this, a || [], !0)) }, is: function (a) { return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length } }); var y, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = n.fn.init = function (a, b) { var c, d; if (!a) return this; if ("string" == typeof a) { if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a); if (c[1]) { if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : l, !0)), v.test(c[1]) && n.isPlainObject(b)) for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]); return this } return d = l.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = l, this.selector = a, this } return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this)) }; A.prototype = n.fn, y = n(l); var B = /^(?:parents|prev(?:Until|All))/, C = { children: !0, contents: !0, next: !0, prev: !0 }; n.extend({ dir: function (a, b, c) { var d = [], e = void 0 !== c; while ((a = a[b]) && 9 !== a.nodeType) if (1 === a.nodeType) { if (e && n(a).is(c)) break; d.push(a) } return d }, sibling: function (a, b) { for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a); return c } }), n.fn.extend({ has: function (a) { var b = n(a, this), c = b.length; return this.filter(function () { for (var a = 0; c > a; a++) if (n.contains(this, b[a])) return !0 }) }, closest: function (a, b) { for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++) for (c = this[d]; c && c !== b; c = c.parentNode) if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) { f.push(c); break } return this.pushStack(f.length > 1 ? n.unique(f) : f) }, index: function (a) { return a ? "string" == typeof a ? g.call(n(a), this[0]) : g.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1 }, add: function (a, b) { return this.pushStack(n.unique(n.merge(this.get(), n(a, b)))) }, addBack: function (a) { return this.add(null == a ? this.prevObject : this.prevObject.filter(a)) } }); function D(a, b) { while ((a = a[b]) && 1 !== a.nodeType); return a } n.each({ parent: function (a) { var b = a.parentNode; return b && 11 !== b.nodeType ? b : null }, parents: function (a) { return n.dir(a, "parentNode") }, parentsUntil: function (a, b, c) { return n.dir(a, "parentNode", c) }, next: function (a) { return D(a, "nextSibling") }, prev: function (a) { return D(a, "previousSibling") }, nextAll: function (a) { return n.dir(a, "nextSibling") }, prevAll: function (a) { return n.dir(a, "previousSibling") }, nextUntil: function (a, b, c) { return n.dir(a, "nextSibling", c) }, prevUntil: function (a, b, c) { return n.dir(a, "previousSibling", c) }, siblings: function (a) { return n.sibling((a.parentNode || {}).firstChild, a) }, children: function (a) { return n.sibling(a.firstChild) }, contents: function (a) { return a.contentDocument || n.merge([], a.childNodes) } }, function (a, b) { n.fn[a] = function (c, d) { var e = n.map(this, b, c); return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (C[a] || n.unique(e), B.test(a) && e.reverse()), this.pushStack(e) } }); var E = /\S+/g, F = {}; function G(a) { var b = F[a] = {}; return n.each(a.match(E) || [], function (a, c) { b[c] = !0 }), b } n.Callbacks = function (a) { a = "string" == typeof a ? F[a] || G(a) : n.extend({}, a); var b, c, d, e, f, g, h = [], i = !a.once && [], j = function (l) { for (b = a.memory && l, c = !0, g = e || 0, e = 0, f = h.length, d = !0; h && f > g; g++) if (h[g].apply(l[0], l[1]) === !1 && a.stopOnFalse) { b = !1; break } d = !1, h && (i ? i.length && j(i.shift()) : b ? h = [] : k.disable()) }, k = { add: function () { if (h) { var c = h.length; !function g(b) { n.each(b, function (b, c) { var d = n.type(c); "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && g(c) }) }(arguments), d ? f = h.length : b && (e = c, j(b)) } return this }, remove: function () { return h && n.each(arguments, function (a, b) { var c; while ((c = n.inArray(b, h, c)) > -1) h.splice(c, 1), d && (f >= c && f--, g >= c && g--) }), this }, has: function (a) { return a ? n.inArray(a, h) > -1 : !(!h || !h.length) }, empty: function () { return h = [], f = 0, this }, disable: function () { return h = i = b = void 0, this }, disabled: function () { return !h }, lock: function () { return i = void 0, b || k.disable(), this }, locked: function () { return !i }, fireWith: function (a, b) { return !h || c && !i || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? i.push(b) : j(b)), this }, fire: function () { return k.fireWith(this, arguments), this }, fired: function () { return !!c } }; return k }, n.extend({ Deferred: function (a) { var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]], c = "pending", d = { state: function () { return c }, always: function () { return e.done(arguments).fail(arguments), this }, then: function () { var a = arguments; return n.Deferred(function (c) { n.each(b, function (b, f) { var g = n.isFunction(a[b]) && a[b]; e[f[1]](function () { var a = g && g.apply(this, arguments); a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments) }) }), a = null }).promise() }, promise: function (a) { return null != a ? n.extend(a, d) : d } }, e = {}; return d.pipe = d.then, n.each(b, function (a, f) { var g = f[2], h = f[3]; d[f[1]] = g.add, h && g.add(function () { c = h }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () { return e[f[0] + "With"](this === e ? d : this, arguments), this }, e[f[0] + "With"] = g.fireWith }), d.promise(e), a && a.call(e, e), e }, when: function (a) { var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && n.isFunction(a.promise) ? e : 0, g = 1 === f ? a : n.Deferred(), h = function (a, b, c) { return function (e) { b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c) } }, i, j, k; if (e > 1) for (i = new Array(e), j = new Array(e), k = new Array(e) ; e > b; b++) c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f; return f || g.resolveWith(k, c), g.promise() } }); var H; n.fn.ready = function (a) { return n.ready.promise().done(a), this }, n.extend({ isReady: !1, readyWait: 1, holdReady: function (a) { a ? n.readyWait++ : n.ready(!0) }, ready: function (a) { (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, a !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready")))) } }); function I() { l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready() } n.ready.promise = function (b) { return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(b) }, n.ready.promise(); var J = n.access = function (a, b, c, d, e, f, g) { var h = 0, i = a.length, j = null == c; if ("object" === n.type(c)) { e = !0; for (h in c) n.access(a, b, h, c[h], !0, f, g) } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) { return j.call(n(a), c) })), b)) for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c))); return e ? a : j ? b.call(a) : i ? b(a[0], c) : f }; n.acceptData = function (a) { return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType }; function K() { Object.defineProperty(this.cache = {}, 0, { get: function () { return {} } }), this.expando = n.expando + Math.random() } K.uid = 1, K.accepts = n.acceptData, K.prototype = { key: function (a) { if (!K.accepts(a)) return 0; var b = {}, c = a[this.expando]; if (!c) { c = K.uid++; try { b[this.expando] = { value: c }, Object.defineProperties(a, b) } catch (d) { b[this.expando] = c, n.extend(a, b) } } return this.cache[c] || (this.cache[c] = {}), c }, set: function (a, b, c) { var d, e = this.key(a), f = this.cache[e]; if ("string" == typeof b) f[b] = c; else if (n.isEmptyObject(f)) n.extend(this.cache[e], b); else for (d in b) f[d] = b[d]; return f }, get: function (a, b) { var c = this.cache[this.key(a)]; return void 0 === b ? c : c[b] }, access: function (a, b, c) { var d; return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, n.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b) }, remove: function (a, b) { var c, d, e, f = this.key(a), g = this.cache[f]; if (void 0 === b) this.cache[f] = {}; else { n.isArray(b) ? d = b.concat(b.map(n.camelCase)) : (e = n.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(E) || [])), c = d.length; while (c--) delete g[d[c]] } }, hasData: function (a) { return !n.isEmptyObject(this.cache[a[this.expando]] || {}) }, discard: function (a) { a[this.expando] && delete this.cache[a[this.expando]] } }; var L = new K, M = new K, N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, O = /([A-Z])/g; function P(a, b, c) { var d; if (void 0 === c && 1 === a.nodeType) if (d = "data-" + b.replace(O, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) { try { c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c } catch (e) { } M.set(a, b, c) } else c = void 0; return c } n.extend({
    hasData: function (a) { return M.hasData(a) || L.hasData(a) }, data: function (a, b, c) { return M.access(a, b, c) }, removeData: function (a, b) {
      M.remove(a, b)
    }, _data: function (a, b, c) { return L.access(a, b, c) }, _removeData: function (a, b) { L.remove(a, b) }
  }), n.fn.extend({ data: function (a, b) { var c, d, e, f = this[0], g = f && f.attributes; if (void 0 === a) { if (this.length && (e = M.get(f), 1 === f.nodeType && !L.get(f, "hasDataAttrs"))) { c = g.length; while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d]))); L.set(f, "hasDataAttrs", !0) } return e } return "object" == typeof a ? this.each(function () { M.set(this, a) }) : J(this, function (b) { var c, d = n.camelCase(a); if (f && void 0 === b) { if (c = M.get(f, a), void 0 !== c) return c; if (c = M.get(f, d), void 0 !== c) return c; if (c = P(f, d, void 0), void 0 !== c) return c } else this.each(function () { var c = M.get(this, d); M.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && M.set(this, a, b) }) }, null, b, arguments.length > 1, null, !0) }, removeData: function (a) { return this.each(function () { M.remove(this, a) }) } }), n.extend({ queue: function (a, b, c) { var d; return a ? (b = (b || "fx") + "queue", d = L.get(a, b), c && (!d || n.isArray(c) ? d = L.access(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0 }, dequeue: function (a, b) { b = b || "fx"; var c = n.queue(a, b), d = c.length, e = c.shift(), f = n._queueHooks(a, b), g = function () { n.dequeue(a, b) }; "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire() }, _queueHooks: function (a, b) { var c = b + "queueHooks"; return L.get(a, c) || L.access(a, c, { empty: n.Callbacks("once memory").add(function () { L.remove(a, [b + "queue", c]) }) }) } }), n.fn.extend({ queue: function (a, b) { var c = 2; return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () { var c = n.queue(this, a, b); n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a) }) }, dequeue: function (a) { return this.each(function () { n.dequeue(this, a) }) }, clearQueue: function (a) { return this.queue(a || "fx", []) }, promise: function (a, b) { var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function () { --d || e.resolveWith(f, [f]) }; "string" != typeof a && (b = a, a = void 0), a = a || "fx"; while (g--) c = L.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h)); return h(), e.promise(b) } }); var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, R = ["Top", "Right", "Bottom", "Left"], S = function (a, b) { return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a) }, T = /^(?:checkbox|radio)$/i; !function () { var a = l.createDocumentFragment(), b = a.appendChild(l.createElement("div")), c = l.createElement("input"); c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue }(); var U = "undefined"; k.focusinBubbles = "onfocusin" in a; var V = /^key/, W = /^(?:mouse|pointer|contextmenu)|click/, X = /^(?:focusinfocus|focusoutblur)$/, Y = /^([^.]*)(?:\.(.+)|)$/; function Z() { return !0 } function $() { return !1 } function _() { try { return l.activeElement } catch (a) { } } n.event = { global: {}, add: function (a, b, c, d, e) { var f, g, h, i, j, k, l, m, o, p, q, r = L.get(a); if (r) { c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = n.guid++), (i = r.events) || (i = r.events = {}), (g = r.handle) || (g = r.handle = function (b) { return typeof n !== U && n.event.triggered !== b.type ? n.event.dispatch.apply(a, arguments) : void 0 }), b = (b || "").match(E) || [""], j = b.length; while (j--) h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o && (l = n.event.special[o] || {}, o = (e ? l.delegateType : l.bindType) || o, l = n.event.special[o] || {}, k = n.extend({ type: o, origType: q, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && n.expr.match.needsContext.test(e), namespace: p.join(".") }, f), (m = i[o]) || (m = i[o] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, p, g) !== !1 || a.addEventListener && a.addEventListener(o, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), n.event.global[o] = !0) } }, remove: function (a, b, c, d, e) { var f, g, h, i, j, k, l, m, o, p, q, r = L.hasData(a) && L.get(a); if (r && (i = r.events)) { b = (b || "").match(E) || [""], j = b.length; while (j--) if (h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) { l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = i[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length; while (f--) k = m[f], !e && q !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k)); g && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete i[o]) } else for (o in i) n.event.remove(a, o + b[j], c, d, !0); n.isEmptyObject(i) && (delete r.handle, L.remove(a, "events")) } }, trigger: function (b, c, d, e) { var f, g, h, i, k, m, o, p = [d || l], q = j.call(b, "type") ? b.type : b, r = j.call(b, "namespace") ? b.namespace.split(".") : []; if (g = h = d = d || l, 3 !== d.nodeType && 8 !== d.nodeType && !X.test(q + n.event.triggered) && (q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), k = q.indexOf(":") < 0 && "on" + q, b = b[n.expando] ? b : new n.Event(q, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = r.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), o = n.event.special[q] || {}, e || !o.trigger || o.trigger.apply(d, c) !== !1)) { if (!e && !o.noBubble && !n.isWindow(d)) { for (i = o.delegateType || q, X.test(i + q) || (g = g.parentNode) ; g; g = g.parentNode) p.push(g), h = g; h === (d.ownerDocument || l) && p.push(h.defaultView || h.parentWindow || a) } f = 0; while ((g = p[f++]) && !b.isPropagationStopped()) b.type = f > 1 ? i : o.bindType || q, m = (L.get(g, "events") || {})[b.type] && L.get(g, "handle"), m && m.apply(g, c), m = k && g[k], m && m.apply && n.acceptData(g) && (b.result = m.apply(g, c), b.result === !1 && b.preventDefault()); return b.type = q, e || b.isDefaultPrevented() || o._default && o._default.apply(p.pop(), c) !== !1 || !n.acceptData(d) || k && n.isFunction(d[q]) && !n.isWindow(d) && (h = d[k], h && (d[k] = null), n.event.triggered = q, d[q](), n.event.triggered = void 0, h && (d[k] = h)), b.result } }, dispatch: function (a) { a = n.event.fix(a); var b, c, e, f, g, h = [], i = d.call(arguments), j = (L.get(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {}; if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) { h = n.event.handlers.call(this, a, j), b = 0; while ((f = h[b++]) && !a.isPropagationStopped()) { a.currentTarget = f.elem, c = 0; while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped()) (!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation())) } return k.postDispatch && k.postDispatch.call(this, a), a.result } }, handlers: function (a, b) { var c, d, e, f, g = [], h = b.delegateCount, i = a.target; if (h && i.nodeType && (!a.button || "click" !== a.type)) for (; i !== this; i = i.parentNode || this) if (i.disabled !== !0 || "click" !== a.type) { for (d = [], c = 0; h > c; c++) f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) >= 0 : n.find(e, this, null, [i]).length), d[e] && d.push(f); d.length && g.push({ elem: i, handlers: d }) } return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (a, b) { return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a } }, mouseHooks: { props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, b) { var c, d, e, f = b.button; return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || l, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a } }, fix: function (a) { if (a[n.expando]) return a; var b, c, d, e = a.type, f = a, g = this.fixHooks[e]; g || (this.fixHooks[e] = g = W.test(e) ? this.mouseHooks : V.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length; while (b--) c = d[b], a[c] = f[c]; return a.target || (a.target = l), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a }, special: { load: { noBubble: !0 }, focus: { trigger: function () { return this !== _() && this.focus ? (this.focus(), !1) : void 0 }, delegateType: "focusin" }, blur: { trigger: function () { return this === _() && this.blur ? (this.blur(), !1) : void 0 }, delegateType: "focusout" }, click: { trigger: function () { return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0 }, _default: function (a) { return n.nodeName(a.target, "a") } }, beforeunload: { postDispatch: function (a) { void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result) } } }, simulate: function (a, b, c, d) { var e = n.extend(new n.Event, c, { type: a, isSimulated: !0, originalEvent: {} }); d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault() } }, n.removeEvent = function (a, b, c) { a.removeEventListener && a.removeEventListener(b, c, !1) }, n.Event = function (a, b) { return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? Z : $) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void (this[n.expando] = !0)) : new n.Event(a, b) }, n.Event.prototype = { isDefaultPrevented: $, isPropagationStopped: $, isImmediatePropagationStopped: $, preventDefault: function () { var a = this.originalEvent; this.isDefaultPrevented = Z, a && a.preventDefault && a.preventDefault() }, stopPropagation: function () { var a = this.originalEvent; this.isPropagationStopped = Z, a && a.stopPropagation && a.stopPropagation() }, stopImmediatePropagation: function () { var a = this.originalEvent; this.isImmediatePropagationStopped = Z, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation() } }, n.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function (a, b) { n.event.special[a] = { delegateType: b, bindType: b, handle: function (a) { var c, d = this, e = a.relatedTarget, f = a.handleObj; return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c } } }), k.focusinBubbles || n.each({ focus: "focusin", blur: "focusout" }, function (a, b) { var c = function (a) { n.event.simulate(b, a.target, n.event.fix(a), !0) }; n.event.special[b] = { setup: function () { var d = this.ownerDocument || this, e = L.access(d, b); e || d.addEventListener(a, c, !0), L.access(d, b, (e || 0) + 1) }, teardown: function () { var d = this.ownerDocument || this, e = L.access(d, b) - 1; e ? L.access(d, b, e) : (d.removeEventListener(a, c, !0), L.remove(d, b)) } } }), n.fn.extend({ on: function (a, b, c, d, e) { var f, g; if ("object" == typeof a) { "string" != typeof b && (c = c || b, b = void 0); for (g in a) this.on(g, b, c, a[g], e); return this } if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = $; else if (!d) return this; return 1 === e && (f = d, d = function (a) { return n().off(a), f.apply(this, arguments) }, d.guid = f.guid || (f.guid = n.guid++)), this.each(function () { n.event.add(this, a, d, c, b) }) }, one: function (a, b, c, d) { return this.on(a, b, c, d, 1) }, off: function (a, b, c) { var d, e; if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this; if ("object" == typeof a) { for (e in a) this.off(e, b, a[e]); return this } return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = $), this.each(function () { n.event.remove(this, a, c, b) }) }, trigger: function (a, b) { return this.each(function () { n.event.trigger(a, b, this) }) }, triggerHandler: function (a, b) { var c = this[0]; return c ? n.event.trigger(a, b, c, !0) : void 0 } }); var ab = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bb = /<([\w:]+)/, cb = /<|&#?\w+;/, db = /<(?:script|style|link)/i, eb = /checked\s*(?:[^=]|=\s*.checked.)/i, fb = /^$|\/(?:java|ecma)script/i, gb = /^true\/(.*)/, hb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, ib = { option: [1, "<select multiple='multiple'>", "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] }; ib.optgroup = ib.option, ib.tbody = ib.tfoot = ib.colgroup = ib.caption = ib.thead, ib.th = ib.td; function jb(a, b) { return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a } function kb(a) { return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a } function lb(a) { var b = gb.exec(a.type); return b ? a.type = b[1] : a.removeAttribute("type"), a } function mb(a, b) { for (var c = 0, d = a.length; d > c; c++) L.set(a[c], "globalEval", !b || L.get(b[c], "globalEval")) } function nb(a, b) { var c, d, e, f, g, h, i, j; if (1 === b.nodeType) { if (L.hasData(a) && (f = L.access(a), g = L.set(b, f), j = f.events)) { delete g.handle, g.events = {}; for (e in j) for (c = 0, d = j[e].length; d > c; c++) n.event.add(b, e, j[e][c]) } M.hasData(a) && (h = M.access(a), i = n.extend({}, h), M.set(b, i)) } } function ob(a, b) { var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : []; return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], c) : c } function pb(a, b) { var c = b.nodeName.toLowerCase(); "input" === c && T.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue) } n.extend({ clone: function (a, b, c) { var d, e, f, g, h = a.cloneNode(!0), i = n.contains(a.ownerDocument, a); if (!(k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a))) for (g = ob(h), f = ob(a), d = 0, e = f.length; e > d; d++) pb(f[d], g[d]); if (b) if (c) for (f = f || ob(a), g = g || ob(h), d = 0, e = f.length; e > d; d++) nb(f[d], g[d]); else nb(a, h); return g = ob(h, "script"), g.length > 0 && mb(g, !i && ob(a, "script")), h }, buildFragment: function (a, b, c, d) { for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, o = a.length; o > m; m++) if (e = a[m], e || 0 === e) if ("object" === n.type(e)) n.merge(l, e.nodeType ? [e] : e); else if (cb.test(e)) { f = f || k.appendChild(b.createElement("div")), g = (bb.exec(e) || ["", ""])[1].toLowerCase(), h = ib[g] || ib._default, f.innerHTML = h[1] + e.replace(ab, "<$1></$2>") + h[2], j = h[0]; while (j--) f = f.lastChild; n.merge(l, f.childNodes), f = k.firstChild, f.textContent = "" } else l.push(b.createTextNode(e)); k.textContent = "", m = 0; while (e = l[m++]) if ((!d || -1 === n.inArray(e, d)) && (i = n.contains(e.ownerDocument, e), f = ob(k.appendChild(e), "script"), i && mb(f), c)) { j = 0; while (e = f[j++]) fb.test(e.type || "") && c.push(e) } return k }, cleanData: function (a) { for (var b, c, d, e, f = n.event.special, g = 0; void 0 !== (c = a[g]) ; g++) { if (n.acceptData(c) && (e = c[L.expando], e && (b = L.cache[e]))) { if (b.events) for (d in b.events) f[d] ? n.event.remove(c, d) : n.removeEvent(c, d, b.handle); L.cache[e] && delete L.cache[e] } delete M.cache[c[M.expando]] } } }), n.fn.extend({ text: function (a) { return J(this, function (a) { return void 0 === a ? n.text(this) : this.empty().each(function () { (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a) }) }, null, a, arguments.length) }, append: function () { return this.domManip(arguments, function (a) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var b = jb(this, a); b.appendChild(a) } }) }, prepend: function () { return this.domManip(arguments, function (a) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var b = jb(this, a); b.insertBefore(a, b.firstChild) } }) }, before: function () { return this.domManip(arguments, function (a) { this.parentNode && this.parentNode.insertBefore(a, this) }) }, after: function () { return this.domManip(arguments, function (a) { this.parentNode && this.parentNode.insertBefore(a, this.nextSibling) }) }, remove: function (a, b) { for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]) ; e++) b || 1 !== c.nodeType || n.cleanData(ob(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && mb(ob(c, "script")), c.parentNode.removeChild(c)); return this }, empty: function () { for (var a, b = 0; null != (a = this[b]) ; b++) 1 === a.nodeType && (n.cleanData(ob(a, !1)), a.textContent = ""); return this }, clone: function (a, b) { return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () { return n.clone(this, a, b) }) }, html: function (a) { return J(this, function (a) { var b = this[0] || {}, c = 0, d = this.length; if (void 0 === a && 1 === b.nodeType) return b.innerHTML; if ("string" == typeof a && !db.test(a) && !ib[(bb.exec(a) || ["", ""])[1].toLowerCase()]) { a = a.replace(ab, "<$1></$2>"); try { for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (n.cleanData(ob(b, !1)), b.innerHTML = a); b = 0 } catch (e) { } } b && this.empty().append(a) }, null, a, arguments.length) }, replaceWith: function () { var a = arguments[0]; return this.domManip(arguments, function (b) { a = this.parentNode, n.cleanData(ob(this)), a && a.replaceChild(b, this) }), a && (a.length || a.nodeType) ? this : this.remove() }, detach: function (a) { return this.remove(a, !0) }, domManip: function (a, b) { a = e.apply([], a); var c, d, f, g, h, i, j = 0, l = this.length, m = this, o = l - 1, p = a[0], q = n.isFunction(p); if (q || l > 1 && "string" == typeof p && !k.checkClone && eb.test(p)) return this.each(function (c) { var d = m.eq(c); q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b) }); if (l && (c = n.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) { for (f = n.map(ob(c, "script"), kb), g = f.length; l > j; j++) h = c, j !== o && (h = n.clone(h, !0, !0), g && n.merge(f, ob(h, "script"))), b.call(this[j], h, j); if (g) for (i = f[f.length - 1].ownerDocument, n.map(f, lb), j = 0; g > j; j++) h = f[j], fb.test(h.type || "") && !L.access(h, "globalEval") && n.contains(i, h) && (h.src ? n._evalUrl && n._evalUrl(h.src) : n.globalEval(h.textContent.replace(hb, ""))) } return this } }), n.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) { n.fn[a] = function (a) { for (var c, d = [], e = n(a), g = e.length - 1, h = 0; g >= h; h++) c = h === g ? this : this.clone(!0), n(e[h])[b](c), f.apply(d, c.get()); return this.pushStack(d) } }); var qb, rb = {}; function sb(b, c) { var d, e = n(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : n.css(e[0], "display"); return e.detach(), f } function tb(a) { var b = l, c = rb[a]; return c || (c = sb(a, b), "none" !== c && c || (qb = (qb || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = qb[0].contentDocument, b.write(), b.close(), c = sb(a, b), qb.detach()), rb[a] = c), c } var ub = /^margin/, vb = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), wb = function (a) { return a.ownerDocument.defaultView.getComputedStyle(a, null) }; function xb(a, b, c) { var d, e, f, g, h = a.style; return c = c || wb(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), vb.test(g) && ub.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g } function yb(a, b) { return { get: function () { return a() ? void delete this.get : (this.get = b).apply(this, arguments) } } } !function () { var b, c, d = l.documentElement, e = l.createElement("div"), f = l.createElement("div"); if (f.style) { f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === f.style.backgroundClip, e.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", e.appendChild(f); function g() { f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f.innerHTML = "", d.appendChild(e); var g = a.getComputedStyle(f, null); b = "1%" !== g.top, c = "4px" === g.width, d.removeChild(e) } a.getComputedStyle && n.extend(k, { pixelPosition: function () { return g(), b }, boxSizingReliable: function () { return null == c && g(), c }, reliableMarginRight: function () { var b, c = f.appendChild(l.createElement("div")); return c.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", c.style.marginRight = c.style.width = "0", f.style.width = "1px", d.appendChild(e), b = !parseFloat(a.getComputedStyle(c, null).marginRight), d.removeChild(e), b } }) } }(), n.swap = function (a, b, c, d) { var e, f, g = {}; for (f in b) g[f] = a.style[f], a.style[f] = b[f]; e = c.apply(a, d || []); for (f in b) a.style[f] = g[f]; return e }; var zb = /^(none|table(?!-c[ea]).+)/, Ab = new RegExp("^(" + Q + ")(.*)$", "i"), Bb = new RegExp("^([+-])=(" + Q + ")", "i"), Cb = { position: "absolute", visibility: "hidden", display: "block" }, Db = { letterSpacing: "0", fontWeight: "400" }, Eb = ["Webkit", "O", "Moz", "ms"]; function Fb(a, b) { if (b in a) return b; var c = b[0].toUpperCase() + b.slice(1), d = b, e = Eb.length; while (e--) if (b = Eb[e] + c, b in a) return b; return d } function Gb(a, b, c) { var d = Ab.exec(b); return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b } function Hb(a, b, c, d, e) { for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += n.css(a, c + R[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + R[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + R[f] + "Width", !0, e))) : (g += n.css(a, "padding" + R[f], !0, e), "padding" !== c && (g += n.css(a, "border" + R[f] + "Width", !0, e))); return g } function Ib(a, b, c) { var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = wb(a), g = "border-box" === n.css(a, "boxSizing", !1, f); if (0 >= e || null == e) { if (e = xb(a, b, f), (0 > e || null == e) && (e = a.style[b]), vb.test(e)) return e; d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0 } return e + Hb(a, b, c || (g ? "border" : "content"), d, f) + "px" } function Jb(a, b) { for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = L.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && S(d) && (f[g] = L.access(d, "olddisplay", tb(d.nodeName)))) : (e = S(d), "none" === c && e || L.set(d, "olddisplay", e ? c : n.css(d, "display")))); for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none")); return a } n.extend({ cssHooks: { opacity: { get: function (a, b) { if (b) { var c = xb(a, "opacity"); return "" === c ? "1" : c } } } }, cssNumber: { columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": "cssFloat" }, style: function (a, b, c, d) { if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) { var e, f, g, h = n.camelCase(b), i = a.style; return b = n.cssProps[h] || (n.cssProps[h] = Fb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c, "string" === f && (e = Bb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0) } }, css: function (a, b, c, d) { var e, f, g, h = n.camelCase(b); return b = n.cssProps[h] || (n.cssProps[h] = Fb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = xb(a, b, d)), "normal" === e && b in Db && (e = Db[b]), "" === c || c ? (f = parseFloat(e), c === !0 || n.isNumeric(f) ? f || 0 : e) : e } }), n.each(["height", "width"], function (a, b) { n.cssHooks[b] = { get: function (a, c, d) { return c ? zb.test(n.css(a, "display")) && 0 === a.offsetWidth ? n.swap(a, Cb, function () { return Ib(a, b, d) }) : Ib(a, b, d) : void 0 }, set: function (a, c, d) { var e = d && wb(a); return Gb(a, c, d ? Hb(a, b, d, "border-box" === n.css(a, "boxSizing", !1, e), e) : 0) } } }), n.cssHooks.marginRight = yb(k.reliableMarginRight, function (a, b) { return b ? n.swap(a, { display: "inline-block" }, xb, [a, "marginRight"]) : void 0 }), n.each({ margin: "", padding: "", border: "Width" }, function (a, b) { n.cssHooks[a + b] = { expand: function (c) { for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + R[d] + b] = f[d] || f[d - 2] || f[0]; return e } }, ub.test(a) || (n.cssHooks[a + b].set = Gb) }), n.fn.extend({ css: function (a, b) { return J(this, function (a, b, c) { var d, e, f = {}, g = 0; if (n.isArray(b)) { for (d = wb(a), e = b.length; e > g; g++) f[b[g]] = n.css(a, b[g], !1, d); return f } return void 0 !== c ? n.style(a, b, c) : n.css(a, b) }, a, b, arguments.length > 1) }, show: function () { return Jb(this, !0) }, hide: function () { return Jb(this) }, toggle: function (a) { return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () { S(this) ? n(this).show() : n(this).hide() }) } }); function Kb(a, b, c, d, e) { return new Kb.prototype.init(a, b, c, d, e) } n.Tween = Kb, Kb.prototype = { constructor: Kb, init: function (a, b, c, d, e, f) { this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px") }, cur: function () { var a = Kb.propHooks[this.prop]; return a && a.get ? a.get(this) : Kb.propHooks._default.get(this) }, run: function (a) { var b, c = Kb.propHooks[this.prop]; return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Kb.propHooks._default.set(this), this } }, Kb.prototype.init.prototype = Kb.prototype, Kb.propHooks = { _default: { get: function (a) { var b; return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop] }, set: function (a) { n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now } } }, Kb.propHooks.scrollTop = Kb.propHooks.scrollLeft = { set: function (a) { a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now) } }, n.easing = { linear: function (a) { return a }, swing: function (a) { return .5 - Math.cos(a * Math.PI) / 2 } }, n.fx = Kb.prototype.init, n.fx.step = {}; var Lb, Mb, Nb = /^(?:toggle|show|hide)$/, Ob = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"), Pb = /queueHooks$/, Qb = [Vb], Rb = { "*": [function (a, b) { var c = this.createTween(a, b), d = c.cur(), e = Ob.exec(b), f = e && e[3] || (n.cssNumber[a] ? "" : "px"), g = (n.cssNumber[a] || "px" !== f && +d) && Ob.exec(n.css(c.elem, a)), h = 1, i = 20; if (g && g[3] !== f) { f = f || g[3], e = e || [], g = +d || 1; do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i) } return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c }] }; function Sb() { return setTimeout(function () { Lb = void 0 }), Lb = n.now() } function Tb(a, b) { var c, d = 0, e = { height: a }; for (b = b ? 1 : 0; 4 > d; d += 2 - b) c = R[d], e["margin" + c] = e["padding" + c] = a; return b && (e.opacity = e.width = a), e } function Ub(a, b, c) { for (var d, e = (Rb[b] || []).concat(Rb["*"]), f = 0, g = e.length; g > f; f++) if (d = e[f].call(c, b, a)) return d } function Vb(a, b, c) { var d, e, f, g, h, i, j, k, l = this, m = {}, o = a.style, p = a.nodeType && S(a), q = L.get(a, "fxshow"); c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () { h.unqueued || i() }), h.unqueued++, l.always(function () { l.always(function () { h.unqueued--, n.queue(a, "fx").length || h.empty.fire() }) })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = n.css(a, "display"), k = "none" === j ? L.get(a, "olddisplay") || tb(a.nodeName) : j, "inline" === k && "none" === n.css(a, "float") && (o.display = "inline-block")), c.overflow && (o.overflow = "hidden", l.always(function () { o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2] })); for (d in b) if (e = b[d], Nb.exec(e)) { if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) { if ("show" !== e || !q || void 0 === q[d]) continue; p = !0 } m[d] = q && q[d] || n.style(a, d) } else j = void 0; if (n.isEmptyObject(m)) "inline" === ("none" === j ? tb(a.nodeName) : j) && (o.display = j); else { q ? "hidden" in q && (p = q.hidden) : q = L.access(a, "fxshow", {}), f && (q.hidden = !p), p ? n(a).show() : l.done(function () { n(a).hide() }), l.done(function () { var b; L.remove(a, "fxshow"); for (b in m) n.style(a, b, m[b]) }); for (d in m) g = Ub(p ? q[d] : 0, d, l), d in q || (q[d] = g.start, p && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0)) } } function Wb(a, b) { var c, d, e, f, g; for (c in a) if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) { f = g.expand(f), delete a[d]; for (c in f) c in a || (a[c] = f[c], b[c] = e) } else b[d] = e } function Xb(a, b, c) { var d, e, f = 0, g = Qb.length, h = n.Deferred().always(function () { delete i.elem }), i = function () { if (e) return !1; for (var b = Lb || Sb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f); return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1) }, j = h.promise({ elem: a, props: n.extend({}, b), opts: n.extend(!0, { specialEasing: {} }, c), originalProperties: b, originalOptions: c, startTime: Lb || Sb(), duration: c.duration, tweens: [], createTween: function (b, c) { var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing); return j.tweens.push(d), d }, stop: function (b) { var c = 0, d = b ? j.tweens.length : 0; if (e) return this; for (e = !0; d > c; c++) j.tweens[c].run(1); return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this } }), k = j.props; for (Wb(k, j.opts.specialEasing) ; g > f; f++) if (d = Qb[f].call(j, a, k, j.opts)) return d; return n.map(k, Ub, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, { elem: a, anim: j, queue: j.opts.queue })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always) } n.Animation = n.extend(Xb, { tweener: function (a, b) { n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" "); for (var c, d = 0, e = a.length; e > d; d++) c = a[d], Rb[c] = Rb[c] || [], Rb[c].unshift(b) }, prefilter: function (a, b) { b ? Qb.unshift(a) : Qb.push(a) } }), n.speed = function (a, b, c) { var d = a && "object" == typeof a ? n.extend({}, a) : { complete: c || !c && b || n.isFunction(a) && a, duration: a, easing: c && b || b && !n.isFunction(b) && b }; return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () { n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue) }, d }, n.fn.extend({ fadeTo: function (a, b, c, d) { return this.filter(S).css("opacity", 0).show().end().animate({ opacity: b }, a, c, d) }, animate: function (a, b, c, d) { var e = n.isEmptyObject(a), f = n.speed(b, c, d), g = function () { var b = Xb(this, n.extend({}, a), f); (e || L.get(this, "finish")) && b.stop(!0) }; return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g) }, stop: function (a, b, c) { var d = function (a) { var b = a.stop; delete a.stop, b(c) }; return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () { var b = !0, e = null != a && a + "queueHooks", f = n.timers, g = L.get(this); if (e) g[e] && g[e].stop && d(g[e]); else for (e in g) g[e] && g[e].stop && Pb.test(e) && d(g[e]); for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1)); (b || !c) && n.dequeue(this, a) }) }, finish: function (a) { return a !== !1 && (a = a || "fx"), this.each(function () { var b, c = L.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0; for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1)); for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this); delete c.finish }) } }), n.each(["toggle", "show", "hide"], function (a, b) { var c = n.fn[b]; n.fn[b] = function (a, d, e) { return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(Tb(b, !0), a, d, e) } }), n.each({ slideDown: Tb("show"), slideUp: Tb("hide"), slideToggle: Tb("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) { n.fn[a] = function (a, c, d) { return this.animate(b, a, c, d) } }), n.timers = [], n.fx.tick = function () { var a, b = 0, c = n.timers; for (Lb = n.now() ; b < c.length; b++) a = c[b], a() || c[b] !== a || c.splice(b--, 1); c.length || n.fx.stop(), Lb = void 0 }, n.fx.timer = function (a) { n.timers.push(a), a() ? n.fx.start() : n.timers.pop() }, n.fx.interval = 13, n.fx.start = function () { Mb || (Mb = setInterval(n.fx.tick, n.fx.interval)) }, n.fx.stop = function () { clearInterval(Mb), Mb = null }, n.fx.speeds = { slow: 600, fast: 200, _default: 400 }, n.fn.delay = function (a, b) { return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) { var d = setTimeout(b, a); c.stop = function () { clearTimeout(d) } }) }, function () { var a = l.createElement("input"), b = l.createElement("select"), c = b.appendChild(l.createElement("option")); a.type = "checkbox", k.checkOn = "" !== a.value, k.optSelected = c.selected, b.disabled = !0, k.optDisabled = !c.disabled, a = l.createElement("input"), a.value = "t", a.type = "radio", k.radioValue = "t" === a.value }(); var Yb, Zb, $b = n.expr.attrHandle; n.fn.extend({ attr: function (a, b) { return J(this, n.attr, a, b, arguments.length > 1) }, removeAttr: function (a) { return this.each(function () { n.removeAttr(this, a) }) } }), n.extend({
    attr: function (a, b, c) {
      var d, e, f = a.nodeType; if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === U ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? Zb : Yb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
    }, removeAttr: function (a, b) { var c, d, e = 0, f = b && b.match(E); if (f && 1 === a.nodeType) while (c = f[e++]) d = n.propFix[c] || c, n.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c) }, attrHooks: { type: { set: function (a, b) { if (!k.radioValue && "radio" === b && n.nodeName(a, "input")) { var c = a.value; return a.setAttribute("type", b), c && (a.value = c), b } } } }
  }), Zb = { set: function (a, b, c) { return b === !1 ? n.removeAttr(a, c) : a.setAttribute(c, c), c } }, n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) { var c = $b[b] || n.find.attr; $b[b] = function (a, b, d) { var e, f; return d || (f = $b[b], $b[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, $b[b] = f), e } }); var _b = /^(?:input|select|textarea|button)$/i; n.fn.extend({ prop: function (a, b) { return J(this, n.prop, a, b, arguments.length > 1) }, removeProp: function (a) { return this.each(function () { delete this[n.propFix[a] || a] }) } }), n.extend({ propFix: { "for": "htmlFor", "class": "className" }, prop: function (a, b, c) { var d, e, f, g = a.nodeType; if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b] }, propHooks: { tabIndex: { get: function (a) { return a.hasAttribute("tabindex") || _b.test(a.nodeName) || a.href ? a.tabIndex : -1 } } } }), k.optSelected || (n.propHooks.selected = { get: function (a) { var b = a.parentNode; return b && b.parentNode && b.parentNode.selectedIndex, null } }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () { n.propFix[this.toLowerCase()] = this }); var ac = /[\t\r\n\f]/g; n.fn.extend({ addClass: function (a) { var b, c, d, e, f, g, h = "string" == typeof a && a, i = 0, j = this.length; if (n.isFunction(a)) return this.each(function (b) { n(this).addClass(a.call(this, b, this.className)) }); if (h) for (b = (a || "").match(E) || []; j > i; i++) if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : " ")) { f = 0; while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " "); g = n.trim(d), c.className !== g && (c.className = g) } return this }, removeClass: function (a) { var b, c, d, e, f, g, h = 0 === arguments.length || "string" == typeof a && a, i = 0, j = this.length; if (n.isFunction(a)) return this.each(function (b) { n(this).removeClass(a.call(this, b, this.className)) }); if (h) for (b = (a || "").match(E) || []; j > i; i++) if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : "")) { f = 0; while (e = b[f++]) while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " "); g = a ? n.trim(d) : "", c.className !== g && (c.className = g) } return this }, toggleClass: function (a, b) { var c = typeof a; return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) { n(this).toggleClass(a.call(this, c, this.className, b), b) } : function () { if ("string" === c) { var b, d = 0, e = n(this), f = a.match(E) || []; while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b) } else (c === U || "boolean" === c) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : L.get(this, "__className__") || "") }) }, hasClass: function (a) { for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ac, " ").indexOf(b) >= 0) return !0; return !1 } }); var bc = /\r/g; n.fn.extend({ val: function (a) { var b, c, d, e = this[0]; { if (arguments.length) return d = n.isFunction(a), this.each(function (c) { var e; 1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) { return null == a ? "" : a + "" })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e)) }); if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(bc, "") : null == c ? "" : c) } } }), n.extend({ valHooks: { option: { get: function (a) { var b = n.find.attr(a, "value"); return null != b ? b : n.trim(n.text(a)) } }, select: { get: function (a) { for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) { if (b = n(c).val(), f) return b; g.push(b) } return g }, set: function (a, b) { var c, d, e = a.options, f = n.makeArray(b), g = e.length; while (g--) d = e[g], (d.selected = n.inArray(d.value, f) >= 0) && (c = !0); return c || (a.selectedIndex = -1), f } } } }), n.each(["radio", "checkbox"], function () { n.valHooks[this] = { set: function (a, b) { return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0 } }, k.checkOn || (n.valHooks[this].get = function (a) { return null === a.getAttribute("value") ? "on" : a.value }) }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) { n.fn[b] = function (a, c) { return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b) } }), n.fn.extend({ hover: function (a, b) { return this.mouseenter(a).mouseleave(b || a) }, bind: function (a, b, c) { return this.on(a, null, b, c) }, unbind: function (a, b) { return this.off(a, null, b) }, delegate: function (a, b, c, d) { return this.on(b, a, c, d) }, undelegate: function (a, b, c) { return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c) } }); var cc = n.now(), dc = /\?/; n.parseJSON = function (a) { return JSON.parse(a + "") }, n.parseXML = function (a) { var b, c; if (!a || "string" != typeof a) return null; try { c = new DOMParser, b = c.parseFromString(a, "text/xml") } catch (d) { b = void 0 } return (!b || b.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + a), b }; var ec, fc, gc = /#.*$/, hc = /([?&])_=[^&]*/, ic = /^(.*?):[ \t]*([^\r\n]*)$/gm, jc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, kc = /^(?:GET|HEAD)$/, lc = /^\/\//, mc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, nc = {}, oc = {}, pc = "*/".concat("*"); try { fc = location.href } catch (qc) { fc = l.createElement("a"), fc.href = "", fc = fc.href } ec = mc.exec(fc.toLowerCase()) || []; function rc(a) { return function (b, c) { "string" != typeof b && (c = b, b = "*"); var d, e = 0, f = b.toLowerCase().match(E) || []; if (n.isFunction(c)) while (d = f[e++]) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c) } } function sc(a, b, c, d) { var e = {}, f = a === oc; function g(h) { var i; return e[h] = !0, n.each(a[h] || [], function (a, h) { var j = h(b, c, d); return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1) }), i } return g(b.dataTypes[0]) || !e["*"] && g("*") } function tc(a, b) { var c, d, e = n.ajaxSettings.flatOptions || {}; for (c in b) void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]); return d && n.extend(!0, a, d), a } function uc(a, b, c) { var d, e, f, g, h = a.contents, i = a.dataTypes; while ("*" === i[0]) i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type")); if (d) for (e in h) if (h[e] && h[e].test(d)) { i.unshift(e); break } if (i[0] in c) f = i[0]; else { for (e in c) { if (!i[0] || a.converters[e + " " + i[0]]) { f = e; break } g || (g = e) } f = f || g } return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0 } function vc(a, b, c, d) { var e, f, g, h, i, j = {}, k = a.dataTypes.slice(); if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g]; f = k.shift(); while (f) if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i; else if ("*" !== i && i !== f) { if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) { g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1])); break } if (g !== !0) if (g && a["throws"]) b = g(b); else try { b = g(b) } catch (l) { return { state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f } } } return { state: "success", data: b } } n.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: fc, type: "GET", isLocal: jc.test(ec[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": pc, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": n.parseJSON, "text xml": n.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function (a, b) { return b ? tc(tc(a, n.ajaxSettings), b) : tc(n.ajaxSettings, a) }, ajaxPrefilter: rc(nc), ajaxTransport: rc(oc), ajax: function (a, b) { "object" == typeof a && (b = a, a = void 0), b = b || {}; var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b), l = k.context || k, m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event, o = n.Deferred(), p = n.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = { readyState: 0, getResponseHeader: function (a) { var b; if (2 === t) { if (!f) { f = {}; while (b = ic.exec(e)) f[b[1].toLowerCase()] = b[2] } b = f[a.toLowerCase()] } return null == b ? null : b }, getAllResponseHeaders: function () { return 2 === t ? e : null }, setRequestHeader: function (a, b) { var c = a.toLowerCase(); return t || (a = s[c] = s[c] || a, r[a] = b), this }, overrideMimeType: function (a) { return t || (k.mimeType = a), this }, statusCode: function (a) { var b; if (a) if (2 > t) for (b in a) q[b] = [q[b], a[b]]; else v.always(a[v.status]); return this }, abort: function (a) { var b = a || u; return c && c.abort(b), x(0, b), this } }; if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || fc) + "").replace(gc, "").replace(lc, ec[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (h = mc.exec(k.url.toLowerCase()), k.crossDomain = !(!h || h[1] === ec[1] && h[2] === ec[2] && (h[3] || ("http:" === h[1] ? "80" : "443")) === (ec[3] || ("http:" === ec[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), sc(nc, k, b, v), 2 === t) return v; i = k.global, i && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !kc.test(k.type), d = k.url, k.hasContent || (k.data && (d = k.url += (dc.test(d) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = hc.test(d) ? d.replace(hc, "$1_=" + cc++) : d + (dc.test(d) ? "&" : "?") + "_=" + cc++)), k.ifModified && (n.lastModified[d] && v.setRequestHeader("If-Modified-Since", n.lastModified[d]), n.etag[d] && v.setRequestHeader("If-None-Match", n.etag[d])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + pc + "; q=0.01" : "") : k.accepts["*"]); for (j in k.headers) v.setRequestHeader(j, k.headers[j]); if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort(); u = "abort"; for (j in { success: 1, error: 1, complete: 1 }) v[j](k[j]); if (c = sc(oc, k, b, v)) { v.readyState = 1, i && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () { v.abort("timeout") }, k.timeout)); try { t = 1, c.send(r, x) } catch (w) { if (!(2 > t)) throw w; x(-1, w) } } else x(-1, "No Transport"); function x(a, b, f, h) { var j, r, s, u, w, x = b; 2 !== t && (t = 2, g && clearTimeout(g), c = void 0, e = h || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, f && (u = uc(k, v, f)), u = vc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[d] = w), w = v.getResponseHeader("etag"), w && (n.etag[d] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, i && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), i && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop"))) } return v }, getJSON: function (a, b, c) { return n.get(a, b, c, "json") }, getScript: function (a, b) { return n.get(a, void 0, b, "script") } }), n.each(["get", "post"], function (a, b) { n[b] = function (a, c, d, e) { return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({ url: a, type: b, dataType: e, data: c, success: d }) } }), n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) { n.fn[b] = function (a) { return this.on(b, a) } }), n._evalUrl = function (a) { return n.ajax({ url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 }) }, n.fn.extend({ wrapAll: function (a) { var b; return n.isFunction(a) ? this.each(function (b) { n(this).wrapAll(a.call(this, b)) }) : (this[0] && (b = n(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () { var a = this; while (a.firstElementChild) a = a.firstElementChild; return a }).append(this)), this) }, wrapInner: function (a) { return this.each(n.isFunction(a) ? function (b) { n(this).wrapInner(a.call(this, b)) } : function () { var b = n(this), c = b.contents(); c.length ? c.wrapAll(a) : b.append(a) }) }, wrap: function (a) { var b = n.isFunction(a); return this.each(function (c) { n(this).wrapAll(b ? a.call(this, c) : a) }) }, unwrap: function () { return this.parent().each(function () { n.nodeName(this, "body") || n(this).replaceWith(this.childNodes) }).end() } }), n.expr.filters.hidden = function (a) { return a.offsetWidth <= 0 && a.offsetHeight <= 0 }, n.expr.filters.visible = function (a) { return !n.expr.filters.hidden(a) }; var wc = /%20/g, xc = /\[\]$/, yc = /\r?\n/g, zc = /^(?:submit|button|image|reset|file)$/i, Ac = /^(?:input|select|textarea|keygen)/i; function Bc(a, b, c, d) { var e; if (n.isArray(b)) n.each(b, function (b, e) { c || xc.test(a) ? d(a, e) : Bc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d) }); else if (c || "object" !== n.type(b)) d(a, b); else for (e in b) Bc(a + "[" + e + "]", b[e], c, d) } n.param = function (a, b) { var c, d = [], e = function (a, b) { b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b) }; if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function () { e(this.name, this.value) }); else for (c in a) Bc(c, a[c], b, e); return d.join("&").replace(wc, "+") }, n.fn.extend({ serialize: function () { return n.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { var a = n.prop(this, "elements"); return a ? n.makeArray(a) : this }).filter(function () { var a = this.type; return this.name && !n(this).is(":disabled") && Ac.test(this.nodeName) && !zc.test(a) && (this.checked || !T.test(a)) }).map(function (a, b) { var c = n(this).val(); return null == c ? null : n.isArray(c) ? n.map(c, function (a) { return { name: b.name, value: a.replace(yc, "\r\n") } }) : { name: b.name, value: c.replace(yc, "\r\n") } }).get() } }), n.ajaxSettings.xhr = function () { try { return new XMLHttpRequest } catch (a) { } }; var Cc = 0, Dc = {}, Ec = { 0: 200, 1223: 204 }, Fc = n.ajaxSettings.xhr(); a.ActiveXObject && n(a).on("unload", function () { for (var a in Dc) Dc[a]() }), k.cors = !!Fc && "withCredentials" in Fc, k.ajax = Fc = !!Fc, n.ajaxTransport(function (a) { var b; return k.cors || Fc && !a.crossDomain ? { send: function (c, d) { var e, f = a.xhr(), g = ++Cc; if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) for (e in a.xhrFields) f[e] = a.xhrFields[e]; a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"); for (e in c) f.setRequestHeader(e, c[e]); b = function (a) { return function () { b && (delete Dc[g], b = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Ec[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? { text: f.responseText } : void 0, f.getAllResponseHeaders())) } }, f.onload = b(), f.onerror = b("error"), b = Dc[g] = b("abort"); try { f.send(a.hasContent && a.data || null) } catch (h) { if (b) throw h } }, abort: function () { b && b() } } : void 0 }), n.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /(?:java|ecma)script/ }, converters: { "text script": function (a) { return n.globalEval(a), a } } }), n.ajaxPrefilter("script", function (a) { void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET") }), n.ajaxTransport("script", function (a) { if (a.crossDomain) { var b, c; return { send: function (d, e) { b = n("<script>").prop({ async: !0, charset: a.scriptCharset, src: a.url }).on("load error", c = function (a) { b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type) }), l.head.appendChild(b[0]) }, abort: function () { c && c() } } } }); var Gc = [], Hc = /(=)\?(?=&|$)|\?\?/; n.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { var a = Gc.pop() || n.expando + "_" + cc++; return this[a] = !0, a } }), n.ajaxPrefilter("json jsonp", function (b, c, d) { var e, f, g, h = b.jsonp !== !1 && (Hc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Hc.test(b.data) && "data"); return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Hc, "$1" + e) : b.jsonp !== !1 && (b.url += (dc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () { return g || n.error(e + " was not called"), g[0] }, b.dataTypes[0] = "json", f = a[e], a[e] = function () { g = arguments }, d.always(function () { a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Gc.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0 }), "script") : void 0 }), n.parseHTML = function (a, b, c) { if (!a || "string" != typeof a) return null; "boolean" == typeof b && (c = b, b = !1), b = b || l; var d = v.exec(a), e = !c && []; return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes)) }; var Ic = n.fn.load; n.fn.load = function (a, b, c) { if ("string" != typeof a && Ic) return Ic.apply(this, arguments); var d, e, f, g = this, h = a.indexOf(" "); return h >= 0 && (d = n.trim(a.slice(h)), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && n.ajax({ url: a, type: e, dataType: "html", data: b }).done(function (a) { f = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a) }).complete(c && function (a, b) { g.each(c, f || [a.responseText, b, a]) }), this }, n.expr.filters.animated = function (a) { return n.grep(n.timers, function (b) { return a === b.elem }).length }; var Jc = a.document.documentElement; function Kc(a) { return n.isWindow(a) ? a : 9 === a.nodeType && a.defaultView } n.offset = { setOffset: function (a, b, c) { var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {}; "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m) } }, n.fn.extend({ offset: function (a) { if (arguments.length) return void 0 === a ? this : this.each(function (b) { n.offset.setOffset(this, a, b) }); var b, c, d = this[0], e = { top: 0, left: 0 }, f = d && d.ownerDocument; if (f) return b = f.documentElement, n.contains(b, d) ? (typeof d.getBoundingClientRect !== U && (e = d.getBoundingClientRect()), c = Kc(f), { top: e.top + c.pageYOffset - b.clientTop, left: e.left + c.pageXOffset - b.clientLeft }) : e }, position: function () { if (this[0]) { var a, b, c = this[0], d = { top: 0, left: 0 }; return "fixed" === n.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (d = a.offset()), d.top += n.css(a[0], "borderTopWidth", !0), d.left += n.css(a[0], "borderLeftWidth", !0)), { top: b.top - d.top - n.css(c, "marginTop", !0), left: b.left - d.left - n.css(c, "marginLeft", !0) } } }, offsetParent: function () { return this.map(function () { var a = this.offsetParent || Jc; while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) a = a.offsetParent; return a || Jc }) } }), n.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (b, c) { var d = "pageYOffset" === c; n.fn[b] = function (e) { return J(this, function (b, e, f) { var g = Kc(b); return void 0 === f ? g ? g[c] : b[e] : void (g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f) }, b, e, arguments.length, null) } }), n.each(["top", "left"], function (a, b) { n.cssHooks[b] = yb(k.pixelPosition, function (a, c) { return c ? (c = xb(a, b), vb.test(c) ? n(a).position()[b] + "px" : c) : void 0 }) }), n.each({ Height: "height", Width: "width" }, function (a, b) { n.each({ padding: "inner" + a, content: b, "": "outer" + a }, function (c, d) { n.fn[d] = function (d, e) { var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border"); return J(this, function (b, c, d) { var e; return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g) }, b, f ? d : void 0, f, null) } }) }), n.fn.size = function () { return this.length }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () { return n }); var Lc = a.jQuery, Mc = a.$; return n.noConflict = function (b) { return a.$ === n && (a.$ = Mc), b && a.jQuery === n && (a.jQuery = Lc), n }, typeof b === U && (a.jQuery = a.$ = n), n
});

// Knockout JavaScript library v2.2.1
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {function j(w){throw w;}var m=!0,p=null,r=!1;function u(w){return function(){return w}};var x=window,y=document,ga=navigator,F=window.jQuery,I=void 0;
function L(w){function ha(a,d,c,e,f){var g=[];a=b.j(function(){var a=d(c,f)||[];0<g.length&&(b.a.Ya(M(g),a),e&&b.r.K(e,p,[c,a,f]));g.splice(0,g.length);b.a.P(g,a)},p,{W:a,Ka:function(){return 0==g.length||!b.a.X(g[0])}});return{M:g,j:a.pa()?a:I}}function M(a){for(;a.length&&!b.a.X(a[0]);)a.splice(0,1);if(1<a.length){for(var d=a[0],c=a[a.length-1],e=[d];d!==c;){d=d.nextSibling;if(!d)return;e.push(d)}Array.prototype.splice.apply(a,[0,a.length].concat(e))}return a}function S(a,b,c,e,f){var g=Math.min,
h=Math.max,k=[],l,n=a.length,q,s=b.length,v=s-n||1,G=n+s+1,J,A,z;for(l=0;l<=n;l++){A=J;k.push(J=[]);z=g(s,l+v);for(q=h(0,l-1);q<=z;q++)J[q]=q?l?a[l-1]===b[q-1]?A[q-1]:g(A[q]||G,J[q-1]||G)+1:q+1:l+1}g=[];h=[];v=[];l=n;for(q=s;l||q;)s=k[l][q]-1,q&&s===k[l][q-1]?h.push(g[g.length]={status:c,value:b[--q],index:q}):l&&s===k[l-1][q]?v.push(g[g.length]={status:e,value:a[--l],index:l}):(g.push({status:"retained",value:b[--q]}),--l);if(h.length&&v.length){a=10*n;var t;for(b=c=0;(f||b<a)&&(t=h[c]);c++){for(e=
0;k=v[e];e++)if(t.value===k.value){t.moved=k.index;k.moved=t.index;v.splice(e,1);b=e=0;break}b+=e}}return g.reverse()}function T(a,d,c,e,f){f=f||{};var g=a&&N(a),g=g&&g.ownerDocument,h=f.templateEngine||O;b.za.vb(c,h,g);c=h.renderTemplate(c,e,f,g);("number"!=typeof c.length||0<c.length&&"number"!=typeof c[0].nodeType)&&j(Error("Template engine must return an array of DOM nodes"));g=r;switch(d){case "replaceChildren":b.e.N(a,c);g=m;break;case "replaceNode":b.a.Ya(a,c);g=m;break;case "ignoreTargetNode":break;
default:j(Error("Unknown renderMode: "+d))}g&&(U(c,e),f.afterRender&&b.r.K(f.afterRender,p,[c,e.$data]));return c}function N(a){return a.nodeType?a:0<a.length?a[0]:p}function U(a,d){if(a.length){var c=a[0],e=a[a.length-1];V(c,e,function(a){b.Da(d,a)});V(c,e,function(a){b.s.ib(a,[d])})}}function V(a,d,c){var e;for(d=b.e.nextSibling(d);a&&(e=a)!==d;)a=b.e.nextSibling(e),(1===e.nodeType||8===e.nodeType)&&c(e)}function W(a,d,c){a=b.g.aa(a);for(var e=b.g.Q,f=0;f<a.length;f++){var g=a[f].key;if(e.hasOwnProperty(g)){var h=
e[g];"function"===typeof h?(g=h(a[f].value))&&j(Error(g)):h||j(Error("This template engine does not support the '"+g+"' binding within its templates"))}}a="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+b.g.ba(a)+" } })()})";return c.createJavaScriptEvaluatorBlock(a)+d}function X(a,d,c,e){function f(a){return function(){return k[a]}}function g(){return k}var h=0,k,l;b.j(function(){var n=c&&c instanceof b.z?c:new b.z(b.a.d(c)),q=n.$data;e&&b.eb(a,n);if(k=("function"==typeof d?
d(n,a):d)||b.J.instance.getBindings(a,n)){if(0===h){h=1;for(var s in k){var v=b.c[s];v&&8===a.nodeType&&!b.e.I[s]&&j(Error("The binding '"+s+"' cannot be used with virtual elements"));if(v&&"function"==typeof v.init&&(v=(0,v.init)(a,f(s),g,q,n))&&v.controlsDescendantBindings)l!==I&&j(Error("Multiple bindings ("+l+" and "+s+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")),l=s}h=2}if(2===h)for(s in k)(v=b.c[s])&&"function"==
typeof v.update&&(0,v.update)(a,f(s),g,q,n)}},p,{W:a});return{Nb:l===I}}function Y(a,d,c){var e=m,f=1===d.nodeType;f&&b.e.Ta(d);if(f&&c||b.J.instance.nodeHasBindings(d))e=X(d,p,a,c).Nb;e&&Z(a,d,!f)}function Z(a,d,c){for(var e=b.e.firstChild(d);d=e;)e=b.e.nextSibling(d),Y(a,d,c)}function $(a,b){var c=aa(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:p}function aa(a,b){for(var c=a,e=1,f=[];c=c.nextSibling;){if(H(c)&&(e--,0===e))return f;f.push(c);B(c)&&e++}b||j(Error("Cannot find closing comment tag to match: "+
a.nodeValue));return p}function H(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ia)}function B(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ja)}function P(a,b){for(var c=p;a!=c;)c=a,a=a.replace(ka,function(a,c){return b[c]});return a}function la(){var a=[],d=[];this.save=function(c,e){var f=b.a.i(a,c);0<=f?d[f]=e:(a.push(c),d.push(e))};this.get=function(c){c=b.a.i(a,c);return 0<=c?d[c]:I}}function ba(a,b,c){function e(e){var g=b(a[e]);switch(typeof g){case "boolean":case "number":case "string":case "function":f[e]=
g;break;case "object":case "undefined":var h=c.get(g);f[e]=h!==I?h:ba(g,b,c)}}c=c||new la;a=b(a);if(!("object"==typeof a&&a!==p&&a!==I&&!(a instanceof Date)))return a;var f=a instanceof Array?[]:{};c.save(a,f);var g=a;if(g instanceof Array){for(var h=0;h<g.length;h++)e(h);"function"==typeof g.toJSON&&e("toJSON")}else for(h in g)e(h);return f}function ca(a,d){if(a)if(8==a.nodeType){var c=b.s.Ua(a.nodeValue);c!=p&&d.push({sb:a,Fb:c})}else if(1==a.nodeType)for(var c=0,e=a.childNodes,f=e.length;c<f;c++)ca(e[c],
d)}function Q(a,d,c,e){b.c[a]={init:function(a){b.a.f.set(a,da,{});return{controlsDescendantBindings:m}},update:function(a,g,h,k,l){h=b.a.f.get(a,da);g=b.a.d(g());k=!c!==!g;var n=!h.Za;if(n||d||k!==h.qb)n&&(h.Za=b.a.Ia(b.e.childNodes(a),m)),k?(n||b.e.N(a,b.a.Ia(h.Za)),b.Ea(e?e(l,g):l,a)):b.e.Y(a),h.qb=k}};b.g.Q[a]=r;b.e.I[a]=m}function ea(a,d,c){c&&d!==b.k.q(a)&&b.k.T(a,d);d!==b.k.q(a)&&b.r.K(b.a.Ba,p,[a,"change"])}var b="undefined"!==typeof w?w:{};b.b=function(a,d){for(var c=a.split("."),e=b,f=0;f<
c.length-1;f++)e=e[c[f]];e[c[c.length-1]]=d};b.p=function(a,b,c){a[b]=c};b.version="2.2.1";b.b("version",b.version);b.a=new function(){function a(a,d){if("input"!==b.a.u(a)||!a.type||"click"!=d.toLowerCase())return r;var c=a.type;return"checkbox"==c||"radio"==c}var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,c={},e={};c[/Firefox\/2/i.test(ga.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];c.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");
for(var f in c){var g=c[f];if(g.length)for(var h=0,k=g.length;h<k;h++)e[g[h]]=f}var l={propertychange:m},n,c=3;f=y.createElement("div");for(g=f.getElementsByTagName("i");f.innerHTML="\x3c!--[if gt IE "+ ++c+"]><i></i><![endif]--\x3e",g[0];);n=4<c?c:I;return{Na:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],o:function(a,b){for(var d=0,c=a.length;d<c;d++)b(a[d])},i:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var d=0,c=a.length;d<
c;d++)if(a[d]===b)return d;return-1},lb:function(a,b,d){for(var c=0,e=a.length;c<e;c++)if(b.call(d,a[c]))return a[c];return p},ga:function(a,d){var c=b.a.i(a,d);0<=c&&a.splice(c,1)},Ga:function(a){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)0>b.a.i(d,a[c])&&d.push(a[c]);return d},V:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)d.push(b(a[c]));return d},fa:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)b(a[c])&&d.push(a[c]);return d},P:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var d=0,c=b.length;d<c;d++)a.push(b[d]);return a},extend:function(a,b){if(b)for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a},ka:function(a){for(;a.firstChild;)b.removeNode(a.firstChild)},Hb:function(a){a=b.a.L(a);for(var d=y.createElement("div"),c=0,e=a.length;c<e;c++)d.appendChild(b.A(a[c]));return d},Ia:function(a,d){for(var c=0,e=a.length,g=[];c<e;c++){var f=a[c].cloneNode(m);g.push(d?b.A(f):f)}return g},N:function(a,d){b.a.ka(a);if(d)for(var c=0,e=d.length;c<e;c++)a.appendChild(d[c])},
Ya:function(a,d){var c=a.nodeType?[a]:a;if(0<c.length){for(var e=c[0],g=e.parentNode,f=0,h=d.length;f<h;f++)g.insertBefore(d[f],e);f=0;for(h=c.length;f<h;f++)b.removeNode(c[f])}},bb:function(a,b){7>n?a.setAttribute("selected",b):a.selected=b},D:function(a){return(a||"").replace(d,"")},Rb:function(a,d){for(var c=[],e=(a||"").split(d),f=0,g=e.length;f<g;f++){var h=b.a.D(e[f]);""!==h&&c.push(h)}return c},Ob:function(a,b){a=a||"";return b.length>a.length?r:a.substring(0,b.length)===b},tb:function(a,b){if(b.compareDocumentPosition)return 16==
(b.compareDocumentPosition(a)&16);for(;a!=p;){if(a==b)return m;a=a.parentNode}return r},X:function(a){return b.a.tb(a,a.ownerDocument)},u:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,d,c){var e=n&&l[d];if(!e&&"undefined"!=typeof F){if(a(b,d)){var f=c;c=function(a,b){var d=this.checked;b&&(this.checked=b.nb!==m);f.call(this,a);this.checked=d}}F(b).bind(d,c)}else!e&&"function"==typeof b.addEventListener?b.addEventListener(d,c,r):"undefined"!=typeof b.attachEvent?b.attachEvent("on"+
d,function(a){c.call(b,a)}):j(Error("Browser doesn't support addEventListener or attachEvent"))},Ba:function(b,d){(!b||!b.nodeType)&&j(Error("element must be a DOM node when calling triggerEvent"));if("undefined"!=typeof F){var c=[];a(b,d)&&c.push({nb:b.checked});F(b).trigger(d,c)}else"function"==typeof y.createEvent?"function"==typeof b.dispatchEvent?(c=y.createEvent(e[d]||"HTMLEvents"),c.initEvent(d,m,m,x,0,0,0,0,0,r,r,r,r,0,b),b.dispatchEvent(c)):j(Error("The supplied element doesn't support dispatchEvent")):
"undefined"!=typeof b.fireEvent?(a(b,d)&&(b.checked=b.checked!==m),b.fireEvent("on"+d)):j(Error("Browser doesn't support triggering events"))},d:function(a){return b.$(a)?a():a},ua:function(a){return b.$(a)?a.t():a},da:function(a,d,c){if(d){var e=/[\w-]+/g,f=a.className.match(e)||[];b.a.o(d.match(e),function(a){var d=b.a.i(f,a);0<=d?c||f.splice(d,1):c&&f.push(a)});a.className=f.join(" ")}},cb:function(a,d){var c=b.a.d(d);if(c===p||c===I)c="";if(3===a.nodeType)a.data=c;else{var e=b.e.firstChild(a);
!e||3!=e.nodeType||b.e.nextSibling(e)?b.e.N(a,[y.createTextNode(c)]):e.data=c;b.a.wb(a)}},ab:function(a,b){a.name=b;if(7>=n)try{a.mergeAttributes(y.createElement("<input name='"+a.name+"'/>"),r)}catch(d){}},wb:function(a){9<=n&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},ub:function(a){if(9<=n){var b=a.style.width;a.style.width=0;a.style.width=b}},Lb:function(a,d){a=b.a.d(a);d=b.a.d(d);for(var c=[],e=a;e<=d;e++)c.push(e);return c},L:function(a){for(var b=[],d=0,c=a.length;d<
c;d++)b.push(a[d]);return b},Pb:6===n,Qb:7===n,Z:n,Oa:function(a,d){for(var c=b.a.L(a.getElementsByTagName("input")).concat(b.a.L(a.getElementsByTagName("textarea"))),e="string"==typeof d?function(a){return a.name===d}:function(a){return d.test(a.name)},f=[],g=c.length-1;0<=g;g--)e(c[g])&&f.push(c[g]);return f},Ib:function(a){return"string"==typeof a&&(a=b.a.D(a))?x.JSON&&x.JSON.parse?x.JSON.parse(a):(new Function("return "+a))():p},xa:function(a,d,c){("undefined"==typeof JSON||"undefined"==typeof JSON.stringify)&&
j(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(b.a.d(a),d,c)},Jb:function(a,d,c){c=c||{};var e=c.params||{},f=c.includeFields||this.Na,g=a;if("object"==typeof a&&"form"===b.a.u(a))for(var g=a.action,h=f.length-1;0<=h;h--)for(var k=b.a.Oa(a,f[h]),l=k.length-1;0<=l;l--)e[k[l].name]=k[l].value;d=b.a.d(d);var n=y.createElement("form");
n.style.display="none";n.action=g;n.method="post";for(var w in d)a=y.createElement("input"),a.name=w,a.value=b.a.xa(b.a.d(d[w])),n.appendChild(a);for(w in e)a=y.createElement("input"),a.name=w,a.value=e[w],n.appendChild(a);y.body.appendChild(n);c.submitter?c.submitter(n):n.submit();setTimeout(function(){n.parentNode.removeChild(n)},0)}}};b.b("utils",b.a);b.b("utils.arrayForEach",b.a.o);b.b("utils.arrayFirst",b.a.lb);b.b("utils.arrayFilter",b.a.fa);b.b("utils.arrayGetDistinctValues",b.a.Ga);b.b("utils.arrayIndexOf",
b.a.i);b.b("utils.arrayMap",b.a.V);b.b("utils.arrayPushAll",b.a.P);b.b("utils.arrayRemoveItem",b.a.ga);b.b("utils.extend",b.a.extend);b.b("utils.fieldsIncludedWithJsonPost",b.a.Na);b.b("utils.getFormFields",b.a.Oa);b.b("utils.peekObservable",b.a.ua);b.b("utils.postJson",b.a.Jb);b.b("utils.parseJson",b.a.Ib);b.b("utils.registerEventHandler",b.a.n);b.b("utils.stringifyJson",b.a.xa);b.b("utils.range",b.a.Lb);b.b("utils.toggleDomNodeCssClass",b.a.da);b.b("utils.triggerEvent",b.a.Ba);b.b("utils.unwrapObservable",
b.a.d);Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return b.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});b.a.f=new function(){var a=0,d="__ko__"+(new Date).getTime(),c={};return{get:function(a,d){var c=b.a.f.la(a,r);return c===I?I:c[d]},set:function(a,d,c){c===I&&b.a.f.la(a,r)===I||(b.a.f.la(a,m)[d]=c)},la:function(b,f){var g=b[d];if(!g||!("null"!==g&&c[g])){if(!f)return I;g=b[d]="ko"+
a++;c[g]={}}return c[g]},clear:function(a){var b=a[d];return b?(delete c[b],a[d]=p,m):r}}};b.b("utils.domData",b.a.f);b.b("utils.domData.clear",b.a.f.clear);b.a.F=new function(){function a(a,d){var e=b.a.f.get(a,c);e===I&&d&&(e=[],b.a.f.set(a,c,e));return e}function d(c){var e=a(c,r);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);b.a.f.clear(c);"function"==typeof F&&"function"==typeof F.cleanData&&F.cleanData([c]);if(f[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}
var c="__ko_domNodeDisposal__"+(new Date).getTime(),e={1:m,8:m,9:m},f={1:m,9:m};return{Ca:function(b,d){"function"!=typeof d&&j(Error("Callback must be a function"));a(b,m).push(d)},Xa:function(d,e){var f=a(d,r);f&&(b.a.ga(f,e),0==f.length&&b.a.f.set(d,c,I))},A:function(a){if(e[a.nodeType]&&(d(a),f[a.nodeType])){var c=[];b.a.P(c,a.getElementsByTagName("*"));for(var k=0,l=c.length;k<l;k++)d(c[k])}return a},removeNode:function(a){b.A(a);a.parentNode&&a.parentNode.removeChild(a)}}};b.A=b.a.F.A;b.removeNode=
b.a.F.removeNode;b.b("cleanNode",b.A);b.b("removeNode",b.removeNode);b.b("utils.domNodeDisposal",b.a.F);b.b("utils.domNodeDisposal.addDisposeCallback",b.a.F.Ca);b.b("utils.domNodeDisposal.removeDisposeCallback",b.a.F.Xa);b.a.ta=function(a){var d;if("undefined"!=typeof F)if(F.parseHTML)d=F.parseHTML(a);else{if((d=F.clean([a]))&&d[0]){for(a=d[0];a.parentNode&&11!==a.parentNode.nodeType;)a=a.parentNode;a.parentNode&&a.parentNode.removeChild(a)}}else{var c=b.a.D(a).toLowerCase();d=y.createElement("div");
c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];a="ignored<div>"+c[1]+a+c[2]+"</div>";for("function"==typeof x.innerShiv?d.appendChild(x.innerShiv(a)):d.innerHTML=a;c[0]--;)d=d.lastChild;d=b.a.L(d.lastChild.childNodes)}return d};b.a.ca=function(a,d){b.a.ka(a);d=b.a.d(d);if(d!==p&&d!==I)if("string"!=typeof d&&(d=d.toString()),
"undefined"!=typeof F)F(a).html(d);else for(var c=b.a.ta(d),e=0;e<c.length;e++)a.appendChild(c[e])};b.b("utils.parseHtmlFragment",b.a.ta);b.b("utils.setHtml",b.a.ca);var R={};b.s={ra:function(a){"function"!=typeof a&&j(Error("You can only pass a function to ko.memoization.memoize()"));var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);R[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},hb:function(a,b){var c=R[a];c===I&&j(Error("Couldn't find any memo with ID "+
a+". Perhaps it's already been unmemoized."));try{return c.apply(p,b||[]),m}finally{delete R[a]}},ib:function(a,d){var c=[];ca(a,c);for(var e=0,f=c.length;e<f;e++){var g=c[e].sb,h=[g];d&&b.a.P(h,d);b.s.hb(c[e].Fb,h);g.nodeValue="";g.parentNode&&g.parentNode.removeChild(g)}},Ua:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:p}};b.b("memoization",b.s);b.b("memoization.memoize",b.s.ra);b.b("memoization.unmemoize",b.s.hb);b.b("memoization.parseMemoText",b.s.Ua);b.b("memoization.unmemoizeDomNodeAndDescendants",
b.s.ib);b.Ma={throttle:function(a,d){a.throttleEvaluation=d;var c=p;return b.j({read:a,write:function(b){clearTimeout(c);c=setTimeout(function(){a(b)},d)}})},notify:function(a,d){a.equalityComparer="always"==d?u(r):b.m.fn.equalityComparer;return a}};b.b("extenders",b.Ma);b.fb=function(a,d,c){this.target=a;this.ha=d;this.rb=c;b.p(this,"dispose",this.B)};b.fb.prototype.B=function(){this.Cb=m;this.rb()};b.S=function(){this.w={};b.a.extend(this,b.S.fn);b.p(this,"subscribe",this.ya);b.p(this,"extend",
this.extend);b.p(this,"getSubscriptionsCount",this.yb)};b.S.fn={ya:function(a,d,c){c=c||"change";var e=new b.fb(this,d?a.bind(d):a,function(){b.a.ga(this.w[c],e)}.bind(this));this.w[c]||(this.w[c]=[]);this.w[c].push(e);return e},notifySubscribers:function(a,d){d=d||"change";this.w[d]&&b.r.K(function(){b.a.o(this.w[d].slice(0),function(b){b&&b.Cb!==m&&b.ha(a)})},this)},yb:function(){var a=0,b;for(b in this.w)this.w.hasOwnProperty(b)&&(a+=this.w[b].length);return a},extend:function(a){var d=this;if(a)for(var c in a){var e=
b.Ma[c];"function"==typeof e&&(d=e(d,a[c]))}return d}};b.Qa=function(a){return"function"==typeof a.ya&&"function"==typeof a.notifySubscribers};b.b("subscribable",b.S);b.b("isSubscribable",b.Qa);var C=[];b.r={mb:function(a){C.push({ha:a,La:[]})},end:function(){C.pop()},Wa:function(a){b.Qa(a)||j(Error("Only subscribable things can act as dependencies"));if(0<C.length){var d=C[C.length-1];d&&!(0<=b.a.i(d.La,a))&&(d.La.push(a),d.ha(a))}},K:function(a,b,c){try{return C.push(p),a.apply(b,c||[])}finally{C.pop()}}};
var ma={undefined:m,"boolean":m,number:m,string:m};b.m=function(a){function d(){if(0<arguments.length){if(!d.equalityComparer||!d.equalityComparer(c,arguments[0]))d.H(),c=arguments[0],d.G();return this}b.r.Wa(d);return c}var c=a;b.S.call(d);d.t=function(){return c};d.G=function(){d.notifySubscribers(c)};d.H=function(){d.notifySubscribers(c,"beforeChange")};b.a.extend(d,b.m.fn);b.p(d,"peek",d.t);b.p(d,"valueHasMutated",d.G);b.p(d,"valueWillMutate",d.H);return d};b.m.fn={equalityComparer:function(a,
b){return a===p||typeof a in ma?a===b:r}};var E=b.m.Kb="__ko_proto__";b.m.fn[E]=b.m;b.ma=function(a,d){return a===p||a===I||a[E]===I?r:a[E]===d?m:b.ma(a[E],d)};b.$=function(a){return b.ma(a,b.m)};b.Ra=function(a){return"function"==typeof a&&a[E]===b.m||"function"==typeof a&&a[E]===b.j&&a.zb?m:r};b.b("observable",b.m);b.b("isObservable",b.$);b.b("isWriteableObservable",b.Ra);b.R=function(a){0==arguments.length&&(a=[]);a!==p&&(a!==I&&!("length"in a))&&j(Error("The argument passed when initializing an observable array must be an array, or null, or undefined."));
var d=b.m(a);b.a.extend(d,b.R.fn);return d};b.R.fn={remove:function(a){for(var b=this.t(),c=[],e="function"==typeof a?a:function(b){return b===a},f=0;f<b.length;f++){var g=b[f];e(g)&&(0===c.length&&this.H(),c.push(g),b.splice(f,1),f--)}c.length&&this.G();return c},removeAll:function(a){if(a===I){var d=this.t(),c=d.slice(0);this.H();d.splice(0,d.length);this.G();return c}return!a?[]:this.remove(function(d){return 0<=b.a.i(a,d)})},destroy:function(a){var b=this.t(),c="function"==typeof a?a:function(b){return b===
a};this.H();for(var e=b.length-1;0<=e;e--)c(b[e])&&(b[e]._destroy=m);this.G()},destroyAll:function(a){return a===I?this.destroy(u(m)):!a?[]:this.destroy(function(d){return 0<=b.a.i(a,d)})},indexOf:function(a){var d=this();return b.a.i(d,a)},replace:function(a,b){var c=this.indexOf(a);0<=c&&(this.H(),this.t()[c]=b,this.G())}};b.a.o("pop push reverse shift sort splice unshift".split(" "),function(a){b.R.fn[a]=function(){var b=this.t();this.H();b=b[a].apply(b,arguments);this.G();return b}});b.a.o(["slice"],
function(a){b.R.fn[a]=function(){var b=this();return b[a].apply(b,arguments)}});b.b("observableArray",b.R);b.j=function(a,d,c){function e(){b.a.o(z,function(a){a.B()});z=[]}function f(){var a=h.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(g,a)):g()}function g(){if(!q)if(n&&w())A();else{q=m;try{var a=b.a.V(z,function(a){return a.target});b.r.mb(function(c){var d;0<=(d=b.a.i(a,c))?a[d]=I:z.push(c.ya(f))});for(var c=s.call(d),e=a.length-1;0<=e;e--)a[e]&&z.splice(e,1)[0].B();n=m;h.notifySubscribers(l,
"beforeChange");l=c}finally{b.r.end()}h.notifySubscribers(l);q=r;z.length||A()}}function h(){if(0<arguments.length)return"function"===typeof v?v.apply(d,arguments):j(Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")),this;n||g();b.r.Wa(h);return l}function k(){return!n||0<z.length}var l,n=r,q=r,s=a;s&&"object"==typeof s?(c=s,s=c.read):(c=c||{},s||(s=c.read));"function"!=typeof s&&j(Error("Pass a function that returns the value of the ko.computed"));
var v=c.write,G=c.disposeWhenNodeIsRemoved||c.W||p,w=c.disposeWhen||c.Ka||u(r),A=e,z=[],t=p;d||(d=c.owner);h.t=function(){n||g();return l};h.xb=function(){return z.length};h.zb="function"===typeof c.write;h.B=function(){A()};h.pa=k;b.S.call(h);b.a.extend(h,b.j.fn);b.p(h,"peek",h.t);b.p(h,"dispose",h.B);b.p(h,"isActive",h.pa);b.p(h,"getDependenciesCount",h.xb);c.deferEvaluation!==m&&g();if(G&&k()){A=function(){b.a.F.Xa(G,arguments.callee);e()};b.a.F.Ca(G,A);var D=w,w=function(){return!b.a.X(G)||D()}}return h};
b.Bb=function(a){return b.ma(a,b.j)};w=b.m.Kb;b.j[w]=b.m;b.j.fn={};b.j.fn[w]=b.j;b.b("dependentObservable",b.j);b.b("computed",b.j);b.b("isComputed",b.Bb);b.gb=function(a){0==arguments.length&&j(Error("When calling ko.toJS, pass the object you want to convert."));return ba(a,function(a){for(var c=0;b.$(a)&&10>c;c++)a=a();return a})};b.toJSON=function(a,d,c){a=b.gb(a);return b.a.xa(a,d,c)};b.b("toJS",b.gb);b.b("toJSON",b.toJSON);b.k={q:function(a){switch(b.a.u(a)){case "option":return a.__ko__hasDomDataOptionValue__===
m?b.a.f.get(a,b.c.options.sa):7>=b.a.Z?a.getAttributeNode("value").specified?a.value:a.text:a.value;case "select":return 0<=a.selectedIndex?b.k.q(a.options[a.selectedIndex]):I;default:return a.value}},T:function(a,d){switch(b.a.u(a)){case "option":switch(typeof d){case "string":b.a.f.set(a,b.c.options.sa,I);"__ko__hasDomDataOptionValue__"in a&&delete a.__ko__hasDomDataOptionValue__;a.value=d;break;default:b.a.f.set(a,b.c.options.sa,d),a.__ko__hasDomDataOptionValue__=m,a.value="number"===typeof d?
d:""}break;case "select":for(var c=a.options.length-1;0<=c;c--)if(b.k.q(a.options[c])==d){a.selectedIndex=c;break}break;default:if(d===p||d===I)d="";a.value=d}}};b.b("selectExtensions",b.k);b.b("selectExtensions.readValue",b.k.q);b.b("selectExtensions.writeValue",b.k.T);var ka=/\@ko_token_(\d+)\@/g,na=["true","false"],oa=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;b.g={Q:[],aa:function(a){var d=b.a.D(a);if(3>d.length)return[];"{"===d.charAt(0)&&(d=d.substring(1,d.length-1));a=[];for(var c=
p,e,f=0;f<d.length;f++){var g=d.charAt(f);if(c===p)switch(g){case '"':case "'":case "/":c=f,e=g}else if(g==e&&"\\"!==d.charAt(f-1)){g=d.substring(c,f+1);a.push(g);var h="@ko_token_"+(a.length-1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f=f-(g.length-h.length),c=p}}e=c=p;for(var k=0,l=p,f=0;f<d.length;f++){g=d.charAt(f);if(c===p)switch(g){case "{":c=f;l=g;e="}";break;case "(":c=f;l=g;e=")";break;case "[":c=f,l=g,e="]"}g===l?k++:g===e&&(k--,0===k&&(g=d.substring(c,f+1),a.push(g),h="@ko_token_"+(a.length-
1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f-=g.length-h.length,c=p))}e=[];d=d.split(",");c=0;for(f=d.length;c<f;c++)k=d[c],l=k.indexOf(":"),0<l&&l<k.length-1?(g=k.substring(l+1),e.push({key:P(k.substring(0,l),a),value:P(g,a)})):e.push({unknown:P(k,a)});return e},ba:function(a){var d="string"===typeof a?b.g.aa(a):a,c=[];a=[];for(var e,f=0;e=d[f];f++)if(0<c.length&&c.push(","),e.key){var g;a:{g=e.key;var h=b.a.D(g);switch(h.length&&h.charAt(0)){case "'":case '"':break a;default:g="'"+h+"'"}}e=e.value;
c.push(g);c.push(":");c.push(e);e=b.a.D(e);0<=b.a.i(na,b.a.D(e).toLowerCase())?e=r:(h=e.match(oa),e=h===p?r:h[1]?"Object("+h[1]+")"+h[2]:e);e&&(0<a.length&&a.push(", "),a.push(g+" : function(__ko_value) { "+e+" = __ko_value; }"))}else e.unknown&&c.push(e.unknown);d=c.join("");0<a.length&&(d=d+", '_ko_property_writers' : { "+a.join("")+" } ");return d},Eb:function(a,d){for(var c=0;c<a.length;c++)if(b.a.D(a[c].key)==d)return m;return r},ea:function(a,d,c,e,f){if(!a||!b.Ra(a)){if((a=d()._ko_property_writers)&&
a[c])a[c](e)}else(!f||a.t()!==e)&&a(e)}};b.b("expressionRewriting",b.g);b.b("expressionRewriting.bindingRewriteValidators",b.g.Q);b.b("expressionRewriting.parseObjectLiteral",b.g.aa);b.b("expressionRewriting.preProcessBindings",b.g.ba);b.b("jsonExpressionRewriting",b.g);b.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",b.g.ba);var K="\x3c!--test--\x3e"===y.createComment("test").text,ja=K?/^\x3c!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\x3e$/:/^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/,ia=K?/^\x3c!--\s*\/ko\s*--\x3e$/:
/^\s*\/ko\s*$/,pa={ul:m,ol:m};b.e={I:{},childNodes:function(a){return B(a)?aa(a):a.childNodes},Y:function(a){if(B(a)){a=b.e.childNodes(a);for(var d=0,c=a.length;d<c;d++)b.removeNode(a[d])}else b.a.ka(a)},N:function(a,d){if(B(a)){b.e.Y(a);for(var c=a.nextSibling,e=0,f=d.length;e<f;e++)c.parentNode.insertBefore(d[e],c)}else b.a.N(a,d)},Va:function(a,b){B(a)?a.parentNode.insertBefore(b,a.nextSibling):a.firstChild?a.insertBefore(b,a.firstChild):a.appendChild(b)},Pa:function(a,d,c){c?B(a)?a.parentNode.insertBefore(d,
c.nextSibling):c.nextSibling?a.insertBefore(d,c.nextSibling):a.appendChild(d):b.e.Va(a,d)},firstChild:function(a){return!B(a)?a.firstChild:!a.nextSibling||H(a.nextSibling)?p:a.nextSibling},nextSibling:function(a){B(a)&&(a=$(a));return a.nextSibling&&H(a.nextSibling)?p:a.nextSibling},jb:function(a){return(a=B(a))?a[1]:p},Ta:function(a){if(pa[b.a.u(a)]){var d=a.firstChild;if(d){do if(1===d.nodeType){var c;c=d.firstChild;var e=p;if(c){do if(e)e.push(c);else if(B(c)){var f=$(c,m);f?c=f:e=[c]}else H(c)&&
(e=[c]);while(c=c.nextSibling)}if(c=e){e=d.nextSibling;for(f=0;f<c.length;f++)e?a.insertBefore(c[f],e):a.appendChild(c[f])}}while(d=d.nextSibling)}}}};b.b("virtualElements",b.e);b.b("virtualElements.allowedBindings",b.e.I);b.b("virtualElements.emptyNode",b.e.Y);b.b("virtualElements.insertAfter",b.e.Pa);b.b("virtualElements.prepend",b.e.Va);b.b("virtualElements.setDomNodeChildren",b.e.N);b.J=function(){this.Ha={}};b.a.extend(b.J.prototype,{nodeHasBindings:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind")!=
p;case 8:return b.e.jb(a)!=p;default:return r}},getBindings:function(a,b){var c=this.getBindingsString(a,b);return c?this.parseBindingsString(c,b,a):p},getBindingsString:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind");case 8:return b.e.jb(a);default:return p}},parseBindingsString:function(a,d,c){try{var e;if(!(e=this.Ha[a])){var f=this.Ha,g,h="with($context){with($data||{}){return{"+b.g.ba(a)+"}}}";g=new Function("$context","$element",h);e=f[a]=g}return e(d,c)}catch(k){j(Error("Unable to parse bindings.\nMessage: "+
k+";\nBindings value: "+a))}}});b.J.instance=new b.J;b.b("bindingProvider",b.J);b.c={};b.z=function(a,d,c){d?(b.a.extend(this,d),this.$parentContext=d,this.$parent=d.$data,this.$parents=(d.$parents||[]).slice(0),this.$parents.unshift(this.$parent)):(this.$parents=[],this.$root=a,this.ko=b);this.$data=a;c&&(this[c]=a)};b.z.prototype.createChildContext=function(a,d){return new b.z(a,this,d)};b.z.prototype.extend=function(a){var d=b.a.extend(new b.z,this);return b.a.extend(d,a)};b.eb=function(a,d){if(2==
arguments.length)b.a.f.set(a,"__ko_bindingContext__",d);else return b.a.f.get(a,"__ko_bindingContext__")};b.Fa=function(a,d,c){1===a.nodeType&&b.e.Ta(a);return X(a,d,c,m)};b.Ea=function(a,b){(1===b.nodeType||8===b.nodeType)&&Z(a,b,m)};b.Da=function(a,b){b&&(1!==b.nodeType&&8!==b.nodeType)&&j(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node"));b=b||x.document.body;Y(a,b,m)};b.ja=function(a){switch(a.nodeType){case 1:case 8:var d=b.eb(a);if(d)return d;
if(a.parentNode)return b.ja(a.parentNode)}return I};b.pb=function(a){return(a=b.ja(a))?a.$data:I};b.b("bindingHandlers",b.c);b.b("applyBindings",b.Da);b.b("applyBindingsToDescendants",b.Ea);b.b("applyBindingsToNode",b.Fa);b.b("contextFor",b.ja);b.b("dataFor",b.pb);var fa={"class":"className","for":"htmlFor"};b.c.attr={update:function(a,d){var c=b.a.d(d())||{},e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]),g=f===r||f===p||f===I;g&&a.removeAttribute(e);8>=b.a.Z&&e in fa?(e=fa[e],g?a.removeAttribute(e):
a[e]=f):g||a.setAttribute(e,f.toString());"name"===e&&b.a.ab(a,g?"":f.toString())}}};b.c.checked={init:function(a,d,c){b.a.n(a,"click",function(){var e;if("checkbox"==a.type)e=a.checked;else if("radio"==a.type&&a.checked)e=a.value;else return;var f=d(),g=b.a.d(f);"checkbox"==a.type&&g instanceof Array?(e=b.a.i(g,a.value),a.checked&&0>e?f.push(a.value):!a.checked&&0<=e&&f.splice(e,1)):b.g.ea(f,c,"checked",e,m)});"radio"==a.type&&!a.name&&b.c.uniqueName.init(a,u(m))},update:function(a,d){var c=b.a.d(d());
"checkbox"==a.type?a.checked=c instanceof Array?0<=b.a.i(c,a.value):c:"radio"==a.type&&(a.checked=a.value==c)}};b.c.css={update:function(a,d){var c=b.a.d(d());if("object"==typeof c)for(var e in c){var f=b.a.d(c[e]);b.a.da(a,e,f)}else c=String(c||""),b.a.da(a,a.__ko__cssValue,r),a.__ko__cssValue=c,b.a.da(a,c,m)}};b.c.enable={update:function(a,d){var c=b.a.d(d());c&&a.disabled?a.removeAttribute("disabled"):!c&&!a.disabled&&(a.disabled=m)}};b.c.disable={update:function(a,d){b.c.enable.update(a,function(){return!b.a.d(d())})}};
b.c.event={init:function(a,d,c,e){var f=d()||{},g;for(g in f)(function(){var f=g;"string"==typeof f&&b.a.n(a,f,function(a){var g,n=d()[f];if(n){var q=c();try{var s=b.a.L(arguments);s.unshift(e);g=n.apply(e,s)}finally{g!==m&&(a.preventDefault?a.preventDefault():a.returnValue=r)}q[f+"Bubble"]===r&&(a.cancelBubble=m,a.stopPropagation&&a.stopPropagation())}})})()}};b.c.foreach={Sa:function(a){return function(){var d=a(),c=b.a.ua(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:b.C.oa};
b.a.d(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:b.C.oa}}},init:function(a,d){return b.c.template.init(a,b.c.foreach.Sa(d))},update:function(a,d,c,e,f){return b.c.template.update(a,b.c.foreach.Sa(d),c,e,f)}};b.g.Q.foreach=r;b.e.I.foreach=m;b.c.hasfocus={init:function(a,d,c){function e(e){a.__ko_hasfocusUpdating=m;var f=a.ownerDocument;"activeElement"in
f&&(e=f.activeElement===a);f=d();b.g.ea(f,c,"hasfocus",e,m);a.__ko_hasfocusUpdating=r}var f=e.bind(p,m),g=e.bind(p,r);b.a.n(a,"focus",f);b.a.n(a,"focusin",f);b.a.n(a,"blur",g);b.a.n(a,"focusout",g)},update:function(a,d){var c=b.a.d(d());a.__ko_hasfocusUpdating||(c?a.focus():a.blur(),b.r.K(b.a.Ba,p,[a,c?"focusin":"focusout"]))}};b.c.html={init:function(){return{controlsDescendantBindings:m}},update:function(a,d){b.a.ca(a,d())}};var da="__ko_withIfBindingData";Q("if");Q("ifnot",r,m);Q("with",m,r,function(a,
b){return a.createChildContext(b)});b.c.options={update:function(a,d,c){"select"!==b.a.u(a)&&j(Error("options binding applies only to SELECT elements"));for(var e=0==a.length,f=b.a.V(b.a.fa(a.childNodes,function(a){return a.tagName&&"option"===b.a.u(a)&&a.selected}),function(a){return b.k.q(a)||a.innerText||a.textContent}),g=a.scrollTop,h=b.a.d(d());0<a.length;)b.A(a.options[0]),a.remove(0);if(h){c=c();var k=c.optionsIncludeDestroyed;"number"!=typeof h.length&&(h=[h]);if(c.optionsCaption){var l=y.createElement("option");
b.a.ca(l,c.optionsCaption);b.k.T(l,I);a.appendChild(l)}d=0;for(var n=h.length;d<n;d++){var q=h[d];if(!q||!q._destroy||k){var l=y.createElement("option"),s=function(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c},v=s(q,c.optionsValue,q);b.k.T(l,b.a.d(v));q=s(q,c.optionsText,v);b.a.cb(l,q);a.appendChild(l)}}h=a.getElementsByTagName("option");d=k=0;for(n=h.length;d<n;d++)0<=b.a.i(f,b.k.q(h[d]))&&(b.a.bb(h[d],m),k++);a.scrollTop=g;e&&"value"in c&&ea(a,b.a.ua(c.value),m);b.a.ub(a)}}};
b.c.options.sa="__ko.optionValueDomData__";b.c.selectedOptions={init:function(a,d,c){b.a.n(a,"change",function(){var e=d(),f=[];b.a.o(a.getElementsByTagName("option"),function(a){a.selected&&f.push(b.k.q(a))});b.g.ea(e,c,"value",f)})},update:function(a,d){"select"!=b.a.u(a)&&j(Error("values binding applies only to SELECT elements"));var c=b.a.d(d());c&&"number"==typeof c.length&&b.a.o(a.getElementsByTagName("option"),function(a){var d=0<=b.a.i(c,b.k.q(a));b.a.bb(a,d)})}};b.c.style={update:function(a,
d){var c=b.a.d(d()||{}),e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]);a.style[e]=f||""}}};b.c.submit={init:function(a,d,c,e){"function"!=typeof d()&&j(Error("The value for a submit binding must be a function"));b.a.n(a,"submit",function(b){var c,h=d();try{c=h.call(e,a)}finally{c!==m&&(b.preventDefault?b.preventDefault():b.returnValue=r)}})}};b.c.text={update:function(a,d){b.a.cb(a,d())}};b.e.I.text=m;b.c.uniqueName={init:function(a,d){if(d()){var c="ko_unique_"+ ++b.c.uniqueName.ob;b.a.ab(a,
c)}}};b.c.uniqueName.ob=0;b.c.value={init:function(a,d,c){function e(){h=r;var e=d(),f=b.k.q(a);b.g.ea(e,c,"value",f)}var f=["change"],g=c().valueUpdate,h=r;g&&("string"==typeof g&&(g=[g]),b.a.P(f,g),f=b.a.Ga(f));if(b.a.Z&&("input"==a.tagName.toLowerCase()&&"text"==a.type&&"off"!=a.autocomplete&&(!a.form||"off"!=a.form.autocomplete))&&-1==b.a.i(f,"propertychange"))b.a.n(a,"propertychange",function(){h=m}),b.a.n(a,"blur",function(){h&&e()});b.a.o(f,function(c){var d=e;b.a.Ob(c,"after")&&(d=function(){setTimeout(e,
0)},c=c.substring(5));b.a.n(a,c,d)})},update:function(a,d){var c="select"===b.a.u(a),e=b.a.d(d()),f=b.k.q(a),g=e!=f;0===e&&(0!==f&&"0"!==f)&&(g=m);g&&(f=function(){b.k.T(a,e)},f(),c&&setTimeout(f,0));c&&0<a.length&&ea(a,e,r)}};b.c.visible={update:function(a,d){var c=b.a.d(d()),e="none"!=a.style.display;c&&!e?a.style.display="":!c&&e&&(a.style.display="none")}};b.c.click={init:function(a,d,c,e){return b.c.event.init.call(this,a,function(){var a={};a.click=d();return a},c,e)}};b.v=function(){};b.v.prototype.renderTemplateSource=
function(){j(Error("Override renderTemplateSource"))};b.v.prototype.createJavaScriptEvaluatorBlock=function(){j(Error("Override createJavaScriptEvaluatorBlock"))};b.v.prototype.makeTemplateSource=function(a,d){if("string"==typeof a){d=d||y;var c=d.getElementById(a);c||j(Error("Cannot find template with ID "+a));return new b.l.h(c)}if(1==a.nodeType||8==a.nodeType)return new b.l.O(a);j(Error("Unknown template type: "+a))};b.v.prototype.renderTemplate=function(a,b,c,e){a=this.makeTemplateSource(a,e);
return this.renderTemplateSource(a,b,c)};b.v.prototype.isTemplateRewritten=function(a,b){return this.allowTemplateRewriting===r?m:this.makeTemplateSource(a,b).data("isRewritten")};b.v.prototype.rewriteTemplate=function(a,b,c){a=this.makeTemplateSource(a,c);b=b(a.text());a.text(b);a.data("isRewritten",m)};b.b("templateEngine",b.v);var qa=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi,ra=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;b.za={vb:function(a,
d,c){d.isTemplateRewritten(a,c)||d.rewriteTemplate(a,function(a){return b.za.Gb(a,d)},c)},Gb:function(a,b){return a.replace(qa,function(a,e,f,g,h,k,l){return W(l,e,b)}).replace(ra,function(a,e){return W(e,"\x3c!-- ko --\x3e",b)})},kb:function(a){return b.s.ra(function(d,c){d.nextSibling&&b.Fa(d.nextSibling,a,c)})}};b.b("__tr_ambtns",b.za.kb);b.l={};b.l.h=function(a){this.h=a};b.l.h.prototype.text=function(){var a=b.a.u(this.h),a="script"===a?"text":"textarea"===a?"value":"innerHTML";if(0==arguments.length)return this.h[a];
var d=arguments[0];"innerHTML"===a?b.a.ca(this.h,d):this.h[a]=d};b.l.h.prototype.data=function(a){if(1===arguments.length)return b.a.f.get(this.h,"templateSourceData_"+a);b.a.f.set(this.h,"templateSourceData_"+a,arguments[1])};b.l.O=function(a){this.h=a};b.l.O.prototype=new b.l.h;b.l.O.prototype.text=function(){if(0==arguments.length){var a=b.a.f.get(this.h,"__ko_anon_template__")||{};a.Aa===I&&a.ia&&(a.Aa=a.ia.innerHTML);return a.Aa}b.a.f.set(this.h,"__ko_anon_template__",{Aa:arguments[0]})};b.l.h.prototype.nodes=
function(){if(0==arguments.length)return(b.a.f.get(this.h,"__ko_anon_template__")||{}).ia;b.a.f.set(this.h,"__ko_anon_template__",{ia:arguments[0]})};b.b("templateSources",b.l);b.b("templateSources.domElement",b.l.h);b.b("templateSources.anonymousTemplate",b.l.O);var O;b.wa=function(a){a!=I&&!(a instanceof b.v)&&j(Error("templateEngine must inherit from ko.templateEngine"));O=a};b.va=function(a,d,c,e,f){c=c||{};(c.templateEngine||O)==I&&j(Error("Set a template engine before calling renderTemplate"));
f=f||"replaceChildren";if(e){var g=N(e);return b.j(function(){var h=d&&d instanceof b.z?d:new b.z(b.a.d(d)),k="function"==typeof a?a(h.$data,h):a,h=T(e,f,k,h,c);"replaceNode"==f&&(e=h,g=N(e))},p,{Ka:function(){return!g||!b.a.X(g)},W:g&&"replaceNode"==f?g.parentNode:g})}return b.s.ra(function(e){b.va(a,d,c,e,"replaceNode")})};b.Mb=function(a,d,c,e,f){function g(a,b){U(b,k);c.afterRender&&c.afterRender(b,a)}function h(d,e){k=f.createChildContext(b.a.d(d),c.as);k.$index=e;var g="function"==typeof a?
a(d,k):a;return T(p,"ignoreTargetNode",g,k,c)}var k;return b.j(function(){var a=b.a.d(d)||[];"undefined"==typeof a.length&&(a=[a]);a=b.a.fa(a,function(a){return c.includeDestroyed||a===I||a===p||!b.a.d(a._destroy)});b.r.K(b.a.$a,p,[e,a,h,c,g])},p,{W:e})};b.c.template={init:function(a,d){var c=b.a.d(d());if("string"!=typeof c&&!c.name&&(1==a.nodeType||8==a.nodeType))c=1==a.nodeType?a.childNodes:b.e.childNodes(a),c=b.a.Hb(c),(new b.l.O(a)).nodes(c);return{controlsDescendantBindings:m}},update:function(a,
d,c,e,f){d=b.a.d(d());c={};e=m;var g,h=p;"string"!=typeof d&&(c=d,d=c.name,"if"in c&&(e=b.a.d(c["if"])),e&&"ifnot"in c&&(e=!b.a.d(c.ifnot)),g=b.a.d(c.data));"foreach"in c?h=b.Mb(d||a,e&&c.foreach||[],c,a,f):e?(f="data"in c?f.createChildContext(g,c.as):f,h=b.va(d||a,f,c,a)):b.e.Y(a);f=h;(g=b.a.f.get(a,"__ko__templateComputedDomDataKey__"))&&"function"==typeof g.B&&g.B();b.a.f.set(a,"__ko__templateComputedDomDataKey__",f&&f.pa()?f:I)}};b.g.Q.template=function(a){a=b.g.aa(a);return 1==a.length&&a[0].unknown||
b.g.Eb(a,"name")?p:"This template engine does not support anonymous templates nested within its templates"};b.e.I.template=m;b.b("setTemplateEngine",b.wa);b.b("renderTemplate",b.va);b.a.Ja=function(a,b,c){a=a||[];b=b||[];return a.length<=b.length?S(a,b,"added","deleted",c):S(b,a,"deleted","added",c)};b.b("utils.compareArrays",b.a.Ja);b.a.$a=function(a,d,c,e,f){function g(a,b){t=l[b];w!==b&&(z[a]=t);t.na(w++);M(t.M);s.push(t);A.push(t)}function h(a,c){if(a)for(var d=0,e=c.length;d<e;d++)c[d]&&b.a.o(c[d].M,
function(b){a(b,d,c[d].U)})}d=d||[];e=e||{};var k=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===I,l=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],n=b.a.V(l,function(a){return a.U}),q=b.a.Ja(n,d),s=[],v=0,w=0,B=[],A=[];d=[];for(var z=[],n=[],t,D=0,C,E;C=q[D];D++)switch(E=C.moved,C.status){case "deleted":E===I&&(t=l[v],t.j&&t.j.B(),B.push.apply(B,M(t.M)),e.beforeRemove&&(d[D]=t,A.push(t)));v++;break;case "retained":g(D,v++);break;case "added":E!==I?
g(D,E):(t={U:C.value,na:b.m(w++)},s.push(t),A.push(t),k||(n[D]=t))}h(e.beforeMove,z);b.a.o(B,e.beforeRemove?b.A:b.removeNode);for(var D=0,k=b.e.firstChild(a),H;t=A[D];D++){t.M||b.a.extend(t,ha(a,c,t.U,f,t.na));for(v=0;q=t.M[v];k=q.nextSibling,H=q,v++)q!==k&&b.e.Pa(a,q,H);!t.Ab&&f&&(f(t.U,t.M,t.na),t.Ab=m)}h(e.beforeRemove,d);h(e.afterMove,z);h(e.afterAdd,n);b.a.f.set(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult",s)};b.b("utils.setDomNodeChildrenFromArrayMapping",b.a.$a);b.C=function(){this.allowTemplateRewriting=
r};b.C.prototype=new b.v;b.C.prototype.renderTemplateSource=function(a){var d=!(9>b.a.Z)&&a.nodes?a.nodes():p;if(d)return b.a.L(d.cloneNode(m).childNodes);a=a.text();return b.a.ta(a)};b.C.oa=new b.C;b.wa(b.C.oa);b.b("nativeTemplateEngine",b.C);b.qa=function(){var a=this.Db=function(){if("undefined"==typeof F||!F.tmpl)return 0;try{if(0<=F.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,c,e){e=e||{};2>a&&j(Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later."));
var f=b.data("precompiled");f||(f=b.text()||"",f=F.template(p,"{{ko_with $item.koBindingContext}}"+f+"{{/ko_with}}"),b.data("precompiled",f));b=[c.$data];c=F.extend({koBindingContext:c},e.templateOptions);c=F.tmpl(f,b,c);c.appendTo(y.createElement("div"));F.fragments={};return c};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){y.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(F.tmpl.tag.ko_code=
{open:"__.push($1 || '');"},F.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};b.qa.prototype=new b.v;w=new b.qa;0<w.Db&&b.wa(w);b.b("jqueryTmplTemplateEngine",b.qa)}"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?L(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],L):L(x.ko={});m;
})();
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
(function () { var t = this; var e = t.Backbone; var i = []; var r = i.push; var s = i.slice; var n = i.splice; var a; if (typeof exports !== "undefined") { a = exports } else { a = t.Backbone = {} } a.VERSION = "1.0.0"; var h = t._; if (!h && typeof require !== "undefined") h = require("underscore"); a.$ = t.jQuery || t.Zepto || t.ender || t.$; a.noConflict = function () { t.Backbone = e; return this }; a.emulateHTTP = false; a.emulateJSON = false; var o = a.Events = { on: function (t, e, i) { if (!l(this, "on", t, [e, i]) || !e) return this; this._events || (this._events = {}); var r = this._events[t] || (this._events[t] = []); r.push({ callback: e, context: i, ctx: i || this }); return this }, once: function (t, e, i) { if (!l(this, "once", t, [e, i]) || !e) return this; var r = this; var s = h.once(function () { r.off(t, s); e.apply(this, arguments) }); s._callback = e; return this.on(t, s, i) }, off: function (t, e, i) { var r, s, n, a, o, u, c, f; if (!this._events || !l(this, "off", t, [e, i])) return this; if (!t && !e && !i) { this._events = {}; return this } a = t ? [t] : h.keys(this._events); for (o = 0, u = a.length; o < u; o++) { t = a[o]; if (n = this._events[t]) { this._events[t] = r = []; if (e || i) { for (c = 0, f = n.length; c < f; c++) { s = n[c]; if (e && e !== s.callback && e !== s.callback._callback || i && i !== s.context) { r.push(s) } } } if (!r.length) delete this._events[t] } } return this }, trigger: function (t) { if (!this._events) return this; var e = s.call(arguments, 1); if (!l(this, "trigger", t, e)) return this; var i = this._events[t]; var r = this._events.all; if (i) c(i, e); if (r) c(r, arguments); return this }, stopListening: function (t, e, i) { var r = this._listeners; if (!r) return this; var s = !e && !i; if (typeof e === "object") i = this; if (t) (r = {})[t._listenerId] = t; for (var n in r) { r[n].off(e, i, this); if (s) delete this._listeners[n] } return this } }; var u = /\s+/; var l = function (t, e, i, r) { if (!i) return true; if (typeof i === "object") { for (var s in i) { t[e].apply(t, [s, i[s]].concat(r)) } return false } if (u.test(i)) { var n = i.split(u); for (var a = 0, h = n.length; a < h; a++) { t[e].apply(t, [n[a]].concat(r)) } return false } return true }; var c = function (t, e) { var i, r = -1, s = t.length, n = e[0], a = e[1], h = e[2]; switch (e.length) { case 0: while (++r < s) (i = t[r]).callback.call(i.ctx); return; case 1: while (++r < s) (i = t[r]).callback.call(i.ctx, n); return; case 2: while (++r < s) (i = t[r]).callback.call(i.ctx, n, a); return; case 3: while (++r < s) (i = t[r]).callback.call(i.ctx, n, a, h); return; default: while (++r < s) (i = t[r]).callback.apply(i.ctx, e) } }; var f = { listenTo: "on", listenToOnce: "once" }; h.each(f, function (t, e) { o[e] = function (e, i, r) { var s = this._listeners || (this._listeners = {}); var n = e._listenerId || (e._listenerId = h.uniqueId("l")); s[n] = e; if (typeof i === "object") r = this; e[t](i, r, this); return this } }); o.bind = o.on; o.unbind = o.off; h.extend(a, o); var d = a.Model = function (t, e) { var i; var r = t || {}; e || (e = {}); this.cid = h.uniqueId("c"); this.attributes = {}; h.extend(this, h.pick(e, p)); if (e.parse) r = this.parse(r, e) || {}; if (i = h.result(this, "defaults")) { r = h.defaults({}, r, i) } this.set(r, e); this.changed = {}; this.initialize.apply(this, arguments) }; var p = ["url", "urlRoot", "collection"]; h.extend(d.prototype, o, { changed: null, validationError: null, idAttribute: "id", initialize: function () { }, toJSON: function (t) { return h.clone(this.attributes) }, sync: function () { return a.sync.apply(this, arguments) }, get: function (t) { return this.attributes[t] }, escape: function (t) { return h.escape(this.get(t)) }, has: function (t) { return this.get(t) != null }, set: function (t, e, i) { var r, s, n, a, o, u, l, c; if (t == null) return this; if (typeof t === "object") { s = t; i = e } else { (s = {})[t] = e } i || (i = {}); if (!this._validate(s, i)) return false; n = i.unset; o = i.silent; a = []; u = this._changing; this._changing = true; if (!u) { this._previousAttributes = h.clone(this.attributes); this.changed = {} } c = this.attributes, l = this._previousAttributes; if (this.idAttribute in s) this.id = s[this.idAttribute]; for (r in s) { e = s[r]; if (!h.isEqual(c[r], e)) a.push(r); if (!h.isEqual(l[r], e)) { this.changed[r] = e } else { delete this.changed[r] } n ? delete c[r] : c[r] = e } if (!o) { if (a.length) this._pending = true; for (var f = 0, d = a.length; f < d; f++) { this.trigger("change:" + a[f], this, c[a[f]], i) } } if (u) return this; if (!o) { while (this._pending) { this._pending = false; this.trigger("change", this, i) } } this._pending = false; this._changing = false; return this }, unset: function (t, e) { return this.set(t, void 0, h.extend({}, e, { unset: true })) }, clear: function (t) { var e = {}; for (var i in this.attributes) e[i] = void 0; return this.set(e, h.extend({}, t, { unset: true })) }, hasChanged: function (t) { if (t == null) return !h.isEmpty(this.changed); return h.has(this.changed, t) }, changedAttributes: function (t) { if (!t) return this.hasChanged() ? h.clone(this.changed) : false; var e, i = false; var r = this._changing ? this._previousAttributes : this.attributes; for (var s in t) { if (h.isEqual(r[s], e = t[s])) continue; (i || (i = {}))[s] = e } return i }, previous: function (t) { if (t == null || !this._previousAttributes) return null; return this._previousAttributes[t] }, previousAttributes: function () { return h.clone(this._previousAttributes) }, fetch: function (t) { t = t ? h.clone(t) : {}; if (t.parse === void 0) t.parse = true; var e = this; var i = t.success; t.success = function (r) { if (!e.set(e.parse(r, t), t)) return false; if (i) i(e, r, t); e.trigger("sync", e, r, t) }; R(this, t); return this.sync("read", this, t) }, save: function (t, e, i) { var r, s, n, a = this.attributes; if (t == null || typeof t === "object") { r = t; i = e } else { (r = {})[t] = e } if (r && (!i || !i.wait) && !this.set(r, i)) return false; i = h.extend({ validate: true }, i); if (!this._validate(r, i)) return false; if (r && i.wait) { this.attributes = h.extend({}, a, r) } if (i.parse === void 0) i.parse = true; var o = this; var u = i.success; i.success = function (t) { o.attributes = a; var e = o.parse(t, i); if (i.wait) e = h.extend(r || {}, e); if (h.isObject(e) && !o.set(e, i)) { return false } if (u) u(o, t, i); o.trigger("sync", o, t, i) }; R(this, i); s = this.isNew() ? "create" : i.patch ? "patch" : "update"; if (s === "patch") i.attrs = r; n = this.sync(s, this, i); if (r && i.wait) this.attributes = a; return n }, destroy: function (t) { t = t ? h.clone(t) : {}; var e = this; var i = t.success; var r = function () { e.trigger("destroy", e, e.collection, t) }; t.success = function (s) { if (t.wait || e.isNew()) r(); if (i) i(e, s, t); if (!e.isNew()) e.trigger("sync", e, s, t) }; if (this.isNew()) { t.success(); return false } R(this, t); var s = this.sync("delete", this, t); if (!t.wait) r(); return s }, url: function () { var t = h.result(this, "urlRoot") || h.result(this.collection, "url") || U(); if (this.isNew()) return t; return t + (t.charAt(t.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id) }, parse: function (t, e) { return t }, clone: function () { return new this.constructor(this.attributes) }, isNew: function () { return this.id == null }, isValid: function (t) { return this._validate({}, h.extend(t || {}, { validate: true })) }, _validate: function (t, e) { if (!e.validate || !this.validate) return true; t = h.extend({}, this.attributes, t); var i = this.validationError = this.validate(t, e) || null; if (!i) return true; this.trigger("invalid", this, i, h.extend(e || {}, { validationError: i })); return false } }); var v = ["keys", "values", "pairs", "invert", "pick", "omit"]; h.each(v, function (t) { d.prototype[t] = function () { var e = s.call(arguments); e.unshift(this.attributes); return h[t].apply(h, e) } }); var g = a.Collection = function (t, e) { e || (e = {}); if (e.url) this.url = e.url; if (e.model) this.model = e.model; if (e.comparator !== void 0) this.comparator = e.comparator; this._reset(); this.initialize.apply(this, arguments); if (t) this.reset(t, h.extend({ silent: true }, e)) }; var m = { add: true, remove: true, merge: true }; var y = { add: true, merge: false, remove: false }; h.extend(g.prototype, o, { model: d, initialize: function () { }, toJSON: function (t) { return this.map(function (e) { return e.toJSON(t) }) }, sync: function () { return a.sync.apply(this, arguments) }, add: function (t, e) { return this.set(t, h.defaults(e || {}, y)) }, remove: function (t, e) { t = h.isArray(t) ? t.slice() : [t]; e || (e = {}); var i, r, s, n; for (i = 0, r = t.length; i < r; i++) { n = this.get(t[i]); if (!n) continue; delete this._byId[n.id]; delete this._byId[n.cid]; s = this.indexOf(n); this.models.splice(s, 1); this.length--; if (!e.silent) { e.index = s; n.trigger("remove", n, this, e) } this._removeReference(n) } return this }, set: function (t, e) { e = h.defaults(e || {}, m); if (e.parse) t = this.parse(t, e); if (!h.isArray(t)) t = t ? [t] : []; var i, s, a, o, u, l; var c = e.at; var f = this.comparator && c == null && e.sort !== false; var d = h.isString(this.comparator) ? this.comparator : null; var p = [], v = [], g = {}; for (i = 0, s = t.length; i < s; i++) { if (!(a = this._prepareModel(t[i], e))) continue; if (u = this.get(a)) { if (e.remove) g[u.cid] = true; if (e.merge) { u.set(a.attributes, e); if (f && !l && u.hasChanged(d)) l = true } } else if (e.add) { p.push(a); a.on("all", this._onModelEvent, this); this._byId[a.cid] = a; if (a.id != null) this._byId[a.id] = a } } if (e.remove) { for (i = 0, s = this.length; i < s; ++i) { if (!g[(a = this.models[i]).cid]) v.push(a) } if (v.length) this.remove(v, e) } if (p.length) { if (f) l = true; this.length += p.length; if (c != null) { n.apply(this.models, [c, 0].concat(p)) } else { r.apply(this.models, p) } } if (l) this.sort({ silent: true }); if (e.silent) return this; for (i = 0, s = p.length; i < s; i++) { (a = p[i]).trigger("add", a, this, e) } if (l) this.trigger("sort", this, e); return this }, reset: function (t, e) { e || (e = {}); for (var i = 0, r = this.models.length; i < r; i++) { this._removeReference(this.models[i]) } e.previousModels = this.models; this._reset(); this.add(t, h.extend({ silent: true }, e)); if (!e.silent) this.trigger("reset", this, e); return this }, push: function (t, e) { t = this._prepareModel(t, e); this.add(t, h.extend({ at: this.length }, e)); return t }, pop: function (t) { var e = this.at(this.length - 1); this.remove(e, t); return e }, unshift: function (t, e) { t = this._prepareModel(t, e); this.add(t, h.extend({ at: 0 }, e)); return t }, shift: function (t) { var e = this.at(0); this.remove(e, t); return e }, slice: function (t, e) { return this.models.slice(t, e) }, get: function (t) { if (t == null) return void 0; return this._byId[t.id != null ? t.id : t.cid || t] }, at: function (t) { return this.models[t] }, where: function (t, e) { if (h.isEmpty(t)) return e ? void 0 : []; return this[e ? "find" : "filter"](function (e) { for (var i in t) { if (t[i] !== e.get(i)) return false } return true }) }, findWhere: function (t) { return this.where(t, true) }, sort: function (t) { if (!this.comparator) throw new Error("Cannot sort a set without a comparator"); t || (t = {}); if (h.isString(this.comparator) || this.comparator.length === 1) { this.models = this.sortBy(this.comparator, this) } else { this.models.sort(h.bind(this.comparator, this)) } if (!t.silent) this.trigger("sort", this, t); return this }, sortedIndex: function (t, e, i) { e || (e = this.comparator); var r = h.isFunction(e) ? e : function (t) { return t.get(e) }; return h.sortedIndex(this.models, t, r, i) }, pluck: function (t) { return h.invoke(this.models, "get", t) }, fetch: function (t) { t = t ? h.clone(t) : {}; if (t.parse === void 0) t.parse = true; var e = t.success; var i = this; t.success = function (r) { var s = t.reset ? "reset" : "set"; i[s](r, t); if (e) e(i, r, t); i.trigger("sync", i, r, t) }; R(this, t); return this.sync("read", this, t) }, create: function (t, e) { e = e ? h.clone(e) : {}; if (!(t = this._prepareModel(t, e))) return false; if (!e.wait) this.add(t, e); var i = this; var r = e.success; e.success = function (s) { if (e.wait) i.add(t, e); if (r) r(t, s, e) }; t.save(null, e); return t }, parse: function (t, e) { return t }, clone: function () { return new this.constructor(this.models) }, _reset: function () { this.length = 0; this.models = []; this._byId = {} }, _prepareModel: function (t, e) { if (t instanceof d) { if (!t.collection) t.collection = this; return t } e || (e = {}); e.collection = this; var i = new this.model(t, e); if (!i._validate(t, e)) { this.trigger("invalid", this, t, e); return false } return i }, _removeReference: function (t) { if (this === t.collection) delete t.collection; t.off("all", this._onModelEvent, this) }, _onModelEvent: function (t, e, i, r) { if ((t === "add" || t === "remove") && i !== this) return; if (t === "destroy") this.remove(e, r); if (e && t === "change:" + e.idAttribute) { delete this._byId[e.previous(e.idAttribute)]; if (e.id != null) this._byId[e.id] = e } this.trigger.apply(this, arguments) } }); var _ = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"]; h.each(_, function (t) { g.prototype[t] = function () { var e = s.call(arguments); e.unshift(this.models); return h[t].apply(h, e) } }); var w = ["groupBy", "countBy", "sortBy"]; h.each(w, function (t) { g.prototype[t] = function (e, i) { var r = h.isFunction(e) ? e : function (t) { return t.get(e) }; return h[t](this.models, r, i) } }); var b = a.View = function (t) { this.cid = h.uniqueId("view"); this._configure(t || {}); this._ensureElement(); this.initialize.apply(this, arguments); this.delegateEvents() }; var x = /^(\S+)\s*(.*)$/; var E = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"]; h.extend(b.prototype, o, { tagName: "div", $: function (t) { return this.$el.find(t) }, initialize: function () { }, render: function () { return this }, remove: function () { this.$el.remove(); this.stopListening(); return this }, setElement: function (t, e) { if (this.$el) this.undelegateEvents(); this.$el = t instanceof a.$ ? t : a.$(t); this.el = this.$el[0]; if (e !== false) this.delegateEvents(); return this }, delegateEvents: function (t) { if (!(t || (t = h.result(this, "events")))) return this; this.undelegateEvents(); for (var e in t) { var i = t[e]; if (!h.isFunction(i)) i = this[t[e]]; if (!i) continue; var r = e.match(x); var s = r[1], n = r[2]; i = h.bind(i, this); s += ".delegateEvents" + this.cid; if (n === "") { this.$el.on(s, i) } else { this.$el.on(s, n, i) } } return this }, undelegateEvents: function () { this.$el.off(".delegateEvents" + this.cid); return this }, _configure: function (t) { if (this.options) t = h.extend({}, h.result(this, "options"), t); h.extend(this, h.pick(t, E)); this.options = t }, _ensureElement: function () { if (!this.el) { var t = h.extend({}, h.result(this, "attributes")); if (this.id) t.id = h.result(this, "id"); if (this.className) t["class"] = h.result(this, "className"); var e = a.$("<" + h.result(this, "tagName") + ">").attr(t); this.setElement(e, false) } else { this.setElement(h.result(this, "el"), false) } } }); a.sync = function (t, e, i) { var r = k[t]; h.defaults(i || (i = {}), { emulateHTTP: a.emulateHTTP, emulateJSON: a.emulateJSON }); var s = { type: r, dataType: "json" }; if (!i.url) { s.url = h.result(e, "url") || U() } if (i.data == null && e && (t === "create" || t === "update" || t === "patch")) { s.contentType = "application/json"; s.data = JSON.stringify(i.attrs || e.toJSON(i)) } if (i.emulateJSON) { s.contentType = "application/x-www-form-urlencoded"; s.data = s.data ? { model: s.data } : {} } if (i.emulateHTTP && (r === "PUT" || r === "DELETE" || r === "PATCH")) { s.type = "POST"; if (i.emulateJSON) s.data._method = r; var n = i.beforeSend; i.beforeSend = function (t) { t.setRequestHeader("X-HTTP-Method-Override", r); if (n) return n.apply(this, arguments) } } if (s.type !== "GET" && !i.emulateJSON) { s.processData = false } if (s.type === "PATCH" && window.ActiveXObject && !(window.external && window.external.msActiveXFilteringEnabled)) { s.xhr = function () { return new ActiveXObject("Microsoft.XMLHTTP") } } var o = i.xhr = a.ajax(h.extend(s, i)); e.trigger("request", e, o, i); return o }; var k = { create: "POST", update: "PUT", patch: "PATCH", "delete": "DELETE", read: "GET" }; a.ajax = function () { return a.$.ajax.apply(a.$, arguments) }; var S = a.Router = function (t) { t || (t = {}); if (t.routes) this.routes = t.routes; this._bindRoutes(); this.initialize.apply(this, arguments) }; var $ = /\((.*?)\)/g; var T = /(\(\?)?:\w+/g; var H = /\*\w+/g; var A = /[\-{}\[\]+?.,\\\^$|#\s]/g; h.extend(S.prototype, o, { initialize: function () { }, route: function (t, e, i) { if (!h.isRegExp(t)) t = this._routeToRegExp(t); if (h.isFunction(e)) { i = e; e = "" } if (!i) i = this[e]; var r = this; a.history.route(t, function (s) { var n = r._extractParameters(t, s); i && i.apply(r, n); r.trigger.apply(r, ["route:" + e].concat(n)); r.trigger("route", e, n); a.history.trigger("route", r, e, n) }); return this }, navigate: function (t, e) { a.history.navigate(t, e); return this }, _bindRoutes: function () { if (!this.routes) return; this.routes = h.result(this, "routes"); var t, e = h.keys(this.routes); while ((t = e.pop()) != null) { this.route(t, this.routes[t]) } }, _routeToRegExp: function (t) { t = t.replace(A, "\\$&").replace($, "(?:$1)?").replace(T, function (t, e) { return e ? t : "([^/]+)" }).replace(H, "(.*?)"); return new RegExp("^" + t + "$") }, _extractParameters: function (t, e) { var i = t.exec(e).slice(1); return h.map(i, function (t) { return t ? decodeURIComponent(t) : null }) } }); var I = a.History = function () { this.handlers = []; h.bindAll(this, "checkUrl"); if (typeof window !== "undefined") { this.location = window.location; this.history = window.history } }; var N = /^[#\/]|\s+$/g; var P = /^\/+|\/+$/g; var O = /msie [\w.]+/; var C = /\/$/; I.started = false; h.extend(I.prototype, o, { interval: 50, getHash: function (t) { var e = (t || this).location.href.match(/#(.*)$/); return e ? e[1] : "" }, getFragment: function (t, e) { if (t == null) { if (this._hasPushState || !this._wantsHashChange || e) { t = this.location.pathname; var i = this.root.replace(C, ""); if (!t.indexOf(i)) t = t.substr(i.length) } else { t = this.getHash() } } return t.replace(N, "") }, start: function (t) { if (I.started) throw new Error("Backbone.history has already been started"); I.started = true; this.options = h.extend({}, { root: "/" }, this.options, t); this.root = this.options.root; this._wantsHashChange = this.options.hashChange !== false; this._wantsPushState = !!this.options.pushState; this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState); var e = this.getFragment(); var i = document.documentMode; var r = O.exec(navigator.userAgent.toLowerCase()) && (!i || i <= 7); this.root = ("/" + this.root + "/").replace(P, "/"); if (r && this._wantsHashChange) { this.iframe = a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow; this.navigate(e) } if (this._hasPushState) { a.$(window).on("popstate", this.checkUrl) } else if (this._wantsHashChange && "onhashchange" in window && !r) { a.$(window).on("hashchange", this.checkUrl) } else if (this._wantsHashChange) { this._checkUrlInterval = setInterval(this.checkUrl, this.interval) } this.fragment = e; var s = this.location; var n = s.pathname.replace(/[^\/]$/, "$&/") === this.root; if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !n) { this.fragment = this.getFragment(null, true); this.location.replace(this.root + this.location.search + "#" + this.fragment); return true } else if (this._wantsPushState && this._hasPushState && n && s.hash) { this.fragment = this.getHash().replace(N, ""); this.history.replaceState({}, document.title, this.root + this.fragment + s.search) } if (!this.options.silent) return this.loadUrl() }, stop: function () { a.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl); clearInterval(this._checkUrlInterval); I.started = false }, route: function (t, e) { this.handlers.unshift({ route: t, callback: e }) }, checkUrl: function (t) { var e = this.getFragment(); if (e === this.fragment && this.iframe) { e = this.getFragment(this.getHash(this.iframe)) } if (e === this.fragment) return false; if (this.iframe) this.navigate(e); this.loadUrl() || this.loadUrl(this.getHash()) }, loadUrl: function (t) { var e = this.fragment = this.getFragment(t); var i = h.any(this.handlers, function (t) { if (t.route.test(e)) { t.callback(e); return true } }); return i }, navigate: function (t, e) { if (!I.started) return false; if (!e || e === true) e = { trigger: e }; t = this.getFragment(t || ""); if (this.fragment === t) return; this.fragment = t; var i = this.root + t; if (this._hasPushState) { this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, i) } else if (this._wantsHashChange) { this._updateHash(this.location, t, e.replace); if (this.iframe && t !== this.getFragment(this.getHash(this.iframe))) { if (!e.replace) this.iframe.document.open().close(); this._updateHash(this.iframe.location, t, e.replace) } } else { return this.location.assign(i) } if (e.trigger) this.loadUrl(t) }, _updateHash: function (t, e, i) { if (i) { var r = t.href.replace(/(javascript:|#).*$/, ""); t.replace(r + "#" + e) } else { t.hash = "#" + e } } }); a.history = new I; var j = function (t, e) { var i = this; var r; if (t && h.has(t, "constructor")) { r = t.constructor } else { r = function () { return i.apply(this, arguments) } } h.extend(r, i, e); var s = function () { this.constructor = r }; s.prototype = i.prototype; r.prototype = new s; if (t) h.extend(r.prototype, t); r.__super__ = i.prototype; return r }; d.extend = g.extend = S.extend = b.extend = I.extend = j; var U = function () { throw new Error('A "url" property or function must be specified') }; var R = function (t, e) { var i = e.error; e.error = function (r) { if (i) i(t, r, e); t.trigger("error", t, r, e) } } }).call(this);
/*
//@ sourceMappingURL=backbone-min.map
*/
//     Sitecore.js 1.0.1
//     (c) 2013 Sitecore

//This code will add the console object for all Browsers
//From https://raw.github.com/h5bp/html5-boilerplate/master/js/plugins.js
// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {};
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());
// Place any jQuery/helper plugins in here.
(function () {
  //use strict to prevent use of Obsolete Functions
  "use strict";
  //keep a reference of the root (could be usefull for frame)
  var root = this,
    _Speak = {}//root.Sitecore.Speak // Map over Sitecore in case of overwrite
    ,
    __SPEAKDEBUG = root.__SITECOREDEBUG || false,
    __info = {}, __sc = window._sc // Map over the _sc in case of overwrite
    ,
    Speak, _sc, models, views, data, cmds, fctry;
  
  if (typeof root.Sitecore != "undefined") {
    _Speak = root.Sitecore.Speak;
  } else {
    root.Sitecore = {};
    root.Sitecore["Speak"] = {};
  }
  //define the global variable that will be used inside the core
  //support for COMMONJS, it will export the Sitecore global.
  if (typeof exports !== 'undefined') {
    _sc = Speak = exports;
  } else {
    //if we are not on COMMONJS style,
    //then we use the root (generally the window object) to store sitecore
    _sc = Speak = root.Sitecore.Speak = root._sc = {};
  }

  //keep Local reference for deps
  var $ = root.jQuery,
    _ = root._,
    ko = root.ko;

  //if we use require and underscore is not loaded, we try to load it
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');
  //if we use require and backbone is not loaded, we try to load it
  if (!Backbone && (typeof require !== 'undefined')) _ = require('backbone');
  //if we use require and ko is not loaded, we try to load it
  if (!ko && (typeof require !== 'undefined')) ko = require('knockout');

  //version of Sitecore
  _sc.VERSION = "1.0.1";
  //Define the API Entry Point
  _sc.__SPEAKDEBUG = __SPEAKDEBUG;
  _sc.__info = __info;

  _sc.Pipelines = {};
  _sc.Factories = {};
  _sc.Commands = {};

  _sc.Behaviors = {};
  _sc.Definitions = {
    Models: {},
    Views: {},
    Data: {}
  };

  models = _sc.Definitions.Models;
  views = _sc.Definitions.Views;
  data = _sc.Definitions.Data;
  cmds = _sc.Commands;
  fctry = _sc.Factories;

  _sc.Web = {};
  _sc.SiteInfo = {};
  _sc.SiteInfo.virtualFolder = "/";

  _sc.debug = function () {
    if (__SPEAKDEBUG) {
      switch (arguments.length) {
      case 1:
        console.log(arguments[0]);
        return;
      case 2:
        console.log(arguments[0], arguments[1]);
        return;
      case 3:
        console.log(arguments[0], arguments[1], arguments[2]);
      case 4:
        console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
        return;
      }
      console.log(arguments);
    }
  };
  //KO stuffs  
  var myPartialBindingProvider = function (initialExclusionSelector, waitingSelector, componentSelector) {
    var result = new ko.bindingProvider(),
      originalHasBindings = result.nodeHasBindings;

    result.exclusionSelector = initialExclusionSelector;

    result.nodeHasBindings = function (node) {

      if (node.nodeType !== 8 && !$(node).is(result.exclusionSelector) && $(node).closest(waitingSelector).length === 0) {
        return originalHasBindings.call(this, node);
      }
      if (node.nodeType === 8) {
        if (!node.registered) {
          return originalHasBindings.call(this, node);
        }
      }
      return false;
    };

    result.getBindings = function (node, bindingContext) {
      // Only getBindings if context is right. Context must match the component
      var contextNode = bindingContext.$root.$el,
        componentNode = $(node).closest(componentSelector);

      if (contextNode && componentNode.length) {
        var contextNodeMatchesComponent = contextNode.is(componentNode);
        
        if (!contextNodeMatchesComponent) {
          return null;
        }
      }
      
      return ko.bindingProvider.prototype.getBindings.apply(this, arguments);
    };

    return result;
  };

  //to prevent registering the same component multiple times,
  //we add the class data-sc-registered at each component which have been data-bound.
  ko.bindingProvider.instance = new myPartialBindingProvider(".data-sc-registered", ".data-sc-waiting", "[data-sc-id]");

  //Readonly binding usefull for basic controls
  ko.bindingHandlers.readonly = {
    update: function (el, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if (value) {
        el.setAttribute("readOnly", true);
      } else {
        el.removeAttribute("readOnly");
      }
    }
  };

  root.dialogClose = function (value) {
    _sc.trigger("sc-frame-message", value);
  };

  root.receiveMessage = function (value, caller) {
    _sc.trigger("sc-frame-message", value, caller);
  };

  root.getParameterByName = function (query) {
    query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"),
    regexS = "[\\?&]" + query + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(window.location.href);

    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
  };
// This is a plugin, constructed from parts of Backbone.js and John Resig's inheritance script.
// (See http://backbonejs.org, http://ejohn.org/blog/simple-javascript-inheritance/)
// No credit goes to me as I did absolutely nothing except patch these two together.
(function (Backbone) {
  Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };
  
  var ctor = function () {}, inherits = function (parent, protoProps, staticProps) {
      var child, _super = parent.prototype,
        fnTest = /xyz/.test(function () {
          xyz;
        }) ? /\b_super\b/ : /.*/;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function () {
          parent.apply(this, arguments);
        };
      }

      // Inherit class (static) properties from parent.
      _.extend(child, parent);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) {
        _.extend(child.prototype, protoProps);
        //isLayout check if the propery is a composited
        var isLayout = protoProps["nestedlayout"] || child.prototype.nestedlayout;
        //this is done in order to differenciate the view and the model
        var isModel = (child.prototype.modelType === Backbone.Model);
        //We check if the model you are extending has a render, afterRender and beforeRender method. We need that in order to execute
        //the beforeRender, afterRender, render of the behaviors
        if (!isModel && !protoProps["render"] && !isLayout) {
          protoProps["render"] = function () {};
        }
        if (!isModel && !protoProps["afterRender"] && !isLayout) {
          protoProps["afterRender"] = function () {};
        }
        if (!isModel && !protoProps["beforeRender"] && !isLayout) {
          protoProps["beforeRender"] = function () {};
        }
        // Copy the properties over onto the new prototype
        for (var name in protoProps) {
          // Check if we're overwriting an existing function
          if (typeof protoProps[name] == "function" && typeof _super[name] == "function" && fnTest.test(protoProps[name])) {
            child.prototype[name] = (function (name, fn) {
              return function () {
                var tmp = this._super;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
              };
            })(name, protoProps[name]);
          }
          //if it is not a model and not a composite and if the we have a render, beforeRender or afterRender method
          //we add to the current method the ability to loop throught the object and execute the appropriate behavior "function"
          if (!isLayout && !isModel && (name === "render" || name === "beforeRender" || name === "afterRender")) {
            child.prototype[name] = (function (name, fn) {
              return function () {
                //we execute the normal function
                fn.apply(this, arguments);
                //if we have behavior we execute the function from the behavior
                if (this.hasBehavior) {
                  var behaviors = [];

                  if (name === "render") {
                    behaviors = this.behaviorsRender;
                  }
                  if (name === "afterRender") {
                    behaviors = this.behaviorsAfterRender;
                  }
                  if (name === "beforeRender") {
                    behaviors = this.behaviorsBeforeRender;
                  }

                  _.each(behaviors, function (init) {
                    init.apply(this, arguments);
                  }, this);
                }
              }
            })(name, protoProps[name]);
          }
        }
      }

      // Add static properties to the constructor function, if supplied.
      if (staticProps) _.extend(child, staticProps);

      // Correctly set child's `prototype.constructor`.
      child.prototype.constructor = child;

      // Set a convenience property in case the parent's prototype is needed later.
      child.__super__ = parent.prototype;

      return child;
    };
})(Backbone);
/*
models.Model = function (options) {

  //If the model wants to use KO, we prepare the viewModel for future use
  if(this.ko) { this.viewModel = {}; }

  if(this.defaults && options && _.isObject(options)) {
    this.defaults = _.extend(this.defaults, options);
  }

  //If the model wants to use KO and it has some defaults value
  //We create an appropriate viewModel based on the defaults values.
  if(this.ko && this.defaults) {
    //we remove the computed value from the defaults because Computed needs special tricks
    this._removeComputed();
    //we create the viewModel
    this._creatingViewModelFromDefaults();
  }

  if(this.useLocalStorage) {
    this.localStorage = new Sitecore.Definitions.Data.LocalStorage(options.name);
  }
  //We call the basic Backbone Model
  Backbone.Model.apply(this, [options]);

  //If the model wants to use KO
  if(this.ko) {
    //we know set the Computed with the special tricks
    this._setComputed();
    //Befare creating the ViewModel, we remove the function we do not want to be exposed
    //Generally all the base functions
    this._preventDefaultFunction();
    //we create the viewModel which means that as soons as a the Model will be instanciated
    //you will have a viewModel property which is a KO viewModel.
    this._creatingViewModel();
  }
};*/

models.Model = Backbone.Model.extend({
  ko: true,
  //As you know Javascript is a semi-dynamic language.
  //But sometimes you need to know th type of your object
  //Sure we have instanceOf or the toString() method
  //But as we are using inheritance a lot, sometimes the chain is broken
  //and this method won't work
  //So in place of relying on these 2 methods, I am setting a referene to the Backbone.Model
  //to modelType. This will allow you to write code like
  //if(this.modelType === Backbone.Model) than you know the Base Class is a Backbone.Model
  //Please AVOID this type of check as much as possible !!!!
  modelType: Backbone.Model,
  set: function () {
    var options = arguments[2];
    if (!arguments[2]) {
      arguments[2] = {};
    }
    var isReallySiletn = _.clone(arguments[2].silent);
    var force = arguments[2].force;
    //arguments[2].silent = true; //postpone the change

    Backbone.Model.prototype["set"].apply(this, arguments);

    if (options && options.computed) {
      this.computed = this.computed || {};
      this.computed[arguments[0]] = options;
    }
    if (!_.isObject(arguments[0]) && (!options || !options.local)) {
      this.updateViewModel(arguments[0], force);
    }
    if (_.isObject(arguments[0]) && (!options || !options.local)) {
      //full object to simple object
      var values = arguments[0];
      var keys = _.keys(values);
      _.each(keys, function (key) {
        this.updateViewModel(key);
      }, this);
    }
    /*if(!isReallySiletn) {
        this.change();
    }*/
  },
  constructor: function (options) {
    //If the model wants to use KO, we prepare the viewModel for future use
    if (this.ko) {
      this.viewModel = {};
    }

    if (this.defaults && options && _.isObject(options)) {
      this.defaults = _.extend(this.defaults, options);
    }

    //If the model wants to use KO and it has some defaults value
    //We create an appropriate viewModel based on the defaults values.
    if (this.ko && this.defaults) {
      //we remove the computed value from the defaults because Computed needs special tricks
      this._removeComputed();
      //we create the viewModel
      this._creatingViewModelFromDefaults();
    }

    if (this.useLocalStorage) {
      this.localStorage = new Speak.Definitions.Data.LocalStorage(options.name);
    }
    //We call the basic Backbone Model
    Backbone.Model.apply(this, [options]);

    //If the model wants to use KO
    if (this.ko) {
      //we know set the Computed with the special tricks
      this._setComputed();
      //Befare creating the ViewModel, we remove the function we do not want to be exposed
      //Generally all the base functions
      this._preventDefaultFunction();
      //we create the viewModel which means that as soons as a the Model will be instanciated
      //you will have a viewModel property which is a KO viewModel.
      this._creatingViewModel();
    }
  },
  /*
  initialize: function() {

  },*/
  _preventDefaultFunction: function () {
    var defaultFuncFromModel = ["_creatingViewModel", "_creatingViewModelFromDefaults", "_setComputed", "_findAppropriateAndApplyBinding", "_removeComputed", "_super", "_preventDefaultFunction", "_validate", "bind", "change", "changedAttributes", "clear", "clone", "constructor", "destroy", "escape", "fetch", "get", "has", "hasChanged", "initialize", "isNew", "isValid", "observable", "off", "on", "parse", "previous", "previousAttributes", "save", "set", "toJSON", "trigger", "unbind", "unset", "url"];
    var functionsFromModel = _.functions(this);
    this.applicableFunctionsFromModel = _.reject(functionsFromModel, function (funcName) {
      return (_.indexOf(defaultFuncFromModel, funcName) >= 0);
    });
  },
  _creatingViewModelFromDefaults: function () {
    var model = this,
      keys = _.keys(this.defaults);

    /*first we assign none computed value*/
    _.each(keys, function (key) {
      this._findAppropriateAndApplyBinding(key, this.defaults);
    }, this);
    /*computed Values should be runned after*/
    //_.each(keys, this._registerComputed, this);
    /*Subscribin should be runned after all value in viewModel are set*/
    //_.each(keys, this._registerSubscribe, this);

    var extendedModelBinding = {};

    if (this.applicableFunctionsFromModel) {
      _.each(this.applicableFunctionsFromModel, function (funcName) {
        extendedModelBinding[funcName] = function () {
          model[funcName].apply(model, arguments);
        };
      });
    }
    _.extend(this.viewModel, extendedModelBinding);
  },
  _removeComputed: function () {
    var keys = _.keys(this.defaults),
      defaults = this.defaults,
      model = this,
      computeds = [];

    _.each(keys, function (key) {
      var value = defaults[key];
      if (_.isObject(value) && value.computed) {
        //this is a computed value
        var clone = _.clone(value);
        var computed = {
          computed: true,
          read: clone.read
        };

        if (clone.write) {
          computed = _.extend(computed, {
            write: clone.write
          });
        }
        if (clone.owner) {
          computed = _.extend(computed, {
            owner: clone.owner
          });
        }
        computeds.push({
          key: key,
          value: clone.value,
          computed: computed
        });
        //delete defaults
        delete defaults[key];
      }
    });
    model.computeds = computeds;
  },
  _setComputed: function () {
    _.each(this.computeds, function (computed) {
      var value = computed.value || "";
      var option = _.extend(computed.computed, {
        local: true
      });
      this.set(computed.key, value, computed.computed, option);
    }, this);
  },
  updateViewModel: function (key, force) {
    if ((this.viewModel && !this.viewModel[key]) || force) {
      this._findAppropriateAndApplyBinding(key, this.attributes, force);
    }
  },
  _findAppropriateAndApplyBinding: function (key, extractFrom, force) {
    var vm = this.viewModel || {};
    if (!vm[key] || force) {
      if (_.isArray(extractFrom[key])) {
        if (extractFrom[key].length > 0 && extractFrom[key][0] && extractFrom[key][0].modelType === Backbone.Model) {
          var obsArr = [];
          _.each(extractFrom[key], function (model) {
            obsArr.push(model.viewModel);
          });
          vm[key] = ko.observableArray(obsArr);
          vm[key].nested = true;
        } else {
          vm[key] = ko.observableArray(extractFrom[key]);
        }
      } else {
        if (extractFrom[key] && extractFrom[key].constructor && _.isObject(extractFrom[key].constructor.__super__) && extractFrom[key].ko) {
          vm[key] = extractFrom[key].viewModel;
          vm[key].nested = true;
        } else {
          if (!this.computed || !this.computed[key]) {
            vm[key] = ko.observable(extractFrom[key]);
          }
        }
      }
      this._registerComputed(key);
      this._registerSubscribe(key);
    }
  },
  _registerSubscribe: function (key) {
    var model = this,
      subscriptions = this.subscriptions || [],
      viewModel = this.viewModel || {};

    if (!viewModel[key].nested) {
      if (!viewModel[key].isComputed) { //one way binding for computed
        model.on("change:" + key, function () {
          if (_.isArray(model.get(key)) && model.get(key).length > 0 && model.get(key)[0] && model.get(key)[0].modelType && model.get(key)[0].modelType === Backbone.Model) {
            var viewModelarr = [];
            _.each(model.get(key), function (chil) {
              viewModelarr.push(chil.viewModel);
            });
            viewModel[key](viewModelarr);
          } else {
            viewModel[key](model.get(key));
          }
        });
      }

      if (viewModel[key].subscribe) {
        subscriptions[key] = viewModel[key].subscribe(function (newValue) {
          model.set(key, newValue);
        });
      }
    }
  },
  _registerComputed: function (key) {
    var model = this,
      viewModel = this.viewModel || {};

    if (model.computed && model.computed[key]) {
      if (this.computed[key]["write"] && !this.computed[key]["owner"]) {
        model.computed[key]["owner"] = this.viewModel;
      }
      var comp = _.pick(model.computed[key], 'write', 'owner', 'read');

      if (!comp.write) {
        viewModel[key] = ko.computed(comp.read, this.viewModel); //be carefully you can only value already defined
      } else {
        viewModel[key] = ko.computed(comp); //be carefully you can only value already defined
      }
      viewModel[key].isComputed = true;
    }
  },
  _creatingViewModel: function () {
    var keys = _.keys(this.attributes);

    /*first we assign none computed value*/
    _.each(keys, function (key) {
      this._findAppropriateAndApplyBinding(key, this.attributes);
    }, this);
    /*computed Values should be runned after*/
    _.each(keys, this._registerComputed, this);
    /*Subscribin should be runned after all value in viewModel are set*/
    _.each(keys, this._registerSubscribe, this);
  }
});

models.Model.extend = Backbone.Model.extend;

views.View = function (options) {
  if (options) {
    this.app = options.app ? options.app : "No parent for this app";
    delete options.app;
  }
  
  var self = this;
  if (options && options.behaviors) {
    _.each(options.behaviors.split(" "), function (behav) {
      self.addBehavior(Speak.Behaviors[behav]);
    });
  }

  Backbone.View.apply(this, [options]);

  if (this.model && this["$el"] && !this.model.viewModel["$el"]) {
    this.model.viewModel.$el = this.$el;
  }

  if (this.model && this["app"] && !this.model.viewModel["app"]) {
    this.model.viewModel.app = this.app;
  }

  // It looks like a duplicate of backbone view functions
  //if (this.hasBehavior) {
  //  _.each(this.behaviors, function (init) {
  //    init.call(this);
  //  }, this);
  //}

  this.setupFunctionWhichCouldBeDataBound();
  this.sync();
};

_.extend(Speak.Definitions.Views.View.prototype, Backbone.View.prototype, {
  /*the goal of this is to delegate the function from backbone to the binding in order to call function from the view and from the model with data-bind*/
  setupFunctionWhichCouldBeDataBound: function () {
    var defaultFuncs = ["$", "_configure", "_ensureElement", "setupFunctionWhichCouldBeDataBound", "applyBindingsIfApplicable", "bind", "constructor", "delegateEvents", "initialize", "make", "off", "on", "remove", "render", "setElement", "trigger", "unbind", "undelegateEvents", "afterRender", "beforeRender", "sync"];
    var functions = _.functions(this);
    this.applicableFunctionsFromView = _.reject(functions, function (funcName) {
      return (_.indexOf(defaultFuncs, funcName) >= 0);
    });

    var view = this;
    _.each(this.applicableFunctionsFromView, function (funcName) {
      if (this.model && this.model.viewModel[funcName]) {
        throw "Conflicted names between Model and View, please provide different names: " + funcName;
      }
      if (this.model) {
        this.model.viewModel[funcName] = function () {
          return view[funcName].apply(view, arguments);
        };
      }
    }, this);
  },
  sync: function () {
    if (this.model && this.model.ko) {
      if (__SPEAKDEBUG) {
        console.log("Applying Binding for the element which has the data-sc-id: " + this.$el.data("sc-id") + ". The viewModel you are trying to apply is:", this.model.viewModel);
      }

      ko.applyBindings(this.model.viewModel ? this.model.viewModel : this.model, this.$el.get(0));
    }
  },
  listen: {

  }
});

views.View.extend = Backbone.View.extend;

// The basic application type
Speak.Definitions.App = Backbone.Model.extend({
  appId: undefined,
  modelType: "application",
  initialize: function (options) {
    this.Controls = [];
    if (this.appId) {
      this.localStorage = new Speak.Definitions.Data.LocalStorage(this.appId);
    } else {
      this.localStorage = "you need to provide a appID in order to use localStorage";
    }
  },
  // Create an run the application
  run: function (name, id, mainapp) {
    var app = _sc.Factories.createApp(name, id, mainapp, this);

    // If the 'initializated' method is defined, run it
    if (typeof this.initialized != "undefined") {
      this.initialized();
    }

    app.ScopedEl.find("[data-sc-cloak]").removeAttr("data-sc-cloak");
    app.trigger("app:loaded");

    return app;
  },
  insertControl: function (def, callback, options) {
    var that = this;

    $.post("/api/rendering", def, function (html) {
      that.insertMarkups(html, name, callback, options);
    });
  },
  insertRendering: function (itemId, options, callback) {
    var item,
      that = this,
      selector,
      $el,
      ajaxOptions = options["ajax"]|| {},
      defaultOptions = {
        database: "core",
        path: "/sitecore/shell/api/sitecore/Layout/RenderItem"
      },
      cb = callback,
      jqxhr,
      successCb,
      errorCb;

    var lang = $('meta[data-sc-name=sitecoreLanguage]').attr("data-sc-content");
    
    if (ajaxOptions && ajaxOptions["success"]) {
      successCb = ajaxOptions["success"];
    }

    errorCb = ajaxOptions["error"];
    
    if (_.isFunction(options)) {
      cb = options;
    } else if (options) {
      defaultOptions = _.extend(defaultOptions, options);
      selector = options.selector ? options.selector : undefined;
      $el = options.$el ? options.$el : undefined;
    }

    if (!defaultOptions.name) {
      defaultOptions.name = _.uniqueId("subapp_");
    }

    var requestUrl = defaultOptions.path + "?sc_itemid=" + itemId + "&sc_database=" + defaultOptions.database + ((lang) ? "&sc_lang=" + lang : "");
    
    jqxhr=$.ajax({
      url: requestUrl,
      method:"GET",
      beforeSend:ajaxOptions["beforeSend"],
      success: function (data, textStatus, jqXHR) {
        if (successCb) {
          successCb.call(data, textStatus, jqXHR);
        }
        that.insertMarkups(data, defaultOptions.name, {
          selector: selector,
          $el: $el
        }, cb);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
          _sc.Helpers.session.unauthorized();
          return;
        }

        if (errorCb) {
          errorCb.call(jqXHR, textStatus, errorThrown);
        }
      },
      complete: ajaxOptions["complete"]
    });

    return jqxhr;
  },
  insertMarkups: function (html, name, options, cb) {
    var defaults = {
      prepend: false,
      selector: undefined,
      parent: undefined,
      $el: undefined
    },
      options = _.extend(defaults, options),
      markup = "<div id='" + name + "' data-sc-app style='display:none;'>" + html + "</div>",
      whereToInject;

    if (options.$el) {
      whereToInject = options.$el;
    } else if (options.selector) {
      whereToInject = $(options.selector);
    } else {
      whereToInject = $("body");
    }

    if (options.prepend) {
      whereToInject.prepend(markup);
    } else {
      whereToInject.append(markup);
    }

    _sc.load(window, whereToInject.find("#" + name), function (app) {
      app.ScopedEl.show();

      if (cb) {
        cb(app);
      }
    });
  },
  destroy: function () {
    var app = this;

    _.each(app.Controls, function (control) {
      control.view.$el.data("sc-app", null); //deregister the control
      control.view.$el.removeClass("data-sc-registered");
    });
    //delete sub controls
    for (var param in app) {
      if (app[param] instanceof Speak.Definitions.App) {
        _.each(app[param].Controls, function (control) {
          control.view.$el.data("sc-app", null); //deregister the control
          control.view.$el.removeClass("data-sc-registered");
        });
      }
    }
    //now delete the app and clean up bindings
    _.each(app.Controls, function (control) {
      ko.cleanNode(control["view"].$el.get(0));
      delete control["model"];
      delete control["view"];
    });

    for (var param in app) {
      delete app[param];
    }

    return undefined;
    //delete Sitecore[appName]; //delete the name
  },
  closeDialog: function (returnValue) {
    window.top.returnValue = returnValue;
    window.top.dialogClose(returnValue);
  },
  sendMessage: function (returnValue) {
    window.top.receiveMessage(returnValue, root.getParameterByName("sp"));
  }
  //dropped as we have separate control for that
  /*,
  openDialog: function (url, args, features) {
    return window.showModalDialog(url, args, features);
  }*/
});

Speak.Definitions.App.extend = Backbone.View.extend;

_.extend(Speak, Backbone.Events);

_.extend(views.View.prototype,
    {
      addBehavior: function (protoProps) {
        this.hasBehavior = true;
        this.behaviors = this.behaviors || [];
        this.behaviorsBeforeRender = this.behaviorsBeforeRender || [];
        this.behaviorsAfterRender = this.behaviorsAfterRender || [];
        this.behaviorsRender = this.behaviorsRender || [];

        if (!protoProps.initialize && !protoProps.afterRender && !protoProps.render && !protoProps.beforeRender) {
          throw "behavior should have an initialize or an after Render method";
        }

        if (protoProps.events) {
          if (this.events) {
            _.extend(this.events, protoProps.events);
          } else {
            this.events = protoProps.events;
          }
        }
        if (protoProps.initialize) {
          this.behaviors.push(protoProps.initialize);
        }
        if (protoProps.afterRender) {
          this.behaviorsAfterRender.push(protoProps.afterRender);
        }
        if (protoProps.render) {
          this.behaviorsRender.push(protoProps.render);
        }
        if (protoProps.beforeRender) {
          this.behaviorsBeforeRender.push(protoProps.beforeRender);
        }

        var behavior = _.omit(protoProps, 'initialize', 'events', 'afterRender', 'render', 'beforeRender');

        _.extend(this, behavior);
      }
    });

_.extend(_sc, {
  /**
   *  destroy the app and unregister all the bindings
   *  @param {app} Sitecore.Definitions.Application you want to destroy
   */
  destroy: function(app) {
    if( !app && !app.destroy ) { throw "you need an app to be destroy"};
    var name = app.name;
    app.destroy();
    delete Speak[name];
  },
  /**
   *  destroy the app and unregister all the bindings
   *  @param {deep} removing all Sitecore variables from the global scope
   *  @returns the Sitecore library
   */
  noConflict: function(deep) {
    if (root._sc === Speak) {
      root._sc = __sc;
    }

    if (deep && root.Speak === Speak) {
      root.Speak = _Speak;
    }

    return Speak;
  }
});

_.extend(_sc, {
  /**
   * load dependencies you need to the PageCode
   * @params {global} generally the windows object
   */
  load: function (global, scopedEL, appLoaded) {
    // collect dependencies from html attributes - dependencies can be separated by commas
    var depsPageCode = [],
      allDepsArray = [],
      firstLoad = false;
    if (!scopedEL) {
      scopedEL = $("html");
      firstLoad = true;
    }

    $(scopedEL).find("[data-sc-require]").each(function () {
      var $depEl = $(this);

      if (!$depEl.is('[data-sc-app]') && $depEl.attr("type") !== "text/x-sitecore-pagecode") {
        $.each($depEl.data("sc-require").split(","), function (i, e) {
          if (_.indexOf(allDepsArray, e) < 0) {
            allDepsArray.push(e);
          }
        });
      }
    });

    if (window.__speak_config && window.__speak_config.useBundle) {
      var allDeps = window.location.origin + "/-/speak/v1/bundles/bundle.js?c=1&n=1&f=" + allDepsArray.join(",");
      depsPageCode.push(allDeps);
    } else {
      depsPageCode = depsPageCode.concat(allDepsArray);
    }

    // override require.js define() to collect sub-dependencies
    var subdeps = [];

    //save the old one
    var _oldDefinedFunction = global.__sc_define;

    global.__sc_define = function (name, deps, callback) {
      if (typeof name == "string") {
        subdeps.push(name);
      }

      if (_oldDefinedFunction)
        _oldDefinedFunction(name, deps, callback);
    };

    $(scopedEL).find("script[type='text/x-sitecore-pagecode']").each(function () {
      global.__sc_define($(this).attr("data-sc-require"));
    });
    
    // load dependencies from html attributes
    require(depsPageCode, function () {
      // find the page code
      var $pageCode = $(scopedEL).find("script[type='text/x-sitecore-pagecode']"),
        $page = $(scopedEL),
        pageCodeSrc = $pageCode.attr("data-sc-require"),
        behaviorsFromPagecode = $pageCode.data("sc-behaviors"),
        pageCode = null;

      $page.attr("data-sc-behaviors", behaviorsFromPagecode);

      var runPageCode = function () {
        if (subdeps.length == 0) {
          // no dependencies - instantiate the page code and run it
          global.__sc_define = _oldDefinedFunction;
          var instance = new pageCode();
          if (appLoaded) {
            appLoaded(instance.run(scopedEL.attr("id"), scopedEL.attr("id")));
          } else {
            instance.run();
          }
          if (firstLoad) {
            _sc.Helpers.overlay.loadOverlays(instance);
          }
        } else {
          // subdependencies found - run recursively
          var t = subdeps;
          subdeps = [];
          _sc.debug("Requiring files: ", t);
          require(t, runPageCode);
        }
      };

      // define function to be called recursively until no subdependencies are collected
      var run = function () {
        if (subdeps.length === 0) {
          // if there is an app, load and run it
          if (pageCodeSrc) {

            _sc.debug("Requiring page code: ", [pageCodeSrc]);

            require([pageCodeSrc], function (pc) {
              pageCode = pc;
              runPageCode();
            });

          } else {
            // no pagecode - run default
            global.__sc_define = _oldDefinedFunction;
            var app;

            if (firstLoad) {
              app = Speak.Factories.createApp();

              _sc.Helpers.overlay.loadOverlays(app);
              // If the 'initializated' method is defined, run it
              if (typeof app.initialized != "undefined") {
                app.initialized();
              }
            } else {
              app = Speak.Factories.createApp(scopedEL.attr("id"), scopedEL.attr("id"));
            }

            app.ScopedEl.find("[data-sc-cloak]").removeAttr("data-sc-cloak");

            if (firstLoad) {
              app.trigger("app:loaded");
            }

            if (appLoaded) {
              appLoaded(app);
            }
          }
        } else {
          // subdependencies found - run recursively
          var t = subdeps;

          subdeps = [];
          _sc.debug("Requiring files: ", t);
          require(t, run);
        }
      };

      if (window.__speak_config && window.__speak_config.useBundle) {
        require(allDepsArray, function () {
          run();
        });
      } else {
        run();
      }
    });
  }
});
_.extend(cmds, {
  /**
   * resovle the property name in the global Object
   * @params {propertyName} property we will try to resolve
   * return the value of the property
   */
  resolve: function (propertyName) {
    if(!_.isString(propertyName)) { throw "provied a correct Path to resolve"; }

    var parts = propertyName.split('.');

    var property = root || window;
    for (var n = 0; n < parts.length; n++) {
      property = property[parts[n]];
        if (property == null) { throw "Reference '" + propertyName + "' not found"; }
    }

    return property;
  },
  /**
   * execute some command available in the Speak.Commands namespace 
   * @params {commandName} the name of the command
   * @params {context} the context you want to pass to the command
   */
  executeCommand: function (commandName, context) {
    if (!commandName || !_.isString(commandName)) { throw "cannot execute command without commandName"; }

    var command = cmds.getCommand(commandName);

    if (command.canExecute(context)) {
      command.execute(context);
    }
  },
  /**
   * getCommand avialable
   * @params {commandName} the command you want to retrieve
   * @returns the command
   */
  getCommand: function (commandName) {
    return cmds.resolve(commandName);
  }
});
var scInit = function() {

  var scAttrs = this._scAttrs;

  _.each(scAttrs, function(attr) {
    if(attr["value"] && attr["value"].indexOf("$el.") !== -1) {
      var value,
          path = attr["value"].substring("$el.".length); 

      if(path.indexOf(":") !== -1) {

        var paths = path.split(":");

        if(paths.length === 2) {

          var valueFromDOM = this.$el[paths[0]](paths[1]);

          if(typeof valueFromDOM !== 'undefined') {
            this.model.set(attr["name"], valueFromDOM);  
          } else {
            //we check if there is a default values
            if(attr["defaultValue"]) { //we fallback to the default value if there is one
              this.model.set(attr["name"], attr["defaultValue"]);  
            }
          }
        }
      } else {
        this.model.set(attr["name"], this.$el[path]());
      }
    }
  }, this);

  _.each(scAttrs, function(attr) {
    if(attr["on"]) {
      this.model.on("change:" + attr["name"], this[attr["on"]], this);
    }
  }, this);
};

var _scInitDefaultValueFromLocalStorage = function() {
  if(this._scAttrs) {
    _.each(this._scAttrs, function(attr) {
      var keys = _.keys(attr);
      var valFromLocalStorage = this.localStorage.get(attr["name"]);
      if(valFromLocalStorage) {
        this.set(attr["name"], valFromLocalStorage)
      } else {
        if(keys.indexOf("defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
          this.set(attr["name"], null);
        } else if(keys.indexOf("defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
          this.set(attr["name"], attr["value"]);  
        } else if(keys.indexOf("defaultValue") > -1) {
          this.set(attr["name"], attr["defaultValue"]);
        } else {
          this.set(attr["name"], undefined);
        }
      }
    }, this);     
  }
}

var scDefaultValue = function () {
  if (this._scAttrs) {
    _.each(this._scAttrs, function (attr) {
      var keys = _.keys(attr);

      if (_.indexOf(keys, "defaultValue") === -1 && attr["value"] && attr["value"].indexOf("$el.") !== -1) {
        this.set(attr["name"], null);
      } else if (_.indexOf(keys, "defaultValue") === -1 && attr["value"].indexOf("$el.") === -1) {
        this.set(attr["name"], attr["value"]);
      } else if (_.indexOf(keys, "defaultValue") > -1) {
        this.set(attr["name"], attr["defaultValue"]);
      } else {
        this.set(attr["name"], undefined);
      }
    }, this);
  }
};

var localStoragetSet = function(model) {
  var baseModel = model;
  return function() {
    baseModel.prototype["set"].apply(this, arguments);

    var options = arguments[2];

    if(_.isObject(arguments[0]) && (!options || !options.local)) {
      //full object to simple object
      var values = arguments[0];
      var keys = _.keys(values);
      _.each(keys, function(key) {
        this.localStorage.set(key, values[key]);
      }, this);
    }
    if(!_.isObject(arguments[0]) && (!options || !options.computed)) {
      this.localStorage.set(arguments[0], arguments[1]);
    }
  };
};

_.extend(fctry, {
  /**
   * createBehavior will add behavior in the Speak.Behaviors namespace
   * @params {name} the name of your behavior
   * @params {behavior} the object you want to turn as a behavior
   * @returns the behavior
   * Changed by ANB on 14.02.04
   * Proviusly the code was throwing an error if the behavior existed, 
   * but since it can happen that our pages try to load teh same behavior (as abehavior rendering or as a required file)
   * than I have checked if the behavior exists, it doesn't add it but it write it on the console.
   */
  createBehavior: function(name, behavior) {

    _sc.Behaviors = _sc.Behaviors || { };

    if (!_sc.Behaviors[name]) {
      _sc.Behaviors[name] = behavior;
    } else {
      _sc.debug("You are trying to create twice the behaviour " + name);  
    }

    return _sc.Behaviors[name];
  },

   /**
   * createComponent, base API to create simple Component
   * @params: {
   *  name: String - "Name of the Control",
   *  selector: String - "css class that will help Speak to register approriate Component"
   *  attrs: [{ }] - "array of object which can define the default value and the value"
   *  initialize: funct - The function that will be exected during the Initialize Time of the Run Method
   *  functions: { } - "the function that will be attached to the component"
   * }
   *          
   */
  createBaseComponent: function(obj) {
    if(!obj.name || !obj.selector) { throw "provide a name and/or a selector"; }

    var componentName = obj.name
      , selector = obj.selector
      , attrs = obj.attributes
      , initialize = obj.initialize
      , base = obj.base
      , based = ["attributes", "name", "selector", "base", "plugin", "initialize", "listenTo", "_scInitFromObject", "extendModel", "_scInit", "_scInitDefaultValue"]
      , functions = _.omit(obj, based)
      , baseModel = models.Model
      , baseView = views.View
      , baseComponent
      , isLocalStorage = obj.localStorage
      , extendModel = obj.extendModel || { }
      , collection = obj.collection
      , exposed;

    if(base) {
      baseComponent = _.find(_sc.Components, function(comp) { return comp.type === base; });
    }

    if(baseComponent) {
      baseModel = baseComponent.model;
      baseView = baseComponent.view;
    }

    if(isLocalStorage) {
      extendModel = _.extend(extendModel, {
        constructor: function () {
          baseModel.apply(this, arguments);
          this._scInitDefaultValueFromLocalStorage();
        },
        set: localStoragetSet(baseModel),
        useLocalStorage: true 
      });
    } else {
      extendModel = _.extend(extendModel, {
        constructor: function() {
          baseModel.apply(this, arguments);
          this._scInitDefaultValue();
        }
      });
    }
    
    var ComponentModel = baseModel.extend(extendModel);

    var ComponentView = baseView.extend({
      initialize: function () {
        _sc.debug("initialize - " + componentName);
        this._super();
        if (this.model.componentName != componentName) {
          return;
        }
        if(this._scInitFromObject) {
          this._scInit();
          this._scInitFromObject();
        } else {
          this._scInit();
        }
      }
    });

    ComponentModel = ComponentModel.extend({
      _scAttrs: attrs,
      _scInitDefaultValue: scDefaultValue,
      _scInitDefaultValueFromLocalStorage: _scInitDefaultValueFromLocalStorage
    });

    exposed = _.extend(functions, {
      _scAttrs: attrs,
      _scInit: scInit,
      _scInitFromObject: initialize
    });

    if(obj["listenTo"]) {
      var listen = {},
          parent = baseView.prototype.listen,
          listenTo = obj["listenTo"],
          listenKeys = _.keys(listenTo);

      _.each(listenKeys, function(key){
        //build the listen
        listen[key + ":$this"] = listenTo[key]
      });
      listen = _.extend(parent, listen);

      ComponentView = _.extend(ComponentView, listen);
    }

    var exposedCollection;
    if(collection) {
      exposedCollection = Backbone.Collection.extend({
        model: collection
      });
    }

    ComponentView = ComponentView.extend(exposed);

    return _sc.Factories.createComponent(componentName, ComponentModel, ComponentView, selector, exposedCollection);    
  },
  /**
   * createComponent will create a component inside the Speak.Components namespace
   * @param {type} string which defines the namespace
   * @param {model}
   * @param {view}
   * @param {el} the selector
   * @param {collection} optionnal, if you want a collection in your component
   * @returns a component
   */
  createComponent: function(type, model, view, el, collection) {
    var component;

    if(!_.isString(type) || !model || !view || !_.isString(el)) { throw "please provide a correct: type (str), model, view and el (html class or id)";}

    _sc.Components = _sc.Components || [];
    _sc.Definitions.Models[type] = model;
    _sc.Definitions.Views[type] = view;

    if(collection) { _sc.Definitions.Collections[type] = collection; }

    _.each(_sc.Components, function(component) {
      if(component.el === el) {  throw "you are trying to add compoment with the same el (.class or #id)"; }
    });

    component = {
        type: type,
        model: model,
        view: view,
        el: el,
        collection: collection
    };

    _sc.Components.push(component);

    return component;
  },
  /**
   * Creating an application object
   * @param {name} the name of your application
   * @param {id} the #id
   * @param {mainApp} the root app
   * @param {app} the current app
   * @returns an application object
   */
  createApp: function(name, id, mainApp, app) {
    var context = { };

    if(_.isObject(name)) {
      context = name;
      _sc.Pipelines.Application.execute(context);
      return context.current;
    } else {
      context.name = name;
      context.id = id;
      context.mainApp = mainApp;
      context.app = app;
      context.aborted = false;

      _sc.Pipelines.Application.execute(context);
      return context.current;
    }
  },
  /**
   * Creating an application object
   * @param {pageUniqueId}
   * @param {id} the #id
   * @returns an application object
   */
  createPageCode: function(pageUniqueId, obj) {
    var rs;
    rs = _sc.Definitions.App.extend(obj);
    rs = rs.extend({ appId: pageUniqueId});
    return rs;
  },
  /*
  convert: {
    name:"hasValue",
    convert: function(param, //params from the converter) {
      return "value";
    }
  }
  */
  createBindingConverter: function(convert) {
    if(!convert.name || !convert.convert) { throw "invalid binding converter"; }
    if(_sc.BindingConverters && _sc.BindingConverters[convert.name]) { throw "already a converter with the same name"; }

    _sc.BindingConverters = _sc.BindingConverters || {};
    _sc.BindingConverters[convert.name] = convert.convert;
  }
});

models.ComponentModel = models.Model.extend({
  initialize: function() {
  }
});

models.ControlModel = models.ComponentModel.extend({
  initialize: function() {
    this._super();
    this.set("isVisible", true);
  },
  toggle: function () {
    this.set("isVisible", !this.get("isVisible"));
  }
});

models.BlockModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("width", 0);
    this.set("height", 0);
  }
});

models.InputModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});

models.ButtonBaseModel = models.ControlModel.extend({
  initialize: function() {
    this._super();
    this.set("isEnabled", true);
  }
});
var v = Speak.Definitions.Views;

v.ComponentView = v.View.extend({
  listen: _.extend({}, Speak.Definitions.Views.View.prototype.listen, {
    "set:$this": "set"
  }),
  initialize: function () {
    if (!this.model) {
      throw "Model required in order to instantiate ComponentView";
    }
    if (!this.el) {
      throw "Element required in order to instantiate ComponentView";
    }
    var init = this.$el.data("init");
    if(init) {
      var keys = _.keys(init);
      _.each(keys, function(key) {
          this.set(key, init[key]);
      }, this.model);
    }
  },
  //PDE: really do not like this
  //JC: kinda like it :-)
  set: function(args) {
    if (!args) { return; }
    
    _.each(_.keys(args), function (attributeName) {
      this.model.set(attributeName, args[attributeName]);
    }, this);
  }
});

v.ControlView = v.ComponentView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ComponentView.prototype.listen, {
    "toggle:$this": "toggle",
    "focus:$this": "focus",
    "show:$this": "show",
    "hide:$this": "hide"
  }),
  initialize: function () {
    this._super();
    this.model.set("isVisible", (this.$el.css("display") !== "none"));
  },
  focus: function () {
    this.$el.focus();
  },
  hide: function () {
    this.model.set("isVisible", false);
  },
  show: function() {
    this.model.set("isVisible", true);
  },
  toggle: function () {
    this.model.toggle();
  }                       
});

v.BlockView = v.ControlView.extend({
  initialize: function() {
    this._super();
    this.model.set("width", this.$el.width());
    this.model.set("height", this.$el.height());
  }
});

v.InputView = v.ControlView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ComponentView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),  
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

v.ButtonBaseView = v.ControlView.extend({
  listen: _.extend({}, Speak.Definitions.Views.ControlView.prototype.listen, {
    "enable:$this": "enable",
    "disable:$this": "disable"
  }),
  initialize: function () {
    this._super();
    this.model.set("isEnabled", $(this.el).attr("disabled") != "disabled");
  },
  click: function() {
    if(this.model.get("isEnabled")) {
        var invocation = this.$el.attr("data-sc-click");
        if (invocation) {
          Speak.Helpers.invocation.execute(invocation, { control: this, app: this.app });
        }
        if (this.model._events && this.model._events["click"]) {
          _.each(this.model._events["click"], function (clickHandler) {
            if (clickHandler["callback"] && clickHandler["context"]) {
              clickHandler["callback"].call(clickHandler["context"]);
            }
          });
        }
    }
  },
  disable: function () {
    this.model.set("isEnabled", false);
  },
  enable: function () {
    this.model.set("isEnabled", true);
  }
});

_sc.Definitions.Collections = _sc.Definitions.Collections || [];

fctry.createComponent("ComponentBase", models.ComponentModel, views.ComponentView, ".sc-componentbase");
fctry.createComponent("ControlBase", models.ControlModel, views.ControlView, ".sc-controlbase");
fctry.createComponent("BlockBase", models.BlockModel, views.BlockView, ".sc-blockbase");
fctry.createComponent("ButtonBase", models.ButtonBaseModel, views.ButtonBaseView, ".sc-buttonBase");
fctry.createComponent("InputBase", models.InputModel, views.InputView, ".sc-inputbase");
fctry.createComponent("PageBase", models.Model, views.View, "body");
fctry.createBindingConverter({
  name: "Has",
  convert: function(array) {
    if(array && array[0]) {
      if(_.isArray(array[0])) {
        if(array[0].length === 0) {
          return false;
        }
        return true;
      }
      return true;
    }
    return false;  
    
  }
});
fctry.createBindingConverter({
  name: "Not",
  convert: function(array) {
    return !(array && array[0]);
  }
});
var urlHelper = {
  combine: function () {
    if (arguments.length === 0) {
      return "";
    }

    var result = _.reduce(arguments, function (memo, part) {
      if (part && _.isString(part)) {
        return memo + "/" + _.compact(part.split("/")).join("/");
      }
      return memo;
    });

    if (!result) {
      return "";
    }

    if (result.indexOf("/") === 0) {
      return result;
    }

    return "/" + result;
  },
  isParameterNameAlreadyInUrl: function (uri, parameterName) {
    return uri.indexOf("?" + parameterName + "=") >= 0 || uri.indexOf("&" + parameterName + "=") >= 0;
  },
  addQueryParameters: function (url, parameterObject) {
    var pairs = _.pairs(parameterObject),
      matchEncodedParamNamePattern = "([\\?&])({{param}}=[^&]+)",
      regexMatchEncodedParam,
      result = url;

    _.each(pairs, function (pair) {
      if (urlHelper.isParameterNameAlreadyInUrl(result, pair[0])) {
        regexMatchEncodedParam = new RegExp(matchEncodedParamNamePattern.replace("{{param}}", encodeURIComponent(pair[0])), "i");
        result = result.replace(regexMatchEncodedParam, "$1" + pair[0] + "=" + pair[1]);
      } else {
        result = ~result.indexOf("?") ? result += "&" : result += "?";
        result += encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
      }
    });

    return result;
  },

  // see solution and benchmark here: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values/901144#901144 
  getQueryParameters: function (url) {
    var result = {},
      parts;

    if (!_.isString(url)) {
      return result;
    }

    parts = url.split("?");

    if (parts.length > 1) { //it is a full url
      parts = parts[1].split("&");
    } else { //it is not
      parts = parts[0].split("&");
    }

    if (!parts) {
      return undefined;
    }
    _.each(parts, function (part) {
      var p = part.split("=");
      if (p.length === 2) {
        result[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    });
    //some comment
    return result;
  }
};

var dateHelper = {
  parseISO: function (time) {
    var year,
      month,
      day,
      hours,
      minutes,
      seconds;

    if (!_.isString(time)) {
      return null;
    }

    year = parseInt(time.substr(0, 4), 10);
    // month should start from 0 !!!
    // minus one in order to have the right month
    month = parseInt(time.substr(4, 2), 10) - 1;
    day = parseInt(time.substr(6, 2), 10);

    if (time.indexOf("T") !== 8) {
      return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }

    hours = parseInt(time.substr(9, 2), 10);
    minutes = parseInt(time.substr(11, 2), 10);
    seconds = parseInt(time.substr(13, 2), 10);

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  },
  toISO: function (date) {
    var result;

    if (!_.isDate(date)) {
      return result;
    }

    result = "";
    result += date.getUTCFullYear();
    // month starts form 0
    result += this.ensureTwoDigits(date.getUTCMonth() + 1);
    result += this.ensureTwoDigits(date.getUTCDate());
    result += "T";
    result += this.ensureTwoDigits(date.getUTCHours());
    result += this.ensureTwoDigits(date.getUTCMinutes());
    result += this.ensureTwoDigits(date.getUTCSeconds());

    return result;
  },
  isISO: function (date) {
    var dateValue,
      dateIsString = _.isString(date);

    // Removes the ticks
    if (dateIsString && date.charAt(15) === ":") {
      date = date.substr(0, 15);
    }

    if (!(dateIsString && (date.length == 8 || date.length == 15))) {
      return false;
    }

    dateValue = this.parseISO(date);
    
    if (Object.prototype.toString.call(dateValue) === "[object Date]") {
      // it is a date
      if (isNaN(dateValue.getYear())) {  // d.valueOf() could also work
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  },
  ensureTwoDigits: function (number) {
    return (number < 10) ? "0" + number.toString() : number.toString();
  }
};

var idHelper = {
  isId: function (value) {
    if (!_.isString(value)) {
      return false;
    }

    return (/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i).test(value);
  },
  toId: function (shortId) {
    if (!shortId || shortId.length !== 32) {
      return shortId;
    }
    return "{" + shortId.substr(0, 8) + "-" + shortId.substr(8, 4) + "-" + shortId.substr(12, 4) + "-" + shortId.substr(16, 4) + "-" + shortId.substr(20, 12) + "}";
  },
  toShortId: function (arg) {
    if (!_.isString(arg) || !idHelper.isId(arg)) {
      return undefined;
    }

    return arg.replace(/-|\{|\}/g, "");
  }
};

var stringHelper = {
  endsWith: function (str, value) {
    if (!value || !str) {
      return false;
    }
    return str.lastIndexOf(value) === (str.length - value.length);
  },
  equals: function (lhs, rhs, caseSensitive) {
    if (!_.isString(lhs) || !_.isString(rhs)) {
      return undefined;
    }
    if (caseSensitive) {
      if (!_.isBoolean(caseSensitive)) {
        return undefined;
      }
      return lhs === rhs;
    }
    return lhs.toLowerCase() === rhs.toLowerCase();
  },
  format: function (str) {
    if (!str) {
      return str;
    }
    _.each(arguments, function (arg, i) {
      str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "gi"), arg);
    });

    return str;
  },
  formatByTemplate: function (template, getValueByParamName) {
    /* params description
      * template - string with attribute name surrounded with curly brackets, e.g <span>{{itemName}}</span>
      * getValueByParamName - function which should return value by fieldname
    */
    if (typeof getValueByParamName != "function") {
      return template;
    }
    if (typeof template != "string") {
      return "";
    }
    var patt = /{{(.*?)}}/gi;
    var result = template.match(patt);
    _.each(result, function (param) {
      var fieldname = param.replace("{{", "").replace("}}", "");
      var paramV = getValueByParamName(fieldname);
      if (typeof paramV != "undefined" && paramV != null) {
        template = template.replace(param, paramV);
      }
    });
    return template;
  }
};

var objectHelper = {
  getOwnProperties: function (obj) {
    var result = [],
      proprety;

    for (proprety in obj) {
      if (obj.hasOwnProperty(proprety)) {
        result.push(proprety);
      }
    }
    return result;
  }
};

var invocationHelper = {
  execute: function (invocation, options) {
    if (!invocation) {
      return;
    }

    var i = invocation.indexOf(":");
    if (i <= 0) {
      throw "Invocation is malformed (missing 'handler:')";
    }

    options = options || {};
    var handler = invocation.substr(0, i);
    var target = invocation.substr(i + 1);

    var context = _.extend({}, {
      handler: handler,
      target: target
    }, options);

    _sc.Pipelines.Invoke.execute(context);
  }
};

var overlayHelper = {
  /*
  Example:
  {
    "overlays" : [
      { "command": "insert", "selector": "component:FilterButton", "placement": "after", "html": "<div>Hello World!</div>" }
    ]
  }
  */
  loadOverlays: function (app) {
    var $overlays = $("script[type='text/x-sitecore-overlays']");
    if ($overlays.length == 0) {
      return;
    }

    var urls = $overlays.data("sc-overlays").split('|');
    var parameters = $overlays.data("sc-parameters");

    for (var index in urls) {
      var url = urls[index] + "?speak=" + _sc.VERSION + "&" + parameters;

      $.ajax({
        url: url,
        dataType: "json"
      }).done(function (data) {
        _sc.Helpers.overlay.processOverlays(app, data, urls[index]);
      }).fail(function (err) {
        console.log("Overlay url failed: " + url, err);
      });
    }
  },

  processOverlays: function (app, data, url) {
    var overlays = data.overlays;
    for (var index in overlays) {
      this.processOverlay(app, overlays[index], url);
    }
  },

  processOverlay: function (app, overlay, url) {
    var command = overlay.command;
    var selector = overlay.selector;
    var placement = overlay.placement;
    var html = overlay.html;

    var $el;
    if (selector.substr(0, 10) == "component:") {
      var controlId = selector.substr(10);
      var control = _.find(app.Controls, function (c) {
        return c.name == controlId;
      });
      if (control == null) {
        console.log("Overlay selector not found: " + selector);
        return;
      }
      $el = control.view.$el;
    } else {
      $el = $(selector);
    }

    if ($el == null || $el.length == 0) {
      console.log("Overlay selector not found: " + selector);
      return;
    }

    switch (command) {
    case "insert":
      this.insert(app, $el, placement, html, url);
      break;
    case "remove":
      this.remove(app, $el);
      break;
    case "replace":
      this.replace(app, $el, html, url);
      break;
    default:
      console.log("Unknow overlay command: " + command);
    }

  },

  insert: function (app, $el, placement, html, url) {
    html = "<div data-sc-app id='" + _.uniqueId("overlay-") + "' >" + html;
    html += "</div>";

    var $html = $($.parseHTML(html));

    switch (placement) {
    case "before":
      $html.insertBefore($el);
      break;
    case "after":
      $html.insertAfter($el);
      break;
    case "prepend":
      $el.prepend(html);
      break;
    case "append":
      $el.append(html);
      break;
    default:
      console.log("Unknow overlay insert placement: " + placement);
    }
    _sc.load(window, $html, function (app) {
      _sc.trigger("overlay-loaded", {
        app: app,
        url: url
      });
    });
  },

  remove: function (app, $el) {
    $el.remove();
  },

  replace: function (app, $el, html, url) {
    html = $.parseHTML(html),
    $html = $(html);

    $el.replaceWith($html);

    _sc.load(window, $html, function (app) {
      _sc.trigger("overlay-loaded", {
        app: app,
        url: url
      });
    });
  }
};

var windowHelper = {
  init: function () {
    $(window).resize(function () {
      _sc.trigger("window:resize", $(window).width(), $(window).height());
    });

    /* $(window).unload(...) not supported */
  },

  loaded: function () {
    _sc.trigger("window:loaded");
  }
};

var antiForgeryTokenValue = $("input[name=__RequestVerificationToken]").val();
var antiForgeryHelper = {
  getAntiForgeryToken: function() {
    return {
      formKey: "__RequestVerificationToken",
      headerKey: "X-RequestVerificationToken",
      value: antiForgeryTokenValue
    };
  }
};

var sessionHelper = {
  unauthorized: function () {
    sessionHelper.logout(function (result) {
      window.top.location.reload(true);
    });
  },
  
  logout: function (callback) {
    var ajaxSettings = {
      url: "/api/sitecore/Authentication/Logout?sc_database=master",
      type: "POST",
      data: {},
      cache: false
    };

    var token = _sc.Helpers.antiForgery.getAntiForgeryToken();
    ajaxSettings.data[token.formKey] = token.value;
    $.ajax(ajaxSettings).complete(callback);
  }
};

_.extend(_sc, {
  Helpers: {
    antiForgery: antiForgeryHelper,
    url: urlHelper,
    date: dateHelper,
    id: idHelper,
    string: stringHelper,
    object: objectHelper,
    invocation: invocationHelper,
    overlay: overlayHelper,
    window: windowHelper,
    session: sessionHelper
  }
});

_sc.Helpers.window.init();
/*
The Convert Part of SPEAK Framework
------------------------------------

What is exposed:
Speak.Converter

*/
var Utils = _sc.Helpers;

var instances = {
  _current: 0, //not used ?
  converters: [],
  aborted: false //not used ?
},
length = function () {
  return instances.converters.length;
},
add = function (converter) {
  converter = converter || {};
     
  if (!_.isFunction(converter.canConvert) ||
      !_.isFunction(converter.convert) ||
      !_.isFunction(converter.reConvert) ||
      !_.isString(converter.name)
  ) {
    throw "invalid converter";
  }
  instances.converters.push(converter);
},
remove = function (name) {
  instances.converters = _.reject(instances.converters, function (pipeline) {
    return pipeline.name === name;
  });
},
get = function (name) {
  return _.find(instances.converters, function (processor) {
    return processor.name === name;
  });
},
getAll = function () {
  return instances.converters;
},
dateConverter = {
  name: "date",
  canConvert: function (field) {
    return Utils.string.equals(field.type, this.name) || Utils.string.equals(field.type, "datetime");
  },
  convert: function (field) {
    var result = "",
    value = field.value;
    if (value) {
      try {
        return Utils.date.parseISO(value).toLocaleDateString();
      } catch (e) {
        return result;
      }
    }
    return result;
  },
  reConvert: function (fieldValue) {
    //TODO Do we want this ?
    if (!fieldValue) { return ""; }

    try {
      var date = new Date(fieldValue);
      return Utils.date.toISO(date);
    } catch (e) {
      return fieldValue || "";
    }
  },
  toStringWithFormat: function (value, format) {
    if (Utils.date.isISO(value)) {
      try {
        var date = Utils.date.parseISO(value);
        var formats = {
          mmss: {
            expression: "(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMinutes())
          },
          mss: {
            expression: "(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",
            value: date.getUTCMinutes().toString(),
          },
          hmm: {
            expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMinutes()),
          },
          hm: {
            expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",
            value: date.getUTCMinutes().toString(),
          },
          ms: {
            expression: "(\\Wss\\W|^ss\\W)00(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMilliseconds()),
          },
          ampm: {
            expression: "(\\W|^)AM/PM(\\W|$)",
            value: ((date.getUTCHours() >= 12) ? "PM" : "AM"),
          },
          ap: {
            expression: "(\\W|^)A/P(\\W|$)",
            value: ((date.getUTCHours() >= 12) ? "P" : "A"),
          },
          yyyy: {
            expression: "(\\W|^)yyyy(\\W|$)",
            value: date.getUTCFullYear().toString(),
          },
          yy: {
            expression: "(\\W|^)yy(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCFullYear() % 100),
          },
          mm: {
            expression: "(\\W|^)mm(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCMonth() + 1),
          },
          m: {
            expression: "(\\W|^)m(\\W|$)",
            value: (date.getUTCMonth()+1).toString(),
          },
          dd: {
            expression: "(\\W|^)dd(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCDate()),
          },
          d: {
            expression: "(\\W|^)d(\\W|$)",
            value: date.getUTCDate().toString(),
          },
          hh: {
            expression: "(\\W|^)hh(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCHours()),
          },
          h: {
            expression: "(\\W|^)h(\\W|$)",
            value: (date.getUTCHours() > 12) ? (date.getUTCHours() - 12).toString() : ((date.getUTCHours() == 0) ? 12 : date.getUTCHours()).toString(),
          },
          ss: {
            expression: "(\\W|^)ss(\\W|$)",
            value: Utils.date.ensureTwoDigits(date.getUTCSeconds()),
          },
          s: {
            expression: "(\\W|^)s(\\W|$)",
            value: date.getUTCSeconds().toString()
          }
        };
        
        for (var step in formats) {
          var find = (formats[step]) ? formats[step].expression : "";
          var replace = "$1" + formats[step].value + "$2";
          if (find != "") {
            var expression = new RegExp(find, 'g');
            format = format.replace(expression, replace);
          }
        }
        return format;
      } catch (e) {
        return value;
      }      
    }
    return value;
  }
},
iconConverter = {
  name: "Icon",
  baseUrl: Utils.url.combine(_sc.SiteInfo.virtualFolder, "~/icon/"),
  canConvert: function (field, fields, item) {
    return Utils.string.equals(field.type, this.name);
  },
  convert: function (field) {
    if (this.canConvert(field)) {
      var value = field.value || "/sitecore/images/blank.gif"; /*really ?*/
      if (value.indexOf("/sitecore/") !== 0) {
        value = Utils.url.combine(this.baseUrl, value);
      }

      return Utils.string.format("<img src=\"{0}\" alt=\"\" />", value); /*really ?*/
    }
  },
  reConvert: function (field) {
    //no need to reConvert
  }
},
converters = {
  length: length,
  add: add,
  remove: remove,
  get: get,
  getAll: getAll
};

converters.add(dateConverter);
converters.add(iconConverter);

_.extend(_sc, { Converters: converters });
/*
The Pipeline Part of SPEAK Framework
------------------------------------

What is exposed:222222
Speak.Pipelines
- run(options)
- add
- remove
- length
*/

var ppl = Speak.Pipelines = function () {
  var pipelines = [];

  return {
    add: function (pipeline) {
      if (!pipeline || !pipeline.name || !_.isObject(pipeline)) {
        throw new "invalid pipeline";
      }

      pipelines.push(pipeline);
      this[pipeline.name] = pipeline;
    },
    remove: function (pipelineName) {
      pipelines = _.reject(pipelines, function (p) {
        return p.name === pipelineName;
      });

      delete Speak.Pipelines[pipelineName];
    },
    length: function () {
      return pipelines.length;
    }
  };
}();

ppl.Pipeline = function (name) {
  var result = {
    name: name,

    processors: [],

    add: function (processor) {
      if (!processor || !processor.priority || !processor.execute || !_.isNumber(processor.priority) || !_.isFunction(processor.execute)) {
        throw "not valid step";
      }

      this.processors.push(processor);
    },
    length: function () {
      return this.processors.length;
    },
    remove: function (processor) {
      this.processors = _.reject(this.processors, function (p) {
        return p === processor;
      });
    },
    execute: function (context) {
      //TODO: sort on adding processors
      var list = _.sortBy(this.processors, function (processor) {
        return processor.priority;
      });

      _.each(list, function (processor) {
        if (context.aborted) {
          return false;
        }
        processor.execute(context);
      });
    }
  };

  return result;
};

var executeContext = function (target, context) {
  //First we check if you want to existing something in the app.
  var targets = target.split(".");
  var firstPath = targets[0];
  if (firstPath === "this") {
    new Function(target).call(context.control.model);
  } else if (context.app && firstPath === "app") {
    var ex = target.replace("app", "this");
    new Function(ex).call(context.app);
  } else {
    /*!!! dangerous zone !!!*/
    new Function(target)();
  }
}

var handleJavaScript = {
  priority: 1000,
  execute: function (context) {
    if (context.handler === "javascript") {
      if (context.target.indexOf(";") > 0) {
        _.each(context.target.split(";"), function (tar) {
          executeContext(tar, context);
        });
      } else {
        executeContext(context.target, context);
      }
    }
  }
};

var handleCommand = {
  priority: 2000,
  execute: function (context) {
    if (context.handler === "command") {
      Speak.Commands.executeCommand(context.target);
    }
  }
};

var serverClick = {
  priority: 3000,
  execute: function (context) {
    if (context.handler !== "serverclick") {
      return;
    }

    //TODO: maybe we should validate
    var options = {
      url: context.target,
      type: "POST",
      dataType: "json",
      data: {}
    };

    var token = Speak.Helpers.antiForgery.getAntiForgeryToken();
    options.data[token.formKey] = token.value;

    var completed = function (result) {
      //TODO: validate result
      Speak.Pipelines.ServerInvoke.execute({
        data: result,
        model: context.model
      });
    };

    $.ajax(options).done(completed);
  }
};

var triggerEvent = {
  priority: 4000,
  execute: function (context) {
    if (context.handler !== "trigger") {
      return;
    }

    var app = context.app;
    if (!app) {
      throw "An application is a required when triggering events";
    }

    var target = context.target;
    var args = {};

    var n = target.indexOf("(");
    if (n >= 0) {
      if (target.indexOf(")", target.length - 1) == -1) {
        throw "Missing ')'";
      }
      var parameters = target.substr(n + 1, target.length - n - 2);
      args = $.parseJSON(parameters);
      target = target.substr(0, n);
    }

    args.sender = context.control;

    app.trigger(target, args);
  }
};

var ivk = new Speak.Pipelines.Pipeline("Invoke");

ivk.add(handleJavaScript);
ivk.add(handleCommand);
ivk.add(serverClick);
ivk.add(triggerEvent);

Speak.Pipelines.add(ivk);

var srvppl = new Speak.Pipelines.Pipeline("ServerInvoke");

Speak.Pipelines.add(srvppl);
var appPpl = new ppl.Pipeline("Application");

/**
 * Initialized all the components
 */

var hasPublicFunctions = function (defaults) {
  if (!defaults) {
    return false;
  }
  return (_.keys(defaults).length > 0);
};

var exposedCollection = function (collection, defaults) {
  /*current exposed nothing*/
  return {};
};

var exposedModel = function (model, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      if (model.attributes[funcName] !== undefined) {
        obj[funcName] = function () {
          if (arguments.length) {
            model.set(funcName, arguments[0]);
            return arguments[0];
          }
          else {
            return model.get(funcName);
          }
        };
      }
      else {
        obj[funcName] = function (args) {
          model[funcName].call(model, args);
        };
      }
    });
  }
  return obj;
};

var exposedView = function (view, defaults) {
  var obj = {};
  if (hasPublicFunctions(defaults)) {
    var keys = _.keys(defaults);

    _.each(keys, function (funcName) {
      obj[funcName] = function (args) {
        view[funcName].call(view, args);
      };
    });
  }

  return obj;
};

var exposedComponent = function (component, componentEl, appName, hasExclude, hasNested, selector, app, context, verifyNestedApp) {
  var $component = $(componentEl),
    uniqueId,
    controlName,
    model,
    collection,
    view;

  if (verifyNestedApp) {
    var $subApps = $component.find("[data-sc-app]");
    if ($subApps.length > 0) {
      $.each($subApps, function () {
        $(this).addClass("data-sc-waiting")
      });
    }
  }
  //if it has data on sc-app, it means the component has been already register
  if (!$component.data("sc-app")) {

    uniqueId = _.uniqueId('sc_' + component.type + '_');
    controlName = $component.attr("data-sc-id");
    if (app.appId) {
      controlName = app.appId + ":" + controlName;
    }

    var newClass = _.filter($component.prop("class").split(" "), function (className) {
      return (className.indexOf('sc_') === -1);
    });

    $component.prop("class", newClass.join(" "));
    $component.addClass(uniqueId); //add a uniqueID enforce this !

    if (hasExclude) {
      if ($("[data-sc-exclude] " + "." + uniqueId).length) {
        return {}; //return empty object
      }
    }
    if (hasNested) {
      if ($component.closest("[data-sc-app]").attr("id") && "#" + $component.closest("[data-sc-app]").attr("id") != selector) {
        return {};
      }
    }

    model = new component.model({ type: uniqueId, name: controlName });
    model.componentName = component.type;
    $component.data("sc-app", appName); //prefer to not relying on DOM

    $component.addClass("data-sc-registered");

    if (component.collection) {
      collection = new component.collection();
    }

    /*adding Behaviors*/
    var behaviors = $component.data("sc-behaviors");

    view = new component.view({ el: "." + uniqueId, model: model, collection: collection, app: app, behaviors: behaviors });


    _.each(view.$el.find("[data-bind]"), function (el) {
      var $el = $(el);
      if ($el.closest(".data-sc-waiting").length == 0) {
        $el.addClass("data-sc-registered");
      }
    }, this);

    /*Also registered comment binding*/
    view.$el.find("*").contents().each(function () {
      try {
        this.registered = (this.nodeType === 8) ? true : false; //Node.COMMENT_NODE 
      } catch (e) {

      }
    });
    /*if(! component.model.prototype.defaults) { component.model.prototype.defaults = {}; }
    if(! component.view.prototype.defaults) { component.view.prototype.defaults = {}; }
    
    if(_.intersection(_.keys(component.model.prototype.defaults), _.keys(component.view.prototype.defaults)).length > 0) {
        $component.data("sc-app", null); //deregister the component before breaking
        throw "Your view and your model from component:" + controlName + ", are exposing property under the same name";
    }*/

    app[controlName] = model; /*;*/

    //_.extend(app[controlName], exposedModel(model, component.model.prototype.defaults));
    //_.extend(app[controlName], exposedView(view, component.view.prototype.defaults));

    if (collection) {
      _.extend(app[controlName], exposedCollection(collection, component.collection.prototype.defaults));
    }
    context.Controls.push({ name: controlName, model: model, view: view, collection: collection });

    if (verifyNestedApp) {
      var $deferedKO = $component.find(".data-sc-waiting");
      $deferedKO.each(function () {
        $(this).removeClass("data-sc-waiting");
      });
    }
  }

  return app;
};

var getScope = function (name, id) {

  if (!name) {
    id = "body";
    name = "app";
  }

  if (!id) {
    id = name;
  }

  if (id !== "body" && id.indexOf("#") < 0) {
    id = "#" + id;
  }

  return {
    name: name,
    el: id,
    $el: $(id)
  };
};

var RegisterTree = function ($element, register) {
  if ($element.find("[data-sc-hasnested]").length === 0) {
    register($element);
  } else {
    _.each($element.find("[data-sc-hasnested]"), function (child) {
      RegisterTree($(child), register);
    });
    register($element);
  }
};

var initialization = {
  priority: 1000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    context = context || {};
    var name = context.name
      , id = context.id
      , mainApp = context.mainApp
      , app = context.app
      , scoped = getScope(name, id)
      , excludeDom = $(scoped.$el).find("[data-sc-exclude]")
      , hasExclude = excludeDom.length || false
      , hasNested = $(scoped.$el).find("[data-sc-app]").length || false
      , hasNestedComponents = [];

    app = app || new Speak.Definitions.App(); //empty app

    app.Controls = context.Controls = [];

    if (!mainApp) { mainApp = Speak; }
    //throw if app already in the page
    if (mainApp[scoped.name]) { throw "already an app with this name"; }

    app.ScopedEl = scoped.$el;
    app.name = scoped.name;
    //forEach component in Speak, we look for a corresping EL

    if (_sc.Components && _sc.Components.length > 0) {
      _.each(_sc.Components, function (component) {
        // we are just looking for component which are not registered
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
          //create a Control Object and add it to the App
          if (!$(this).data("sc-hasnested")) {
            exposedComponent(component, this, scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context);
          } else {
            //defering until not nested are done
            hasNestedComponents.push(component);
          }
        });
      });
    }

    if (hasNestedComponents.length > 0) {
      _.each(hasNestedComponents, function (component) {
        $(scoped.$el).find(component.el + ":not(.data-sc-registered)").each(function () {
          /*sub nested*/

          var element = $(this);
          RegisterTree(element, function ($elem) {
            var appropriateComp = _.find(hasNestedComponents, function (comp) {
              return $elem.is(comp.el);
            });
            exposedComponent(appropriateComp, $elem.get(0), scoped.name, hasExclude, hasNested, scoped.$el.selector, app, context, true);
          });

        });
      });
    }

    /*it is time to register events*/
    _.each(context.Controls, function (ctrl) {
      if (ctrl.view.listen) {
        var eventList = _.keys(ctrl.view.listen);
        _.each(eventList, function (eventName) {
          var e = eventName;
          if (e.indexOf(":$this") >= 0) {
            var ctrlId = ctrl.view.$el.attr("data-sc-id");
            if (ctrlId) {
              e = e.replace("$this", ctrlId);
            } else {
              //console.log("Control has no 'data-sc-id' attribute - event '" + eventName + "' is not bound");
              return;
            }
          }
          app.on(e, ctrl.view[ctrl.view.listen[eventName]], ctrl.view);
        });
      }
    });

    //not exposed to Speak anymore
    if (mainApp === Speak) {
      if (__SPEAKDEBUG) {
        mainApp[scoped.name] = app;
      } else {
        mainApp[scoped.name] = "application";
      }
    } else {
      mainApp[scoped.name] = app;
      mainApp["nested"] = mainApp["nested"] || [];
      mainApp["nested"].push(app);
    }

    scoped.$el.find("[data-sc-app]").each(function () {
      var $app = $(this),
          id = $app.attr("data-sc-app"),
          $pageCode = $app.find("script[type='text/x-sitecore-pagecode']");

      //require
      var dep;

      if ($pageCode) {
        dep = $pageCode.attr("data-sc-require");
      }

      if (dep) {
        require(dep.split(','), function (subapp) {
          var instance = new subapp();
          instance.run(id, id, app);
        });
      } else {
        _sc.Factories.createApp({
          name: id,
          id: id,
          mainApp: app,
          aborted: false
        });
      }
    });

    context.current = app;
  }
};

var getConverter = function (converterName) {
  var converter = _sc.BindingConverters[converterName];
  if (!converter) {
    return undefined;
  } else {
    return converter;
  }
}

var getValue = function (bindingForOneProperty) {
  if (bindingForOneProperty.converter) {
    var parameters = [];

    _.each(bindingForOneProperty.from, function (setup) {
      parameters.push(setup.model.get(setup.attribute));
    });
    return bindingForOneProperty.converter(parameters);
  } else {
    var singleModel = bindingForOneProperty.from[0].model,
        value = bindingForOneProperty.from[0].attribute;

    return singleModel.get(value);
  }
}

var createBinding = function (bindingForOneProperty) {
  _.each(bindingForOneProperty.from, function (f) {
    f.model.on("change:" + f.attribute, function () {
      bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
    });
  });

  bindingForOneProperty.model.set(bindingForOneProperty.to, getValue(bindingForOneProperty));
};

var getUniformAttribute = function (model, attribute) {
  var keys = _.keys(model.attributes);
  var hasAttribute = _.find(keys, function (key) { return key === attribute; });
  if (!hasAttribute) {
    return (attribute.charAt(0).toLowerCase() + attribute.slice(1));
  } else {
    return attribute;
  }
};


var getUniformModel = function (app, model) {
  var keys = _.keys(app);
  var hasModel = _.find(keys, function (key) { return key === model; });
  if (!hasModel) {
    return app[(model.charAt(0).toUpperCase() + model.slice(1))];
  } else {
    return app[model];
  }
};


var applyBinding = function ($el, app, scId) {
  var namespace = scId,
      conf = $el.attr("data-sc-bindings"),
      bindingConfigurationList = [],
      leftModel = app[namespace];
  //backward compatibily
  if (conf.indexOf("{") != 0) {
    //try to make the old bindings work with new one
    var compatibleBindings = [];

    _.each(conf.split(","), function (singleBinding) {
      var compatibleBinding = [];

      _.each(singleBinding.split(":"), function (part) {
        compatibleBinding.push('"' + part + '"');
      });

      compatibleBindings.push(compatibleBinding.join(":"));
    });
    conf = "{" + compatibleBindings.join(",") + "}";
  }

  try {
    var json = JSON.parse(conf);
    _.each(_.keys(json), function (key) {

      var bindingConfiguration = { from: [], to: key, converter: undefined, model: leftModel },
          config = json[key],
          modelPath,
          model,
          attribute;

      bindingConfiguration.to = getUniformAttribute(leftModel, key);

      if (!_.isObject(config)) {
        //classic binding Items:SearchDatasource.Items
        model = app[config.split(".")[0]];
        attribute = getUniformAttribute(model, config.split(".")[1]);

        /*if(!model.attributes[attribute]) {a
          
        }*/
        bindingConfiguration.from.push({ model: model, attribute: attribute });
      } else {
        bindingConfiguration.converter = getConverter(config.converter);

        _.each(config.parameters, function (value) {
          model = getUniformModel(app, value.split(".")[0]);

          attribute = getUniformAttribute(model, value.split(".")[1]);

          bindingConfiguration.from.push({ model: model, attribute: attribute });
        });
      }
      bindingConfigurationList.push(bindingConfiguration);
    });

    _.each(bindingConfigurationList, createBinding);
  }
  catch (ex) {
    //alert("Failed to data-bind: " + scId + "." + left + " => " + right + "\n" + ex);
    throw "Failed to data-bind: " + scId + "\n" + ex;
  }

};

var applyingCrossBinding = {
  priority: 1500,
  execute: function (context) {
    if (context.current.Controls.length === 0) {
      return;
    }

    _.each(context.current.Controls, function (control) {
      if (control.view.$el.attr("data-sc-bindings")) {
        applyBinding(control.view.$el, context.current, control.view.$el.attr("data-sc-id"));
      }
    });
  }
};

var beforeRenderTime = {
  priority: 2000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.beforeRender) {
        //we execute it
        control.view.beforeRender();
      }
    });
  }
};
/**
 * Render Methods
 */
var renderingTime = {
  priority: 3000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.render) {
        //we execute it
        control.view.render();
      }
    });
  }
};

var afterRenderTime = {
  priority: 4000,
  //run: function(name, id, mainApp, app)
  execute: function (context) {
    _.each(context.Controls, function (control) {
      //if control has a render method
      if (control.view.afterRender) {
        //we execute it
        control.view.afterRender();
      }
    });
  }
};

appPpl.add(initialization);
appPpl.add(applyingCrossBinding);
appPpl.add(beforeRenderTime);
appPpl.add(renderingTime);
appPpl.add(afterRenderTime);

Speak.Pipelines.add(appPpl);
_.extend(_sc.Web, {
    itemWebApi: {
      takeValidScope: function(elem) {
        switch (elem) {
          case "self":
            return "s";
          case "children":
            return "c";
          case "parent":
            return "p";
          default:
            throw "Unsupported scope. It must be either 'self', 'children' or 'parent'";
        }
      },
      addScope: function(url, scope) {
        if (scope && _.isArray(scope)) {
          var result = _.compact(_.map(scope, _sc.Web.itemWebApi.takeValidScope)).join("|");

          url = _sc.Helpers.url.addQueryParameters(url, { scope: result });
        }

        return url;
      },
      addDatabase: function(url, database) {
        if (database && _.isString(database)) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_database: database });
        }

        return url;
      },
      addContentDatabase: function (url, database) {
        if (database && _.isString(database)) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_content: database });
        }

        return url;
      },
      addItemSelectorUrlPortion: function(url, itemSelector, options) {
        if (itemSelector && _.isString(itemSelector)) {
          if (options && options.facetsRootItemId) {
            url = _sc.Helpers.url.addQueryParameters(url, { facetsRootItemId: options.facetsRootItemId });
          }

          if (itemSelector.indexOf("search:") === 0) {
            url = _sc.Helpers.url.addQueryParameters(url, { search: itemSelector.substr("search:".length) });

            if (options && options.root && Speak.Helpers.id.isId(options.root)) {
              url = _sc.Helpers.url.addQueryParameters(url, { root: options.root });
            }

            if (options && options.searchConfig) {
              url = _sc.Helpers.url.addQueryParameters(url, { searchConfig: options.searchConfig });
            }
          } else if (itemSelector.indexOf("query:") === 0) {
            url = _sc.Helpers.url.addQueryParameters(url, { query: itemSelector.substr("query:".length) });
          } else if (_sc.Helpers.id.isId(itemSelector)) {
            url = _sc.Helpers.url.addQueryParameters(url, { sc_itemid: itemSelector });
          } else {
            url = _sc.Helpers.url.combine(url, itemSelector);
          }
        }
        return url;
      },
      addLanguage: function(url, language) {
        if (language) {
          url = _sc.Helpers.url.addQueryParameters(url, { language: language });
        }
        return url;
      },
      addItemVersion: function(url, version) {
        if (version) {
          url = _sc.Helpers.url.addQueryParameters(url, { sc_itemversion: version });
        }

        return url;
      },
      getUrl: function(itemSelector, options) {
        options = options || {};

        var webApi = "/-/item/v1";
        var virtualFolder = "";
        
        if (options.webApi) {
          webApi = options.webApi;
        }
        
        if (options.virtualFolder) {
          virtualFolder = options.virtualFolder;
        }

        var url = _sc.Helpers.url.combine(webApi, virtualFolder);
        url = this.addItemSelectorUrlPortion(url, itemSelector, options);

        if (options.scope) {
          url = this.addScope(url, options.scope);
        }

        // for search datasource we should use Content Database
        if (options.database && itemSelector != "" && itemSelector.indexOf("search:") === 0) {
          url = this.addContentDatabase(url, options.database);
        }
        else if (options.database) {
          url = this.addDatabase(url, options.database);
        }

        if (options.language) {
          url = this.addLanguage(url, options.language);
        }

        if (options.version) {
          url = this.addItemVersion(url, options.version);
        }

        if (options.payLoad) {
          url = _sc.Helpers.url.addQueryParameters(url, { payload: "full" });
        }

        if (options.formatting) {
          url = _sc.Helpers.url.addQueryParameters(url, { format: options.formatting });
        }

        if (options.sorting) {
          url = _sc.Helpers.url.addQueryParameters(url, { sorting: options.sorting });
        }
        
        if (options.showHiddenItems) {
          url = _sc.Helpers.url.addQueryParameters(url, { showHiddenItems: options.showHiddenItems });
        }
        
        if (options.fields) {
          url = _sc.Helpers.url.addQueryParameters(url, { fields: options.fields.join("|") });
        }

        if (options.pageSize && options.pageSize > 0) {
          url = _sc.Helpers.url.addQueryParameters(url, { pageIndex: options.pageIndex, pageSize: options.pageSize });
        }

        return url;
      }
    }
});

/*!
 * backbone.layoutmanager.js v0.7.5
 * Copyright 2012, Tim Branyen (@tbranyen)
 * backbone.layoutmanager.js may be freely distributed under the MIT license.
 */
(function(window) {

"use strict";

// Hoisted, referenced at the bottom of the source.  This caches a list of all
// LayoutManager options at definition time.
var keys;

// Localize global dependency references.
var Backbone = window.Backbone;
var _ = window._;
var $ = window.$;

// Maintain references to the two `Backbone.View` functions that are
// overwritten so that they can be proxied.
var _configure = Backbone.View.prototype._configure;
var render = Backbone.View.prototype.render;

// Cache these methods for performance.
var aPush = Array.prototype.push;
var aConcat = Array.prototype.concat;
var aSplice = Array.prototype.splice;

// LayoutManager is a wrapper around a `Backbone.View`.
var LayoutManager = Speak.Definitions.Views.View.extend({
  // This named function allows for significantly easier debugging.
  constructor: function Layout(options) {
    // Options may not always be passed to the constructor, this ensures it is
    // always an object.
    options = options || {};

    // Grant this View superpowers.
    LayoutManager.setupView(this, options);

    // Have Backbone set up the rest of this View.
    Backbone.View.call(this, options);
  },
  nestedlayout: true,

  // Shorthand to `setView` function with the `append` flag set.
  insertView: function(selector, view) {
    // If the `view` argument exists, then a selector was passed in.  This code
    // path will forward the selector on to `setView`.
    if (view) {
      return this.setView(selector, view, true);
    }

    // If no `view` argument is defined, then assume the first argument is the
    // View, somewhat now confusingly named `selector`.
    return this.setView(selector, true);
  },

  // Iterate over an object and ensure every value is wrapped in an array to
  // ensure they will be appended, then pass that object to `setViews`.
  insertViews: function(views) {
    // If an array of views was passed it should be inserted into the
    // root view. Much like calling insertView without a selector
    if (_.isArray(views)) {
      return this.setViews({'': views});
    }

    _.each(views, function(view, selector) {
      views[selector] = _.isArray(view) ? view : [view];
    });

    return this.setViews(views);
  },

  // Returns the View that matches the `getViews` filter function.
  getView: function(fn) {
    return this.getViews(fn).first().value();
  },

  // Provide a filter function to get a flattened array of all the subviews.
  // If the filter function is omitted it will return all subviews.  If a 
  // String is passed instead, it will return the Views for that selector.
  getViews: function(fn) {
    // Generate an array of all top level (no deeply nested) Views flattened.
    var views = _.chain(this.views).map(function(view) {
      return _.isArray(view) ? view : [view];
    }, this).flatten().value();

    // If the filter argument is a String, then return a chained Version of the
    // elements.
    if (typeof fn === "string") {
      return _.chain([this.views[fn]]).flatten();
    }

    // If a filter function is provided, run it on all Views and return a
    // wrapped chain. Otherwise, simply return a wrapped chain of all Views.
    return _.chain(typeof fn === "function" ? _.filter(views, fn) : views);
  },

  // This takes in a partial name and view instance and assigns them to
  // the internal collection of views.  If a view is not a LayoutManager
  // instance, then mix in the LayoutManager prototype.  This ensures
  // all Views can be used successfully.
  //
  // Must definitely wrap any render method passed in or defaults to a
  // typical render function `return layout(this).render()`.
  setView: function(name, view, append) {
    var manager, existing, options;
    // Parent view, the one you are setting a View on.
    var root = this;


    // If no name was passed, use an empty string and shift all arguments.
    if (typeof name !== "string") {
      append = view;
      view = name;
      name = "";
    }

    // If the parent views object doesn't exist... create it.
    this.views = this.views || {};

    // Shorthand the `__manager__` property.
    manager = view.__manager__;

    // Shorthand the View that potentially already exists.
    existing = this.views[name];

    // If the View has not been properly set up, throw an Error message
    // indicating that the View needs `manage: true` set.
    if (!manager) {
      throw new Error("Please set `View#manage` property with selector '" +
        name + "' to `true`.");
    }

    // Assign options.
    options = view._options();

    // Add reference to the parentView.
    manager.parent = root;

    // Add reference to the placement selector used.
    manager.selector = name;

    // Code path is less complex for Views that are not being appended.  Simply
    // remove existing Views and bail out with the assignment.
    if (!append) {
      // If the View we are adding has already been rendered, simply inject it
      // into the parent.
      if (manager.hasRendered) {
        options.partial(root.el, manager.selector, view.el, manager.append); 
      }

      // Ensure remove is called when swapping View's.
      if (existing) {
        // If the views are an array, iterate and remove each individually.
        _.each(aConcat.call([], existing), function(nestedView) {
          nestedView.remove();
        });
      }

      // Assign to main views object and return for chainability.
      return this.views[name] = view;
    }

    // Ensure this.views[name] is an array and push this View to the end.
    this.views[name] = aConcat.call([], existing || [], view);

    // Put the view into `append` mode.
    manager.append = true;

    return view;
  },

  // Allows the setting of multiple views instead of a single view.
  setViews: function(views) {
    // Iterate over all the views and use the View's view method to assign.
    _.each(views, function(view, name) {
      // If the view is an array put all views into insert mode.
      if (_.isArray(view)) {
        return _.each(view, function(view) {
          this.insertView(name, view);
        }, this);
      }

      // Assign each view using the view function.
      this.setView(name, view);
    }, this);

    // Allow for chaining
    return this;
  },

  // By default this should find all nested views and render them into
  // the this.el and call done once all of them have successfully been
  // resolved.
  //
  // This function returns a promise that can be chained to determine
  // once all subviews and main view have been rendered into the view.el.
  render: function() {
    var root = this;
    var options = root._options();
    var manager = root.__manager__;
    var parent = manager.parent;
    var rentManager = parent && parent.__manager__;
    var def = options.deferred();

    // Triggered once the render has succeeded.
    function resolve() {
      var next, afterRender;

      // If there is a parent, attach.
      if (parent) {
        if (!options.contains(parent.el, root.el)) {
          options.partial(parent.el, manager.selector, root.el,
            manager.append);
        }
      }

      // Ensure events are always correctly bound after rendering.
      root.delegateEvents();

      // Set this View as successfully rendered.
      manager.hasRendered = true;

      // Resolve the deferred.
      def.resolveWith(root, [root]);

      // Only process the queue if it exists.
      if (next = manager.queue.shift()) {
        // Ensure that the next render is only called after all other
        // `done` handlers have completed.  This will prevent `render`
        // callbacks from firing out of order.
        next();
      } else {
        // Once the queue is depleted, remove it, the render process has
        // completed.
        delete manager.queue;
      }

      // Reusable function for triggering the afterRender callback and event
      // and setting the hasRendered flag.
      function completeRender() {
        var afterRender = options.afterRender;

        if (afterRender) {
          afterRender.call(root, root);
        }

        // Always emit an afterRender event.
        root.trigger("afterRender", root);
      }

      // If the parent is currently rendering, wait until it has completed
      // until calling the nested View's `afterRender`.
      if (rentManager && rentManager.queue) {
        // Wait until the parent View has finished rendering, which could be
        // asynchronous, and trigger afterRender on this View once it has
        // compeleted.
        afterRender = function() {
          // Wish we had `once` for this...
          parent.off("afterRender", afterRender, this);

          // Trigger the afterRender and set hasRendered.
          completeRender();
        };

        return parent.on("afterRender", afterRender, root);
      }

      // This View and its parent have both rendered.
      completeRender();
    }

    // Actually facilitate a render.
    function actuallyRender() {
      var options = root._options();
      var manager = root.__manager__;
      var parent = manager.parent;
      var rentManager = parent && parent.__manager__;

      // The `_viewRender` method is broken out to abstract away from having
      // too much code in `processRender`.
      root._render(LayoutManager._viewRender, options).done(function() {
        // If there are no children to worry about, complete the render
        // instantly.
        if (!_.keys(root.views).length) {
          return resolve();
        }

        // Create a list of promises to wait on until rendering is done.
        // Since this method will run on all children as well, its sufficient
        // for a full hierarchical. 
        var promises = _.map(root.views, function(view) {
          var append = _.isArray(view);

          // If items are being inserted, they will be in a non-zero length
          // Array.
          if (append && view.length) {
            // Only need to wait for the first View to complete, the rest
            // will be synchronous, by virtue of having the template cached.
            return view[0].render().pipe(function() {
              // Map over all the View's to be inserted and call render on
              // them all.  Once they have all resolved, resolve the other
              // deferred.
              return options.when(_.map(view.slice(1), function(insertView) {
                return insertView.render();
              }));
            });
          }

          // Only return the fetch deferred, resolve the main deferred after
          // the element has been attached to it's parent.
          return !append ? view.render() : view;
        });

        // Once all nested Views have been rendered, resolve this View's
        // deferred.
        options.when(promises).done(function() {
          resolve();
        });
      });
    }

    // Another render is currently happening if there is an existing queue, so
    // push a closure to render later into the queue.
    if (manager.queue) {
      aPush.call(manager.queue, function() {
        actuallyRender();
      });
    } else {
      manager.queue = [];

      // This the first `render`, preceeding the `queue` so render
      // immediately.
      actuallyRender(root, def);
    }

    // Add the View to the deferred so that `view.render().view.el` is
    // possible.
    def.view = root;
    
    // This is the promise that determines if the `render` function has
    // completed or not.
    return def;
  },

  // Ensure the cleanup function is called whenever remove is called.
  remove: function() {
    // Force remove itself from its parent.
    LayoutManager._removeView(this, true);

    // Call the original remove function.
    return this._remove.apply(this, arguments);
  },

  // Merge instance and global options.
  _options: function() {
    return LayoutManager.augment({}, this, LayoutManager.prototype.options, this.options);
  }
},
{
  // Clearable cache.
  _cache: {},

  // Creates a deferred and returns a function to call when finished.
  _makeAsync: function(options, done) {
    var handler = options.deferred();

    // Used to handle asynchronous renders.
    handler.async = function() {
      handler._isAsync = true;

      return done;
    };

    return handler;
  },

  // This gets passed to all _render methods.  The `root` value here is passed
  // from the `manage(this).render()` line in the `_render` function
  _viewRender: function(root, options) {
    var url, contents, fetchAsync;
    var manager = root.__manager__;

    // This function is responsible for pairing the rendered template into
    // the DOM element.
    function applyTemplate(rendered) {
      // Actually put the rendered contents into the element.
      if (rendered) {
        options.html(root.$el, rendered);
      }

      // Resolve only after fetch and render have succeeded.
      fetchAsync.resolveWith(root, [root]);
    }

    // Once the template is successfully fetched, use its contents to proceed.
    // Context argument is first, since it is bound for partial application
    // reasons.
    function done(context, contents) {
      // Store the rendered template someplace so it can be re-assignable.
      var rendered;
      // This allows the `render` method to be asynchronous as well as `fetch`.
      var renderAsync = LayoutManager._makeAsync(options, function(rendered) {
        applyTemplate(rendered);
      });

      // Ensure the cache is up-to-date.
      LayoutManager.cache(url, contents);

      // Render the View into the el property.
      if (contents) {
        rendered = options.render.call(renderAsync, contents, context);
      }

      // If the function was synchronous, continue execution.
      if (!renderAsync._isAsync) {
        applyTemplate(rendered);
      }
    }

    return {
      // This `render` function is what gets called inside of the View render,
      // when `manage(this).render` is called.  Returns a promise that can be
      // used to know when the element has been rendered into its parent.
      render: function() {
        var serialize = root.serialize || options.serialize;
        var data = root.data || options.data;
        var context = serialize || data;
        
        var template = root.template || options.template;
        var controlId = "";

        if(root.parent && root.parent.$el) {
          controlId = root.parent.$el.data("sc-id");
        }

        // If data is a function, immediately call it.
        if (_.isFunction(context)) {
          context = context.call(root);
        }

        // This allows for `var done = this.async()` and then `done(contents)`.
        fetchAsync = LayoutManager._makeAsync(options, function(contents) {
          done(context, contents);
        });

        // Set the url to the prefix + the view's template property.
        if (typeof template === "string") {
          url = options.prefix + template;
        }

        // Check if contents are already cached and if they are, simply process
        // the template with the correct data.
        if (contents = LayoutManager.cache(url + controlId)) {
          done(context, contents, url);

          return fetchAsync;
        }

        // Fetch layout and template contents.
        if (typeof template === "string") {
          contents = options.fetch.call(fetchAsync, options.prefix + template, controlId);
        // If its not a string just pass the object/function/whatever.
        } else if (template != null) {
          contents = options.fetch.call(fetchAsync, template);
        }

        // If the function was synchronous, continue execution.
        if (!fetchAsync._isAsync) {
          done(context, contents);
        }

        return fetchAsync;
      }
    };
  },

  // Remove all nested Views.
  _removeViews: function(root, force) {
    // Shift arguments around.
    if (typeof root === "boolean") {
      force = root;
      root = this;
    }

    // Allow removeView to be called on instances.
    root = root || this;

    // Iterate over all of the nested View's and remove.
    root.getViews().each(function(view) {
      // Force doesn't care about if a View has rendered or not.
      if (view.__manager__.hasRendered || force) {
        LayoutManager._removeView(view, force);
      }
    });
  },

  // Remove a single nested View.
  _removeView: function(view, force) {
    var parentViews;
    // Shorthand the manager for easier access.
    var manager = view.__manager__;
    // Test for keep.
    var keep = typeof view.keep === "boolean" ? view.keep : view.options.keep;

    // Only remove views that do not have `keep` attribute set, unless the
    // View is in `append` mode and the force flag is set.
    if (!keep && (manager.append === true || force)) {
      // Clean out the events.
      LayoutManager.cleanViews(view);

      // Since we are removing this view, force subviews to remove
      view._removeViews(true);  
           
      // Remove the View completely.
      view.$el.remove();

      // Bail out early if no parent exists.
      if (!manager.parent) { return; }

      // Assign (if they exist) the sibling Views to a property.
      parentViews = manager.parent.views[manager.selector];

      // If this is an array of items remove items that are not marked to
      // keep.
      if (_.isArray(parentViews)) {
        // Remove duplicate Views.
        return _.each(_.clone(parentViews), function(view, i) {
          // If the managers match, splice off this View.
          if (view && view.__manager__ === manager) {
            aSplice.call(parentViews, i, 1);
          }
        });
      }

      // Otherwise delete the parent selector.
      delete manager.parent.views[manager.selector];
    }
  },

  // Accept either a single view or an array of views to clean of all DOM
  // events internal model and collection references and all Backbone.Events.
  cleanViews: function(views) {
    // Clear out all existing views.
    _.each(aConcat.call([], views), function(view) {
      // Remove all custom events attached to this View.
      view.unbind();

      // Automatically unbind `model`.
      if (view.model instanceof Backbone.Model) {
        view.model.off(null, null, view);
      }

      // Automatically unbind `collection`.
      if (view.collection instanceof Backbone.Collection) {
        view.collection.off(null, null, view);
      }

      // If a custom cleanup method was provided on the view, call it after
      // the initial cleanup is done
      if (view.cleanup) {
        view.cleanup.call(view);
      }
    });
  },

  // Cache templates into LayoutManager._cache.
  cache: function(path, contents) {
    // If template path is found in the cache, return the contents.
    if (path in this._cache) {
      return this._cache[path];
    // Ensure path and contents aren't undefined.
    } else if (path != null && contents != null) {
      return this._cache[path] = contents;
    }

    // If the template is not in the cache, return undefined.
  },

  // This static method allows for global configuration of LayoutManager.
  configure: function(opts) {
    this.augment(LayoutManager.prototype.options, opts);

    // Allow LayoutManager to manage Backbone.View.prototype.
    if (opts.manage) {
      Backbone.View.prototype.manage = true;
    }
  },
  
  augment: !_.forIn ? _.extend : function(destination) {
    return _.reduce(Array.prototype.slice.call(arguments, 1), function(destination, source) {
      _.forIn(source, function(value, key) { destination[key] = value; });
      return destination;
    }, destination);
  },
  
  // Configure a View to work with the LayoutManager plugin.
  setupView: function(view, options) {
    // If the View has already been setup, no need to do it again.
    if (view.__manager__) {
      return;
    }

    var views, declaredViews, viewOptions;
    var proto = Backbone.LayoutManager.prototype;
    var viewOverrides = _.pick(view, keys);

    // Ensure necessary properties are set.
    _.defaults(view, {
      // Ensure a view always has a views object.
      views: {},

      // Internal state object used to store whether or not a View has been
      // taken over by layout manager and if it has been rendered into the DOM.
      __manager__: {},

      // Add the ability to remove all Views.
      _removeViews: LayoutManager._removeViews,

      // Add the ability to remove itself.
      _removeView: LayoutManager._removeView

    // Mix in all LayoutManager prototype properties as well.
    }, LayoutManager.prototype);

    // Extend the options with the prototype and passed options.
    options = view.options = _.defaults(options || {}, view.options,
      proto.options);

    // Ensure view events are properly copied over.
    viewOptions = _.pick(options, aConcat.call(["events"],
      _.values(options.events || {})));

    // Merge the View options into the View.
    LayoutManager.augment(view, viewOptions);

    // If the View still has the Backbone.View#render method, remove it.  Don't
    // want it accidentally overriding the LM render.
    if (viewOverrides.render === LayoutManager.prototype.render ||
      viewOverrides.render === Backbone.View.prototype.render) {
      delete viewOverrides.render;
    }

    // Pick out the specific properties that can be dynamically added at
    // runtime and ensure they are available on the view object.
    LayoutManager.augment(options, viewOverrides);

    // By default the original Remove function is the Backbone.View one.
    view._remove = Backbone.View.prototype.remove;

    // Always use this render function when using LayoutManager.
    view._render = function(manage, options) {
      // Keep the view consistent between callbacks and deferreds.
      var view = this;
      // Shorthand the manager.
      var manager = view.__manager__;
      // Cache these properties.
      var beforeRender = options.beforeRender;

      // Ensure all nested Views are properly scrubbed if re-rendering.
      if (manager.hasRendered) {
        this._removeViews();
      }

      // If a beforeRender function is defined, call it.
      if (beforeRender) {
        beforeRender.call(this, this);
      }

      // Always emit a beforeRender event.
      this.trigger("beforeRender", this);

      // Render!
      return manage(this, options).render();
    };

    // Ensure the render is always set correctly.
    view.render = LayoutManager.prototype.render;

    // If the user provided their own remove override, use that instead of the
    // default.
    if (view.remove !== proto.remove) {
      view._remove = view.remove;
      view.remove = proto.remove;
    }
    
    // Normalize views to exist on either instance or options, default to
    // options.
    views = options.views || view.views;

    // Set the internal views, only if selectors have been provided.
    if (_.keys(views).length) {
      // Keep original object declared containing Views.
      declaredViews = views;

      // Reset the property to avoid duplication or overwritting.
      view.views = {};

      // Set the declared Views.
      view.setViews(declaredViews);
    }

    // If a template is passed use that instead.
    if (view.options.template) {
      view.options.template = options.template;
    // Ensure the template is mapped over.
    } else if (view.template) {
      options.template = view.template;

      // Remove it from the instance.
      delete view.template;
    }
  }
});

// Convenience assignment to make creating Layout's slightly shorter.
Speak.Definitions.Views.CompositeView = Backbone.Layout = Backbone.LayoutView = Backbone.LayoutManager = LayoutManager;
// Tack on the version.
LayoutManager.VERSION = "0.7.5";

// Override _configure to provide extra functionality that is necessary in
// order for the render function reference to be bound during initialize.
Backbone.View.prototype._configure = function() {
  // Run the original _configure.
  var retVal = _configure.apply(this, arguments);

  // If manage is set, do it!
  if (this.manage) {
    // Set up this View.
    LayoutManager.setupView(this);
  }

  // Act like nothing happened.
  return retVal;
};

// Default configuration options; designed to be overriden.
LayoutManager.prototype.options = {
  // Prefix template/layout paths.
  prefix: "",

  // Can be used to supply a different deferred implementation.
  deferred: function() {
    return $.Deferred();
  },

  // Fetch is passed a path and is expected to return template contents as a
  // function or string.
  fetch: function(path) {
    return _.template($(path).html());
  },

  // This is the most common way you will want to partially apply a view into
  // a layout.
  partial: function(root, name, el, append) {
    // If no selector is specified, assume the parent should be added to.
    var $root = name ? $(root).find(name) : $(root);

    // Use the append method if append argument is true.
    this[append ? "append" : "html"]($root, el);
  },

  // Override this with a custom HTML method, passed a root element and an
  // element to replace the innerHTML with.
  html: function($root, el) {
    $root.html(el);
  },

  // Very similar to HTML except this one will appendChild.
  append: function($root, el) {
    $root.append(el);
  },

  // Return a deferred for when all promises resolve/reject.
  when: function(promises) {
    return $.when.apply(null, promises);
  },

  // By default, render using underscore's templating.
  render: function(template, context) {
    return template(context);
  },

  // A method to determine if a View contains another.
  contains: function(parent, child) {
    return $.contains(parent, child);
  }
};

// Maintain a list of the keys at define time.
keys = _.keys(LayoutManager.prototype.options);

LayoutManager.prototype.options = _.extend(LayoutManager.prototype.options, {
  // function or string.
  fetch: function (path, selector, controlId) {
    var templateEl = "[data-layout-" + path + "]";

    if (selector) {
        templateEl = "[data-layout-" + path + "='" + selector + "']";
    }
    /*PDE: should change this code in order to find the template inside the component*/
    //var template = $(selector).find("[data-layout-"+ path +"]").html();
    var template = $(templateEl).html();
    if(template === undefined) {
      throw "missing template data-layout-" + path + " in order to work";
    }
    return _.template(template);
  }
});

})(this);
data.DatabaseUri = function(databaseName) {
  if (!databaseName) {
    throw "Parameter 'databaseName' is null or empty";
  }

  this.databaseName = databaseName;
  this.webApi = "";
  this.virtualFolder = "/sitecore/shell";
};

_.extend(data.DatabaseUri.prototype, {
  getDatabaseName: function() {
    return this.databaseName;
  }
});


data.ItemUri = function(databaseUri, itemId) {
  if (!databaseUri) {
    throw "Parameter 'databaseUri' is null or empty";
  }

  if (!itemId) {
    throw "Parameter 'itemId' is null or empty";
  }

  this.databaseUri = databaseUri;
  this.itemId = itemId;
};

_.extend(data.ItemUri.prototype, {
  getDatabaseName: function() {
    return this.databaseUri.databaseName;
  },  
  getDatabaseUri: function() {
    return this.databaseUri;
  },
  getItemId: function() {
    return this.itemId;
  }
});

data.ItemVersionUri = function(itemUri, language, version)
{
  if (!itemUri) {
    throw "Parameter 'itemUri' is null";
  }

  if (!language) {
    throw "Parameter 'language' is null or empty";
  }

  if (!_.isNumber(version)) {
    throw "Parameter 'version' is null or not a number";
  }

  this.itemUri = itemUri;
  this.language = language;
  this.version = version;
};

_.extend(data.ItemVersionUri.prototype, {
  getDatabaseUri: function() {
    return this.itemUri.getDatabaseUri();
  },
  getDatabaseName: function() {
    return this.itemUri.getDatabaseName();
  },
  getItemUri: function () {
    return this.itemUri;
  },
  getItemId: function () {
    return this.itemUri.getItemId();
  },
  getLanguage: function() {
    return this.language;
  },
  getVersion: function() {
    return this.version;
  }
});

data.FieldUri = function(itemVersionUri, fieldId) {
  if (!itemVersionUri) {
    throw "Parameter 'itemVersionUri' is null or empty";
  }

  if (!fieldId) {
    throw "Parameter 'fieldId' is null or empty";
  }

  this.itemVersionUri = itemVersionUri;
  this.fieldId = fieldId;
};

_.extend(data.FieldUri.prototype, {
  getDatabaseUri: function() {
    return this.itemVersionUri.getDatabaseUri();
  },
  getDatabaseName: function() {
    return this.itemVersionUri.getDatabaseName();
  },
  getItemUri: function () {
    return this.itemVersionUri.getItemUri();
  },
  getItemId: function () {
    return this.itemVersionUri.getItemId();
  },
  getLanguage: function() {
    return this.itemVersionUri.getLanguage();
  },
  getVersion: function() {
    return this.itemVersionUri.getVersion();
  },
  getFieldId: function() {
    return this.fieldId;
  }
});
data.Database = function (databaseUri) {
  if (!databaseUri) {
    throw "Parameter 'databaseUri' is null";
  }

  this.databaseUri = databaseUri;
  this.ajaxOptions = { dataType: "json" };
};

_.extend(data.Database.prototype, {
  convertToItem: function(data) {
    if (!data.result) {
      console.debug("ERROR: No data from server");
      return null;
    }

    if (!data.result.items) {
      console.debug("ERROR: No items from server");
      return null;
    }

    if (data.result.items.length === 0) {
      return null;
    }

    if (data.result.items.length > 1) {
      console.debug("ERROR: Expected a single item");
      return null;
    }

    return new _sc.Definitions.Data.Item(data.result.items[0]);
  },
  convertToItems: function(data) {
    if (!data.result) {
      console.debug("ERROR: No data from server");
      return { items: [], totalCount: 0, data: data };
    }

    if (!data.result.items) {
      console.debug("ERROR: No items from server");
      return { items: [], totalCount: 0, data: data };
    }

    var items = _.map(data.result.items, function (itemData) {
      return new _sc.Definitions.Data.Item(itemData); 
    });

    return { items: items, total: data.result.totalCount, data: data.result };
  },
  getItem: function(id, completed, options) {
    if (!id) {
      throw "Parameter 'id' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    options = options || {};
    if (id instanceof _sc.Definitions.Data.ItemUri) {
      options.database = id.getDatabaseName();
      id = id.getItemId();
    }

    if (id instanceof _sc.Definitions.Data.ItemVersionUri) {
      options.database = id.getDatabaseName();
      options.language = id.getLanguage();
      options.version = id.getVersion();
      id = id.getItemId();
    }

    var url = this.getUrl(id, options);

    if (options["scope"] && (_.contains(options["scope"], "parent") || _.contains(options["scope"], "children"))) {
      this.get(url).pipe(this.convertToItems).done(completed).fail(function (err) {
        completed(null, err);
      });
    } else {
      this.get(url).pipe(this.convertToItem).done(completed).fail(function (err) {
        completed(null, err);
      });
    }
  },
  search: function(searchText, completed, options) {
    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    var url = this.getUrl("search:" + searchText, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  
  query: function(queryExpression, completed, options) {
    if (!queryExpression) {
      throw "Parameter 'queryExpression' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    var url = this.getUrl("query:" + queryExpression, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  getChildren: function(id, completed, options) {
    if (!id) {
      throw "Parameter 'id' is null";
    }

    if (!completed) {
      throw "Parameter 'completed' is null";
    }

    options = options || {};
    if (!options.scope) {
      options.scope = ["children"];
    }

    var url = this.getUrl(id, options);

    this.get(url).pipe(this.convertToItems).done(function (data) {
      completed(data.items, data.total, data.data);
    }).fail(function (err) {
      completed([], 0, err);
    });
  },
  getUrl: function(itemSelector, options) {
    options = options || {};
    if (!options.database) {
      options.database = this.databaseUri.getDatabaseName();
    }

    if (!options.webApi) {
      options.webApi= this.databaseUri.webApi;
    }

    if (!options.virtualFolder) {
      options.virtualFolder = this.databaseUri.virtualFolder;
    }

    var url = Speak.Web.itemWebApi.getUrl(itemSelector, options);
    
    return url;
  },
  get: function (url) {
    return $.ajax({
      url: url,
      dataType: this.ajaxOptions.dataType
    });
  }
});
data.Field = function(item, fieldUri, fieldName, value, type) {
  if (!item) {
    throw "Parameter 'item' is null";
  }

  if (!(fieldUri instanceof data.FieldUri)) {
    throw "Parameter 'fieldUri' is null";
  }

  this.item = item;
  this.fieldUri = fieldUri;
  this.fieldName = fieldName || "";
  this.value = value || "";
  this.type = type || "Single-Line Text";
};

_.extend(data.Field.prototype, {
  toModel: function () {
    if (!this.$model) {
      this.$model = new _sc.Definitions.Models.Model(this);
    }

    return this.$model;
  },
  toViewModel: function () {
    var vm = {
      fieldId: this.fieldUri.getFieldId(),
      fieldName: this.fieldName,
      type: this.type,
      value: new ko.observable(this.value)
    };

    var self = this;
    vm.value.subscribe(function(newValue) {
      self.item[self.fieldName] = newValue;
      self.value = newValue;
    });
    return vm;
  }
});

data.LocalStorage = function (appID) {
    if(!appID) {
        throw "you need to provide a unique key";
    }
    this.appID = appID;
    this.fullKey = this.prefix + this.appID;
    this.localStorageLibrary = $.jStorage;
};

_.extend(data.LocalStorage.prototype, {
    prefix: "#sc#",
    get: function (key) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.get(realKey);
    },
    getAll: function() {
      var index = this.localStorageLibrary.index()
          , result = {}
          , appKeys;

      appKeys = _.filter(index, function(key){
          return (key.indexOf(this.fullKey) >= 0);
      }, this);

      _.each(appKeys, function(key){
          var objKey = key.substring(this.fullKey.length, key.length);

          result[objKey] = this.localStorageLibrary.get(key);
      }, this);

      return result;
    },
    deleteRecord: function(key) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.deleteKey(realKey);
    },
    /**
     * options: {TTL: 1000}
     */
    set: function(key, value, options) {
      var realKey = this.fullKey + key;
      return this.localStorageLibrary.set(realKey, value, options)
    },
    /**
     * Will flush only the key which begins with the right prefix
     */
    flush: function() {
      var index = this.localStorageLibrary.index();

      var appKeys = _.filter(index, function(key){
          return (key.indexOf(this.fullKey) >= 0);
      }, this);

      _.each(appKeys, function(key){
          this.localStorageLibrary.deleteKey(key);
      }, this);
    } 
});
var ajaxHelper = {
  options: function (method, data) {
    return {
      dataType: "json",
      type: method,
      data: data
    };
  },
  convertResponse: function (data) {
    if (data.statusCode !== 200) {
      return $.Deferred().reject({
        readyState: 4,
        status: data.statusCode,
        responseText: data.error.message
      });
    }

    return data.result;
  },
  createItem: function (data) {
    return new _sc.Definitions.Data.Item(data.items[0]);
  },
  triggerCreated: function (item) {
    _sc.trigger("item:created", item);
    return item;
  }
};
/**
 * Creating an Item using ItemWebApi
 * @param {itemDefinition} - minium definition for an Item {name, templateId, parentId, database }.
 *        - master database will be used if not defined
 * @param {callback} - function which will be executed as soon as the Item is created on the server
 */
var create = function (itemDefinition, fields, completed) {
  var item = itemDefinition, antiCsrfToken;

  if (!itemDefinition.name || !itemDefinition.templateId || !itemDefinition.parentId) {
    throw "Provide valid parameter in order to create an Item";
  }

  if (!itemDefinition.database) {
    itemDefinition.database = "core";
  }

  var url = _sc.Web.itemWebApi.getUrl(item.parentId, {
    webApi: "/-/item/v1/sitecore/shell",
    database: itemDefinition.database
  });

  url = _sc.Helpers.url.addQueryParameters(url, {
    name: itemDefinition.name
  });

  url = _sc.Helpers.url.addQueryParameters(url, {
    template: itemDefinition.templateId
  });

  antiCsrfToken = _sc.Helpers.antiForgery.getAntiForgeryToken();
  fields[antiCsrfToken.formKey] = antiCsrfToken.value;
  
  return $.when($.ajax(url, ajaxHelper.options("POST", fields)))
    .pipe(ajaxHelper.convertResponse)
    .pipe(ajaxHelper.createItem)
    .pipe(ajaxHelper.triggerCreated)
    .done(completed);
},//updateBackbone
  update = function (completed, context) {
    var dataToSend;

    if (!this.$fields) {
      //in case if the model was translated to Backbone model
      dataToSend = _.map(this.attributes.$fields, function (field) {
        var res;
        //update only changed fields
        if (this.attributes[field.fieldName] !== field.value) {
          res = {
            name: field.fieldName,
            value: this.attributes[field.fieldName]
          };
          return res;
        }
      }, this);

      dataToSend = _.filter(dataToSend, function (field) {
        return typeof field !== "undefined";
      });

    } else {
      //case when fields not nested in the attributes collection
      dataToSend = _.map(this.$fields, function (field) {
        return {
          name: field.fieldName,
          value: this[field.fieldName]
        };
      }, this);
    }

    var url = this.getUrl();

    var ajaxOptions = {
      dataType: "json",
      type: "PUT",
      data: dataToSend
    };

    var triggerUpdated = function (result) {
      _sc.trigger("item:updated", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerUpdated).done($.proxy(completed, context));
  },
  read = function (completed, context) {
    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "GET"
    };

    var updateFields = function (data) {
      if (!data.items) {
        return this;
      }

      if (data.items.length === 0) {
        throw "Item not found";
      }

      if (date.items.length > 1) {
        throw "Expected a single item";
      }

      var itemData = data.items[0];

      _.each(itemData.Fields, function (field, fieldId) {
        this[field.Name] = field.Value;

        var f = this.getFieldById(fieldId);
        if (f != null) {
          f.value = field.Value;
        } else {
          this.$fields.push(this, new Speak.Definitions.Data.Field(fieldUri, field.Name, field.Value, field.Type));
        }
      }, this);

      return this;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(updateFields).done($.proxy(completed, context));
  },
  remove = function (completed, context) {
    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "DELETE"
    };

    var triggerDeleted = function (result) {
      _sc.trigger("item:deleted", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerDeleted).done($.proxy(completed, context));
  },
  rename = function (newName, completed, context) {
    var data = [{
        name: "__itemName",
        value: newName
      }
    ];

    var url = this.getUrl();
    var ajaxOptions = {
      dataType: "json",
      type: "PUT",
      data: data
    };

    var triggerRenamed = function (result) {
      _sc.trigger("item:renamed", this);
      return result;
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(this.convertResponse).pipe(triggerRenamed).done($.proxy(completed, context));
  };

data.createItem = create;

var itemSync = function (method, completed, options) {
  var self = this;
  options = options || {};
  var success = options.success || function () {
      if (completed) {
        completed(self);
      }
    };

  switch (method) {
  case 'read':
    this.read(this).pipe(success);
    break;
  case 'create':
    throw "The 'create' operation is not supported";
  case 'update':
    this.update(this, options).pipe(success);
    break;
  case 'delete':
    this.remove(this).pipe(success);
    break;
  }
};

var ItemBackbone = Speak.Definitions.Models.Model.extend({
  idAttribute: "itemId",
  getUrl: function () {
    var itemUri = this.get("itemUri"),
      database = new data.Database(itemUri.getDatabaseUri());

    return database.getUrl(itemUri.getItemId());
  },
  read: read,
  remove: remove,
  rename: rename,
  update: update
});


data.Item = function (itemUri, itemData) {
  if (!itemData) {
    itemData = itemUri;

    if (itemData.itemUri) {
      itemUri = itemData.itemUri;
    } else {
      var databaseUri = new data.DatabaseUri(itemData.Database);
      itemUri = new data.ItemUri(databaseUri, itemData.ID);
    }
  }

  if (itemData instanceof data.Item) {
    this.shallowCopy(itemData);
    return;
  }

  this.$fields = [];

  _.each(itemData.Fields, function (field, fieldId) {
    this[field.Name] = field.Value;

    var fieldUri = new data.FieldUri(itemUri, fieldId);

    var itemField = new data.Field(this, fieldUri, field.Name, field.Value, field.Type);
    
    if (field.FormattedValue) {
      itemField.formattedValue = field.FormattedValue;
    }
    if (field.LongDateValue) {
      itemField.longDateValue = field.LongDateValue;
    }
    if (field.ShortDateValue) {
      itemField.shortDateValue = field.ShortDateValue;
    }
    
    this.$fields.push(itemField);
  }, this);

  this.itemUri = itemUri;
  this.itemId = itemUri.getItemId();
  this.itemName = itemData.Name || "";
  /*not field on the Item on Sitecore */
  this.$displayName = itemData.DisplayName || "";
  this.$database = itemData.Database || "";
  this.$language = itemData.Language || "";
  this.$version = itemData.Version || 0;
  this.$templateName = itemData.TemplateName || "";
  this.$templateId = itemData.TemplateId || "";
  this.$hasChildren = itemData.HasChildren || false;
  this.$path = itemData.Path || "";
  this.$url = itemData.Url || "";
  this.$mediaurl = itemData.MediaUrl || "";
  this.$icon = itemData.Icon || "";
};

_.extend(data.Item.prototype, {
  getFieldById: function (fieldId) {
    return _.find(this.$fields, function (field) {
      return field.fieldUri.getFieldId() == fieldId;
    }, this);
  },
  shallowCopy: function (item) {
    this.$fields = item.$fields;

    _.each(item.$fields, function (field, fieldId) {
      this[field.Name] = field.Value;
    }, this);

    this.itemUri = item.itemUri;
    this.itemId = item.itemId;
    this.itemName = item.itemName;
    this.$displayName = item.$displayName;
    this.$language = item.$language;
    this.$version = item.$version;
    this.$templateName = item.$templateName;
    this.$templateId = item.$templateId;
    this.$hasChildren = item.$hasChildren;
    this.$path = item.$path;
    this.$url = item.$url;
    this.$mediaurl = item.$mediaurl;
  },
  toModel: function () {
    if (!this.$model) {
      var item = new ItemBackbone(this);
      item.sync = itemSync;
      return item;
    }
    return this.$model;
  },
  toViewModel: function () {
    return this.toModel().viewModel;
  },
  convertResponse: ajaxHelper.convertResponse
});
_.extend(_sc.Factories, {
  createJQueryUIComponent: function (Models, Views, control, separateWidgetModel) {
    var model = Models.ControlModel.extend({
      initialize: function (options) {
        this._super();

        /* copy functions from the control to the model */
        if (control.model) {
          _.each(_.keys(control.model), function (member) {
            this.model[member] = control.model[member];
          }, this);
        }

        /* create attributes */
        _.each(control.attributes, function (attribute) {
          var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
          this.set(attribute.name, defaultValue);
        }, this);

        /* call post initialize function */
        if (typeof this.initialized != "undefined") {
          this.initialized();
        }
      }
    });

    /*separate model for plugin*/
    var widgetModel;
    if (separateWidgetModel) {
      widgetModel = Models.ControlModel.extend({
        initialize: function (options) {
          this._super();

          /* create attributes */
          _.each(control.attributes, function (attribute) {
            //skip the sitecore added properties in model
            if (attribute.added == true)
              return;
            //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
            var pluginPropertyName = typeof attribute.pluginProperty !== "undefined" ? attribute.pluginProperty : attribute.name;
            var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
            this.set(pluginPropertyName, defaultValue);
          }, this);

          /* call post initialize function */
          if (typeof this.initialized != "undefined") {
            this.initialized();
          }
        }
      });
    }

    var view = Views.ControlView.extend({
      initialize: function (options) {
        this._super();
        var pluginPropertyName;

        options = options || {};

        /* copy functions from the control to the view */
        if (control.view) {
          _.each(_.keys(control.view), function (member) {
            this[member] = control.view[member];
          }, this);
        }

        if (separateWidgetModel) 
          this.widgetModel = new widgetModel();
        
        /* setup attributes on the model */
        _.each(control.attributes, function (attribute) {
          pluginPropertyName = typeof attribute.pluginProperty !== "undefined" ? attribute.pluginProperty : attribute.name;
          var defaultValue = typeof attribute.defaultValue != "undefined" ? attribute.defaultValue : null;
          if (typeof defaultValue !== "undefined" && defaultValue !== null) 
            options[pluginPropertyName] = defaultValue;

          var value = this.$el.attr("data-sc-option-" + pluginPropertyName);

          if (value) {
            if (value == "true") {
              value = true;
            }

            if (value == "false") {
              value = false;
            }
            if (separateWidgetModel) {
              if (this.widgetModel.has(pluginPropertyName))
                this.model.set(pluginPropertyName, value);
            }            
            else
              this.model.set(attribute.name, value);

            /*if (typeof options[attribute.name] === "undefined") {*/
            options[pluginPropertyName] = value;
            /*}*/
          }
        }, this);
        
        /* setup events */
        _.each(control.events, function (eventDescriptor) {
          if (typeof options[eventDescriptor.name] === "undefined") {
            var self = this;
            options[eventDescriptor.name] = function (e, data) {
              self.raiseEvent(eventDescriptor, e, data);
            };
          }
        }, this);

        /* create the jquery ui component */
        this.$el[control.control](options);
        this.widget = this.$el[control.control];

        this.widget = this.widget || this.$el.data(control.control);
        /*after update to jqeryUI 1.10.1 widget retrieving should be done by calling $el.data("widgetNamespace-widgetName")*/
        this.widget = this.widget || this.$el.data(control.namespace + control.control);

        /* setup functions */
        _.each(control.functions, function (functionDescriptor) {
          var self = this;
          //setting the control.function to run appropriate one from the widget
          this[functionDescriptor.name] = function () {
            //if there is no method with appropriate name just inside the widget object (like Datepicker)
            //trying to execute it through the $element.widgetName("methodName", parameters), e.g. $(element).datepicker("setDate","01/01/2014")
            if (!self.widget[functionDescriptor.name]) {
              var func = self.widget;
              return func.apply(self.$el, [functionDescriptor.name, arguments[0]]);
            }
            //when we have needed method inside the widget instance object - trying to execute it through widgetInstance.methodName(params)
            //this part was initialy implemented for the dynaTree library
            return self.widget[functionDescriptor.name].apply(self.widget, arguments);
          };
        }, this);

        /* subscribe to changes */
        if (separateWidgetModel) {
          this.widgetModel.on("change", function (modelArg, opts) {
            var changes = {};
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              changes[attributeName] = modelArg.get(attributeName);
            });
            this.$el[control.control]("option", changes);
          }, this);
          this.model.on("change", function (modelArg, opts) {
            var changes = {}, jqPluginPropertyName, attr;
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              //getting changed attribute object
              attr = _.find(control.attributes, function (attribute) {
                return attribute.name == attributeName;
              });
              //skip the sitecore added properties in model
              //skip the properties with manual sync
              if (attr && !(attr.added == true || attr.manualSync == true)) {
                //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
                jqPluginPropertyName = (attr && typeof attr.pluginProperty !== "undefined") ? attr.pluginProperty : attributeName;
                this.widgetModel.set(jqPluginPropertyName, modelArg.get(attributeName));
              }
            }, this);
            this.$el[control.control]("option", changes);
          }, this);
        } else {
          this.model.on("change", function (modelArg, opts) {
            var changes = {}, jqPluginPropertyName, attr;
            if (!modelArg.changed) {
              return;
            }

            _.each(_.keys(modelArg.changed), function (attributeName) {
              //skip the sitecore added properties in model
              if (!_.find(control.attributes, function (attribute) {
                return attribute.name == attributeName && attribute.added == true;
              })) {
                //getting changed attribute object
                attr = _.find(control.attributes, function (attribute) {
                  return attribute.name == attributeName;
                });

                //the name of the attribute property can be different for sitecore control model and for jqueryUI plugin
                jqPluginPropertyName = (attr && typeof attr.pluginProperty !== "undefined") ? attr.pluginProperty : attributeName;
                changes[jqPluginPropertyName] = modelArg.get(attributeName);
              }
            });
            this.$el[control.control]("option", changes);
          }, this);
        }
        
        /* call post initialize function */
        if (typeof this.initialized != "undefined") {
          this.initialized();
        }
      },
      raiseEvent: function (eventDescriptor, e, data) {
        if (eventDescriptor.on) {
          this[eventDescriptor.on](e, data);
        }

        var controlId = this.$el.attr("data-sc-id");

        var ctrl = this.app[controlId];
        if (ctrl && typeof ctrl[eventDescriptor.name] != "undefined") {
          ctrl[eventDescriptor.name](ctrl, e, data);
        }
        if (controlId) {
          this.app.trigger(eventDescriptor.name + ":" + controlId, e, data);
        }
      }
    });

    fctry.createComponent(control.componentName, model, view, control.selector);
  }
});
  if(__SPEAKDEBUG) {

    var numberOfApps = 0
        , totalNumberOfControls = 0
        , totlaNumberOfApp = 0
        , alltheControls = [];

    var retrieveAppInfo = function(app) {      
      var numberOfNestedApp = 0,
          nestedApps = [],
          nbControlInThisApp = 0;

        for(var param in app) {
          if(app[param] && app[param].modelType === "application") {
            var app = app[param];
            totlaNumberOfApp += 1;
            numberOfNestedApp += 1;

            _.each(app.Controls, function(control){
              totalNumberOfControls += 1;
              nbControlInThisApp += 1;
              alltheControls.push(control);
            });
            nestedApps.push(retrieveAppInfo(app[param]));
          }
        }
        return {
          numberOfNestedApp: numberOfApps,
          nestedApps: nestedApps,
          nbControlInThisApp: nbControlInThisApp
        };
    };

    var getAllInfo = function() {
      var appStats = retrieveAppInfo(Speak);
      return {
        numberOfApps: numberOfApps,
        totalNumberOfControls: totalNumberOfControls,
        totlaNumberOfApp: totlaNumberOfApp,
        alltheControls: alltheControls,
        allApplications: appStats
      };
    };

    _sc.__info = function() {
      return  {
        Components: {
          totalComponents: Speak.Components.length,
          compontentList: Speak.Components
        },
        Pipelines: {
          totalPipelines: Speak.Pipelines.length()
        },
        Applications: getAllInfo()
      };
    }
  }
}).call(window);