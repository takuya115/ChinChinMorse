
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var morsify = createCommonjsModule(function (module, exports) {
    (((name, root, factory) => {
      {
        module.exports = factory();
      }
    })('morsify', commonjsGlobal, () => {

      const characters = {
        '1': { // Latin => https://en.wikipedia.org/wiki/Morse_code
          'A': '01', 'B': '1000', 'C': '1010', 'D': '100', 'E': '0', 'F': '0010',
          'G': '110', 'H': '0000', 'I': '00', 'J': '0111', 'K': '101', 'L': '0100',
          'M': '11', 'N': '10', 'O': '111', 'P': '0110', 'Q': '1101', 'R': '010',
          'S': '000', 'T': '1', 'U': '001', 'V': '0001', 'W': '011', 'X': '1001',
          'Y': '1011', 'Z': '1100'
        },
        '2': { // Numbers
          '0': '11111', '1': '01111', '2': '00111', '3': '00011', '4': '00001',
          '5': '00000', '6': '10000', '7': '11000', '8': '11100', '9': '11110'
        },
        '3': { // Punctuation
          '.': '010101', ',': '110011', '?': '001100', '\'': '011110', '!': '101011', '/': '10010',
          '(': '10110', ')': '101101', '&': '01000', ':': '111000', ';': '101010', '=': '10001',
          '+': '01010', '-': '100001', '_': '001101', '"': '010010', '$': '0001001', '@': '011010',
          '¿': '00101', '¡': '110001'
        },
        '4': { // Latin Extended => https://ham.stackexchange.com/questions/1379/international-characters-in-morse-code
          'Ã': '01101', 'Á': '01101', 'Å': '01101', 'À': '01101', 'Â': '01101', 'Ä': '0101',
          'Ą': '0101', 'Æ': '0101', 'Ç': '10100', 'Ć': '10100', 'Ĉ': '10100', 'Č': '110',
          'Ð': '00110', 'È': '01001', 'Ę': '00100', 'Ë': '00100', 'É': '00100',
          'Ê': '10010', 'Ğ': '11010', 'Ĝ': '11010', 'Ĥ': '1111', 'İ': '01001', 'Ï': '10011',
          'Ì': '01110', 'Ĵ': '01110', 'Ł': '01001', 'Ń': '11011', 'Ñ': '11011', 'Ó': '1110',
          'Ò': '1110', 'Ö': '1110', 'Ô': '1110', 'Ø': '1110', 'Ś': '0001000', 'Ş': '01100',
          'Ș': '1111', 'Š': '1111', 'Ŝ': '00010', 'ß': '000000', 'Þ': '01100', 'Ü': '0011',
          'Ù': '0011', 'Ŭ': '0011', 'Ž': '11001', 'Ź': '110010', 'Ż': '11001'
        },
        '5': { // Cyrillic Alphabet => https://en.wikipedia.org/wiki/Russian_Morse_code
          'А': '01', 'Б': '1000', 'В': '011', 'Г': '110', 'Д': '100', 'Е': '0',
          'Ж': '0001', 'З': '1100', 'И': '00', 'Й': '0111', 'К': '101','Л': '0100',
          'М': '11', 'Н': '10', 'О': '111', 'П': '0110', 'Р': '010', 'С': '000',
          'Т': '1', 'У': '001', 'Ф': '0010', 'Х': '0000', 'Ц': '1010', 'Ч': '1110',
          'Ш': '1111', 'Щ': '1101', 'Ъ': '11011', 'Ы': '1011', 'Ь': '1001', 'Э': '00100',
          'Ю': '0011', 'Я': '0101', 'Ї': '01110', 'Є': '00100', 'І': '00', 'Ґ': '110'
        },
        '6': { // Greek Alphabet => https://en.wikipedia.org/wiki/Morse_code_for_non-Latin_alphabets
          'Α': '01', 'Β':'1000', 'Γ':'110', 'Δ':'100', 'Ε':'0', 'Ζ':'1100',
          'Η':'0000', 'Θ':'1010', 'Ι': '00', 'Κ': '101', 'Λ': '0100', 'Μ': '11',
          'Ν': '10', 'Ξ': '1001', 'Ο': '111', 'Π': '0110', 'Ρ': '010', 'Σ':'000',
          'Τ':'1', 'Υ': '1011', 'Φ':'0010', 'Χ': '1111', 'Ψ': '1101', 'Ω':'011'
        },
        '7': { // Hebrew Alphabet => https://en.wikipedia.org/wiki/Morse_code_for_non-Latin_alphabets
          'א': '01', 'ב': '1000', 'ג': '110', 'ד': '100', 'ה': '111', 'ו': '0',
          'ז': '1100', 'ח': '0000', 'ט': '001', 'י': '00', 'כ': '101', 'ל': '0100',
          'מ': '11', 'נ': '10', 'ס': '1010', 'ע': '0111', 'פ': '0110', 'צ': '011',
          'ק': '1101', 'ר': '010', 'ש': '000', 'ת': '1'
        },
        '8': { // Arabic Alphabet => https://en.wikipedia.org/wiki/Morse_code_for_non-Latin_alphabets
          'ا': '01', 'ب': '1000', 'ت': '1', 'ث': '1010', 'ج': '0111', 'ح': '0000',
          'خ': '111', 'د': '100', 'ذ': '1100', 'ر': '010', 'ز': '1110', 'س': '000',
          'ش': '1111', 'ص': '1001', 'ض': '0001', 'ط': '001', 'ظ': '1011', 'ع': '0101',
          'غ': '110', 'ف': '0010', 'ق': '1101', 'ك': '101', 'ل': '0100', 'م':	'11',
          'ن':	'10', 'ه':	'00100', 'و':	'011', 'ي':	'00', 'ﺀ':	'0'
        },
        '9': { // Persian Alphabet => https://en.wikipedia.org/wiki/Morse_code_for_non-Latin_alphabets
          'ا': '01', 'ب': '1000', 'پ': '0110', 'ت': '1', 'ث': '1010', 'ج': '0111',
          'چ': '1110', 'ح': '0000', 'خ' : '1001', 'د': '100', 'ذ': '0001', 'ر': '010',
          'ز': '1100', 'ژ': '110', 'س': '000', 'ش': '1111', 'ص': '0101', 'ض': '00100',
          'ط': '001', 'ظ': '1011', 'ع': '111', 'غ': '0011', 'ف': '0010', 'ق': '111000',
          'ک': '101', 'گ': '1101', 'ل': '0100', 'م': '11', 'ن': '10', 'و': '011',
          'ه': '0', 'ی': '00'
        },
        '10': { // Japanese Alphabet => https://ja.wikipedia.org/wiki/%E3%83%A2%E3%83%BC%E3%83%AB%E3%82%B9%E7%AC%A6%E5%8F%B7#%E5%92%8C%E6%96%87%E3%83%A2%E3%83%BC%E3%83%AB%E3%82%B9%E7%AC%A6%E5%8F%B7
          'ア': '11011', 'カ': '0100', 'サ': '10101', 'タ': '10',	'ナ': '010', 'ハ': '1000',
          'マ': '1001', 'ヤ': '011', 'ラ': '000', 'ワ': '101', 'イ': '01', 'キ': '10100',
          'シ': '11010', 'チ': '0010', 'ニ': '1010', 'ヒ': '11001', 'ミ': '00101', 'リ': '110',
          'ヰ': '01001', 'ウ': '001', 'ク': '0001', 'ス': '11101', 'ツ': '0110', 'ヌ': '0000',
          'フ': '1100', 'ム': '1', 'ユ': '10011', 'ル': '10110', 'ン': '01010', 'エ': '10111',
          'ケ': '1011', 'セ': '01110', 'テ': '01011', 'ネ': '1101', 'ヘ': '0', 'メ': '10001',
          'レ': '111', 'ヱ': '01100', 'オ': '01000', 'コ': '1111', 'ソ':'1110', 'ト': '00100',
          'ノ': '0011', 'ホ': '100', 'モ': '10010', 'ヨ': '11', 'ロ': '0101', 'ヲ': '0111',
          '゛': '00', '゜': '00110', '。': '010100',  'ー': '01101', '、': '010101',
          '（': '101101', '）': '010010'
        },
        '11': { // Korean Alphabet => https://en.wikipedia.org/wiki/SKATS
          'ㄱ': '0100', 'ㄴ': '0010', 'ㄷ': '1000', 'ㄹ': '0001', 'ㅁ': '11', 'ㅂ': '011',
          'ㅅ': '110', 'ㅇ': '101', 'ㅈ': '0110', 'ㅊ': '1010', 'ㅋ': '1001', 'ㅌ': '1100',
          'ㅍ': '111', 'ㅎ': '0111', 'ㅏ': '0', 'ㅑ': '00', 'ㅓ': '1', 'ㅕ': '000',
          'ㅗ': '01', 'ㅛ': '10', 'ㅜ': '0000', 'ㅠ': '010', 'ㅡ': '100', 'ㅣ': '001'
        },
        '12' : { // Thai Alphabet => https://th.wikipedia.org/wiki/รหัสมอร์ส
          'ก': '110', 'ข': '1010', 'ค': '101', 'ง': '10110', 'จ': '10010',
          'ฉ': '1111', 'ช': '1001', 'ซ': '1100', 'ญ': '0111', 'ด': '100',
          'ต': '1', 'ถ': '10100', 'ท': '10011', 'น': '10', 'บ': '1000',
          'ป': '0110', 'ผ':'1101', 'ฝ': '10101', 'พ': '01100', 'ฟ': '0010',
          'ม': '11', 'ย': '1011', 'ร': '010', 'ล': '0100', 'ว': '011',
          'ส': '000', 'ห': '0000', 'อ': '10001', 'ฮ': '11011', 'ฤ': '01011',
          'ะ': '01000', 'า': '01', 'ิ': '00100', 'ี': '00', 'ึ': '00110',
          'ื': '0011', 'ุ': '00101', 'ู': '1110', 'เ': '0', 'แ': '0101',
          'ไ': '01001', 'โ': '111', 'ำ': '00010', '่': '001', '้': '0001',
          '๊': '11000', '๋':'01010',  'ั': '01101', '็': '11100', '์': '11001',
          'ๆ': '10111', 'ฯ': '11010'
        }
      };

      const getCharacters = (opts, usePriority) => {
        const options = getOptions(opts);
        const mapped = {};
        for (const set in characters) {
          mapped[set] = {};
          for (const key in characters[set]) {
            mapped[set][key] = characters[set][key].replace(/0/g, options.dot).replace(/1/g, options.dash);
          }
        }
        if (usePriority !== true) {
          delete mapped[0];
        }
        return mapped;
      };

      const swapCharacters = (options) => {
        const swapped = {};
        const mappedCharacters = getCharacters(options, true);
        for (const set in mappedCharacters) {
          for (const key in mappedCharacters[set]) {
            if (typeof swapped[mappedCharacters[set][key]] === 'undefined') {
              swapped[mappedCharacters[set][key]] = key;
            }
          }
        }
        return swapped;
      };

      const getOptions = (options) => {
        options = options || {};
        options.oscillator = options.oscillator || {};
        options = {
          dash: options.dash || '-',
          dot: options.dot || '.',
          space: options.space || '/',
          separator: options.separator || ' ',
          invalid: options.invalid || '#',
          priority: options.priority || 1,
          unit: options.unit || 0.08, // period of one unit, in seconds, 1.2 / c where c is speed of transmission, in words per minute
          fwUnit: options.fwUnit || options.unit || 0.08, // Farnsworth unit to control intercharacter and interword gaps
          oscillator: {
            type: options.oscillator.type || 'sine', // sine, square, sawtooth, triangle
            frequency: options.oscillator.frequency || 500,  // value in hertz
            onended: options.oscillator.onended || null  // event that fires when the tone has stopped playing
          }
        };
        characters[1][options.separator] = options.space;
        characters[0] = characters[options.priority];
        return options;
      };

      const encode = (text, opts) => {
        const options = getOptions(opts);
        return [...text.replace(/\s+/g, options.separator).trim().toLocaleUpperCase()].map(function(character) {
          for (let set in characters) {
            if (typeof characters[set] !== 'undefined' && typeof characters[set][character] !== 'undefined') {
              return characters[set][character];
            }
          }
          return options.invalid;
        }).join(options.separator).replace(/0/g, options.dot).replace(/1/g, options.dash);
      };

      const decode = (morse, opts) => {
        const options = getOptions(opts), swapped = swapCharacters(options);
        return morse.replace(/\s+/g, options.separator).trim().split(options.separator).map(function(characters) {
          if (typeof swapped[characters] !== 'undefined') {
            return swapped[characters];
          }
          return options.invalid;
        }).join('');
      };

      let AudioContext = null;
      let context = null;

      const audio = (text, opts, morseString) => {

        if (AudioContext === null && typeof window !== 'undefined') {
          AudioContext = window.AudioContext || window.webkitAudioContext;
          context = new AudioContext();
        }

        const options = getOptions(opts);
        const morse = morseString || encode(text, opts);
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        let timeout;
        let t = context.currentTime;

        oscillator.type = options.oscillator.type;
        oscillator.frequency.value = options.oscillator.frequency;
        oscillator.onended = options.oscillator.onended;

        gainNode.gain.setValueAtTime(0, t);

        const tone = (i) => {
          gainNode.gain.setValueAtTime(1, t);
          t += i * options.unit;
        };

        const silence = (i) => {
          gainNode.gain.setValueAtTime(0, t);
          t += i * options.unit;
        };

        const gap = (i) => {
          gainNode.gain.setValueAtTime(0, t);
          t += i * options.fwUnit;
        };

        for (let i = 0; i <= morse.length; i++) {
          if (morse[i] === options.space) {
            gap(7);
          } else if (morse[i] === options.dot) {
            tone(1);
            silence(1);
          } else if (morse[i] === options.dash) {
            tone(3);
            silence(1);
          } else if (
            (typeof morse[i + 1] !== 'undefined' && morse[i + 1] !== options.space) &&
            (typeof morse[i - 1] !== 'undefined' && morse[i - 1] !== options.space)
          ) {
            gap(3);
          }
        }

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        const play = () => {
          oscillator.start(context.currentTime);
          timeout = setTimeout(() => stop(), (t - context.currentTime) * 1000);
        };

        const stop = () => {
          clearTimeout(timeout);
          timeout = 0;
          oscillator.stop(0);
        };

        return {
          play,
          stop,
          context,
          oscillator,
          gainNode
        };
      };

      return {
        characters: getCharacters,
        decode,
        encode,
        audio
      };
    }));
    });

    /* src\App.svelte generated by Svelte v3.32.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let main;
    	let div0;
    	let h4;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let t9;
    	let div1;
    	let h30;
    	let t11;
    	let textarea0;
    	let t12;
    	let div2;
    	let button0;
    	let t14;
    	let button1;
    	let t16;
    	let div3;
    	let h31;
    	let t18;
    	let textarea1;
    	let t19;
    	let p3;
    	let t21;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "ちんちんもーるす";
    			t1 = space();
    			main = element("main");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "ひらがなとカタカナをモールス信号に変えるよ！";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "もはやモールスというか換字式暗号みたくなってるけどツッコまないでね！";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "えんこーど: ぶんしょう → ちんちん...";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "でこーど: ちんちん... → ぶんしょう";
    			t9 = space();
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "にゅうりょく";
    			t11 = space();
    			textarea0 = element("textarea");
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "えんこーど";
    			t14 = space();
    			button1 = element("button");
    			button1.textContent = "でこーど";
    			t16 = space();
    			div3 = element("div");
    			h31 = element("h3");
    			h31.textContent = "しゅつりょく";
    			t18 = space();
    			textarea1 = element("textarea");
    			t19 = space();
    			p3 = element("p");
    			p3.textContent = "遊びでひみつのモード仕込んでみたよ！さがしてみてね！";
    			t21 = space();
    			a = element("a");
    			a.textContent = "コードはこちら";
    			add_location(h1, file, 86, 1, 2464);
    			set_style(header, "text-align", "center");
    			attr_dev(header, "class", "svelte-1viwdy0");
    			add_location(header, file, 85, 0, 2426);
    			add_location(h4, file, 90, 2, 2512);
    			add_location(p0, file, 91, 2, 2547);
    			add_location(p1, file, 92, 2, 2592);
    			add_location(p2, file, 93, 2, 2625);
    			add_location(div0, file, 89, 1, 2503);
    			add_location(h30, file, 96, 2, 2674);
    			attr_dev(textarea0, "name", "input-kana");
    			attr_dev(textarea0, "id", "input-kana");
    			attr_dev(textarea0, "cols", "30");
    			attr_dev(textarea0, "rows", "10");
    			attr_dev(textarea0, "class", "svelte-1viwdy0");
    			add_location(textarea0, file, 97, 2, 2693);
    			add_location(div1, file, 95, 1, 2665);
    			set_style(button0, "margin", "0 10px");
    			add_location(button0, file, 101, 2, 2861);
    			set_style(button1, "margin", "0 10px");
    			add_location(button1, file, 102, 2, 2927);
    			set_style(div2, "display", "flex");
    			set_style(div2, "justify-content", "center");
    			add_location(div2, file, 100, 1, 2806);
    			add_location(h31, file, 106, 2, 3011);
    			attr_dev(textarea1, "name", "output-chin");
    			attr_dev(textarea1, "id", "output-chin");
    			attr_dev(textarea1, "cols", "30");
    			attr_dev(textarea1, "rows", "10");
    			textarea1.readOnly = true;
    			attr_dev(textarea1, "class", "svelte-1viwdy0");
    			add_location(textarea1, file, 107, 2, 3030);
    			add_location(div3, file, 105, 1, 3002);
    			add_location(p3, file, 109, 1, 3152);
    			attr_dev(a, "href", "https://github.com/takuya115/ChinChinMorse");
    			add_location(a, file, 110, 1, 3188);
    			attr_dev(main, "class", "svelte-1viwdy0");
    			add_location(main, file, 88, 0, 2494);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(div0, t7);
    			append_dev(div0, p2);
    			append_dev(main, t9);
    			append_dev(main, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t11);
    			append_dev(div1, textarea0);
    			set_input_value(textarea0, /*inputWord*/ ctx[0]);
    			append_dev(main, t12);
    			append_dev(main, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(main, t16);
    			append_dev(main, div3);
    			append_dev(div3, h31);
    			append_dev(div3, t18);
    			append_dev(div3, textarea1);
    			set_input_value(textarea1, /*outputWord*/ ctx[1]);
    			append_dev(main, t19);
    			append_dev(main, p3);
    			append_dev(main, t21);
    			append_dev(main, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[4]),
    					listen_dev(button0, "click", /*encode*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*decode*/ ctx[3], false, false, false),
    					listen_dev(textarea1, "input", /*textarea1_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputWord*/ 1) {
    				set_input_value(textarea0, /*inputWord*/ ctx[0]);
    			}

    			if (dirty & /*outputWord*/ 2) {
    				set_input_value(textarea1, /*outputWord*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function hiraToKana(str) {
    	return str.replace(/[\u3041-\u3096]/g, match => {
    		const chr = match.charCodeAt(0) + 96;
    		return String.fromCharCode(chr);
    	});
    }

    // 濁音（ガギグゲゴ、など）を文字と濁音記号に分離する
    function dakuonTransrator(str) {
    	// unicodeでは「は、ば、ぱ」の並びになっているので-1すれば元の文字が得られる
    	return str.replace(/[ガギグゲゴザジズゼゾダヂヅデドバビブベボ]/g, match => {
    		const chr = match.charCodeAt(0) - 1;
    		return `${String.fromCharCode(chr)}゛`;
    	});
    }

    // 半濁音(パピプペポ)を文字と半濁音記号に分離する
    function handakuonTransrator(str) {
    	return str.replace(/[パピプペポ]/g, match => {
    		const chr = match.charCodeAt(0) - 2;
    		return `${String.fromCharCode(chr)}゜`;
    	});
    }

    // 捨て仮名(ャュョなど小さい文字)を元の文字に戻す
    function suteganaTransrator(str) {
    	return str.replace(/[ァィゥェォャュョッ]/g, match => {
    		const chr = match.charCodeAt(0) + 1;
    		return String.fromCharCode(chr);
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let inputWord = "";
    	let outputWord = "";

    	const moresProps = {
    		priority: 10,
    		dash: "ちんちん",
    		dot: "ちんこ",
    		separator: "ちんぽ"
    	};

    	const mesugakiProps = {
    		priority: 10,
    		dash: "ざぁこ",
    		dot: "♥",
    		separator: "♡"
    	};

    	function encode() {
    		if (detectKanji()) return alert("漢字はつかえないよ！　めっ！！");
    		const inputList = inputWord.split("\n");
    		const encodeList = [];

    		// シークレットモード
    		const mode = document.querySelector("#secret-mode").value;

    		inputList.forEach(str => {
    			let word = str;

    			// ひらがなをカタカナにする
    			word = hiraToKana(word);

    			// 濁音を「元文字+゛」の形にする
    			word = dakuonTransrator(word);

    			// 半濁音を「元文字+゜」の形にする
    			word = handakuonTransrator(word);

    			// 拗音(小さいヤユヨ)を元の文字にする
    			word = suteganaTransrator(word);

    			// モールス信号にする
    			encodeList.push(morsify.encode(word, mode === "メスガキ" ? mesugakiProps : moresProps));
    		});

    		$$invalidate(1, outputWord = encodeList.join("\n"));
    	}

    	// 漢字の検出
    	function detectKanji() {
    		const regexp = new RegExp(/([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu);
    		return regexp.test(inputWord);
    	}

    	// デコード
    	function decode() {
    		const inputList = inputWord.split("\n");
    		const dencodeList = [];

    		// シークレットモード
    		const mode = document.querySelector("#secret-mode").value;

    		inputList.forEach(str => {
    			dencodeList.push(morsify.decode(str, mode === "メスガキ" ? mesugakiProps : moresProps));
    		});

    		$$invalidate(1, outputWord = dencodeList.join("\n"));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function textarea0_input_handler() {
    		inputWord = this.value;
    		$$invalidate(0, inputWord);
    	}

    	function textarea1_input_handler() {
    		outputWord = this.value;
    		$$invalidate(1, outputWord);
    	}

    	$$self.$capture_state = () => ({
    		morsify,
    		inputWord,
    		outputWord,
    		moresProps,
    		mesugakiProps,
    		encode,
    		hiraToKana,
    		dakuonTransrator,
    		handakuonTransrator,
    		suteganaTransrator,
    		detectKanji,
    		decode
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputWord" in $$props) $$invalidate(0, inputWord = $$props.inputWord);
    		if ("outputWord" in $$props) $$invalidate(1, outputWord = $$props.outputWord);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputWord,
    		outputWord,
    		encode,
    		decode,
    		textarea0_input_handler,
    		textarea1_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
