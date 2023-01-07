// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function Immutable(val) {
    if (val == null || typeof val != 'object') return val;
    for (const subVal of Object.values(val))Immutable(subVal);
    return Object.freeze(val);
}
function Inverse(obj) {
    return Object.entries(obj).reduce((reversed, [key, val])=>({
            ...reversed,
            [val]: key
        }), {});
}
var ArrayUtil;
(function(ArrayUtil) {
    function shuffle(self, random) {
        for(let i = self.length - 1; i >= 0; i--){
            swap(self, i, Math.trunc(random() * (i + 1)));
        }
    }
    ArrayUtil.shuffle = shuffle;
    function swap(self, left, right) {
        [self[left], self[right]] = [
            self[right],
            self[left]
        ];
    }
    ArrayUtil.swap = swap;
})(ArrayUtil || (ArrayUtil = {}));
function assert(condition, msg) {
    if (!condition) throw Error(msg);
}
var Color;
(function(Color) {
    function intToFloats(color) {
        return [
            (color >> 24 & 0xff) / 0xff,
            (color >> 16 & 0xff) / 0xff,
            (color >> 8 & 0xff) / 0xff,
            (color >> 0 & 0xff) / 0xff
        ];
    }
    Color.intToFloats = intToFloats;
})(Color || (Color = {}));
var Obj;
(function(Obj) {
    function is(val) {
        return val != null && typeof val == 'object';
    }
    Obj.is = is;
})(Obj || (Obj = {}));
var Str;
(function(Str) {
    function capitalize(str) {
        if (str[0] == null) return str;
        return `${str[0].toLocaleUpperCase()}${str.slice(1)}`;
    }
    Str.capitalize = capitalize;
    function isBlank(str) {
        return str == null || /^\s*$/.test(str);
    }
    Str.isBlank = isBlank;
    function lowercase(str) {
        return str.toLocaleLowerCase();
    }
    Str.lowercase = lowercase;
    function uncapitalize(str) {
        if (str[0] == null) return str;
        return `${str[0].toLocaleLowerCase()}${str.slice(1)}`;
    }
    Str.uncapitalize = uncapitalize;
    function uppercase(str) {
        return str.toLocaleUpperCase();
    }
    Str.uppercase = uppercase;
})(Str || (Str = {}));
class NumNamespaceImpl {
    #name;
    signedness;
    constructor(name, signedness){
        this.#name = name;
        this.signedness = signedness;
    }
    construct(num) {
        assert(this.is(num), `${num} is not a ${this.#name}.`);
        return num;
    }
}
var NumUtil;
class IntNumNamespaceImpl extends NumNamespaceImpl {
    min;
    max;
    width;
    static new(name, width, signedness) {
        const base = new IntNumNamespaceImpl(name, width, signedness);
        const constructor = base.construct.bind(base);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        return Object.assign(constructor, base);
    }
    constructor(name, width, signedness){
        super(name, signedness);
        assert(width > 0 && Number.isInteger(width), 'Width must be integer greater than zero.');
        assert(width <= 32 || signedness == 'Unsigned' && width == 53 || signedness == 'Signed' && width == 54, 'Width must be < 53b or unsigned 53b or signed 54b.');
        this.width = width;
        if (this.signedness == 'Signed') {
            this.min = -(2 ** (width - 1));
            this.max = 2 ** (width - 1) - 1;
        } else {
            this.min = 0;
            this.max = 2 ** width - 1;
        }
    }
    ceil = (num)=>{
        return NumUtil.clamp(Math.ceil(num), this.min, this.max);
    };
    floor = (num)=>{
        return NumUtil.clamp(Math.floor(num), this.min, this.max);
    };
    is = (num)=>{
        return Number.isInteger(num) && NumUtil.inDomain(num, this.min, this.max, 'Inclusive');
    };
    mod = (__int)=>{
        if (this.width < 53) {
            return this.construct(NumUtil.wrap(__int, this.min, this.max + 1));
        }
        if (this.width == 53) return this.construct(NumUtil.modUint(__int));
        return this.construct(NumUtil.modInt(__int));
    };
    round = (num)=>{
        return NumUtil.clamp(NumUtil.round(num), this.min, this.max);
    };
    trunc = (num)=>{
        return NumUtil.clamp(Math.trunc(num), this.min, this.max);
    };
}
(function(NumUtil1) {
    function wrap(num, min, max) {
        if (min == max) return min;
        assert(max > min, `max=${max} < min=${min}.`);
        const range = max - min;
        const x = (num - min) % range;
        const y = x + range;
        const z = y % range;
        return z + min;
    }
    NumUtil1.wrap = wrap;
    function mod(num, mod) {
        return num - mod * Math.floor(num / mod);
    }
    NumUtil1.mod = mod;
    function modInt(num) {
        if (num == Number.MAX_SAFE_INTEGER + 1) return Number.MIN_SAFE_INTEGER - 1;
        const b27 = 2 ** 27;
        const hi = Math.floor(num / b27) % b27 * b27;
        return hi + mod(num, b27);
    }
    NumUtil1.modInt = modInt;
    function modUint(num) {
        return NumUtil.mod(num, Number.MAX_SAFE_INTEGER + 1);
    }
    NumUtil1.modUint = modUint;
    function clamp(num, min, max) {
        assert(max >= min, `max=${max} < min=${min}.`);
        assert(!Number.isNaN(num), `${num} is not a number.`);
        return Math.min(Math.max(num, min), max);
    }
    NumUtil1.clamp = clamp;
    function ceilMultiple(multiple, val) {
        return multiple == 0 ? 0 : Math.ceil(val / multiple) * multiple;
    }
    NumUtil1.ceilMultiple = ceilMultiple;
    function lerp(from, to, ratio) {
        return from * (1 - ratio) + to * ratio;
    }
    NumUtil1.lerp = lerp;
    function lerpInt(from, to, ratio) {
        const interpolation = Int.round(lerp(from, to, ratio));
        if (interpolation == from && ratio != 0) {
            return Int(interpolation + Math.sign(to - interpolation));
        }
        return interpolation;
    }
    NumUtil1.lerpInt = lerpInt;
    function round(num) {
        return num < 0 ? -Math.round(-num) : Math.round(num);
    }
    NumUtil1.round = round;
    function lshift(val, shift) {
        return val * 2 ** shift;
    }
    NumUtil1.lshift = lshift;
    function rshift(num, shift) {
        return Math.floor(num / 2 ** shift);
    }
    NumUtil1.rshift = rshift;
    function ushift(num, shift) {
        if (num >= 0) return rshift(num, shift);
        return Math.floor((num + 2 ** 54) / 2 ** shift);
    }
    NumUtil1.ushift = ushift;
    function assertDomain(num, min, max, range) {
        assert(inDomain(num, min, max, range), `${num} not in ${formatInterval(min, max, range)}.`);
    }
    NumUtil1.assertDomain = assertDomain;
    function inDomain(num, min, max, interval) {
        return domainTest[interval](num, min, max);
    }
    NumUtil1.inDomain = inDomain;
    function formatInterval(min, max, interval) {
        const { start , end  } = intervalBrackets[interval];
        return `${start}${min}, ${max}${end}`;
    }
    const intervalBrackets = Immutable({
        Inclusive: {
            start: '[',
            end: ']'
        },
        Exclusive: {
            start: '(',
            end: ')'
        },
        InclusiveExclusive: {
            start: '[',
            end: ')'
        },
        ExclusiveInclusive: {
            start: '(',
            end: ']'
        }
    });
    const domainTest = Immutable({
        Inclusive: (num, min, max)=>num >= min && num <= max,
        Exclusive: (num, min, max)=>num > min && num < max,
        InclusiveExclusive: (num, min, max)=>num >= min && num < max,
        ExclusiveInclusive: (num, min, max)=>num > min && num <= max
    });
})(NumUtil || (NumUtil = {}));
class NumberNumNamespaceImpl extends NumNamespaceImpl {
    min;
    max;
    static new(name, signedness, min, max) {
        const base = new NumberNumNamespaceImpl(name, signedness, min, max);
        const constructor = base.construct.bind(base);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        return Object.assign(constructor, base);
    }
    constructor(name, signedness, min, max){
        super(name, signedness);
        this.min = min;
        this.max = max;
    }
    clamp = (num)=>{
        return NumUtil.clamp(num, this.min, this.max);
    };
    is = (num)=>{
        return NumUtil.inDomain(num, this.min, this.max, 'Inclusive');
    };
}
const I4 = IntNumNamespaceImpl.new('I4', 4, 'Signed');
const U4 = IntNumNamespaceImpl.new('U4', 4, 'Unsigned');
const I8 = IntNumNamespaceImpl.new('I8', 8, 'Signed');
const U8 = IntNumNamespaceImpl.new('U8', 8, 'Unsigned');
const I16 = IntNumNamespaceImpl.new('I16', 16, 'Signed');
const U16 = IntNumNamespaceImpl.new('U16', 16, 'Unsigned');
const I32 = IntNumNamespaceImpl.new('I32', 32, 'Signed');
const U32 = IntNumNamespaceImpl.new('U32', 32, 'Unsigned');
const Int = IntNumNamespaceImpl.new('Int', 54, 'Signed');
const Uint = IntNumNamespaceImpl.new('Uint', 53, 'Unsigned');
const Num = NumberNumNamespaceImpl.new('Number', 'Signed', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
class XYNamespaceImpl {
    absCoerce(self, coerce) {
        return this.setCoerce(self, coerce, Math.abs(self.x), Math.abs(self.y));
    }
    addCoerce(self, coerce, ...args) {
        const term = argsToXY1(args);
        return this.setCoerce(self, coerce, self.x + term.x, self.y + term.y);
    }
    areaCoerce(self, coerce) {
        return coerce(self.x * self.y);
    }
    construct(coerce, ...args) {
        if (args.length == 2) {
            return {
                x: coerce(args[0]),
                y: coerce(args[1])
            };
        }
        return {
            x: coerce(args[0].x),
            y: coerce(args[0].y)
        };
    }
    divCoerce(self, coerce, ...args) {
        const divisor = argsToXY1(args);
        return this.setCoerce(self, coerce, self.x / divisor.x, self.y / divisor.y);
    }
    eq = (self, ...args)=>{
        const xy = argsToXY1(args);
        return self.x == xy.x && self.y == xy.y;
    };
    magnitudeCoerce(self, coerce) {
        return coerce(Math.sqrt(self.x * self.x + self.y * self.y));
    }
    maxCoerce(self, coerce, ...args) {
        const xy = argsToXY1(args);
        return this.setCoerce(self, coerce, Math.max(self.x, xy.x), Math.max(self.y, xy.y));
    }
    minCoerce(self, coerce, ...args) {
        const xy = argsToXY1(args);
        return this.setCoerce(self, coerce, Math.min(self.x, xy.x), Math.min(self.y, xy.y));
    }
    mulCoerce(self, coerce, ...args) {
        const factor = argsToXY1(args);
        return this.setCoerce(self, coerce, self.x * factor.x, self.y * factor.y);
    }
    setCoerce(self, coerce, ...args) {
        if (args.length == 2) {
            ({ x: self.x , y: self.y  } = this.construct(coerce, ...args));
        } else ({ x: self.x , y: self.y  } = this.construct(coerce, ...args));
        return self;
    }
    subCoerce(self, coerce, ...args) {
        const term = argsToXY1(args);
        return this.setCoerce(self, coerce, self.x - term.x, self.y - term.y);
    }
    toString = (self)=>`(${self.x}, ${self.y})`;
}
class IntXYNamespaceImpl extends XYNamespaceImpl {
    static new(name, num) {
        const base = new IntXYNamespaceImpl(num);
        const constructor = base.construct.bind(base, num);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        const adapters = {};
        for (const coercion of [
            '',
            'ceil',
            'floor',
            'mod',
            'round',
            'trunc'
        ]){
            const coerce = coercion == '' ? base.num : base.num[coercion];
            if (coercion != '') {
                adapters[coercion] = (...args)=>base.construct(coerce, ...args);
            }
            for (const op of [
                'add',
                'div',
                'mul',
                'sub'
            ]){
                const method = `${op}${Str.capitalize(coercion)}`;
                adapters[method] = (self, ...args)=>base[`${op}Coerce`](self, coerce, ...args);
            }
            for (const op1 of [
                'max',
                'min',
                'set'
            ]){
                const method1 = `${op1}${Str.capitalize(coercion)}`;
                adapters[method1] = (self, ...args)=>base[`${op1}Coerce`](self, coerce, ...args);
            }
            adapters[`lerp${Str.capitalize(coercion)}`] = (self, ...args)=>base.lerpCoerce(self, coerce, ...args);
        }
        for (const coercion1 of [
            '',
            'clamp'
        ]){
            adapters[`abs${Str.capitalize(coercion1)}`] = (self)=>base.absCoerce(self, coercion1 == '' ? base.num : base.num.trunc);
            adapters[`area${Str.capitalize(coercion1)}`] = (self)=>base.areaCoerce(self, coercion1 == '' ? base.num : base.num.trunc);
            adapters[`magnitude${Str.capitalize(coercion1)}`] = (self)=>base.magnitudeCoerce(self, coercion1 == '' ? base.num : base.num.trunc);
        }
        adapters.areaNum = (self)=>base.areaCoerce(self, Number);
        adapters.magnitudeNum = (self)=>base.magnitudeCoerce(self, Number);
        return Object.assign(constructor, base, adapters);
    }
    num;
    constructor(num){
        super();
        this.num = num;
    }
    lerpCoerce(self, coerce, ...args) {
        if (args.length == 3) {
            return this.setCoerce(self, coerce, NumUtil.lerpInt(self.x, args[0], args[2]), NumUtil.lerpInt(self.y, args[1], args[2]));
        }
        return this.setCoerce(self, coerce, NumUtil.lerpInt(self.x, args[0].x, args[1]), NumUtil.lerpInt(self.y, args[0].y, args[1]));
    }
}
class NumberXYNamespaceImpl extends XYNamespaceImpl {
    static new(name, num) {
        const base = new NumberXYNamespaceImpl(num);
        const constructor = base.construct.bind(base, num);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        const adapters = {};
        for (const op of [
            'add',
            'div',
            'mul',
            'sub'
        ]){
            const method = `${op}Clamp`;
            adapters[op] = (self, ...args)=>base[`${op}Coerce`](self, base.num, ...args);
            adapters[method] = (self, ...args)=>base[`${op}Coerce`](self, base.num.clamp, ...args);
        }
        for (const op1 of [
            'max',
            'min',
            'set'
        ]){
            const method1 = `${op1}Clamp`;
            adapters[op1] = (self, ...args)=>base[`${op1}Coerce`](self, base.num, ...args);
            adapters[method1] = (self, ...args)=>base[`${op1}Coerce`](self, base.num.clamp, ...args);
        }
        for (const coercion of [
            '',
            'clamp'
        ]){
            adapters[`abs${Str.capitalize(coercion)}`] = (self)=>base.absCoerce(self, coercion == '' ? base.num : base.num.clamp);
            adapters[`area${Str.capitalize(coercion)}`] = (self)=>base.areaCoerce(self, coercion == '' ? base.num : base.num.clamp);
            adapters[`magnitude${Str.capitalize(coercion)}`] = (self)=>base.magnitudeCoerce(self, coercion == '' ? base.num : base.num.clamp);
        }
        return Object.assign(constructor, base, adapters);
    }
    num;
    constructor(num){
        super();
        this.num = num;
    }
    clamp = (...args)=>this.construct(this.num.clamp, ...args);
    lerp = (self, ...args)=>this.lerpCoerce(self, this.num, ...args);
    lerpClamp = (self, ...args)=>this.lerpCoerce(self, this.num.clamp, ...args);
    lerpCoerce(self, coerce, ...args) {
        if (args.length == 3) {
            return this.setCoerce(self, coerce, NumUtil.lerp(self.x, args[0], args[2]), NumUtil.lerp(self.y, args[1], args[2]));
        }
        return this.setCoerce(self, coerce, NumUtil.lerp(self.x, args[0].x, args[1]), NumUtil.lerp(self.y, args[0].y, args[1]));
    }
}
const I4XY = IntXYNamespaceImpl.new('I4XY', I4);
const U4XY = IntXYNamespaceImpl.new('U4XY', U4);
const I8XY = IntXYNamespaceImpl.new('I8XY', I8);
const U8XY = IntXYNamespaceImpl.new('U8XY', U8);
const I16XY = IntXYNamespaceImpl.new('I16XY', I16);
const U16XY = IntXYNamespaceImpl.new('U16XY', U16);
const I32XY = IntXYNamespaceImpl.new('I32XY', I32);
const U32XY = IntXYNamespaceImpl.new('U32XY', U32);
const IntXY = IntXYNamespaceImpl.new('IntXY', Int);
const UintXY = IntXYNamespaceImpl.new('UintXY', Uint);
const NumberXY = NumberXYNamespaceImpl.new('NumberXY', Num);
class BoxNamespaceImpl {
    areaCoerce(self, coerce) {
        return coerce(this.widthCoerce(self, coerce) * this.heightCoerce(self, coerce));
    }
    centerCoerce(self, coerce) {
        const wh = this.whCoerce(self, NumberXY);
        const offset = NumberXY.div(wh, 2, 2);
        return coerce(NumberXY.add(offset, self.start));
    }
    construct(coerce, ...args) {
        if (args.length == 4) {
            const start = coerce({
                x: args[0],
                y: args[1]
            });
            return {
                start,
                end: coerce({
                    x: start.x + args[2],
                    y: start.y + args[3]
                })
            };
        }
        if (args.length == 2) return {
            start: args[0],
            end: args[1]
        };
        return {
            start: coerce(args[0].start),
            end: coerce(args[0].end)
        };
    }
    contains = (self, ...args)=>{
        if (this.empty(self)) return false;
        const box = argsToBox(args);
        return self.start.x <= box.start.x && self.end.x >= box.end.x && self.start.y <= box.start.y && self.end.y >= box.end.y;
    };
    empty = (self)=>{
        return this.areaCoerce(self, Number) == 0;
    };
    eq = (self, ...args)=>{
        const box = argsToBox(args);
        return this.xy.eq(self.start, box.start) && this.xy.eq(self.end, box.end);
    };
    flip = (self)=>{
        const { start  } = self;
        self.start = self.end;
        self.end = start;
    };
    flipped = (self)=>{
        return self.start.x > self.end.x || self.start.y > self.end.y;
    };
    heightCoerce(self, coerce) {
        return coerce(self.end.y - self.start.y);
    }
    intersectionCoerce(self, coerce, ...args) {
        const box = NumberBox(argsToBox(args));
        const min = NumberXY(this.min(self));
        const max = NumberXY(this.max(self));
        return {
            start: coerce(NumberXY.max(min, NumberBox.min(box))),
            end: coerce(NumberXY.min(max, NumberBox.max(box)))
        };
    }
    intersects = (self, ...args)=>{
        const box = argsToBox(args);
        return self.start.x < box.end.x && self.end.x > box.start.x && self.start.y < box.end.y && self.end.y > box.start.y;
    };
    max = (self)=>{
        return this.xy.max({
            ...self.start
        }, self.end);
    };
    min = (self)=>{
        return this.xy.min({
            ...self.start
        }, self.end);
    };
    moveByCoerce(self, coerce, ...args) {
        const by = argsToXY(args);
        const start = coerce({
            x: self.start.x + by.x,
            y: self.start.y + by.y
        });
        const end = coerce({
            x: self.end.x + by.x,
            y: self.end.y + by.y
        });
        this.xy.set(self.start, start);
        this.xy.set(self.end, end);
        return self;
    }
    moveCenterToCoerce(self, coerce, ...args) {
        const to = NumberXY(argsToXY(args));
        const by = NumberXY.sub(to, this.centerCoerce(self, coerce));
        return this.moveByCoerce(self, coerce, by);
    }
    moveToCoerce(self, coerce, ...args) {
        const to = NumberXY(argsToXY(args));
        const by = NumberXY.sub(to, self.start);
        return this.moveByCoerce(self, coerce, by);
    }
    order = (self)=>{
        return this.setCoerce(self, this.xy, this.min(self), this.max(self));
    };
    setCoerce(self, coerce, ...args) {
        const box = argsToBox(args);
        this.xy.set(self.start, coerce(box.start));
        this.xy.set(self.end, coerce(box.end));
        return self;
    }
    sizeByCoerce(self, coerce, ...args) {
        const by = argsToXY(args);
        const end = coerce({
            x: self.end.x + by.x,
            y: self.end.y + by.y
        });
        this.xy.set(self.end, end);
        return self;
    }
    sizeToCoerce(self, coerce, ...args) {
        const to = NumberXY(argsToXY(args));
        const by = NumberXY.sub(NumberXY.add(to, self.start), self.end);
        return this.sizeByCoerce(self, coerce, by);
    }
    toString = (self)=>{
        return `[${this.xy.toString(self.start)}, ${this.xy.toString(self.end)}]`;
    };
    unionCoerce(self, coerce, ...args) {
        const box = NumberBox(argsToBox(args));
        const min = NumberXY(this.min(self));
        const max = NumberXY(this.max(self));
        return {
            start: coerce(NumberXY.min(min, NumberBox.min(box))),
            end: coerce(NumberXY.max(max, NumberBox.max(box)))
        };
    }
    whCoerce(self, coerce) {
        return coerce({
            x: self.end.x - self.start.x,
            y: self.end.y - self.start.y
        });
    }
    widthCoerce(self, coerce) {
        return coerce(self.end.x - self.start.x);
    }
}
function Random(seed) {
    seed = I32(seed * 16_807 % 0x7fff_ffff);
    if (seed <= 0) {
        seed = I32((seed + 0x7fff_fffe) % 0x7fff_fffe + 1);
    }
    return {
        seed
    };
}
function NonNull(val, msg) {
    assertNonNull(val, msg);
    return val;
}
class IntBoxNamespaceImpl extends BoxNamespaceImpl {
    static new(name, num, xy) {
        const base = new IntBoxNamespaceImpl(num, xy);
        const constructor = base.construct.bind(base, base.xy);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        const adapters = {};
        for (const coercion of [
            '',
            'clamp'
        ]){
            const opCoerce = Str.capitalize(coercion);
            const numCoerce = coercion == '' ? base.num : base.num.trunc;
            const xyCoerce = coercion == '' ? base.xy : base.xy.trunc;
            adapters[`area${opCoerce}`] = (self)=>base.areaCoerce(self, numCoerce);
            adapters[`height${opCoerce}`] = (self)=>base.heightCoerce(self, numCoerce);
            adapters[`width${opCoerce}`] = (self)=>base.widthCoerce(self, numCoerce);
            adapters[`wh${opCoerce}`] = (self)=>base.whCoerce(self, xyCoerce);
        }
        adapters.areaNum = (self)=>base.areaCoerce(self, Number);
        adapters.heightNum = (self)=>base.heightCoerce(self, Number);
        adapters.widthNum = (self)=>base.widthCoerce(self, Number);
        adapters.centerNum = (self)=>base.centerCoerce(self, NumberXY);
        adapters.whNum = (self)=>base.whCoerce(self, NumberXY);
        for (const coercion1 of [
            '',
            'ceil',
            'floor',
            'mod',
            'round',
            'trunc'
        ]){
            const opCoerce1 = Str.capitalize(coercion1);
            const xyCoerce1 = coercion1 == '' ? base.xy : base.xy[coercion1];
            adapters[`center${opCoerce1}`] = (self, ...args)=>base.centerCoerce(self, xyCoerce1, ...args);
            adapters[`set${opCoerce1}`] = (self, ...args)=>base.setCoerce(self, xyCoerce1, ...args);
            for (const op of [
                'intersection',
                'union'
            ]){
                adapters[`${op}${opCoerce1}`] = (self, ...args)=>base[`${op}Coerce`](self, base.xy, ...args);
            }
            for (const op1 of [
                'moveBy',
                'moveCenterTo',
                'moveTo',
                'sizeBy',
                'sizeTo'
            ]){
                adapters[`${op1}${opCoerce1}`] = (self, ...args)=>base[`${op1}Coerce`](self, xyCoerce1, ...args);
            }
            if (coercion1 != '') {
                adapters[coercion1] = (...args)=>base.construct(xyCoerce1, ...args);
            }
        }
        return Object.assign(constructor, base, adapters);
    }
    num;
    xy;
    constructor(num, xy){
        super();
        this.num = num;
        this.xy = xy;
    }
}
class NumberBoxNamespaceImpl extends BoxNamespaceImpl {
    static new(name, num, xy) {
        const base = new NumberBoxNamespaceImpl(num, xy);
        const constructor = base.construct.bind(base, base.xy);
        Object.defineProperty(constructor, 'name', {
            value: name
        });
        const adapters = {};
        for (const coercion of [
            '',
            'clamp'
        ]){
            const opCoerce = Str.capitalize(coercion);
            const numCoerce = coercion == '' ? base.num : base.num.clamp;
            const xyCoerce = coercion == '' ? base.xy : base.xy.clamp;
            adapters[`area${opCoerce}`] = (self)=>base.areaCoerce(self, numCoerce);
            adapters[`height${opCoerce}`] = (self)=>base.heightCoerce(self, numCoerce);
            adapters[`width${opCoerce}`] = (self)=>base.widthCoerce(self, numCoerce);
            adapters[`center${opCoerce}`] = (self, ...args)=>base.centerCoerce(self, xyCoerce, ...args);
            adapters[`set${opCoerce}`] = (self, ...args)=>base.setCoerce(self, xyCoerce, ...args);
            adapters[`wh${opCoerce}`] = (self)=>base.whCoerce(self, xyCoerce);
            for (const op of [
                'intersection',
                'union'
            ]){
                adapters[`${op}${opCoerce}`] = (self, ...args)=>base[`${op}Coerce`](self, base.xy, ...args);
            }
            for (const op1 of [
                'moveBy',
                'moveCenterTo',
                'moveTo',
                'sizeBy',
                'sizeTo'
            ]){
                adapters[`${op1}${opCoerce}`] = (self, ...args)=>base[`${op1}Coerce`](self, xyCoerce, ...args);
            }
        }
        return Object.assign(constructor, base, adapters);
    }
    num;
    xy;
    constructor(num, xy){
        super();
        this.num = num;
        this.xy = xy;
    }
    clamp = (...args)=>{
        return this.construct(this.xy.clamp, ...args);
    };
}
IntBoxNamespaceImpl.new('I4Box', I4, I4XY);
IntBoxNamespaceImpl.new('U4Box', U4, U4XY);
IntBoxNamespaceImpl.new('I8Box', I8, I8XY);
IntBoxNamespaceImpl.new('U8Box', U8, U8XY);
const I16Box = IntBoxNamespaceImpl.new('I16Box', I16, I16XY);
const U16Box = IntBoxNamespaceImpl.new('U16Box', U16, U16XY);
IntBoxNamespaceImpl.new('I32Box', I32, I32XY);
IntBoxNamespaceImpl.new('U32Box', U32, U32XY);
IntBoxNamespaceImpl.new('IntBox', Int, IntXY);
IntBoxNamespaceImpl.new('UintBox', Uint, UintXY);
const NumberBox = NumberBoxNamespaceImpl.new('NumberBox', Num, NumberXY);
const Unumber = NumberNumNamespaceImpl.new('Unumber', 'Unsigned', 0, Number.POSITIVE_INFINITY);
const UnumberXY = NumberXYNamespaceImpl.new('UnumberXY', Unumber);
NumberBoxNamespaceImpl.new('UnumberBox', Unumber, UnumberXY);
function argsToBox(args) {
    if (args.length == 2) {
        if (typeof args[0] == 'number') {
            const start = {
                x: args[0],
                y: args[1]
            };
            return {
                start,
                end: {
                    x: start.x,
                    y: start.y
                }
            };
        }
        return {
            start: {
                x: args[0].x,
                y: args[0].y
            },
            end: {
                x: args[1].x,
                y: args[1].y
            }
        };
    }
    if (args.length == 1) {
        if ('x' in args[0]) {
            return {
                start: {
                    x: args[0].x,
                    y: args[0].y
                },
                end: {
                    x: args[0].x,
                    y: args[0].y
                }
            };
        }
        return {
            start: {
                x: args[0].start.x,
                y: args[0].start.y
            },
            end: {
                x: args[0].end.x,
                y: args[0].end.y
            }
        };
    }
    return {
        start: {
            x: args[0],
            y: args[1]
        },
        end: {
            x: args[0] + args[2],
            y: args[1] + args[3]
        }
    };
}
function argsToXY(args) {
    if (args.length == 1) return args[0];
    return {
        x: args[0],
        y: args[1]
    };
}
function argsToXY1(args) {
    if (args.length == 1) return args[0];
    return {
        x: args[0],
        y: args[1]
    };
}
(function(Random) {
    function fraction(self) {
        return (i32(self) - 1) / 0x7fff_fffe;
    }
    Random.fraction = fraction;
    function i32(self) {
        self.seed = I32(self.seed * 16_807 % 0x7fff_ffff);
        return self.seed;
    }
    Random.i32 = i32;
})(Random || (Random = {}));
function assertNonNull(val, msg) {
    assert(val != null, msg ?? 'Expected nonnullish value.');
}
var Aseprite;
(function(Aseprite) {
    Aseprite.Infinity = U16.max;
    Aseprite.Direction = Immutable({
        Forward: 'forward',
        Reverse: 'reverse',
        PingPong: 'pingpong'
    });
})(Aseprite || (Aseprite = {}));
const InfiniteDuration = U32.max;
var Playback;
(function(Playback) {
    Playback.values = Immutable(new Set([
        'Forward',
        'Reverse',
        'PingPong'
    ]));
})(Playback || (Playback = {}));
class Animator {
    #film;
    #start;
    get film() {
        return this.#film;
    }
    constructor(film, start = 0){
        this.#film = film;
        this.#start = start;
    }
    cel(time) {
        return this.#film.cels[this.index(time)];
    }
    index(time) {
        const timeIndex = Math.trunc((time - this.#start) / this.#film.period);
        const infinite = this.#film.duration == InfiniteDuration;
        if (infinite && timeIndex >= this.#film.cels.length - 1) {
            return this.#film.cels.length - 1;
        }
        return period[this.#film.direction](timeIndex, this.#film.cels.length);
    }
    reset(start, film) {
        this.#film = film ?? this.#film;
        this.#start = start;
    }
}
var AtlasMetaParser;
const period = Object.freeze({
    Forward: (timeIndex, len)=>timeIndex % len,
    Reverse: (timeIndex, len)=>len - 1 - timeIndex % len,
    PingPong: (timeIndex, len)=>Math.abs(NumUtil.wrap(timeIndex, 2 - len, len))
});
(function(AtlasMetaParser) {
    function parse(file, ids) {
        const factory = new CelIDFactory();
        const asepriteFile = file;
        const filmByID = parseFilmByID(factory, asepriteFile, ids);
        return Immutable({
            version: asepriteFile.meta.version,
            filename: asepriteFile.meta.image,
            format: asepriteFile.meta.format,
            wh: parseU16XY(asepriteFile.meta.size),
            filmByID,
            celBoundsByID: newCelBoundsByID(factory, filmByID)
        });
    }
    AtlasMetaParser.parse = parse;
    function parseFilmByID(factory, file, ids) {
        const { frameTags , slices  } = file.meta;
        const map = new Map();
        for (const frameTag of frameTags){
            const id = frameTag.name;
            assert(isFilmID(id, ids), `Unknown ID in atlas: "${id}".`);
            assert(!map.has(id), `Duplicate ID in atlas: "${id}".`);
            map.set(id, parseFilm(id, frameTag, file.frames, slices, factory));
        }
        const missingIDs = ids == null || ids.size == map.size ? [] : [
            ...ids.keys()
        ].filter((id)=>!map.has(id)).map((id)=>`"${id}"`);
        assert(missingIDs.length == 0, `Missing ID(s) in atlas: ${missingIDs.join(', ')}.`);
        const orphanSlices = slices.filter((slice)=>!map.has(slice.name));
        assert(orphanSlices.length == 0, `Missing ID(s) for slice(s): ${orphanSlices.map((slice)=>slice.name).join(', ')}.`);
        return Object.fromEntries(map);
    }
    AtlasMetaParser.parseFilmByID = parseFilmByID;
    function newCelBoundsByID(factory, filmByID) {
        const celBoundsByID = [];
        for (const film of Object.values(filmByID)){
            for (const cel of film.cels)celBoundsByID[cel.id] = cel.bounds;
        }
        assert(celBoundsByID.length == factory.size, `Cel bounds lookup table has incorrect length ` + `(${celBoundsByID.length}); length should equal number of CelIDs ` + `created (${factory.size}).`);
        return celBoundsByID;
    }
    AtlasMetaParser.newCelBoundsByID = newCelBoundsByID;
    function isFilmID(id, ids) {
        return ids == null || ids.has(id);
    }
    AtlasMetaParser.isFilmID = isFilmID;
    function parseFilm(id, frameTag, frameMap, slices, factory) {
        const frames = parseTagFrames(frameTag, frameMap);
        const cels = frames.map((frame, i)=>parseCel(frameTag, frame, i, slices, factory));
        assert(cels.length > 0, `"${frameTag.name}" film has no cels.`);
        const invalidDurationCelIndex = cels.slice(frameTag.direction == Aseprite.Direction.Reverse ? 1 : 0, frameTag.direction == Aseprite.Direction.Forward ? -1 : undefined).findIndex(({ duration  })=>duration == InfiniteDuration);
        assert(invalidDurationCelIndex == -1, `Cel ${invalidDurationCelIndex} must have finite duration (less than ` + `${Aseprite.Infinity}) for ${frameTag.direction} playback in ` + `"${frameTag.name}" film.`);
        let duration = cels.reduce((time, { duration  })=>Math.min(InfiniteDuration, time + duration), 0);
        if (frameTag.direction == Aseprite.Direction.PingPong && cels.length > 2) {
            duration += duration - (cels[0].duration + cels.at(-1).duration);
        }
        assert(duration > 0, `Zero total duration for "${frameTag.name}" film.`);
        const wh = parseU16XY(frames[0].sourceSize);
        const area = wh.x * wh.y;
        assert(cels.every(({ bounds  })=>U16Box.area(bounds) == area), `Cel sizes for "${frameTag.name}" film vary.`);
        const period = computePeriod(cels);
        for(let i = cels.length - 1; i >= 0; i--){
            const cel = cels[i];
            if (cel.duration == InfiniteDuration) continue;
            for(let duration1 = period; duration1 < cel.duration; duration1 += period)cels.splice(i, 0, cel);
        }
        return {
            id,
            wh,
            cels,
            period,
            duration: U32(duration),
            direction: parsePlayback(frameTag.direction)
        };
    }
    AtlasMetaParser.parseFilm = parseFilm;
    function parseTagFrames({ name , from , to  }, frameMap) {
        const frames = [];
        for(; from <= to; from++){
            const tagFrameNumber = `${name}-${from}`;
            const frame = frameMap[tagFrameNumber];
            assert(frame != null, `Missing Frame "${tagFrameNumber}".`);
            frames.push(frame);
        }
        return frames;
    }
    function parsePlayback(direction) {
        assert(isDirection(direction), `"${direction}" is not a Direction.`);
        const playback = {
            'forward': 'Forward',
            'reverse': 'Reverse',
            'pingpong': 'PingPong'
        };
        return playback[direction];
    }
    AtlasMetaParser.parsePlayback = parsePlayback;
    function isDirection(value) {
        return Object.values(Aseprite.Direction).some((direction)=>value == direction);
    }
    AtlasMetaParser.isDirection = isDirection;
    function parseCel(frameTag, frame, frameNumber, slices, factory) {
        const sliceBoxes = parseSlices(frameTag, frameNumber, slices);
        const sliceBounds = sliceBoxes.length < 1 ? U16Box(1, 1, -1, -1) : sliceBoxes.reduce((sum, slice)=>U16Box.union(sum, slice));
        return {
            id: factory.new(),
            bounds: parseBounds(frame),
            duration: parseDuration(frame.duration),
            sliceBounds,
            slices: sliceBoxes
        };
    }
    AtlasMetaParser.parseCel = parseCel;
    function parseBounds(frame) {
        const padding = parsePadding(frame);
        return U16Box(frame.frame.x + padding.x / 2, frame.frame.y + padding.y / 2, frame.sourceSize.w, frame.sourceSize.h);
    }
    AtlasMetaParser.parseBounds = parseBounds;
    function parsePadding(frame) {
        const w = frame.frame.w - frame.sourceSize.w;
        const h = frame.frame.h - frame.sourceSize.h;
        assert(isEven(w) && isEven(h), 'Cel padding is not evenly divisible.');
        return U16XY(w, h);
    }
    AtlasMetaParser.parsePadding = parsePadding;
    function isEven(val) {
        return (val & 1) == 0;
    }
    function parseDuration(duration) {
        assert(duration > 0, 'Cel duration is not positive.');
        if (duration == Aseprite.Infinity) return InfiniteDuration;
        return U32(duration);
    }
    AtlasMetaParser.parseDuration = parseDuration;
    function parseSlices(frameTag, index, slices) {
        const bounds = [];
        for (const slice of slices){
            if (slice.name != frameTag.name) continue;
            const key = slice.keys.filter((key)=>key.frame <= index).at(-1);
            if (key != null) bounds.push(parseU16Box(key.bounds));
        }
        return bounds;
    }
    AtlasMetaParser.parseSlices = parseSlices;
    function parseU16Box(rect) {
        return U16Box(rect.x, rect.y, rect.w, rect.h);
    }
    AtlasMetaParser.parseU16Box = parseU16Box;
    function parseU16XY(wh) {
        return U16XY(wh.w, wh.h);
    }
    AtlasMetaParser.parseU16XY = parseU16XY;
    function computePeriod(cels) {
        const durations = cels.map((cel)=>cel.duration);
        if (durations.length <= 1) return durations[0];
        const infinite = durations.at(-1) == InfiniteDuration;
        const finiteDurations = infinite ? durations.slice(0, -1) : durations;
        const period = greatestCommonDivisor(finiteDurations);
        return U32(period);
    }
    function greatestCommonDivisor(ints) {
        return ints.reduce((gcd, __int)=>greatestCommonDivisorPair(gcd, __int), ints[0]);
    }
    AtlasMetaParser.greatestCommonDivisor = greatestCommonDivisor;
    function greatestCommonDivisorPair(lhs, rhs) {
        assert(lhs != 0 && rhs != 0, 'Cannot divide by zero.');
        const remainder = lhs % rhs;
        if (remainder == 0) return rhs;
        return greatestCommonDivisorPair(rhs, Int(remainder));
    }
    AtlasMetaParser.greatestCommonDivisorPair = greatestCommonDivisorPair;
})(AtlasMetaParser || (AtlasMetaParser = {}));
class CelIDFactory {
    #id = 0;
    new() {
        return this.#id++;
    }
    get size() {
        return this.#id;
    }
}
const Layer = Immutable({
    Top: U8(0x01),
    Cursor: U8(0x01),
    Bottom: U8(0x40)
});
Immutable(Inverse(Layer));
U16(0b1111_1111_0000_0000);
const LayerMask = U16(0b0000_0000_0111_1111);
const LayerByHeightFlag = U16(0b1000_0000);
U16(LayerByHeightFlag);
const __default = JSON.parse(`{
  "//": "https://w3c.github.io/gamepad/#remapping",
  "buttons": {
    "14": "Left",
    "15": "Right",
    "12": "Up",
    "13": "Down",
    "0": "Action",
    "9": "Menu"
  },
  "axes": {
    "0": "Left",
    "1": "Up",
    "2": "Left",
    "3": "Up"
  }
}
`);
const __default1 = JSON.parse(`{
  "ArrowLeft": "Left",
  "a": "Left",
  "ArrowRight": "Right",
  "d": "Right",
  "ArrowUp": "Up",
  "w": "Up",
  "ArrowDown": "Down",
  "s": "Down",
  " ": "Action",
  "Enter": "Action",
  "Escape": "Menu",
  "Ctrl+Alt+Shift+D": "DebugContextLoss",
  "0": "ScaleReset",
  "-": "ScaleDecrease",
  "+": "ScaleIncrease"
}
`);
const __default2 = JSON.parse(`{ "0": "Point", "1": "Action" }
`);
const __default3 = JSON.parse(`{
  "uniforms": {
    "uAtlas": "uAtlas",
    "uAtlasSize": "uAtlasSize",
    "uProjection": "uProjection",
    "uSourceByCelID": "uSourceByCelID"
  },
  "perVertex": [{ "name": "vUV", "type": "UNSIGNED_SHORT", "len": 2 }],
  "perInstance": [
    { "name": "iCelID", "type": "UNSIGNED_SHORT", "len": 1 },
    { "name": "iTarget", "type": "SHORT", "len": 4 },
    { "name": "iWrapLayerByHeightLayer", "type": "UNSIGNED_SHORT", "len": 1 }
  ]
}
`);
function Synth() {
    return {
        context: new AudioContext()
    };
}
(function(Synth) {
    function play(val, type, startFrequency, endFrequency, duration) {
        const oscillator = val.context.createOscillator();
        const gain = val.context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(startFrequency, val.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, val.context.currentTime + duration);
        gain.gain.setValueAtTime(1, val.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, val.context.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(val.context.destination);
        oscillator.start();
        oscillator.stop(val.context.currentTime + duration);
        return {
            ...val,
            oscillator,
            gain
        };
    }
    Synth.play = play;
})(Synth || (Synth = {}));
var FollowCamFill;
(function(FollowCamFill) {
    FollowCamFill.values = Immutable(new Set([
        'X',
        'Y',
        'XY'
    ]));
})(FollowCamFill || (FollowCamFill = {}));
var FollowCamConfig;
(function(FollowCamConfig) {
    let Orientation;
    (function(Orientation) {
        Orientation.values = Immutable(new Set([
            'North',
            'Northeast',
            'East',
            'Southeast',
            'South',
            'Southwest',
            'West',
            'Northwest',
            'Center'
        ]));
    })(Orientation = FollowCamConfig.Orientation || (FollowCamConfig.Orientation = {}));
})(FollowCamConfig || (FollowCamConfig = {}));
function Ent(ent) {
    return U32(ent);
}
(function(Ent1) {
    function parse(ent) {
        return Ent(Number.parseInt(ent, 10));
    }
    Ent1.parse = parse;
})(Ent || (Ent = {}));
const FollowCamSystem = Immutable({
    query: new Set([
        'followCam',
        'sprite'
    ]),
    updateEnt
});
function updateEnt(set, update) {
    const { followCam , sprite  } = set;
    const pad = I16XY(followCam.pad?.x ?? 0, followCam.pad?.y ?? 0);
    I16Box.sizeTo(sprite.bounds, I16(followCam.fill == 'X' || followCam.fill == 'XY' ? I16Box.width(update.camBounds) - pad.x * 2 : sprite.w), I16(followCam.fill == 'Y' || followCam.fill == 'XY' ? I16Box.height(update.camBounds) - pad.y * 2 : sprite.h));
    I16Box.moveTo(sprite.bounds, computeX(sprite, update.camBounds, followCam), computeY(sprite, update.camBounds, followCam));
}
function computeX(sprite, cam, component) {
    const camW = I16Box.width(cam);
    const spriteW = Math.abs(sprite.w);
    const padW = component.pad?.x ?? 0;
    let x = cam.start.x;
    switch(component.orientation){
        case 'Southwest':
        case 'West':
        case 'Northwest':
            x = I16(x + padW);
            break;
        case 'Southeast':
        case 'East':
        case 'Northeast':
            x = I16(x + camW - (spriteW + padW));
            break;
        case 'North':
        case 'South':
        case 'Center':
            x = I16(x + Math.trunc(camW / 2) - (Math.trunc(spriteW / 2) + padW));
            break;
    }
    const modulo = (component.modulo?.x ?? x) || 1;
    return I16(x - x % modulo);
}
function computeY(sprite, cam, component) {
    const camH = I16Box.height(cam);
    const spriteH = Math.abs(sprite.h);
    const padH = component.pad?.y ?? 0;
    let y = cam.start.y;
    switch(component.orientation){
        case 'North':
        case 'Northeast':
        case 'Northwest':
            y = I16(y + padH);
            break;
        case 'Southeast':
        case 'South':
        case 'Southwest':
            y = I16(y + camH - (spriteH + padH));
            break;
        case 'East':
        case 'West':
        case 'Center':
            y = I16(y + Math.trunc(camH / 2) - (Math.trunc(spriteH / 2) + padH));
            break;
    }
    const modulo = (component.modulo?.y ?? y) || 1;
    return I16(y - y % modulo);
}
const FollowPointSystem = Immutable({
    query: new Set([
        'followPoint',
        'sprite'
    ]),
    updateEnt: updateEnt1
});
function updateEnt1(set, update) {
    const { sprite  } = set;
    if (update.input.xy != null) sprite.moveTo(update.input.xy);
    else {
        const tick = 1000 / 60;
        const speed = I16.trunc(Math.max(1, update.delta / tick * 4));
        if (update.input.isOn('Left')) sprite.moveBy(I16XY(-speed, 0));
        if (update.input.isOn('Right')) sprite.moveBy(I16XY(speed, 0));
        if (update.input.isOn('Up')) sprite.moveBy(I16XY(0, -speed));
        if (update.input.isOn('Down')) sprite.moveBy(I16XY(0, speed));
    }
}
var Button;
(function(Button) {
    Button.values = Immutable(new Set([
        'Point',
        'Left',
        'Right',
        'Up',
        'Down',
        'Action',
        'Menu',
        'DebugContextLoss',
        'ScaleReset',
        'ScaleIncrease',
        'ScaleDecrease'
    ]));
    var Bit = Button.Bit = Immutable({
        Left: 0b000_0000_0001n,
        Right: 0b000_0000_0010n,
        Up: 0b000_0000_0100n,
        Down: 0b000_0000_1000n,
        Point: 0b000_0001_0000n,
        Action: 0b000_0010_0000n,
        Menu: 0b000_0100_0000n,
        DebugContextLoss: 0b000_1000_0000n,
        ScaleReset: 0b001_0000_0000n,
        ScaleIncrease: 0b010_0000_0000n,
        ScaleDecrease: 0b100_0000_0000n
    });
    Button.InvertBit = Immutable({
        Left: Bit.Right,
        Right: Bit.Left,
        Up: Bit.Down,
        Down: Bit.Up
    });
})(Button || (Button = {}));
var PointerType;
(function(PointerType) {
    PointerType.values = Immutable(new Set([
        'Mouse',
        'Pen',
        'Touch'
    ]));
    function parse(type) {
        const pointerType = Str.capitalize(type);
        return isPointerType(pointerType) ? pointerType : undefined;
    }
    PointerType.parse = parse;
})(PointerType || (PointerType = {}));
function isPointerType(type) {
    return PointerType.values.has(type);
}
var ImageLoader;
(function(ImageLoader) {
    function load(source) {
        return new Promise((resolve, reject)=>{
            const image = new Image();
            image.onload = ()=>resolve(image);
            image.onerror = ()=>reject(image);
            image.src = source;
        });
    }
    ImageLoader.load = load;
})(ImageLoader || (ImageLoader = {}));
var JSONLoader;
(function(JSONLoader) {
    async function load(source) {
        const response = await fetch(source, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
    JSONLoader.load = load;
})(JSONLoader || (JSONLoader = {}));
var GL;
(function(GL) {
    GL.debug = true;
    function initAttribute(gl, stride, divisor, buffer, location, attrib) {
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribIPointer(location, attrib.len, gl[attrib.type], stride, attrib.offset);
        gl.vertexAttribDivisor(location, divisor);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    GL.initAttribute = initAttribute;
    function loadProgram(gl, vertexGLSL, fragmentGLSL) {
        const program = gl.createProgram();
        if (program == null) return null;
        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexGLSL);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentGLSL);
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        const log = gl.getProgramInfoLog(program);
        if (log) console.info(log);
        gl.detachShader(program, fragmentShader);
        gl.detachShader(program, vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return program;
    }
    GL.loadProgram = loadProgram;
    function compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        assertNonNull(shader, 'Shader creation failed.');
        gl.shaderSource(shader, source.trim());
        gl.compileShader(shader);
        const log = gl.getShaderInfoLog(shader);
        if (log) console.info(log);
        return shader;
    }
    GL.compileShader = compileShader;
    function bufferData(gl, buffer, data, usage) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    GL.bufferData = bufferData;
    function loadTexture(gl, textureUnit, image) {
        gl.activeTexture(textureUnit);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        return texture;
    }
    GL.loadTexture = loadTexture;
    function loadDataTexture(gl, textureUnit, internalFormat, width, height, format, type, dat) {
        gl.activeTexture(textureUnit);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, dat);
        return texture;
    }
    GL.loadDataTexture = loadDataTexture;
    function uniformLocations(gl, program) {
        if (program == null) return {};
        const len = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        const locations = {};
        for(let i = 0; i < len; ++i){
            const uniform = gl.getActiveUniform(program, i);
            assertNonNull(uniform, `Missing shader uniform at index ${i}.`);
            locations[uniform.name] = gl.getUniformLocation(program, uniform.name);
        }
        return locations;
    }
    GL.uniformLocations = uniformLocations;
    function uniformLocation(layout, uniforms, name) {
        return NonNull(uniforms[NonNull(layout.uniforms[name])]);
    }
    GL.uniformLocation = uniformLocation;
    function attributeLocations(gl, program) {
        if (program == null) return {};
        const len = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        const locations = {};
        for(let i = 0; i < len; ++i){
            const attr = gl.getActiveAttrib(program, i);
            assertNonNull(attr, `Missing shader attribute at index ${i}.`);
            locations[attr.name] = gl.getAttribLocation(program, attr.name);
        }
        return locations;
    }
    GL.attributeLocations = attributeLocations;
})(GL || (GL = {}));
var Viewport;
(function(Viewport) {
    function scale(nativeViewportWH, minViewportWH, zoomOut) {
        const x = nativeViewportWH.x / minViewportWH.x;
        const y = nativeViewportWH.y / minViewportWH.y;
        return I16(Math.max(1, Math.floor(Math.min(x, y)) - zoomOut));
    }
    Viewport.scale = scale;
    function clientViewportWH(window1) {
        const { width , height  } = window1.document.body.getBoundingClientRect();
        return NumberXY(width, height);
    }
    Viewport.clientViewportWH = clientViewportWH;
    function nativeViewportWH(window1, clientViewportWH) {
        return U16XY.round(clientViewportWH.x * window1.devicePixelRatio, clientViewportWH.y * window1.devicePixelRatio);
    }
    Viewport.nativeViewportWH = nativeViewportWH;
    function camWH(nativeViewportWH, scale) {
        return I16XY.floor(nativeViewportWH.x / scale, nativeViewportWH.y / scale);
    }
    Viewport.camWH = camWH;
    function nativeCanvasWH(camWH, scale) {
        return I16XY(camWH.x * scale, camWH.y * scale);
    }
    Viewport.nativeCanvasWH = nativeCanvasWH;
    function clientCanvasWH(window1, nativeCanvasWH) {
        const ratio = window1.devicePixelRatio;
        return NumberXY(nativeCanvasWH.x / ratio, nativeCanvasWH.y / ratio);
    }
    Viewport.clientCanvasWH = clientCanvasWH;
    function toLevelXY(point, clientViewportWH, cam) {
        return I16XY.trunc(cam.start.x + point.x / clientViewportWH.x * I16Box.width(cam), cam.start.y + point.y / clientViewportWH.y * I16Box.height(cam));
    }
    Viewport.toLevelXY = toLevelXY;
})(Viewport || (Viewport = {}));
const littleEndian = new Int8Array(new Int16Array([
    1
]).buffer)[0] == 1;
function InstanceBuffer(layout, len = Uint(0)) {
    return {
        buffer: new DataView(new ArrayBuffer(layout.perInstance.stride * len)),
        layout,
        size: 0
    };
}
(function(InstanceBuffer) {
    function resize(self, len) {
        self.buffer = new DataView(new ArrayBuffer(self.layout.perInstance.stride * len));
    }
    InstanceBuffer.resize = resize;
    function set(self, index, sprite, time) {
        const i = index * self.layout.perInstance.stride;
        if (self.buffer.byteLength < i + self.layout.perInstance.stride) {
            resize(self, Uint(Math.max(1, index) * 2));
        }
        self.buffer.setUint16(i + 0, sprite.cel(time).id, littleEndian);
        self.buffer.setInt16(i + 2, sprite.x, littleEndian);
        self.buffer.setInt16(i + 4, sprite.y, littleEndian);
        self.buffer.setInt16(i + 6, sprite.w, littleEndian);
        self.buffer.setInt16(i + 8, sprite.h, littleEndian);
        self.buffer.setUint16(i + 10, sprite.wrapLayerByHeightLayer, littleEndian);
        self.size = index + 1;
    }
    InstanceBuffer.set = set;
})(InstanceBuffer || (InstanceBuffer = {}));
const GLDataTypeSize = Immutable({
    BYTE: 1,
    UNSIGNED_BYTE: 1,
    SHORT: 2,
    UNSIGNED_SHORT: 2,
    INT: 4,
    UNSIGNED_INT: 4,
    FLOAT: 4
});
var ShaderLayoutParser;
(function(ShaderLayoutParser) {
    function parse(config) {
        return Immutable({
            uniforms: config.uniforms,
            perVertex: parseAttributes(0, config.perVertex),
            perInstance: parseAttributes(1, config.perInstance)
        });
    }
    ShaderLayoutParser.parse = parse;
})(ShaderLayoutParser || (ShaderLayoutParser = {}));
function parseAttributes(divisor, configs) {
    const attribs = configs.reduce(reduceAttribVariable, []);
    const maxDataTypeSize = attribs.reduce((max, attrib)=>Math.max(max, GLDataTypeSize[attrib.type]), 0);
    const lastAttrib = attribs.at(-1);
    const size = lastAttrib == null ? 0 : nextAttribOffset(lastAttrib);
    return {
        len: attribs.reduce((sum, { len  })=>sum + len, 0),
        stride: NumUtil.ceilMultiple(maxDataTypeSize, size),
        divisor,
        attributes: attribs
    };
}
function reduceAttribVariable(attribs, { type , name , len  }, index) {
    const attrib = attribs[index - 1];
    const offset = attrib == null ? 0 : nextAttribOffset(attrib);
    assert(isGLDataType(type), `${type} is not a GLDataType.`);
    return attribs.concat({
        type,
        name,
        len,
        offset
    });
}
function nextAttribOffset(attrib) {
    return attrib.offset + GLDataTypeSize[attrib.type] * attrib.len;
}
function isGLDataType(type) {
    return type in GLDataTypeSize;
}
var JSONStorage;
(function(JSONStorage) {
    function clear(storage) {
        storage.clear();
    }
    JSONStorage.clear = clear;
    function get(self, key) {
        const val = self.getItem(key);
        return val == null ? undefined : JSON.parse(val);
    }
    JSONStorage.get = get;
    function put(self, key, val) {
        if (val == null) self.removeItem(key);
        else self.setItem(key, JSON.stringify(val));
    }
    JSONStorage.put = put;
})(JSONStorage || (JSONStorage = {}));
var Font;
(function(Font) {
    function kerning(self, lhs, rhs) {
        if (rhs == null) return self.endOfLineKerning;
        if (Str.isBlank(lhs) || Str.isBlank(rhs)) return self.whitespaceKerning;
        return self.kerning[lhs + rhs] ?? self.defaultKerning;
    }
    Font.kerning = kerning;
    function charWidth(self, letter) {
        return self.charWidth[letter] ?? self.defaultCharWidth;
    }
    Font.charWidth = charWidth;
})(Font || (Font = {}));
function mapValues(record, transformer) {
    const ret = {};
    const entries = Object.entries(record);
    for (const [key, value] of entries){
        const mappedValue = transformer(value);
        ret[key] = mappedValue;
    }
    return ret;
}
var FontParser;
(function(FontParser) {
    function parse(meta, cast) {
        return Immutable({
            id: meta.id,
            name: meta.name,
            cellWidth: cast(meta.cellWidth),
            cellHeight: cast(meta.cellHeight),
            leading: cast(meta.leading),
            lineHeight: cast(meta.cellHeight + meta.leading),
            baseline: cast(meta.baseline),
            kerning: mapValues(meta.kerning, cast),
            defaultKerning: cast(meta.defaultKerning),
            whitespaceKerning: cast(meta.whitespaceKerning),
            endOfLineKerning: cast(meta.endOfLineKerning),
            charWidth: mapValues(meta.charWidth, cast),
            defaultCharWidth: cast(meta.defaultCharWidth)
        });
    }
    FontParser.parse = parse;
})(FontParser || (FontParser = {}));
function ECS(systems) {
    return {
        factory: Ent(0),
        systems,
        entsBySystem: new Map([
            ...systems
        ].map((system)=>[
                system,
                new Set()
            ])),
        componentsByEnt: new Map(),
        componentsByRef: new Map(),
        systemsByEnt: new Map(),
        pending: []
    };
}
const CursorSystem = Immutable({
    query: new Set([
        'cursor',
        'sprite'
    ]),
    updateEnt: updateEnt2
});
const RenderSystem = Immutable({
    type: 'Render',
    query: new Set([
        'sprite'
    ]),
    update
});
class GamepadPoller {
    #buttons = 0n;
    get sample() {
        return this.#buttons;
    }
    reset() {
        this.#buttons = 0n;
    }
    preupdate() {
        if (!globalThis.isSecureContext) return;
        const gamepads = Array.from(navigator.getGamepads());
        this.#buttons = gamepads.reduce(reduceGamepads, 0n);
    }
}
class KeyboardPoller {
    #buttons = 0n;
    get sample() {
        return this.#buttons;
    }
    reset() {
        this.#buttons = 0n;
    }
    register(op) {
        const fn = `${op}EventListener`;
        globalThis[fn]('blur', this.#onBlurEvent, {
            capture: true,
            passive: true
        });
        for (const type of [
            'keydown',
            'keyup'
        ]){
            const callback = this.#onKeyEvent;
            globalThis[fn](type, callback, {
                capture: true,
                passive: true
            });
        }
    }
    #onBlurEvent = ()=>{
        this.#buttons = 0n;
    };
    #onKeyEvent = (ev)=>{
        const on = ev.type == 'keydown';
        for (const key of eventToKeys(ev)){
            this.#buttons = keyToButton(this.#buttons, key, on);
        }
    };
}
class PointerPoller {
    #buttons;
    #cam;
    #clientViewportWH;
    #pointerType;
    #xy;
    get pointerType() {
        return this.#pointerType;
    }
    get sample() {
        return this.#buttons;
    }
    get xy() {
        return this.#xy;
    }
    constructor(){
        this.#buttons = 0n;
        this.#cam = I16Box(0, 0, 1, 1);
        this.#clientViewportWH = NumberXY(1, 1);
    }
    postupdate(clientViewportWH, cam) {
        this.#clientViewportWH = clientViewportWH;
        this.#cam = cam;
        if (this.#buttons == 0n || this.#buttons == Button.Bit.Point) this.reset();
    }
    register(op) {
        const fn = `${op}EventListener`;
        window[fn]('pointercancel', this.reset, {
            capture: true,
            passive: true
        });
        const types = [
            'contextmenu',
            'pointerdown',
            'pointermove',
            'pointerup'
        ];
        for (const type of types){
            const passive = type != 'contextmenu' && type != 'pointerdown';
            window[fn](type, this.#onPointEvent, {
                capture: true,
                passive
            });
        }
    }
    reset = ()=>{
        this.#buttons = 0n;
        this.#pointerType = undefined;
        this.#xy = undefined;
    };
    #onPointEvent = (ev)=>{
        if (ev.type != 'contextmenu') {
            const pointer = ev;
            this.#buttons = pointerButtonsToButton(pointer.buttons);
            this.#pointerType = PointerType.parse(pointer.pointerType);
            const clientXY = NumberXY(pointer.clientX, pointer.clientY);
            this.#xy = Viewport.toLevelXY(clientXY, this.#clientViewportWH, this.#cam);
        }
        const active = ev.type == 'contextmenu' || ev.type == 'pointerdown';
        if (active) ev.preventDefault();
    };
}
class InputPoller {
    #gamepad = new GamepadPoller();
    #keyboard = new KeyboardPoller();
    #pointer = new PointerPoller();
    get pointerType() {
        return this.#pointer.pointerType;
    }
    get sample() {
        return this.#gamepad.sample | this.#keyboard.sample | this.#pointer.sample;
    }
    get xy() {
        return this.#pointer.xy;
    }
    preupdate() {
        this.#gamepad.preupdate();
    }
    postupdate(clientViewportWH, cam) {
        this.#pointer.postupdate(clientViewportWH, cam);
    }
    register(op) {
        this.#keyboard.register(op);
        this.#pointer.register(op);
    }
    reset() {
        this.#gamepad.reset();
        this.#keyboard.reset();
        this.#pointer.reset();
    }
}
class Input {
    #duration = 0;
    #poller = new InputPoller();
    #prevButtons = 0n;
    #combo = [];
    #maxInterval;
    #minHeld;
    get buttons() {
        return this.#poller.sample;
    }
    get pointerType() {
        return this.#poller.pointerType;
    }
    get xy() {
        return this.#poller.xy;
    }
    constructor(minHeld = 300, maxInterval = 300){
        this.#minHeld = minHeld;
        this.#maxInterval = maxInterval;
    }
    isCombo(...combo) {
        if (combo.length != this.#combo.length) return false;
        for (const [i, buttons] of combo.entries()){
            const mask = buttons.reduce((sum, button)=>sum | Button.Bit[button], 0n);
            if (this.#combo[i] != mask) return false;
            if (i == combo.length - 1 && mask != this.buttons) return false;
        }
        return true;
    }
    isComboStart(...combo) {
        return this.isCombo(...combo) && !!combo.at(-1)?.every((button)=>this.isOnStart(button));
    }
    isComboHeld(...combo) {
        return this.isCombo(...combo) && this.isHeld();
    }
    isOn(...buttons) {
        return buttons.every((button)=>{
            const mask = Button.Bit[button];
            return (this.buttons & mask) == mask;
        });
    }
    isOnStart(...buttons) {
        return this.isOn(...buttons) && this.isStart(...buttons);
    }
    isOnHeld(...buttons) {
        return this.isOn(...buttons) && this.isHeld();
    }
    isOff(...buttons) {
        return !this.isOn(...buttons);
    }
    isOffStart(...buttons) {
        return this.isOff(...buttons) && this.isStart(...buttons);
    }
    isOffHeld(...buttons) {
        return this.isOff(...buttons) && this.isHeld();
    }
    isStart(...buttons) {
        return buttons.every((button)=>{
            const mask = Button.Bit[button];
            return this.#duration == 0 && (this.buttons & mask) != (this.#prevButtons & mask);
        });
    }
    isHeld() {
        return this.#duration >= this.#minHeld;
    }
    preupdate() {
        this.#poller.preupdate();
        if (this.#duration > this.#maxInterval && (this.buttons == 0n || this.buttons != this.#prevButtons)) {
            this.#duration = 0;
            this.#combo.length = 0;
        } else if (this.buttons != this.#prevButtons) {
            this.#duration = 0;
            if (this.buttons != 0n) this.#combo.push(this.buttons);
        } else if (this.buttons != 0n && this.buttons == this.#prevButtons) {
            this.#combo.pop();
            this.#combo.push(this.buttons);
        }
    }
    postupdate(delta, clientViewportWH, cam) {
        this.#poller.postupdate(clientViewportWH, cam);
        this.#duration += delta;
        this.#prevButtons = this.buttons;
    }
    register(op) {
        this.#poller.register(op);
    }
    reset() {
        this.#poller.reset();
    }
}
var LevelParser;
const uv = new Uint16Array(Object.freeze([
    1,
    1,
    0,
    1,
    1,
    0,
    0,
    0
]));
const __default4 = `#version 300 es
#pragma debug(${GL.debug ? 'on' : 'off'})
#pragma optimize(${GL.debug ? 'off' : 'on'})

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#essl300_minimum_requirements_webgl_2
// todo: int is currently I32 but should be mediump (I16). However, that broke
// on Joie's phone.
precision highp int; // I32
precision mediump isampler2D; // U16
precision mediump usampler2D; // U16
precision highp float; // F32
precision highp sampler2D; // F32

// The camera projection in pixels.
uniform mat4 uProjection;

// The atlas spritesheet.
uniform sampler2D uAtlas;

// The atlas cel ID to subimage box coordinate. Each row is x, y, width (z), and
// height (w) in pixels.
uniform usampler2D uSourceByCelID;

// Each vertex of a two triangle strip in a unit square (each x/y is either 0 or
// 1). Multiplying a width and height against the UV coordinates gives the
// bounding box.
in uvec2 vUV;

// The atlas cel ID (index).
in uint iCelID;

// The rendered destination and dimensions in level pixel coordinates. x, y,
// scaled width (z) and scaled height (w) in pixels. When the destination width
// and height is not equal to the source width and height times scale, the
// rendered result is the source truncated or repeated. Width and height are
// negative when flipped.
in ivec4 iTarget;

in uint iWrapLayerByHeightLayer;

const uint LayerByHeightFlag = 1u << 7;
const uint LayerMask = 0x007fu;
const uint LayerByHeightMask = LayerByHeightFlag;
const uint LayerByHeightFlagStart = LayerByHeightMask & LayerByHeightFlag;
const uint LayerByHeightFlagEnd = LayerByHeightMask & ~LayerByHeightFlag;

// Only care about layer, height, and y. See
// https://www.patternsgameprog.com/opengl-2d-facade-25-get-the-z-of-a-pixel.
float zDepth() {
  const float maxLayer = 64.;
  const float maxY = 16. * 1024.;
  const float maxDepth = maxLayer * maxY;
  bool layerByHeight =
    (iWrapLayerByHeightLayer & LayerByHeightMask) == LayerByHeightFlagStart;
  float depth = float(iWrapLayerByHeightLayer & LayerMask) * maxY
    - float(iTarget.y + (layerByHeight ? iTarget.w : 0));
  return depth / maxDepth;
}

out vec2 vTargetWH;
out vec4 vSourceXYWH;
flat out ivec2 vWrapXY;

void main() {
  uvec4 sourceXYWH = texelFetch(uSourceByCelID, ivec2(0, iCelID), 0);

  ivec2 targetWH = ivec2(vUV) * iTarget.zw;
  gl_Position = vec4(iTarget.xy + abs(targetWH), zDepth(), 1) * uProjection;
  vTargetWH = vec2(targetWH);
  vSourceXYWH = vec4(sourceXYWH);

  vWrapXY= ivec2((iWrapLayerByHeightLayer >> 12)& 0xfu, (iWrapLayerByHeightLayer >> 8)& 0xfu);
}`;
const __default5 = `#version 300 es
#pragma debug(${GL.debug ? 'on' : 'off'})
#pragma optimize(${GL.debug ? 'off' : 'on'})

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#essl300_minimum_requirements_webgl_2
precision mediump int; // I16
precision mediump isampler2D; // U16
precision mediump usampler2D; // U16
precision highp float; // F32
precision highp sampler2D; // F32

uniform sampler2D uAtlas;
uniform uvec2 uAtlasSize; // width (x), height (y) in pixels.

/**
 * The destination width and height. These dimensions are negative when flipped.
 */
in vec2 vTargetWH;

/** Atlas position and dimensions. */
in vec4 vSourceXYWH;

/** Destination texture rotation offset. */
flat in ivec2 vWrapXY;

out vec4 frag;

void main() {
  // Wrap the target over the source to prevent scaling.
  vec2 sourceXY = vSourceXYWH.xy;
  vec2 sourceWH = vSourceXYWH.zw;
  vec2 px = sourceXY + mod(vTargetWH - vec2(vWrapXY), sourceWH);
  frag = texture(uAtlas, px / vec2(uAtlasSize));
  if(frag.a < 1.) discard;
}`;
const uvLen = uv.length / 2;
function Renderer(canvas, atlas, layout, atlasMeta) {
    const gl = canvas.getContext('webgl2', {
        antialias: false,
        desynchronized: true,
        preserveDrawingBuffer: false
    });
    assertNonNull(gl, 'WebGL 2 unsupported.');
    const [r, g, b, a] = Color.intToFloats(U32(0x0a1a1a_ff));
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthRange(0, 1);
    gl.depthFunc(gl.LESS);
    gl.clearDepth(1);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);
    const program = GL.loadProgram(gl, __default4, __default5);
    const uniforms = GL.uniformLocations(gl, program);
    gl.uniform1i(GL.uniformLocation(layout, uniforms, 'uAtlas'), 0);
    gl.uniform1i(GL.uniformLocation(layout, uniforms, 'uSourceByCelID'), 1);
    gl.uniform2ui(GL.uniformLocation(layout, uniforms, 'uAtlasSize'), atlas.naturalWidth, atlas.naturalHeight);
    const attributes = GL.attributeLocations(gl, program);
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    const perVertexBuffer = gl.createBuffer();
    for (const attr of layout.perVertex.attributes){
        GL.initAttribute(gl, layout.perVertex.stride, layout.perVertex.divisor, perVertexBuffer, NonNull(attributes[attr.name]), attr);
    }
    GL.bufferData(gl, perVertexBuffer, uv, gl.STATIC_READ);
    const perInstanceBuffer = gl.createBuffer();
    for (const attr1 of layout.perInstance.attributes){
        GL.initAttribute(gl, layout.perInstance.stride, layout.perInstance.divisor, perInstanceBuffer, NonNull(attributes[attr1.name]), attr1);
    }
    GL.loadTexture(gl, gl.TEXTURE0, atlas);
    const dat = new Uint16Array(atlasMeta.celBoundsByID.flatMap((box)=>[
            box.start.x,
            box.start.y,
            U16Box.width(box),
            U16Box.height(box)
        ]));
    GL.loadDataTexture(gl, gl.TEXTURE1, gl.RGBA16UI, 1, dat.byteLength / (4 * 2), gl.RGBA_INTEGER, gl.UNSIGNED_SHORT, dat);
    return {
        gl,
        layout,
        uniforms,
        attributes,
        projection: new Float32Array(4 * 4),
        perInstanceBuffer,
        loseContext: gl.getExtension('WEBGL_lose_context')
    };
}
class RendererStateMachine {
    #frameID;
    #renderer;
    #canvas;
    #newRenderer;
    #onFrame;
    #onPause;
    #window;
    constructor(props){
        this.#canvas = props.canvas;
        this.#frameID = undefined;
        this.#newRenderer = props.newRenderer;
        this.#onFrame = props.onFrame;
        this.#onPause = props.onPause;
        this.#renderer = props.newRenderer();
        this.#window = props.window;
    }
    isContextLost() {
        return this.#renderer.gl.isContextLost();
    }
    loseContext() {
        this.#renderer.loseContext?.loseContext();
    }
    render(time, scale, cam, instanceBuffer) {
        Renderer.render(this.#renderer, time, scale, cam, instanceBuffer);
    }
    restoreContext() {
        this.#renderer.loseContext?.restoreContext();
    }
    start() {
        this.#register('add');
        this.#resume();
    }
    stop() {
        this.#pause();
        this.#register('remove');
    }
    #isDocumentVisible() {
        return this.#window.document.visibilityState == 'visible';
    }
    #requestAnimationFrame(then) {
        this.#frameID = this.#window.requestAnimationFrame((now)=>this.#loop(now, then));
    }
    #onEvent = (event)=>{
        event.preventDefault();
        if (event.type == 'webglcontextrestored') {
            this.#renderer = this.#newRenderer();
        }
        if (!this.isContextLost() && this.#isDocumentVisible()) this.#resume();
        else this.#pause();
    };
    #loop(now, then1) {
        const delta = Math.min(now - (then1 ?? now), 1000);
        this.#onFrame(delta);
        if (this.#frameID != null) this.#requestAnimationFrame(now);
    }
    #pause() {
        if (this.#frameID == null) return;
        this.#window.cancelAnimationFrame(this.#frameID);
        this.#frameID = undefined;
        if (this.isContextLost()) console.debug('Renderer paused; no GL context.');
        else if (!this.#isDocumentVisible()) {
            console.debug('Renderer paused; document hidden.');
        } else console.debug('Renderer paused.');
        this.#onPause();
    }
    #register(op) {
        const fn = `${op}EventListener`;
        for (const type of [
            'webglcontextrestored',
            'webglcontextlost'
        ]){
            this.#canvas[fn](type, this.#onEvent);
        }
        this.#window[fn]('visibilitychange', this.#onEvent);
    }
    #resume() {
        if (this.isContextLost()) {
            console.debug('Renderer cannot resume; no GL context.');
        } else if (!this.#isDocumentVisible()) {
            console.debug('Renderer cannot resume; document hidden.');
        } else if (this.#frameID == null) {
            console.debug('Renderer looping.');
            this.#requestAnimationFrame(undefined);
        }
    }
}
var SpriteFlip;
var TextLayout;
(function(ECS) {
    function addComponents(self, ent, components) {
        self.pending.push({
            type: 'AddComponents',
            ent,
            components
        });
    }
    ECS.addComponents = addComponents;
    function addEnt(self, ...components) {
        for (const map of components){
            self.pending.push({
                type: 'AddEnt',
                components: map
            });
        }
    }
    ECS.addEnt = addEnt;
    function query(self, ...types) {
        const sets = [];
        for (const set of self.componentsByEnt.values()){
            if (types.every((type)=>type in set)) sets.push(set);
        }
        return sets;
    }
    ECS.query = query;
    function get(self, ent, ...types) {
        const components = [];
        for (const type of types){
            const component = self.componentsByEnt.get(ent)?.[type];
            assertNonNull(component, `Ent ${ent} missing ${String(type)} component.`);
            components.push(component);
        }
        return types.length == 1 ? components[0] : components;
    }
    ECS.get = get;
    function flush(self) {
        for (const cmd of self.pending)execCmd(cmd, self);
        self.pending.length = 0;
    }
    ECS.flush = flush;
    function removeEnt(self, ent) {
        self.pending.push({
            type: 'RemoveEnt',
            ent
        });
    }
    ECS.removeEnt = removeEnt;
    function removeComponents(self, ent, components) {
        self.pending.push({
            type: 'RemoveComponents',
            ent,
            components
        });
    }
    ECS.removeComponents = removeComponents;
    function update(self, update) {
        for (const [system, ents] of self.entsBySystem.entries()){
            if (system.skip?.(update)) continue;
            const sets = new Set([
                ...ents
            ].map((ent)=>getEntComponents(self, ent)));
            if (system.update != null) system.update(sets, update);
            else for (const set of sets)system.updateEnt?.(set, update);
        }
        flush(self);
    }
    ECS.update = update;
})(ECS || (ECS = {}));
function execCmd(cmd, self) {
    switch(cmd.type){
        case 'AddComponents':
            {
                addComponents(self, cmd.ent, cmd.components);
                break;
            }
        case 'AddEnt':
            {
                self.factory = Ent(self.factory + 1);
                const ent = self.factory;
                self.componentsByEnt.set(ent, {});
                self.systemsByEnt.set(ent, new Set());
                addComponents(self, ent, cmd.components);
                break;
            }
        case 'RemoveComponents':
            removeComponents(self, cmd.ent, cmd.components);
            break;
        case 'RemoveEnt':
            {
                self.componentsByEnt.delete(cmd.ent);
                const systems = getEntSystems(self, cmd.ent);
                self.systemsByEnt.delete(cmd.ent);
                for (const system of systems){
                    self.entsBySystem.get(system)?.delete(cmd.ent);
                }
                break;
            }
    }
}
function addComponents(self, ent, components) {
    const entComponents = getEntComponents(self, ent);
    if (entComponents == null) return;
    for (const [type, component] of Object.entries(components)){
        self.componentsByRef.delete(entComponents[type]);
        entComponents[type] = component;
        self.componentsByRef.set(component, entComponents);
    }
    invalidateEntSystems(self, ent);
}
function removeComponents(self, ent, components) {
    const entComponents = getEntComponents(self, ent);
    for (const component of components){
        const ref = entComponents[component];
        delete entComponents[component];
        self.componentsByRef.delete(ref);
    }
    invalidateEntSystems(self, ent);
}
function getEntComponents(self, ent) {
    return NonNull(self.componentsByEnt.get(ent), `Ent ${ent} missing in ECS.componentsByEnt.`);
}
function hasEntComponents(self, ent, query) {
    const components = getEntComponents(self, ent);
    return [
        ...query
    ].every((type)=>type in components);
}
function invalidateEntSystems(self, ent) {
    const systems = new Set();
    for (const [system, ents] of self.entsBySystem){
        const add = hasEntComponents(self, ent, system.query);
        ents[add ? 'add' : 'delete'](ent);
        if (add) systems.add(system);
    }
    const entSystems = getEntSystems(self, ent);
    entSystems.clear();
    for (const system1 of systems)entSystems.add(system1);
}
function getEntSystems(self, ent) {
    return NonNull(self.systemsByEnt.get(ent), `Ent ${ent} missing in ECS.systemsByEnt.`);
}
function updateEnt2(set, update) {
    const { cursor , sprite  } = set;
    if (update.input.pointerType == 'Pen' || update.input.pointerType == 'Touch') sprite.layer = Layer.Bottom;
    else if (update.input.pointerType == 'Mouse') sprite.layer = Layer.Cursor;
    if (update.input.isOn('Action')) {
        if (update.input.isOnStart('Action')) {
            sprite.animate(update.time, cursor.pick);
        }
    } else sprite.animate(update.time, cursor.point);
}
function update(sets, update) {
    let index = 0;
    for (const set of sets.values()){
        InstanceBuffer.set(update.instanceBuffer, index, set.sprite, update.time);
        index++;
    }
    update.rendererStateMachine.render(update.time, update.scale, update.camBounds, update.instanceBuffer);
}
function reduceGamepads(sum, pad) {
    const axes = pad?.axes.reduce(reduceAxes, 0n) ?? 0n;
    const directionsButtons = pad?.buttons.reduce(reduceButtons, 0n) ?? 0n;
    return sum | axes | directionsButtons;
}
function reduceButtons(sum, gamepadButton, index) {
    const button = buttonIndexToButton(index);
    return sum | (gamepadButton.pressed ? button : 0n);
}
function buttonIndexToButton(index) {
    const fn = __default.buttons[index];
    if (fn == null) return 0n;
    return Button.Bit[fn];
}
function reduceAxes(sum, axis, index) {
    const bit = axisIndexToButton(index, Math.sign(axis));
    const on = Math.abs(axis) >= 0.5;
    return sum | bit & (on ? bit : 0n);
}
function axisIndexToButton(index, direction) {
    const fn = __default.axes[index];
    if (fn == null) return 0n;
    if (direction < 0) return Button.Bit[fn];
    return Button.InvertBit[fn] ?? 0n;
}
function eventToKeys(ev) {
    const meta = ev.metaKey ? 'Meta+' : '';
    const ctrl = ev.ctrlKey ? 'Ctrl+' : '';
    const alt = ev.altKey ? 'Alt+' : '';
    const shift = ev.shiftKey ? 'Shift+' : '';
    if (ev.type == 'keydown') {
        return new Set([
            meta + ctrl + alt + shift + ev.key
        ]);
    }
    return new Set([
        meta + ctrl + alt + shift + ev.key,
        ctrl + alt + shift + ev.key,
        alt + shift + ev.key,
        shift + ev.key,
        ev.key
    ]);
}
function keyToButton(buttons, key, on) {
    const fn = __default1[key];
    if (fn == null) return buttons;
    const bit = Button.Bit[fn];
    return on ? buttons | bit : buttons & ~bit;
}
function pointerButtonsToButton(buttons) {
    let mapped = Button.Bit.Point;
    for(let button = 1; button <= buttons; button <<= 1){
        if ((button & buttons) != button) continue;
        const fn = __default2[button];
        if (fn == null) continue;
        mapped |= Button.Bit[fn];
    }
    return mapped;
}
(function(SpriteFlip) {
    SpriteFlip.values = Immutable(new Set([
        'X',
        'Y',
        'XY'
    ]));
})(SpriteFlip || (SpriteFlip = {}));
class Sprite {
    #animator;
    #bounds;
    #wrapLayerByHeightLayer;
    get bounds() {
        return this.#bounds;
    }
    get film() {
        return this.#animator.film;
    }
    get h() {
        return I16Box.height(this.#bounds);
    }
    set layer(layer) {
        const { wrap , layerByHeight  } = parseWrapLayerByHeightLayer(this.#wrapLayerByHeightLayer);
        this.#wrapLayerByHeightLayer = serializeWrapLayerByHeightLayer(wrap, layerByHeight, layer);
    }
    get w() {
        return I16Box.width(this.#bounds);
    }
    get wrapLayerByHeightLayer() {
        return this.#wrapLayerByHeightLayer;
    }
    get x() {
        return this.#bounds.start.x;
    }
    get y() {
        return this.#bounds.start.y;
    }
    constructor(film, layer, props){
        this.#animator = new Animator(film);
        const flip = I16XY(props?.flip == 'X' || props?.flip == 'XY' ? -1 : 1, props?.flip == 'Y' || props?.flip == 'XY' ? -1 : 1);
        this.#bounds = I16Box(props?.xy?.x ?? 0, props?.xy?.y ?? 0, (props?.wh?.x ?? film.wh.x) * flip.x, (props?.wh?.y ?? film.wh.y) * flip.y);
        this.#wrapLayerByHeightLayer = serializeWrapLayerByHeightLayer(I4XY(props?.wrap?.x ?? 0, props?.wrap?.y ?? 0), props?.layerByHeight ?? false, layer);
    }
    animate(start, film) {
        this.#animator.reset(start, film);
    }
    cel(time) {
        return this.#animator.cel(time);
    }
    compareDepth(sprite) {
        const { layerByHeight: lhsLayerByHeight , layer: lhsLayer  } = parseWrapLayerByHeightLayer(this.#wrapLayerByHeightLayer);
        const { layerByHeight: rhsLayerByHeight , layer: rhsLayer  } = parseWrapLayerByHeightLayer(sprite.#wrapLayerByHeightLayer);
        return lhsLayer == rhsLayer ? sprite.bounds[rhsLayerByHeight ? 'start' : 'end'].y - this.bounds[lhsLayerByHeight ? 'start' : 'end'].y : lhsLayer - rhsLayer;
    }
    isInFrontOf(sprite) {
        return this.compareDepth(sprite) < 0;
    }
    intersects(xyOrBox, time) {
        if (!this.intersectsBounds(xyOrBox)) return false;
        const cel = this.cel(time);
        if (cel.slices.length == 0) return true;
        const box = 'x' in xyOrBox ? I16Box.round(xyOrBox.x, xyOrBox.y, 0, 0) : I16Box.round(xyOrBox);
        I16Box.moveBy(box, -this.x, -this.y);
        if (!U16Box.intersects(cel.sliceBounds, box)) return false;
        for (const slice of cel.slices){
            if (U16Box.intersects(slice, box)) return true;
        }
        return false;
    }
    intersectsBounds(xyOrBoxOrSprite) {
        if ('bounds' in xyOrBoxOrSprite) {
            return I16Box.intersects(this.bounds, xyOrBoxOrSprite.bounds);
        }
        return I16Box.intersects(this.bounds, xyOrBoxOrSprite);
    }
    intersectsSprite(sprite, time) {
        if (!this.intersectsBounds(sprite)) return false;
        const cel = sprite.cel(time);
        if (cel.slices.length == 0) {
            return this.intersects(sprite.bounds, time);
        }
        const box = I16Box.moveBy(I16Box(cel.sliceBounds), sprite.bounds.start);
        if (!this.intersects(box, time)) return false;
        for (const slice of cel.slices){
            const box1 = I16Box.moveBy(I16Box(slice), sprite.bounds.start);
            if (this.intersects(box1, time)) return true;
        }
        return false;
    }
    moveTo(xy) {
        I16Box.moveTo(this.bounds, xy);
        return this;
    }
    moveBy(xy) {
        I16Box.moveBy(this.bounds, xy);
        return this;
    }
    toString() {
        const wlbhl = parseWrapLayerByHeightLayer(this.#wrapLayerByHeightLayer);
        return `Sprite {id=${this.film.id} box=${I16Box.toString(this.bounds)} layer=${wlbhl.layer} layerByHeight=${wlbhl.layerByHeight} wrap=${I4XY.toString(wlbhl.wrap)}}`;
    }
}
(function(LevelParser) {
    function parseComponent(lut, key, val) {
        switch(key){
            case 'cursor':
                return parseCursorFilmSet(lut, val);
            case 'followCam':
                return parseFollowCam(val);
            case 'followPoint':
                return {};
            case 'sprite':
                return parseSprite(lut, val);
        }
    }
    LevelParser.parseComponent = parseComponent;
    function parseFollowCam(json) {
        return {
            fill: json.fill == null ? undefined : parseFollowCamFill(json.fill),
            orientation: parseFollowCamOrientation(json.orientation),
            modulo: json.modulo,
            pad: json.pad
        };
    }
    LevelParser.parseFollowCam = parseFollowCam;
    function parseCursorFilmSet(lut, json) {
        return {
            pick: parseFilm(lut, json.pick),
            point: parseFilm(lut, json.point)
        };
    }
    LevelParser.parseCursorFilmSet = parseCursorFilmSet;
    function parseSprite(lut, json) {
        const film = parseFilm(lut, json.id);
        const layer = parseLayer(lut, json.layer);
        const props = {
            flip: json.flip == null ? undefined : parseSpriteFlip(json.flip),
            wh: json.wh,
            wrap: json.wrap,
            xy: json.xy,
            layerByHeight: json.layerByHeight
        };
        return new Sprite(film, layer, props);
    }
    LevelParser.parseSprite = parseSprite;
})(LevelParser || (LevelParser = {}));
function parseFilm(lut, id) {
    const film = lut.filmByID[id];
    return NonNull(film, `Bad film ID "${id}".`);
}
function parseFollowCamFill(fill) {
    assert(FollowCamFill.values.has(fill), `Bad fill specifier "${fill}".`);
    return fill;
}
function parseFollowCamOrientation(orientation) {
    assert(FollowCamConfig.Orientation.values.has(orientation), `Bad orientation "${orientation}".`);
    return orientation;
}
function parseLayer(lut, layer) {
    const code = lut.layerByID[layer];
    return NonNull(code, `Bad layer "${layer}".`);
}
function parseSpriteFlip(flip) {
    assert(SpriteFlip.values.has(flip), `Bad flip specifier "${flip}".`);
    return flip;
}
(function(Renderer) {
    function render(self, _time, scale, cam, instanceBuffer) {
        resize(self, scale, cam);
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
        const perInstanceBuffer = self.perInstanceBuffer;
        GL.bufferData(self.gl, perInstanceBuffer, instanceBuffer.buffer, self.gl.DYNAMIC_READ);
        self.gl.drawArraysInstanced(self.gl.TRIANGLE_STRIP, 0, uvLen, instanceBuffer.size);
    }
    Renderer.render = render;
    function resize(self, scale, cam) {
        const camWH = I16XY(I16Box.width(cam), I16Box.height(cam));
        const nativeCanvasWH = Viewport.nativeCanvasWH(camWH, scale);
        if (self.gl.canvas.width != nativeCanvasWH.x || self.gl.canvas.height != nativeCanvasWH.y) {
            self.gl.canvas.width = nativeCanvasWH.x;
            self.gl.canvas.height = nativeCanvasWH.y;
            self.gl.viewport(0, 0, nativeCanvasWH.x, nativeCanvasWH.y);
            console.debug(`Canvas resized to ${nativeCanvasWH.x}×${nativeCanvasWH.y} native pixels with ${camWH.x}×${camWH.y} cam (level pixels) at a ${scale}x scale.`);
        }
        if (self.gl.canvas instanceof HTMLCanvasElement) {
            const clientWH = Viewport.clientCanvasWH(window, nativeCanvasWH);
            const diffW = Number.parseFloat(self.gl.canvas.style.width.slice(0, -2)) - clientWH.x;
            const diffH = Number.parseFloat(self.gl.canvas.style.height.slice(0, -2)) - clientWH.y;
            if (!Number.isFinite(diffW) || Math.abs(diffW) >= .5 || !Number.isFinite(diffH) || Math.abs(diffH) >= .5) {
                self.gl.canvas.style.width = `${clientWH.x}px`;
                self.gl.canvas.style.height = `${clientWH.y}px`;
                console.debug(`Canvas styled to ${self.gl.canvas.style.width}×${self.gl.canvas.style.height} ` + `for ${devicePixelRatio}x pixel ratio.`);
            }
        }
        self.projection.set(project(cam));
        self.gl.uniformMatrix4fv(GL.uniformLocation(self.layout, self.uniforms, 'uProjection'), false, self.projection);
    }
    Renderer.resize = resize;
    function project(cam) {
        const { w , h  } = {
            w: 2 / I16Box.width(cam),
            h: 2 / I16Box.height(cam)
        };
        return [
            w,
            0,
            0,
            -1 - cam.start.x * w,
            0,
            -h,
            0,
            1 + cam.start.y * h,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
        ];
    }
})(Renderer || (Renderer = {}));
function parseWrapLayerByHeightLayer(wrapLayerByHeightLayer) {
    const wrapX = I4.mod(NumUtil.ushift(wrapLayerByHeightLayer, 12) & 0xf);
    const wrapY = I4.mod(NumUtil.ushift(wrapLayerByHeightLayer, 8) & 0xf);
    const layerByHeight = NumUtil.ushift(wrapLayerByHeightLayer, 7) & 1;
    const layer = U8(wrapLayerByHeightLayer & LayerMask);
    return {
        wrap: I4XY(wrapX, wrapY),
        layerByHeight: layerByHeight == LayerByHeightFlag,
        layer
    };
}
function serializeWrapLayerByHeightLayer(wrapXY, layerByHeight, layer) {
    const wrap = NumUtil.lshift(wrapXY.x & 0xf, 12) | NumUtil.lshift(wrapXY.y & 0xf, 8);
    return U16(wrap | (layerByHeight ? 0 : LayerByHeightFlag) | layer);
}
(function(TextLayout) {
    function layout(font, str, width, scale) {
        const chars = [];
        let cursor = I16XY(0, 0);
        let i = 0;
        for(;;){
            const __char = str[i];
            if (__char == null) break;
            let layout;
            if (__char == '\n') layout = layoutNewline(font, cursor, scale);
            else if (Str.isBlank(__char)) {
                layout = layoutSpace(font, cursor, width, tracking(font, __char, scale, str[i + 1]), scale);
            } else {
                layout = layoutWord(font, cursor, width, str, Uint(i), scale);
                if (cursor.x != 0 && layout.cursor.y == nextLine(font, cursor.y, scale).y) {
                    const word_width = width - cursor.x + layout.cursor.x;
                    if (word_width <= width) {
                        cursor = nextLine(font, cursor.y, scale);
                        layout = layoutWord(font, cursor, width, str, Uint(i), scale);
                    }
                }
            }
            i += layout.chars.length;
            chars.push(...layout.chars);
            cursor.x = layout.cursor.x;
            cursor.y = layout.cursor.y;
        }
        return {
            chars,
            cursor
        };
    }
    TextLayout.layout = layout;
    function layoutWord(font, cursor, width, word, index, scale) {
        const chars = [];
        let x = cursor.x;
        let y = cursor.y;
        for(;;){
            const __char = word[index];
            if (__char == null || Str.isBlank(__char)) break;
            const span = tracking(font, __char, scale, word[index + 1]);
            if (x != 0 && x + span > width) {
                const xy = nextLine(font, y, scale);
                x = xy.x;
                y = xy.y;
            }
            const w = scale.x * Font.charWidth(font, __char);
            const h = scale.y * font.cellHeight;
            chars.push(I16Box.round(x, y, w, h));
            x = I16.round(x + span);
            index++;
        }
        return {
            chars,
            cursor: I16XY(x, y)
        };
    }
    TextLayout.layoutWord = layoutWord;
})(TextLayout || (TextLayout = {}));
function nextLine(font, y, scale) {
    return I16XY.round(0, y + scale.y * font.lineHeight);
}
function layoutNewline(font, { y  }, scale) {
    return {
        chars: [
            undefined
        ],
        cursor: nextLine(font, y, scale)
    };
}
function layoutSpace(font, { x , y  }, width, span, scale) {
    const cursor = x != 0 && x + span >= width ? nextLine(font, y, scale) : I16XY.round(x + span, y);
    return {
        chars: [
            undefined
        ],
        cursor
    };
}
function tracking(font, lhs, scale, rhs) {
    return I16.round(scale.x * (Font.charWidth(font, lhs) + Font.kerning(font, lhs, rhs)));
}
var Color1;
(function(Color) {
    Color.values = Immutable(new Set([
        'Black',
        'Red'
    ]));
})(Color1 || (Color1 = {}));
var Direction;
(function(Direction) {
    Direction.values = Immutable(new Set([
        'Down',
        'Up'
    ]));
})(Direction || (Direction = {}));
var Rank;
(function(Rank1) {
    Rank1.values = Immutable(new Set([
        'Ace',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Jack',
        'Queen',
        'King'
    ]));
    Rank1.toOrder = Immutable([
        ...Rank.values
    ].reduce((order, value, index)=>({
            ...order,
            [value]: index
        }), {}));
    var toPoint = Rank1.toPoint = Immutable({
        Ace: 1,
        Two: 2,
        Three: 3,
        Four: 4,
        Five: 5,
        Six: 6,
        Seven: 7,
        Eight: 8,
        Nine: 9,
        Ten: 10,
        Jack: 11,
        Queen: 13,
        King: 14
    });
    Rank1.fromPoint = Immutable(Inverse(toPoint));
    Rank1.toASCII = Immutable({
        Ace: 'A',
        Two: '2',
        Three: '3',
        Four: '4',
        Five: '5',
        Six: '6',
        Seven: '7',
        Eight: '8',
        Nine: '9',
        Ten: '10',
        Jack: 'J',
        Queen: 'Q',
        King: 'K'
    });
})(Rank || (Rank = {}));
var Suit;
(function(Suit) {
    var values = Suit.values = Immutable(new Set([
        'Clubs',
        'Diamonds',
        'Hearts',
        'Spades'
    ]));
    var toOrder = Suit.toOrder = Immutable([
        ...values
    ].reduce((order, value, index)=>({
            ...order,
            [value]: index
        }), {}));
    Suit.fromOrder = Immutable(Inverse(toOrder));
    Suit.toColor = Immutable({
        Clubs: 'Black',
        Diamonds: 'Red',
        Hearts: 'Red',
        Spades: 'Black'
    });
    Suit.toASCII = Immutable({
        Clubs: 'C',
        Diamonds: 'D',
        Hearts: 'H',
        Spades: 'S'
    });
})(Suit || (Suit = {}));
var Visibility;
(function(Visibility) {
    Visibility.values = Immutable([
        'Directed',
        'Undirected'
    ]);
})(Visibility || (Visibility = {}));
var Unicode;
(function(Unicode) {
    Unicode.ideographicSpace = '　';
    function fractionOfInts(numerator, denominator) {
        const numeratorStr = intToSuperscript(numerator);
        const denominatorStr = intToSubscript(denominator);
        return `${numeratorStr}⁄${denominatorStr}`;
    }
    Unicode.fractionOfInts = fractionOfInts;
    function intToSubscript(val) {
        const subscriptsStart = '₀'.codePointAt(0);
        assert(subscriptsStart != null);
        let str = '';
        for (const digit of genIntDigits(val)){
            str = `${String.fromCodePoint(subscriptsStart + digit)}${str}`;
        }
        return str;
    }
    function intToSuperscript(val) {
        const superscripts = [
            '⁰',
            '¹',
            '²',
            '³',
            '⁴',
            '⁵',
            '⁶',
            '⁷',
            '⁸',
            '⁹'
        ];
        let str = '';
        for (const digit of genIntDigits(val))str = `${superscripts[digit]}${str}`;
        return str;
    }
    function* genIntDigits(val) {
        if (val == 0) return yield Int(0);
        for(; val > 0; val = Int.trunc(val / 10))yield Int(val % 10);
    }
})(Unicode || (Unicode = {}));
const unicode = Immutable({
    rangeStart: 0x1f0a0,
    rankSize: 16,
    suitMax: 3
});
function Foundation() {
    return [
        [],
        [],
        [],
        []
    ];
}
function Tableau(lanes) {
    assert(lanes > 0, `Tableau size must be greater than zero but was ${lanes}.`);
    const tableau = [];
    for(let i = 0; i < lanes; i++)tableau.push([]);
    return tableau;
}
var Pile;
function Card(direction, rank, suit) {
    return {
        direction,
        rank,
        suit
    };
}
(function(Pile) {
    function newDeck(direction = 'Down') {
        const deck = [];
        for (const suit of Suit.values){
            for (const rank of Rank.values)deck.push({
                suit,
                rank,
                direction
            });
        }
        return deck;
    }
    Pile.newDeck = newDeck;
    function toString(piles, visibility = 'Directed') {
        const height = piles.reduce((max, pile)=>Math.max(max, pile.length), 0);
        let str = '';
        for(let y = 0; y < height; y++){
            if (str != '') str += '\n';
            for(let x = 0; x < piles.length; x++){
                str += piles[x][y] == null ? y == 0 ? '🃟' : Unicode.ideographicSpace : Card.toString(visibility, piles[x][y]);
            }
        }
        return str == '' ? '🃟'.repeat(piles.length) : str;
    }
    Pile.toString = toString;
})(Pile || (Pile = {}));
function Solitaire(drawSize, random, tableauSize) {
    drawSize ??= Uint(3);
    if (random == null) {
        const rand = Random(I32.mod(Date.now()));
        random = ()=>Random.fraction(rand);
    }
    tableauSize ??= Uint(7);
    const stock = Pile.newDeck();
    ArrayUtil.shuffle(stock, random);
    const self = {
        drawSize,
        foundation: Foundation(),
        stock,
        tableau: Tableau(tableauSize),
        waste: [],
        random,
        tableauSize,
        wins: Uint(0)
    };
    Tableau.deal(self.tableau, stock);
    return self;
}
(function(Card) {
    function isDirected(direction, ...cards) {
        return cards.every((card)=>card.direction == direction);
    }
    Card.isDirected = isDirected;
    function fromString(str, direction = 'Up') {
        return [
            ...str
        ].map((code)=>fromStringCode(code, direction));
    }
    Card.fromString = fromString;
    function fromStringCode(code, direction = 'Up') {
        const point = NonNull(code.codePointAt(0), `No code point in ${code}.`);
        const index = point - unicode.rangeStart;
        const suit = Suit.fromOrder[unicode.suitMax - Math.trunc(index / unicode.rankSize)];
        assertNonNull(suit, `No suit at code point ${point}.`);
        const rank = Rank.fromPoint[index % unicode.rankSize];
        assertNonNull(rank, `No rank at code point ${point}.`);
        return {
            direction,
            rank,
            suit
        };
    }
    Card.fromStringCode = fromStringCode;
    function succeeds(succeeds, ...cards) {
        if (cards.length == 0) return succeeds(undefined, undefined);
        for(let index = 0; index <= cards.length - 1; index++){
            if (!succeeds(cards[index], cards[index + 1])) return false;
        }
        return true;
    }
    Card.succeeds = succeeds;
    function toASCII(card) {
        return `${Suit.toASCII[card.suit]}${Rank.toASCII[card.rank]}`;
    }
    Card.toASCII = toASCII;
    function toString(visibility, ...cards) {
        return cards.reduce((str, card)=>str + cardToString(visibility, card), '');
    }
    Card.toString = toString;
})(Card || (Card = {}));
function cardToString(visibility, card) {
    if (visibility == 'Directed' && card.direction == 'Down') return '🂠';
    const point = unicode.rangeStart + (unicode.suitMax - Suit.toOrder[card.suit]) * unicode.rankSize + Rank.toPoint[card.rank];
    return String.fromCodePoint(point);
}
const succeeds = (lhs, rhs)=>{
    if (lhs?.direction == 'Down' || rhs?.direction == 'Down') return false;
    if (rhs == null) return lhs != null;
    if (lhs == null) return rhs.rank == 'Ace';
    if (lhs.suit != rhs.suit) return false;
    return Rank.toOrder[lhs.rank] + 1 == Rank.toOrder[rhs.rank];
};
const suitToIndex = Immutable({
    Clubs: 0,
    Diamonds: 1,
    Hearts: 2,
    Spades: 3
});
(function(Foundation) {
    function build(self, cards) {
        const card = cards[0];
        if (card == null || !isBuildable(self, cards)) return;
        getPillar(self, card.suit).push(...cards.splice(0));
    }
    Foundation.build = build;
    function getPillar(self, suit) {
        return self[suitToIndex[suit]];
    }
    Foundation.getPillar = getPillar;
    function isBuildable(self, cards) {
        const card = cards[0];
        if (card == null || !Card.succeeds(succeeds, ...cards)) return false;
        return succeeds(getPillar(self, card.suit).at(-1), card);
    }
    Foundation.isBuildable = isBuildable;
    function select(self, card) {
        for (const [index, foundation] of self.entries()){
            const y = foundation.indexOf(card);
            if (y == -1) continue;
            return {
                cards: foundation.splice(y),
                pile: 'Foundation',
                xy: UintXY(index, y)
            };
        }
    }
    Foundation.select = select;
    function isBuilt(self) {
        return isPillarBuilt(...Object.values(self));
    }
    Foundation.isBuilt = isBuilt;
    function isPillarBuilt(...pillars) {
        return pillars.every((pillar)=>pillar.at(-1)?.rank == 'King');
    }
    Foundation.isPillarBuilt = isPillarBuilt;
    function toString(self, visibility = 'Directed') {
        return Pile.toString(Object.values(self), visibility);
    }
    Foundation.toString = toString;
})(Foundation || (Foundation = {}));
const succeeds1 = (lhs, rhs)=>{
    if (lhs?.direction == 'Down' || rhs?.direction == 'Down') return false;
    if (rhs == null) return lhs != null;
    if (lhs == null) return rhs.rank == 'King';
    return Suit.toColor[lhs.suit] != Suit.toColor[rhs.suit] && Rank.toOrder[lhs.rank] == Rank.toOrder[rhs.rank] + 1;
};
(function(Tableau) {
    function deal(self, stock) {
        for (const [index, lane] of self.entries()){
            assert(lane.length == 0, 'Tableau must be reset before dealt.');
            const cards = stock.splice(-index - 1);
            for (const card of cards)card.direction = 'Down';
            lane.push(...cards);
        }
    }
    Tableau.deal = deal;
    function build(lane, cards) {
        if (!isBuildable(lane, cards)) return;
        lane.push(...cards.splice(0));
    }
    Tableau.build = build;
    function select(self, card) {
        for (const [x, lane] of self.entries()){
            const y = lane.indexOf(card);
            if (y == -1) continue;
            return {
                cards: lane.splice(y),
                pile: 'Tableau',
                xy: UintXY(x, y)
            };
        }
    }
    Tableau.select = select;
    function isBuildable(lane, cards) {
        if (!Card.succeeds(succeeds1, ...cards)) return false;
        return succeeds1(lane.at(-1), cards[0]);
    }
    Tableau.isBuildable = isBuildable;
    function toString(self, visibility = 'Directed') {
        return Pile.toString(self, visibility);
    }
    Tableau.toString = toString;
})(Tableau || (Tableau = {}));
(function(Solitaire) {
    function reset(self) {
        if (isWon(self)) self.wins = Uint(self.wins + 1);
        for (const pillar of self.foundation)self.stock.push(...pillar.splice(0));
        for (const lane of self.tableau)self.stock.push(...lane.splice(0));
        self.stock.push(...self.waste.splice(0));
        for (const card of self.stock)card.direction = 'Down';
        ArrayUtil.shuffle(self.stock, self.random);
        Tableau.deal(self.tableau, self.stock);
    }
    Solitaire.reset = reset;
    function point(self, card) {
        deselect(self);
        const stockY = self.stock.indexOf(card);
        if (stockY != -1) {
            if (stockY != self.stock.length - 1) return;
            const y = Math.max(0, stockY - (self.drawSize - 1));
            const cards = self.stock.splice(y).reverse();
            for (const card1 of cards)card1.direction = 'Up';
            self.waste.push(...cards);
            return;
        }
        const wasteY = self.waste.indexOf(card);
        if (wasteY != -1) {
            self.selected = {
                cards: self.waste.splice(wasteY),
                pile: 'Waste',
                xy: UintXY(0, wasteY)
            };
            return self.selected;
        }
        self.selected = NonNull(Foundation.select(self.foundation, card) ?? Tableau.select(self.tableau, card), `Missing card ${Card.toString('Undirected', card)}.`);
        const { cards: cards1  } = self.selected;
        if (cards1.length == 1 && cards1[0]?.direction == 'Down') {
            cards1[0].direction = 'Up';
            deselect(self);
        }
        return self.selected;
    }
    Solitaire.point = point;
    function deal(self) {
        deselect(self);
        if (self.stock.length > 0) return;
        const waste = self.waste.splice(0).reverse();
        for (const card of waste)card.direction = 'Down';
        self.stock.push(...waste);
    }
    Solitaire.deal = deal;
    function isBuildable(self, at) {
        if (self.selected == null) return false;
        if (at.type == 'Foundation') {
            return Foundation.isBuildable(self.foundation, self.selected.cards);
        }
        return Tableau.isBuildable(NonNull(self.tableau[at.x]), self.selected.cards);
    }
    Solitaire.isBuildable = isBuildable;
    function isWon(self) {
        return Foundation.isBuilt(self.foundation);
    }
    Solitaire.isWon = isWon;
    function toString(self, visibility = 'Directed') {
        const foundations = Foundation.toString(self.foundation, visibility);
        const tableau = Tableau.toString(self.tableau, visibility);
        const stock = Card.toString(visibility, ...self.stock);
        const reserve = padCharEnd(Card.toString('Directed', ...self.waste.slice(-self.drawSize)), Uint(1), '🃟');
        const unreservedWaste = self.waste.slice(0, -self.drawSize);
        const waste = padCharEnd(visibility == 'Directed' ? '🂠'.repeat(unreservedWaste.length) : Card.toString(visibility, ...unreservedWaste), Uint(1), '🃟');
        const selected = self.selected == null ? '' : Card.toString(visibility, ...self.selected.cards) + ` from ${self.selected.pile} ${UintXY.toString(self.selected.xy)}`;
        return `
${foundations}
${tableau}
${stock} ${reserve} ${waste}
${selected}
    `.trim();
    }
    Solitaire.toString = toString;
    function build(self, at) {
        if (self.selected == null) return;
        if (at.type == 'Foundation') {
            Foundation.build(self.foundation, self.selected.cards);
        } else Tableau.build(NonNull(self.tableau[at.x]), self.selected.cards);
        if (self.selected.cards.length != 0) return;
        delete self.selected;
    }
    Solitaire.build = build;
    function deselect(self) {
        if (self.selected == null) return;
        const pile = self.selected.pile == 'Waste' ? self.waste : self[Str.uncapitalize(self.selected.pile)][self.selected.xy.x];
        pile.push(...self.selected.cards);
        delete self.selected;
    }
    Solitaire.deselect = deselect;
})(Solitaire || (Solitaire = {}));
function padCharEnd(str, width, __char) {
    return str + __char.repeat(Math.max(0, width - str.length));
}
const __default6 = JSON.parse(`[
  {
    "name": "cursor",
    "cursor": { "pick": "CursorPick", "point": "CursorPoint" },
    "followPoint": {},
    "sprite": { "id": "CursorPoint", "layer": "Cursor" }
  },

  {
    "name": "background border",
    "followCam": { "fill": "XY", "orientation": "Northwest" },
    "sprite": {
      "id": "PaletteDark",
      "layer": "Background",
      "layerByHeight": true
    }
  },
  {
    "name": "background corner NW",
    "followCam": { "orientation": "Northwest" },
    "sprite": { "id": "Corner", "layer": "Background" }
  },
  {
    "name": "background corner NE",
    "followCam": { "orientation": "Northeast" },
    "sprite": { "id": "Corner", "layer": "Background", "flip": "X" }
  },
  {
    "name": "background corner SE",
    "followCam": { "orientation": "Southeast" },
    "sprite": { "id": "Corner", "layer": "Background", "flip": "XY" }
  },
  {
    "name": "background corner SW",
    "followCam": { "orientation": "Southwest" },
    "sprite": { "id": "Corner", "layer": "Background", "flip": "Y" }
  },

  {
    "name": "background",
    "followCam": {
      "fill": "XY",
      "orientation": "Northwest",
      "pad": { "x": 1, "y": 1 }
    },
    "sprite": {
      "id": "Grid",
      "layer": "Background",
      "layerByHeight": true,
      "wrap": { "x": -1, "y": -1 }
    }
  },

  {
    "name": "Patience the Demon",
    "followCam": {
      "modulo": { "x": 8, "y": 8 },
      "orientation": "Northwest",
      "pad": { "x": 16, "y": 16 }
    },
    "patienceTheDemon": {},
    "sprite": { "id": "PatienceTheDemonGood", "layer": "Patience" }
  }
]
`);
const __default7 = JSON.parse(`{
  "version": "1.3-beta21-x64",
  "filename": "atlas.png",
  "format": "I8",
  "wh": {
    "x": 216,
    "y": 250
  },
  "filmByID": {
    "Checkerboard": {
      "id": "Checkerboard",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 0,
          "bounds": {
            "start": {
              "x": 152,
              "y": 224
            },
            "end": {
              "x": 160,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Grid": {
      "id": "Grid",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 1,
          "bounds": {
            "start": {
              "x": 72,
              "y": 224
            },
            "end": {
              "x": 80,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Corner": {
      "id": "Corner",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 2,
          "bounds": {
            "start": {
              "x": 160,
              "y": 224
            },
            "end": {
              "x": 168,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardCA": {
      "id": "CardCA",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 3,
          "bounds": {
            "start": {
              "x": 144,
              "y": 96
            },
            "end": {
              "x": 168,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC2": {
      "id": "CardC2",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 4,
          "bounds": {
            "start": {
              "x": 168,
              "y": 96
            },
            "end": {
              "x": 192,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC3": {
      "id": "CardC3",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 5,
          "bounds": {
            "start": {
              "x": 192,
              "y": 96
            },
            "end": {
              "x": 216,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC4": {
      "id": "CardC4",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 6,
          "bounds": {
            "start": {
              "x": 0,
              "y": 128
            },
            "end": {
              "x": 24,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC5": {
      "id": "CardC5",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 7,
          "bounds": {
            "start": {
              "x": 24,
              "y": 128
            },
            "end": {
              "x": 48,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC6": {
      "id": "CardC6",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 8,
          "bounds": {
            "start": {
              "x": 48,
              "y": 128
            },
            "end": {
              "x": 72,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC7": {
      "id": "CardC7",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 9,
          "bounds": {
            "start": {
              "x": 72,
              "y": 128
            },
            "end": {
              "x": 96,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC8": {
      "id": "CardC8",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 10,
          "bounds": {
            "start": {
              "x": 96,
              "y": 128
            },
            "end": {
              "x": 120,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC9": {
      "id": "CardC9",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 11,
          "bounds": {
            "start": {
              "x": 120,
              "y": 128
            },
            "end": {
              "x": 144,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardC10": {
      "id": "CardC10",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 12,
          "bounds": {
            "start": {
              "x": 144,
              "y": 128
            },
            "end": {
              "x": 168,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardCJ": {
      "id": "CardCJ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 13,
          "bounds": {
            "start": {
              "x": 168,
              "y": 128
            },
            "end": {
              "x": 192,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardCQ": {
      "id": "CardCQ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 14,
          "bounds": {
            "start": {
              "x": 192,
              "y": 128
            },
            "end": {
              "x": 216,
              "y": 160
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardCK": {
      "id": "CardCK",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 15,
          "bounds": {
            "start": {
              "x": 0,
              "y": 160
            },
            "end": {
              "x": 24,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardDA": {
      "id": "CardDA",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 16,
          "bounds": {
            "start": {
              "x": 24,
              "y": 160
            },
            "end": {
              "x": 48,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD2": {
      "id": "CardD2",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 17,
          "bounds": {
            "start": {
              "x": 144,
              "y": 192
            },
            "end": {
              "x": 168,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD3": {
      "id": "CardD3",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 18,
          "bounds": {
            "start": {
              "x": 48,
              "y": 160
            },
            "end": {
              "x": 72,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD4": {
      "id": "CardD4",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 19,
          "bounds": {
            "start": {
              "x": 120,
              "y": 192
            },
            "end": {
              "x": 144,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD5": {
      "id": "CardD5",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 20,
          "bounds": {
            "start": {
              "x": 96,
              "y": 192
            },
            "end": {
              "x": 120,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD6": {
      "id": "CardD6",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 21,
          "bounds": {
            "start": {
              "x": 72,
              "y": 192
            },
            "end": {
              "x": 96,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD7": {
      "id": "CardD7",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 22,
          "bounds": {
            "start": {
              "x": 48,
              "y": 192
            },
            "end": {
              "x": 72,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD8": {
      "id": "CardD8",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 23,
          "bounds": {
            "start": {
              "x": 24,
              "y": 192
            },
            "end": {
              "x": 48,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD9": {
      "id": "CardD9",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 24,
          "bounds": {
            "start": {
              "x": 0,
              "y": 192
            },
            "end": {
              "x": 24,
              "y": 224
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardD10": {
      "id": "CardD10",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 25,
          "bounds": {
            "start": {
              "x": 192,
              "y": 160
            },
            "end": {
              "x": 216,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardDJ": {
      "id": "CardDJ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 26,
          "bounds": {
            "start": {
              "x": 168,
              "y": 160
            },
            "end": {
              "x": 192,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardDQ": {
      "id": "CardDQ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 27,
          "bounds": {
            "start": {
              "x": 144,
              "y": 160
            },
            "end": {
              "x": 168,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardDK": {
      "id": "CardDK",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 28,
          "bounds": {
            "start": {
              "x": 120,
              "y": 160
            },
            "end": {
              "x": 144,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardHA": {
      "id": "CardHA",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 29,
          "bounds": {
            "start": {
              "x": 96,
              "y": 160
            },
            "end": {
              "x": 120,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH2": {
      "id": "CardH2",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 30,
          "bounds": {
            "start": {
              "x": 72,
              "y": 160
            },
            "end": {
              "x": 96,
              "y": 192
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH3": {
      "id": "CardH3",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 31,
          "bounds": {
            "start": {
              "x": 120,
              "y": 96
            },
            "end": {
              "x": 144,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH4": {
      "id": "CardH4",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 32,
          "bounds": {
            "start": {
              "x": 168,
              "y": 32
            },
            "end": {
              "x": 192,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH5": {
      "id": "CardH5",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 33,
          "bounds": {
            "start": {
              "x": 24,
              "y": 0
            },
            "end": {
              "x": 48,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH6": {
      "id": "CardH6",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 34,
          "bounds": {
            "start": {
              "x": 48,
              "y": 0
            },
            "end": {
              "x": 72,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH7": {
      "id": "CardH7",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 35,
          "bounds": {
            "start": {
              "x": 72,
              "y": 0
            },
            "end": {
              "x": 96,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH8": {
      "id": "CardH8",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 36,
          "bounds": {
            "start": {
              "x": 96,
              "y": 0
            },
            "end": {
              "x": 120,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH9": {
      "id": "CardH9",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 37,
          "bounds": {
            "start": {
              "x": 120,
              "y": 0
            },
            "end": {
              "x": 144,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardH10": {
      "id": "CardH10",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 38,
          "bounds": {
            "start": {
              "x": 144,
              "y": 0
            },
            "end": {
              "x": 168,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardHJ": {
      "id": "CardHJ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 39,
          "bounds": {
            "start": {
              "x": 168,
              "y": 0
            },
            "end": {
              "x": 192,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardHQ": {
      "id": "CardHQ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 40,
          "bounds": {
            "start": {
              "x": 192,
              "y": 0
            },
            "end": {
              "x": 216,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardHK": {
      "id": "CardHK",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 41,
          "bounds": {
            "start": {
              "x": 0,
              "y": 32
            },
            "end": {
              "x": 24,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardSA": {
      "id": "CardSA",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 42,
          "bounds": {
            "start": {
              "x": 24,
              "y": 32
            },
            "end": {
              "x": 48,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS2": {
      "id": "CardS2",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 43,
          "bounds": {
            "start": {
              "x": 48,
              "y": 32
            },
            "end": {
              "x": 72,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS3": {
      "id": "CardS3",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 44,
          "bounds": {
            "start": {
              "x": 72,
              "y": 32
            },
            "end": {
              "x": 96,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS4": {
      "id": "CardS4",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 45,
          "bounds": {
            "start": {
              "x": 96,
              "y": 32
            },
            "end": {
              "x": 120,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS5": {
      "id": "CardS5",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 46,
          "bounds": {
            "start": {
              "x": 120,
              "y": 32
            },
            "end": {
              "x": 144,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS6": {
      "id": "CardS6",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 47,
          "bounds": {
            "start": {
              "x": 144,
              "y": 32
            },
            "end": {
              "x": 168,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS7": {
      "id": "CardS7",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 48,
          "bounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 24,
              "y": 32
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS8": {
      "id": "CardS8",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 49,
          "bounds": {
            "start": {
              "x": 192,
              "y": 32
            },
            "end": {
              "x": 216,
              "y": 64
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS9": {
      "id": "CardS9",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 50,
          "bounds": {
            "start": {
              "x": 0,
              "y": 64
            },
            "end": {
              "x": 24,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardS10": {
      "id": "CardS10",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 51,
          "bounds": {
            "start": {
              "x": 24,
              "y": 64
            },
            "end": {
              "x": 48,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardSJ": {
      "id": "CardSJ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 52,
          "bounds": {
            "start": {
              "x": 48,
              "y": 64
            },
            "end": {
              "x": 72,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardSQ": {
      "id": "CardSQ",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 53,
          "bounds": {
            "start": {
              "x": 72,
              "y": 64
            },
            "end": {
              "x": 96,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardSK": {
      "id": "CardSK",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 54,
          "bounds": {
            "start": {
              "x": 96,
              "y": 64
            },
            "end": {
              "x": 120,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardDown": {
      "id": "CardDown",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 55,
          "bounds": {
            "start": {
              "x": 120,
              "y": 64
            },
            "end": {
              "x": 144,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantPile": {
      "id": "CardVacantPile",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 56,
          "bounds": {
            "start": {
              "x": 144,
              "y": 64
            },
            "end": {
              "x": 168,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantStock": {
      "id": "CardVacantStock",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 57,
          "bounds": {
            "start": {
              "x": 168,
              "y": 64
            },
            "end": {
              "x": 192,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantClubs": {
      "id": "CardVacantClubs",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 58,
          "bounds": {
            "start": {
              "x": 192,
              "y": 64
            },
            "end": {
              "x": 216,
              "y": 96
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantDiamonds": {
      "id": "CardVacantDiamonds",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 59,
          "bounds": {
            "start": {
              "x": 0,
              "y": 96
            },
            "end": {
              "x": 24,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantHearts": {
      "id": "CardVacantHearts",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 60,
          "bounds": {
            "start": {
              "x": 24,
              "y": 96
            },
            "end": {
              "x": 48,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardVacantSpades": {
      "id": "CardVacantSpades",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 61,
          "bounds": {
            "start": {
              "x": 48,
              "y": 96
            },
            "end": {
              "x": 72,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardOutlineFocus": {
      "id": "CardOutlineFocus",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 62,
          "bounds": {
            "start": {
              "x": 72,
              "y": 96
            },
            "end": {
              "x": 96,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CardOutlineChecked": {
      "id": "CardOutlineChecked",
      "wh": {
        "x": 24,
        "y": 32
      },
      "cels": [
        {
          "id": 63,
          "bounds": {
            "start": {
              "x": 96,
              "y": 96
            },
            "end": {
              "x": 120,
              "y": 128
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CursorPoint": {
      "id": "CursorPoint",
      "wh": {
        "x": 16,
        "y": 16
      },
      "cels": [
        {
          "id": 64,
          "bounds": {
            "start": {
              "x": 0,
              "y": 224
            },
            "end": {
              "x": 16,
              "y": 240
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 3,
              "y": 3
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 3,
                "y": 3
              }
            }
          ]
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "CursorPick": {
      "id": "CursorPick",
      "wh": {
        "x": 16,
        "y": 16
      },
      "cels": [
        {
          "id": 65,
          "bounds": {
            "start": {
              "x": 16,
              "y": 224
            },
            "end": {
              "x": 32,
              "y": 240
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 3,
              "y": 3
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 3,
                "y": 3
              }
            }
          ]
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-00": {
      "id": "MemProp5x6-00",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 66,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-01": {
      "id": "MemProp5x6-01",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 67,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-02": {
      "id": "MemProp5x6-02",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 68,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-03": {
      "id": "MemProp5x6-03",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 69,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-04": {
      "id": "MemProp5x6-04",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 70,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-05": {
      "id": "MemProp5x6-05",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 71,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-06": {
      "id": "MemProp5x6-06",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 72,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-07": {
      "id": "MemProp5x6-07",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 73,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-08": {
      "id": "MemProp5x6-08",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 74,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-09": {
      "id": "MemProp5x6-09",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 75,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0a": {
      "id": "MemProp5x6-0a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 76,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0b": {
      "id": "MemProp5x6-0b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 77,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0c": {
      "id": "MemProp5x6-0c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 78,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0d": {
      "id": "MemProp5x6-0d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 79,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0e": {
      "id": "MemProp5x6-0e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 80,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-0f": {
      "id": "MemProp5x6-0f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 81,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-10": {
      "id": "MemProp5x6-10",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 82,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-11": {
      "id": "MemProp5x6-11",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 83,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-12": {
      "id": "MemProp5x6-12",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 84,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-13": {
      "id": "MemProp5x6-13",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 85,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-14": {
      "id": "MemProp5x6-14",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 86,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-15": {
      "id": "MemProp5x6-15",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 87,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-16": {
      "id": "MemProp5x6-16",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 88,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-17": {
      "id": "MemProp5x6-17",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 89,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-18": {
      "id": "MemProp5x6-18",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 90,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-19": {
      "id": "MemProp5x6-19",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 91,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1a": {
      "id": "MemProp5x6-1a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 92,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1b": {
      "id": "MemProp5x6-1b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 93,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1c": {
      "id": "MemProp5x6-1c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 94,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1d": {
      "id": "MemProp5x6-1d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 95,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1e": {
      "id": "MemProp5x6-1e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 96,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-1f": {
      "id": "MemProp5x6-1f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 97,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-20": {
      "id": "MemProp5x6-20",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 98,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-21": {
      "id": "MemProp5x6-21",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 99,
          "bounds": {
            "start": {
              "x": 162,
              "y": 232
            },
            "end": {
              "x": 167,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-22": {
      "id": "MemProp5x6-22",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 100,
          "bounds": {
            "start": {
              "x": 32,
              "y": 238
            },
            "end": {
              "x": 37,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-23": {
      "id": "MemProp5x6-23",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 101,
          "bounds": {
            "start": {
              "x": 37,
              "y": 238
            },
            "end": {
              "x": 42,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-24": {
      "id": "MemProp5x6-24",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 102,
          "bounds": {
            "start": {
              "x": 42,
              "y": 238
            },
            "end": {
              "x": 47,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-25": {
      "id": "MemProp5x6-25",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 103,
          "bounds": {
            "start": {
              "x": 47,
              "y": 238
            },
            "end": {
              "x": 52,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-26": {
      "id": "MemProp5x6-26",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 104,
          "bounds": {
            "start": {
              "x": 52,
              "y": 238
            },
            "end": {
              "x": 57,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-27": {
      "id": "MemProp5x6-27",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 105,
          "bounds": {
            "start": {
              "x": 57,
              "y": 238
            },
            "end": {
              "x": 62,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-28": {
      "id": "MemProp5x6-28",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 106,
          "bounds": {
            "start": {
              "x": 62,
              "y": 238
            },
            "end": {
              "x": 67,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-29": {
      "id": "MemProp5x6-29",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 107,
          "bounds": {
            "start": {
              "x": 67,
              "y": 238
            },
            "end": {
              "x": 72,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2a": {
      "id": "MemProp5x6-2a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 108,
          "bounds": {
            "start": {
              "x": 72,
              "y": 238
            },
            "end": {
              "x": 77,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2b": {
      "id": "MemProp5x6-2b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 109,
          "bounds": {
            "start": {
              "x": 152,
              "y": 232
            },
            "end": {
              "x": 157,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2c": {
      "id": "MemProp5x6-2c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 110,
          "bounds": {
            "start": {
              "x": 82,
              "y": 238
            },
            "end": {
              "x": 87,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2d": {
      "id": "MemProp5x6-2d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 111,
          "bounds": {
            "start": {
              "x": 87,
              "y": 238
            },
            "end": {
              "x": 92,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2e": {
      "id": "MemProp5x6-2e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 112,
          "bounds": {
            "start": {
              "x": 92,
              "y": 238
            },
            "end": {
              "x": 97,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-2f": {
      "id": "MemProp5x6-2f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 113,
          "bounds": {
            "start": {
              "x": 97,
              "y": 238
            },
            "end": {
              "x": 102,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-30": {
      "id": "MemProp5x6-30",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 114,
          "bounds": {
            "start": {
              "x": 100,
              "y": 244
            },
            "end": {
              "x": 105,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-31": {
      "id": "MemProp5x6-31",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 115,
          "bounds": {
            "start": {
              "x": 35,
              "y": 244
            },
            "end": {
              "x": 40,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-32": {
      "id": "MemProp5x6-32",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 116,
          "bounds": {
            "start": {
              "x": 30,
              "y": 244
            },
            "end": {
              "x": 35,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-33": {
      "id": "MemProp5x6-33",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 117,
          "bounds": {
            "start": {
              "x": 207,
              "y": 240
            },
            "end": {
              "x": 212,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-34": {
      "id": "MemProp5x6-34",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 118,
          "bounds": {
            "start": {
              "x": 202,
              "y": 240
            },
            "end": {
              "x": 207,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-35": {
      "id": "MemProp5x6-35",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 119,
          "bounds": {
            "start": {
              "x": 197,
              "y": 240
            },
            "end": {
              "x": 202,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-36": {
      "id": "MemProp5x6-36",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 120,
          "bounds": {
            "start": {
              "x": 192,
              "y": 240
            },
            "end": {
              "x": 197,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-37": {
      "id": "MemProp5x6-37",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 121,
          "bounds": {
            "start": {
              "x": 187,
              "y": 240
            },
            "end": {
              "x": 192,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-38": {
      "id": "MemProp5x6-38",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 122,
          "bounds": {
            "start": {
              "x": 182,
              "y": 240
            },
            "end": {
              "x": 187,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-39": {
      "id": "MemProp5x6-39",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 123,
          "bounds": {
            "start": {
              "x": 177,
              "y": 240
            },
            "end": {
              "x": 182,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3a": {
      "id": "MemProp5x6-3a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 124,
          "bounds": {
            "start": {
              "x": 172,
              "y": 240
            },
            "end": {
              "x": 177,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3b": {
      "id": "MemProp5x6-3b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 125,
          "bounds": {
            "start": {
              "x": 167,
              "y": 240
            },
            "end": {
              "x": 172,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3c": {
      "id": "MemProp5x6-3c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 126,
          "bounds": {
            "start": {
              "x": 132,
              "y": 238
            },
            "end": {
              "x": 137,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3d": {
      "id": "MemProp5x6-3d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 127,
          "bounds": {
            "start": {
              "x": 20,
              "y": 240
            },
            "end": {
              "x": 25,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3e": {
      "id": "MemProp5x6-3e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 128,
          "bounds": {
            "start": {
              "x": 15,
              "y": 240
            },
            "end": {
              "x": 20,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-3f": {
      "id": "MemProp5x6-3f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 129,
          "bounds": {
            "start": {
              "x": 10,
              "y": 240
            },
            "end": {
              "x": 15,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-40": {
      "id": "MemProp5x6-40",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 130,
          "bounds": {
            "start": {
              "x": 5,
              "y": 240
            },
            "end": {
              "x": 10,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-41": {
      "id": "MemProp5x6-41",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 131,
          "bounds": {
            "start": {
              "x": 0,
              "y": 240
            },
            "end": {
              "x": 5,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-42": {
      "id": "MemProp5x6-42",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 132,
          "bounds": {
            "start": {
              "x": 162,
              "y": 238
            },
            "end": {
              "x": 167,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-43": {
      "id": "MemProp5x6-43",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 133,
          "bounds": {
            "start": {
              "x": 157,
              "y": 238
            },
            "end": {
              "x": 162,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-44": {
      "id": "MemProp5x6-44",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 134,
          "bounds": {
            "start": {
              "x": 152,
              "y": 238
            },
            "end": {
              "x": 157,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-45": {
      "id": "MemProp5x6-45",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 135,
          "bounds": {
            "start": {
              "x": 147,
              "y": 238
            },
            "end": {
              "x": 152,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-46": {
      "id": "MemProp5x6-46",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 136,
          "bounds": {
            "start": {
              "x": 142,
              "y": 238
            },
            "end": {
              "x": 147,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-47": {
      "id": "MemProp5x6-47",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 137,
          "bounds": {
            "start": {
              "x": 137,
              "y": 238
            },
            "end": {
              "x": 142,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-48": {
      "id": "MemProp5x6-48",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 138,
          "bounds": {
            "start": {
              "x": 25,
              "y": 240
            },
            "end": {
              "x": 30,
              "y": 246
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-49": {
      "id": "MemProp5x6-49",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 139,
          "bounds": {
            "start": {
              "x": 155,
              "y": 244
            },
            "end": {
              "x": 160,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4a": {
      "id": "MemProp5x6-4a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 140,
          "bounds": {
            "start": {
              "x": 150,
              "y": 244
            },
            "end": {
              "x": 155,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4b": {
      "id": "MemProp5x6-4b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 141,
          "bounds": {
            "start": {
              "x": 145,
              "y": 244
            },
            "end": {
              "x": 150,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4c": {
      "id": "MemProp5x6-4c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 142,
          "bounds": {
            "start": {
              "x": 140,
              "y": 244
            },
            "end": {
              "x": 145,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4d": {
      "id": "MemProp5x6-4d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 143,
          "bounds": {
            "start": {
              "x": 135,
              "y": 244
            },
            "end": {
              "x": 140,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4e": {
      "id": "MemProp5x6-4e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 144,
          "bounds": {
            "start": {
              "x": 130,
              "y": 244
            },
            "end": {
              "x": 135,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-4f": {
      "id": "MemProp5x6-4f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 145,
          "bounds": {
            "start": {
              "x": 125,
              "y": 244
            },
            "end": {
              "x": 130,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-50": {
      "id": "MemProp5x6-50",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 146,
          "bounds": {
            "start": {
              "x": 120,
              "y": 244
            },
            "end": {
              "x": 125,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-51": {
      "id": "MemProp5x6-51",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 147,
          "bounds": {
            "start": {
              "x": 115,
              "y": 244
            },
            "end": {
              "x": 120,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-52": {
      "id": "MemProp5x6-52",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 148,
          "bounds": {
            "start": {
              "x": 110,
              "y": 244
            },
            "end": {
              "x": 115,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-53": {
      "id": "MemProp5x6-53",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 149,
          "bounds": {
            "start": {
              "x": 105,
              "y": 244
            },
            "end": {
              "x": 110,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-54": {
      "id": "MemProp5x6-54",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 150,
          "bounds": {
            "start": {
              "x": 40,
              "y": 244
            },
            "end": {
              "x": 45,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-55": {
      "id": "MemProp5x6-55",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 151,
          "bounds": {
            "start": {
              "x": 95,
              "y": 244
            },
            "end": {
              "x": 100,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-56": {
      "id": "MemProp5x6-56",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 152,
          "bounds": {
            "start": {
              "x": 90,
              "y": 244
            },
            "end": {
              "x": 95,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-57": {
      "id": "MemProp5x6-57",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 153,
          "bounds": {
            "start": {
              "x": 85,
              "y": 244
            },
            "end": {
              "x": 90,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-58": {
      "id": "MemProp5x6-58",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 154,
          "bounds": {
            "start": {
              "x": 80,
              "y": 244
            },
            "end": {
              "x": 85,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-59": {
      "id": "MemProp5x6-59",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 155,
          "bounds": {
            "start": {
              "x": 75,
              "y": 244
            },
            "end": {
              "x": 80,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5a": {
      "id": "MemProp5x6-5a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 156,
          "bounds": {
            "start": {
              "x": 70,
              "y": 244
            },
            "end": {
              "x": 75,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5b": {
      "id": "MemProp5x6-5b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 157,
          "bounds": {
            "start": {
              "x": 65,
              "y": 244
            },
            "end": {
              "x": 70,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5c": {
      "id": "MemProp5x6-5c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 158,
          "bounds": {
            "start": {
              "x": 60,
              "y": 244
            },
            "end": {
              "x": 65,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5d": {
      "id": "MemProp5x6-5d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 159,
          "bounds": {
            "start": {
              "x": 55,
              "y": 244
            },
            "end": {
              "x": 60,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5e": {
      "id": "MemProp5x6-5e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 160,
          "bounds": {
            "start": {
              "x": 50,
              "y": 244
            },
            "end": {
              "x": 55,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-5f": {
      "id": "MemProp5x6-5f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 161,
          "bounds": {
            "start": {
              "x": 45,
              "y": 244
            },
            "end": {
              "x": 50,
              "y": 250
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-60": {
      "id": "MemProp5x6-60",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 162,
          "bounds": {
            "start": {
              "x": 147,
              "y": 232
            },
            "end": {
              "x": 152,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-61": {
      "id": "MemProp5x6-61",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 163,
          "bounds": {
            "start": {
              "x": 37,
              "y": 232
            },
            "end": {
              "x": 42,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-62": {
      "id": "MemProp5x6-62",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 164,
          "bounds": {
            "start": {
              "x": 142,
              "y": 232
            },
            "end": {
              "x": 147,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-63": {
      "id": "MemProp5x6-63",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 165,
          "bounds": {
            "start": {
              "x": 137,
              "y": 232
            },
            "end": {
              "x": 142,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-64": {
      "id": "MemProp5x6-64",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 166,
          "bounds": {
            "start": {
              "x": 132,
              "y": 232
            },
            "end": {
              "x": 137,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-65": {
      "id": "MemProp5x6-65",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 167,
          "bounds": {
            "start": {
              "x": 127,
              "y": 232
            },
            "end": {
              "x": 132,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-66": {
      "id": "MemProp5x6-66",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 168,
          "bounds": {
            "start": {
              "x": 122,
              "y": 232
            },
            "end": {
              "x": 127,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-67": {
      "id": "MemProp5x6-67",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 169,
          "bounds": {
            "start": {
              "x": 117,
              "y": 232
            },
            "end": {
              "x": 122,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-68": {
      "id": "MemProp5x6-68",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 170,
          "bounds": {
            "start": {
              "x": 112,
              "y": 232
            },
            "end": {
              "x": 117,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-69": {
      "id": "MemProp5x6-69",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 171,
          "bounds": {
            "start": {
              "x": 107,
              "y": 232
            },
            "end": {
              "x": 112,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6a": {
      "id": "MemProp5x6-6a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 172,
          "bounds": {
            "start": {
              "x": 102,
              "y": 232
            },
            "end": {
              "x": 107,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6b": {
      "id": "MemProp5x6-6b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 173,
          "bounds": {
            "start": {
              "x": 97,
              "y": 232
            },
            "end": {
              "x": 102,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6c": {
      "id": "MemProp5x6-6c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 174,
          "bounds": {
            "start": {
              "x": 92,
              "y": 232
            },
            "end": {
              "x": 97,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6d": {
      "id": "MemProp5x6-6d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 175,
          "bounds": {
            "start": {
              "x": 87,
              "y": 232
            },
            "end": {
              "x": 92,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6e": {
      "id": "MemProp5x6-6e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 176,
          "bounds": {
            "start": {
              "x": 82,
              "y": 232
            },
            "end": {
              "x": 87,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-6f": {
      "id": "MemProp5x6-6f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 177,
          "bounds": {
            "start": {
              "x": 77,
              "y": 232
            },
            "end": {
              "x": 82,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-70": {
      "id": "MemProp5x6-70",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 178,
          "bounds": {
            "start": {
              "x": 72,
              "y": 232
            },
            "end": {
              "x": 77,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-71": {
      "id": "MemProp5x6-71",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 179,
          "bounds": {
            "start": {
              "x": 67,
              "y": 232
            },
            "end": {
              "x": 72,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-72": {
      "id": "MemProp5x6-72",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 180,
          "bounds": {
            "start": {
              "x": 62,
              "y": 232
            },
            "end": {
              "x": 67,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-73": {
      "id": "MemProp5x6-73",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 181,
          "bounds": {
            "start": {
              "x": 57,
              "y": 232
            },
            "end": {
              "x": 62,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-74": {
      "id": "MemProp5x6-74",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 182,
          "bounds": {
            "start": {
              "x": 52,
              "y": 232
            },
            "end": {
              "x": 57,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-75": {
      "id": "MemProp5x6-75",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 183,
          "bounds": {
            "start": {
              "x": 47,
              "y": 232
            },
            "end": {
              "x": 52,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-76": {
      "id": "MemProp5x6-76",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 184,
          "bounds": {
            "start": {
              "x": 42,
              "y": 232
            },
            "end": {
              "x": 47,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-77": {
      "id": "MemProp5x6-77",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 185,
          "bounds": {
            "start": {
              "x": 32,
              "y": 232
            },
            "end": {
              "x": 37,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-78": {
      "id": "MemProp5x6-78",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 186,
          "bounds": {
            "start": {
              "x": 77,
              "y": 238
            },
            "end": {
              "x": 82,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-79": {
      "id": "MemProp5x6-79",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 187,
          "bounds": {
            "start": {
              "x": 127,
              "y": 238
            },
            "end": {
              "x": 132,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7a": {
      "id": "MemProp5x6-7a",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 188,
          "bounds": {
            "start": {
              "x": 122,
              "y": 238
            },
            "end": {
              "x": 127,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7b": {
      "id": "MemProp5x6-7b",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 189,
          "bounds": {
            "start": {
              "x": 117,
              "y": 238
            },
            "end": {
              "x": 122,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7c": {
      "id": "MemProp5x6-7c",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 190,
          "bounds": {
            "start": {
              "x": 112,
              "y": 238
            },
            "end": {
              "x": 117,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7d": {
      "id": "MemProp5x6-7d",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 191,
          "bounds": {
            "start": {
              "x": 107,
              "y": 238
            },
            "end": {
              "x": 112,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7e": {
      "id": "MemProp5x6-7e",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 192,
          "bounds": {
            "start": {
              "x": 102,
              "y": 238
            },
            "end": {
              "x": 107,
              "y": 244
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "MemProp5x6-7f": {
      "id": "MemProp5x6-7f",
      "wh": {
        "x": 5,
        "y": 6
      },
      "cels": [
        {
          "id": 193,
          "bounds": {
            "start": {
              "x": 157,
              "y": 232
            },
            "end": {
              "x": 162,
              "y": 238
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "PaletteAlpha": {
      "id": "PaletteAlpha",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 194,
          "bounds": {
            "start": {
              "x": 32,
              "y": 224
            },
            "end": {
              "x": 40,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "PaletteDark": {
      "id": "PaletteDark",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 195,
          "bounds": {
            "start": {
              "x": 64,
              "y": 224
            },
            "end": {
              "x": 72,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "PaletteMid": {
      "id": "PaletteMid",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 196,
          "bounds": {
            "start": {
              "x": 56,
              "y": 224
            },
            "end": {
              "x": 64,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "PaletteLight": {
      "id": "PaletteLight",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 197,
          "bounds": {
            "start": {
              "x": 48,
              "y": 224
            },
            "end": {
              "x": 56,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "PatienceTheDemonGood": {
      "id": "PatienceTheDemonGood",
      "wh": {
        "x": 24,
        "y": 24
      },
      "cels": [
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 198,
          "bounds": {
            "start": {
              "x": 168,
              "y": 192
            },
            "end": {
              "x": 192,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 199,
          "bounds": {
            "start": {
              "x": 168,
              "y": 216
            },
            "end": {
              "x": 192,
              "y": 240
            }
          },
          "duration": 300,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        }
      ],
      "period": 300,
      "duration": 60000,
      "direction": "Forward"
    },
    "PatienceTheDemonEvil": {
      "id": "PatienceTheDemonEvil",
      "wh": {
        "x": 24,
        "y": 24
      },
      "cels": [
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 200,
          "bounds": {
            "start": {
              "x": 192,
              "y": 192
            },
            "end": {
              "x": 216,
              "y": 216
            }
          },
          "duration": 59700,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        },
        {
          "id": 201,
          "bounds": {
            "start": {
              "x": 192,
              "y": 216
            },
            "end": {
              "x": 216,
              "y": 240
            }
          },
          "duration": 300,
          "sliceBounds": {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 7,
              "y": 10
            }
          },
          "slices": [
            {
              "start": {
                "x": 0,
                "y": 0
              },
              "end": {
                "x": 7,
                "y": 10
              }
            }
          ]
        }
      ],
      "period": 300,
      "duration": 60000,
      "direction": "Forward"
    },
    "Tally0": {
      "id": "Tally0",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 202,
          "bounds": {
            "start": {
              "x": 32,
              "y": 224
            },
            "end": {
              "x": 40,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally1": {
      "id": "Tally1",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 203,
          "bounds": {
            "start": {
              "x": 40,
              "y": 224
            },
            "end": {
              "x": 48,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally2": {
      "id": "Tally2",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 204,
          "bounds": {
            "start": {
              "x": 80,
              "y": 224
            },
            "end": {
              "x": 88,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally3": {
      "id": "Tally3",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 205,
          "bounds": {
            "start": {
              "x": 88,
              "y": 224
            },
            "end": {
              "x": 96,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally4": {
      "id": "Tally4",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 206,
          "bounds": {
            "start": {
              "x": 96,
              "y": 224
            },
            "end": {
              "x": 104,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally5": {
      "id": "Tally5",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 207,
          "bounds": {
            "start": {
              "x": 104,
              "y": 224
            },
            "end": {
              "x": 112,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally6": {
      "id": "Tally6",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 208,
          "bounds": {
            "start": {
              "x": 112,
              "y": 224
            },
            "end": {
              "x": 120,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally7": {
      "id": "Tally7",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 209,
          "bounds": {
            "start": {
              "x": 120,
              "y": 224
            },
            "end": {
              "x": 128,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally8": {
      "id": "Tally8",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 210,
          "bounds": {
            "start": {
              "x": 128,
              "y": 224
            },
            "end": {
              "x": 136,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally9": {
      "id": "Tally9",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 211,
          "bounds": {
            "start": {
              "x": 136,
              "y": 224
            },
            "end": {
              "x": 144,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    },
    "Tally10": {
      "id": "Tally10",
      "wh": {
        "x": 8,
        "y": 8
      },
      "cels": [
        {
          "id": 212,
          "bounds": {
            "start": {
              "x": 144,
              "y": 224
            },
            "end": {
              "x": 152,
              "y": 232
            }
          },
          "duration": 4294967295,
          "sliceBounds": {
            "start": {
              "x": 1,
              "y": 1
            },
            "end": {
              "x": 0,
              "y": 0
            }
          },
          "slices": []
        }
      ],
      "period": 4294967295,
      "duration": 4294967295,
      "direction": "Forward"
    }
  },
  "celBoundsByID": [
    {
      "start": {
        "x": 152,
        "y": 224
      },
      "end": {
        "x": 160,
        "y": 232
      }
    },
    {
      "start": {
        "x": 72,
        "y": 224
      },
      "end": {
        "x": 80,
        "y": 232
      }
    },
    {
      "start": {
        "x": 160,
        "y": 224
      },
      "end": {
        "x": 168,
        "y": 232
      }
    },
    {
      "start": {
        "x": 144,
        "y": 96
      },
      "end": {
        "x": 168,
        "y": 128
      }
    },
    {
      "start": {
        "x": 168,
        "y": 96
      },
      "end": {
        "x": 192,
        "y": 128
      }
    },
    {
      "start": {
        "x": 192,
        "y": 96
      },
      "end": {
        "x": 216,
        "y": 128
      }
    },
    {
      "start": {
        "x": 0,
        "y": 128
      },
      "end": {
        "x": 24,
        "y": 160
      }
    },
    {
      "start": {
        "x": 24,
        "y": 128
      },
      "end": {
        "x": 48,
        "y": 160
      }
    },
    {
      "start": {
        "x": 48,
        "y": 128
      },
      "end": {
        "x": 72,
        "y": 160
      }
    },
    {
      "start": {
        "x": 72,
        "y": 128
      },
      "end": {
        "x": 96,
        "y": 160
      }
    },
    {
      "start": {
        "x": 96,
        "y": 128
      },
      "end": {
        "x": 120,
        "y": 160
      }
    },
    {
      "start": {
        "x": 120,
        "y": 128
      },
      "end": {
        "x": 144,
        "y": 160
      }
    },
    {
      "start": {
        "x": 144,
        "y": 128
      },
      "end": {
        "x": 168,
        "y": 160
      }
    },
    {
      "start": {
        "x": 168,
        "y": 128
      },
      "end": {
        "x": 192,
        "y": 160
      }
    },
    {
      "start": {
        "x": 192,
        "y": 128
      },
      "end": {
        "x": 216,
        "y": 160
      }
    },
    {
      "start": {
        "x": 0,
        "y": 160
      },
      "end": {
        "x": 24,
        "y": 192
      }
    },
    {
      "start": {
        "x": 24,
        "y": 160
      },
      "end": {
        "x": 48,
        "y": 192
      }
    },
    {
      "start": {
        "x": 144,
        "y": 192
      },
      "end": {
        "x": 168,
        "y": 224
      }
    },
    {
      "start": {
        "x": 48,
        "y": 160
      },
      "end": {
        "x": 72,
        "y": 192
      }
    },
    {
      "start": {
        "x": 120,
        "y": 192
      },
      "end": {
        "x": 144,
        "y": 224
      }
    },
    {
      "start": {
        "x": 96,
        "y": 192
      },
      "end": {
        "x": 120,
        "y": 224
      }
    },
    {
      "start": {
        "x": 72,
        "y": 192
      },
      "end": {
        "x": 96,
        "y": 224
      }
    },
    {
      "start": {
        "x": 48,
        "y": 192
      },
      "end": {
        "x": 72,
        "y": 224
      }
    },
    {
      "start": {
        "x": 24,
        "y": 192
      },
      "end": {
        "x": 48,
        "y": 224
      }
    },
    {
      "start": {
        "x": 0,
        "y": 192
      },
      "end": {
        "x": 24,
        "y": 224
      }
    },
    {
      "start": {
        "x": 192,
        "y": 160
      },
      "end": {
        "x": 216,
        "y": 192
      }
    },
    {
      "start": {
        "x": 168,
        "y": 160
      },
      "end": {
        "x": 192,
        "y": 192
      }
    },
    {
      "start": {
        "x": 144,
        "y": 160
      },
      "end": {
        "x": 168,
        "y": 192
      }
    },
    {
      "start": {
        "x": 120,
        "y": 160
      },
      "end": {
        "x": 144,
        "y": 192
      }
    },
    {
      "start": {
        "x": 96,
        "y": 160
      },
      "end": {
        "x": 120,
        "y": 192
      }
    },
    {
      "start": {
        "x": 72,
        "y": 160
      },
      "end": {
        "x": 96,
        "y": 192
      }
    },
    {
      "start": {
        "x": 120,
        "y": 96
      },
      "end": {
        "x": 144,
        "y": 128
      }
    },
    {
      "start": {
        "x": 168,
        "y": 32
      },
      "end": {
        "x": 192,
        "y": 64
      }
    },
    {
      "start": {
        "x": 24,
        "y": 0
      },
      "end": {
        "x": 48,
        "y": 32
      }
    },
    {
      "start": {
        "x": 48,
        "y": 0
      },
      "end": {
        "x": 72,
        "y": 32
      }
    },
    {
      "start": {
        "x": 72,
        "y": 0
      },
      "end": {
        "x": 96,
        "y": 32
      }
    },
    {
      "start": {
        "x": 96,
        "y": 0
      },
      "end": {
        "x": 120,
        "y": 32
      }
    },
    {
      "start": {
        "x": 120,
        "y": 0
      },
      "end": {
        "x": 144,
        "y": 32
      }
    },
    {
      "start": {
        "x": 144,
        "y": 0
      },
      "end": {
        "x": 168,
        "y": 32
      }
    },
    {
      "start": {
        "x": 168,
        "y": 0
      },
      "end": {
        "x": 192,
        "y": 32
      }
    },
    {
      "start": {
        "x": 192,
        "y": 0
      },
      "end": {
        "x": 216,
        "y": 32
      }
    },
    {
      "start": {
        "x": 0,
        "y": 32
      },
      "end": {
        "x": 24,
        "y": 64
      }
    },
    {
      "start": {
        "x": 24,
        "y": 32
      },
      "end": {
        "x": 48,
        "y": 64
      }
    },
    {
      "start": {
        "x": 48,
        "y": 32
      },
      "end": {
        "x": 72,
        "y": 64
      }
    },
    {
      "start": {
        "x": 72,
        "y": 32
      },
      "end": {
        "x": 96,
        "y": 64
      }
    },
    {
      "start": {
        "x": 96,
        "y": 32
      },
      "end": {
        "x": 120,
        "y": 64
      }
    },
    {
      "start": {
        "x": 120,
        "y": 32
      },
      "end": {
        "x": 144,
        "y": 64
      }
    },
    {
      "start": {
        "x": 144,
        "y": 32
      },
      "end": {
        "x": 168,
        "y": 64
      }
    },
    {
      "start": {
        "x": 0,
        "y": 0
      },
      "end": {
        "x": 24,
        "y": 32
      }
    },
    {
      "start": {
        "x": 192,
        "y": 32
      },
      "end": {
        "x": 216,
        "y": 64
      }
    },
    {
      "start": {
        "x": 0,
        "y": 64
      },
      "end": {
        "x": 24,
        "y": 96
      }
    },
    {
      "start": {
        "x": 24,
        "y": 64
      },
      "end": {
        "x": 48,
        "y": 96
      }
    },
    {
      "start": {
        "x": 48,
        "y": 64
      },
      "end": {
        "x": 72,
        "y": 96
      }
    },
    {
      "start": {
        "x": 72,
        "y": 64
      },
      "end": {
        "x": 96,
        "y": 96
      }
    },
    {
      "start": {
        "x": 96,
        "y": 64
      },
      "end": {
        "x": 120,
        "y": 96
      }
    },
    {
      "start": {
        "x": 120,
        "y": 64
      },
      "end": {
        "x": 144,
        "y": 96
      }
    },
    {
      "start": {
        "x": 144,
        "y": 64
      },
      "end": {
        "x": 168,
        "y": 96
      }
    },
    {
      "start": {
        "x": 168,
        "y": 64
      },
      "end": {
        "x": 192,
        "y": 96
      }
    },
    {
      "start": {
        "x": 192,
        "y": 64
      },
      "end": {
        "x": 216,
        "y": 96
      }
    },
    {
      "start": {
        "x": 0,
        "y": 96
      },
      "end": {
        "x": 24,
        "y": 128
      }
    },
    {
      "start": {
        "x": 24,
        "y": 96
      },
      "end": {
        "x": 48,
        "y": 128
      }
    },
    {
      "start": {
        "x": 48,
        "y": 96
      },
      "end": {
        "x": 72,
        "y": 128
      }
    },
    {
      "start": {
        "x": 72,
        "y": 96
      },
      "end": {
        "x": 96,
        "y": 128
      }
    },
    {
      "start": {
        "x": 96,
        "y": 96
      },
      "end": {
        "x": 120,
        "y": 128
      }
    },
    {
      "start": {
        "x": 0,
        "y": 224
      },
      "end": {
        "x": 16,
        "y": 240
      }
    },
    {
      "start": {
        "x": 16,
        "y": 224
      },
      "end": {
        "x": 32,
        "y": 240
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 162,
        "y": 232
      },
      "end": {
        "x": 167,
        "y": 238
      }
    },
    {
      "start": {
        "x": 32,
        "y": 238
      },
      "end": {
        "x": 37,
        "y": 244
      }
    },
    {
      "start": {
        "x": 37,
        "y": 238
      },
      "end": {
        "x": 42,
        "y": 244
      }
    },
    {
      "start": {
        "x": 42,
        "y": 238
      },
      "end": {
        "x": 47,
        "y": 244
      }
    },
    {
      "start": {
        "x": 47,
        "y": 238
      },
      "end": {
        "x": 52,
        "y": 244
      }
    },
    {
      "start": {
        "x": 52,
        "y": 238
      },
      "end": {
        "x": 57,
        "y": 244
      }
    },
    {
      "start": {
        "x": 57,
        "y": 238
      },
      "end": {
        "x": 62,
        "y": 244
      }
    },
    {
      "start": {
        "x": 62,
        "y": 238
      },
      "end": {
        "x": 67,
        "y": 244
      }
    },
    {
      "start": {
        "x": 67,
        "y": 238
      },
      "end": {
        "x": 72,
        "y": 244
      }
    },
    {
      "start": {
        "x": 72,
        "y": 238
      },
      "end": {
        "x": 77,
        "y": 244
      }
    },
    {
      "start": {
        "x": 152,
        "y": 232
      },
      "end": {
        "x": 157,
        "y": 238
      }
    },
    {
      "start": {
        "x": 82,
        "y": 238
      },
      "end": {
        "x": 87,
        "y": 244
      }
    },
    {
      "start": {
        "x": 87,
        "y": 238
      },
      "end": {
        "x": 92,
        "y": 244
      }
    },
    {
      "start": {
        "x": 92,
        "y": 238
      },
      "end": {
        "x": 97,
        "y": 244
      }
    },
    {
      "start": {
        "x": 97,
        "y": 238
      },
      "end": {
        "x": 102,
        "y": 244
      }
    },
    {
      "start": {
        "x": 100,
        "y": 244
      },
      "end": {
        "x": 105,
        "y": 250
      }
    },
    {
      "start": {
        "x": 35,
        "y": 244
      },
      "end": {
        "x": 40,
        "y": 250
      }
    },
    {
      "start": {
        "x": 30,
        "y": 244
      },
      "end": {
        "x": 35,
        "y": 250
      }
    },
    {
      "start": {
        "x": 207,
        "y": 240
      },
      "end": {
        "x": 212,
        "y": 246
      }
    },
    {
      "start": {
        "x": 202,
        "y": 240
      },
      "end": {
        "x": 207,
        "y": 246
      }
    },
    {
      "start": {
        "x": 197,
        "y": 240
      },
      "end": {
        "x": 202,
        "y": 246
      }
    },
    {
      "start": {
        "x": 192,
        "y": 240
      },
      "end": {
        "x": 197,
        "y": 246
      }
    },
    {
      "start": {
        "x": 187,
        "y": 240
      },
      "end": {
        "x": 192,
        "y": 246
      }
    },
    {
      "start": {
        "x": 182,
        "y": 240
      },
      "end": {
        "x": 187,
        "y": 246
      }
    },
    {
      "start": {
        "x": 177,
        "y": 240
      },
      "end": {
        "x": 182,
        "y": 246
      }
    },
    {
      "start": {
        "x": 172,
        "y": 240
      },
      "end": {
        "x": 177,
        "y": 246
      }
    },
    {
      "start": {
        "x": 167,
        "y": 240
      },
      "end": {
        "x": 172,
        "y": 246
      }
    },
    {
      "start": {
        "x": 132,
        "y": 238
      },
      "end": {
        "x": 137,
        "y": 244
      }
    },
    {
      "start": {
        "x": 20,
        "y": 240
      },
      "end": {
        "x": 25,
        "y": 246
      }
    },
    {
      "start": {
        "x": 15,
        "y": 240
      },
      "end": {
        "x": 20,
        "y": 246
      }
    },
    {
      "start": {
        "x": 10,
        "y": 240
      },
      "end": {
        "x": 15,
        "y": 246
      }
    },
    {
      "start": {
        "x": 5,
        "y": 240
      },
      "end": {
        "x": 10,
        "y": 246
      }
    },
    {
      "start": {
        "x": 0,
        "y": 240
      },
      "end": {
        "x": 5,
        "y": 246
      }
    },
    {
      "start": {
        "x": 162,
        "y": 238
      },
      "end": {
        "x": 167,
        "y": 244
      }
    },
    {
      "start": {
        "x": 157,
        "y": 238
      },
      "end": {
        "x": 162,
        "y": 244
      }
    },
    {
      "start": {
        "x": 152,
        "y": 238
      },
      "end": {
        "x": 157,
        "y": 244
      }
    },
    {
      "start": {
        "x": 147,
        "y": 238
      },
      "end": {
        "x": 152,
        "y": 244
      }
    },
    {
      "start": {
        "x": 142,
        "y": 238
      },
      "end": {
        "x": 147,
        "y": 244
      }
    },
    {
      "start": {
        "x": 137,
        "y": 238
      },
      "end": {
        "x": 142,
        "y": 244
      }
    },
    {
      "start": {
        "x": 25,
        "y": 240
      },
      "end": {
        "x": 30,
        "y": 246
      }
    },
    {
      "start": {
        "x": 155,
        "y": 244
      },
      "end": {
        "x": 160,
        "y": 250
      }
    },
    {
      "start": {
        "x": 150,
        "y": 244
      },
      "end": {
        "x": 155,
        "y": 250
      }
    },
    {
      "start": {
        "x": 145,
        "y": 244
      },
      "end": {
        "x": 150,
        "y": 250
      }
    },
    {
      "start": {
        "x": 140,
        "y": 244
      },
      "end": {
        "x": 145,
        "y": 250
      }
    },
    {
      "start": {
        "x": 135,
        "y": 244
      },
      "end": {
        "x": 140,
        "y": 250
      }
    },
    {
      "start": {
        "x": 130,
        "y": 244
      },
      "end": {
        "x": 135,
        "y": 250
      }
    },
    {
      "start": {
        "x": 125,
        "y": 244
      },
      "end": {
        "x": 130,
        "y": 250
      }
    },
    {
      "start": {
        "x": 120,
        "y": 244
      },
      "end": {
        "x": 125,
        "y": 250
      }
    },
    {
      "start": {
        "x": 115,
        "y": 244
      },
      "end": {
        "x": 120,
        "y": 250
      }
    },
    {
      "start": {
        "x": 110,
        "y": 244
      },
      "end": {
        "x": 115,
        "y": 250
      }
    },
    {
      "start": {
        "x": 105,
        "y": 244
      },
      "end": {
        "x": 110,
        "y": 250
      }
    },
    {
      "start": {
        "x": 40,
        "y": 244
      },
      "end": {
        "x": 45,
        "y": 250
      }
    },
    {
      "start": {
        "x": 95,
        "y": 244
      },
      "end": {
        "x": 100,
        "y": 250
      }
    },
    {
      "start": {
        "x": 90,
        "y": 244
      },
      "end": {
        "x": 95,
        "y": 250
      }
    },
    {
      "start": {
        "x": 85,
        "y": 244
      },
      "end": {
        "x": 90,
        "y": 250
      }
    },
    {
      "start": {
        "x": 80,
        "y": 244
      },
      "end": {
        "x": 85,
        "y": 250
      }
    },
    {
      "start": {
        "x": 75,
        "y": 244
      },
      "end": {
        "x": 80,
        "y": 250
      }
    },
    {
      "start": {
        "x": 70,
        "y": 244
      },
      "end": {
        "x": 75,
        "y": 250
      }
    },
    {
      "start": {
        "x": 65,
        "y": 244
      },
      "end": {
        "x": 70,
        "y": 250
      }
    },
    {
      "start": {
        "x": 60,
        "y": 244
      },
      "end": {
        "x": 65,
        "y": 250
      }
    },
    {
      "start": {
        "x": 55,
        "y": 244
      },
      "end": {
        "x": 60,
        "y": 250
      }
    },
    {
      "start": {
        "x": 50,
        "y": 244
      },
      "end": {
        "x": 55,
        "y": 250
      }
    },
    {
      "start": {
        "x": 45,
        "y": 244
      },
      "end": {
        "x": 50,
        "y": 250
      }
    },
    {
      "start": {
        "x": 147,
        "y": 232
      },
      "end": {
        "x": 152,
        "y": 238
      }
    },
    {
      "start": {
        "x": 37,
        "y": 232
      },
      "end": {
        "x": 42,
        "y": 238
      }
    },
    {
      "start": {
        "x": 142,
        "y": 232
      },
      "end": {
        "x": 147,
        "y": 238
      }
    },
    {
      "start": {
        "x": 137,
        "y": 232
      },
      "end": {
        "x": 142,
        "y": 238
      }
    },
    {
      "start": {
        "x": 132,
        "y": 232
      },
      "end": {
        "x": 137,
        "y": 238
      }
    },
    {
      "start": {
        "x": 127,
        "y": 232
      },
      "end": {
        "x": 132,
        "y": 238
      }
    },
    {
      "start": {
        "x": 122,
        "y": 232
      },
      "end": {
        "x": 127,
        "y": 238
      }
    },
    {
      "start": {
        "x": 117,
        "y": 232
      },
      "end": {
        "x": 122,
        "y": 238
      }
    },
    {
      "start": {
        "x": 112,
        "y": 232
      },
      "end": {
        "x": 117,
        "y": 238
      }
    },
    {
      "start": {
        "x": 107,
        "y": 232
      },
      "end": {
        "x": 112,
        "y": 238
      }
    },
    {
      "start": {
        "x": 102,
        "y": 232
      },
      "end": {
        "x": 107,
        "y": 238
      }
    },
    {
      "start": {
        "x": 97,
        "y": 232
      },
      "end": {
        "x": 102,
        "y": 238
      }
    },
    {
      "start": {
        "x": 92,
        "y": 232
      },
      "end": {
        "x": 97,
        "y": 238
      }
    },
    {
      "start": {
        "x": 87,
        "y": 232
      },
      "end": {
        "x": 92,
        "y": 238
      }
    },
    {
      "start": {
        "x": 82,
        "y": 232
      },
      "end": {
        "x": 87,
        "y": 238
      }
    },
    {
      "start": {
        "x": 77,
        "y": 232
      },
      "end": {
        "x": 82,
        "y": 238
      }
    },
    {
      "start": {
        "x": 72,
        "y": 232
      },
      "end": {
        "x": 77,
        "y": 238
      }
    },
    {
      "start": {
        "x": 67,
        "y": 232
      },
      "end": {
        "x": 72,
        "y": 238
      }
    },
    {
      "start": {
        "x": 62,
        "y": 232
      },
      "end": {
        "x": 67,
        "y": 238
      }
    },
    {
      "start": {
        "x": 57,
        "y": 232
      },
      "end": {
        "x": 62,
        "y": 238
      }
    },
    {
      "start": {
        "x": 52,
        "y": 232
      },
      "end": {
        "x": 57,
        "y": 238
      }
    },
    {
      "start": {
        "x": 47,
        "y": 232
      },
      "end": {
        "x": 52,
        "y": 238
      }
    },
    {
      "start": {
        "x": 42,
        "y": 232
      },
      "end": {
        "x": 47,
        "y": 238
      }
    },
    {
      "start": {
        "x": 32,
        "y": 232
      },
      "end": {
        "x": 37,
        "y": 238
      }
    },
    {
      "start": {
        "x": 77,
        "y": 238
      },
      "end": {
        "x": 82,
        "y": 244
      }
    },
    {
      "start": {
        "x": 127,
        "y": 238
      },
      "end": {
        "x": 132,
        "y": 244
      }
    },
    {
      "start": {
        "x": 122,
        "y": 238
      },
      "end": {
        "x": 127,
        "y": 244
      }
    },
    {
      "start": {
        "x": 117,
        "y": 238
      },
      "end": {
        "x": 122,
        "y": 244
      }
    },
    {
      "start": {
        "x": 112,
        "y": 238
      },
      "end": {
        "x": 117,
        "y": 244
      }
    },
    {
      "start": {
        "x": 107,
        "y": 238
      },
      "end": {
        "x": 112,
        "y": 244
      }
    },
    {
      "start": {
        "x": 102,
        "y": 238
      },
      "end": {
        "x": 107,
        "y": 244
      }
    },
    {
      "start": {
        "x": 157,
        "y": 232
      },
      "end": {
        "x": 162,
        "y": 238
      }
    },
    {
      "start": {
        "x": 32,
        "y": 224
      },
      "end": {
        "x": 40,
        "y": 232
      }
    },
    {
      "start": {
        "x": 64,
        "y": 224
      },
      "end": {
        "x": 72,
        "y": 232
      }
    },
    {
      "start": {
        "x": 56,
        "y": 224
      },
      "end": {
        "x": 64,
        "y": 232
      }
    },
    {
      "start": {
        "x": 48,
        "y": 224
      },
      "end": {
        "x": 56,
        "y": 232
      }
    },
    {
      "start": {
        "x": 168,
        "y": 192
      },
      "end": {
        "x": 192,
        "y": 216
      }
    },
    {
      "start": {
        "x": 168,
        "y": 216
      },
      "end": {
        "x": 192,
        "y": 240
      }
    },
    {
      "start": {
        "x": 192,
        "y": 192
      },
      "end": {
        "x": 216,
        "y": 216
      }
    },
    {
      "start": {
        "x": 192,
        "y": 216
      },
      "end": {
        "x": 216,
        "y": 240
      }
    },
    {
      "start": {
        "x": 32,
        "y": 224
      },
      "end": {
        "x": 40,
        "y": 232
      }
    },
    {
      "start": {
        "x": 40,
        "y": 224
      },
      "end": {
        "x": 48,
        "y": 232
      }
    },
    {
      "start": {
        "x": 80,
        "y": 224
      },
      "end": {
        "x": 88,
        "y": 232
      }
    },
    {
      "start": {
        "x": 88,
        "y": 224
      },
      "end": {
        "x": 96,
        "y": 232
      }
    },
    {
      "start": {
        "x": 96,
        "y": 224
      },
      "end": {
        "x": 104,
        "y": 232
      }
    },
    {
      "start": {
        "x": 104,
        "y": 224
      },
      "end": {
        "x": 112,
        "y": 232
      }
    },
    {
      "start": {
        "x": 112,
        "y": 224
      },
      "end": {
        "x": 120,
        "y": 232
      }
    },
    {
      "start": {
        "x": 120,
        "y": 224
      },
      "end": {
        "x": 128,
        "y": 232
      }
    },
    {
      "start": {
        "x": 128,
        "y": 224
      },
      "end": {
        "x": 136,
        "y": 232
      }
    },
    {
      "start": {
        "x": 136,
        "y": 224
      },
      "end": {
        "x": 144,
        "y": 232
      }
    },
    {
      "start": {
        "x": 144,
        "y": 224
      },
      "end": {
        "x": 152,
        "y": 232
      }
    }
  ]
}
`);
var Assets;
(function(Assets) {
    async function load() {
        const atlas = await ImageLoader.load('atlas.png');
        const shaderLayout = ShaderLayoutParser.parse(__default3);
        return {
            atlas,
            atlasMeta: __default7,
            shaderLayout
        };
    }
    Assets.load = load;
})(Assets || (Assets = {}));
var SublimeFilmID;
(function(SublimeFilmID) {
    SublimeFilmID.values = Immutable(new Set([
        'CardCA',
        'CardC2',
        'CardC3',
        'CardC4',
        'CardC5',
        'CardC6',
        'CardC7',
        'CardC8',
        'CardC9',
        'CardC10',
        'CardCJ',
        'CardCQ',
        'CardCK',
        'CardDA',
        'CardD2',
        'CardD3',
        'CardD4',
        'CardD5',
        'CardD6',
        'CardD7',
        'CardD8',
        'CardD9',
        'CardD10',
        'CardDJ',
        'CardDQ',
        'CardDK',
        'CardHA',
        'CardH2',
        'CardH3',
        'CardH4',
        'CardH5',
        'CardH6',
        'CardH7',
        'CardH8',
        'CardH9',
        'CardH10',
        'CardHJ',
        'CardHQ',
        'CardHK',
        'CardSA',
        'CardS2',
        'CardS3',
        'CardS4',
        'CardS5',
        'CardS6',
        'CardS7',
        'CardS8',
        'CardS9',
        'CardS10',
        'CardSJ',
        'CardSQ',
        'CardSK',
        'CardDown',
        'CardVacantClubs',
        'CardVacantDiamonds',
        'CardVacantHearts',
        'CardVacantSpades',
        'CardVacantPile',
        'CardVacantStock',
        'CardOutlineChecked',
        'CardOutlineFocus',
        'Checkerboard',
        'Corner',
        'CursorPick',
        'CursorPoint',
        'Grid',
        'PaletteAlpha',
        'PaletteDark',
        'PaletteLight',
        'PaletteMid',
        'MemProp5x6-00',
        'MemProp5x6-01',
        'MemProp5x6-02',
        'MemProp5x6-03',
        'MemProp5x6-04',
        'MemProp5x6-05',
        'MemProp5x6-06',
        'MemProp5x6-07',
        'MemProp5x6-08',
        'MemProp5x6-09',
        'MemProp5x6-0a',
        'MemProp5x6-0b',
        'MemProp5x6-0c',
        'MemProp5x6-0d',
        'MemProp5x6-0e',
        'MemProp5x6-0f',
        'MemProp5x6-10',
        'MemProp5x6-11',
        'MemProp5x6-12',
        'MemProp5x6-13',
        'MemProp5x6-14',
        'MemProp5x6-15',
        'MemProp5x6-16',
        'MemProp5x6-17',
        'MemProp5x6-18',
        'MemProp5x6-19',
        'MemProp5x6-1a',
        'MemProp5x6-1b',
        'MemProp5x6-1c',
        'MemProp5x6-1d',
        'MemProp5x6-1e',
        'MemProp5x6-1f',
        'MemProp5x6-20',
        'MemProp5x6-21',
        'MemProp5x6-22',
        'MemProp5x6-23',
        'MemProp5x6-24',
        'MemProp5x6-25',
        'MemProp5x6-26',
        'MemProp5x6-27',
        'MemProp5x6-28',
        'MemProp5x6-29',
        'MemProp5x6-2a',
        'MemProp5x6-2b',
        'MemProp5x6-2c',
        'MemProp5x6-2d',
        'MemProp5x6-2e',
        'MemProp5x6-2f',
        'MemProp5x6-30',
        'MemProp5x6-31',
        'MemProp5x6-32',
        'MemProp5x6-33',
        'MemProp5x6-34',
        'MemProp5x6-35',
        'MemProp5x6-36',
        'MemProp5x6-37',
        'MemProp5x6-38',
        'MemProp5x6-39',
        'MemProp5x6-3a',
        'MemProp5x6-3b',
        'MemProp5x6-3c',
        'MemProp5x6-3d',
        'MemProp5x6-3e',
        'MemProp5x6-3f',
        'MemProp5x6-40',
        'MemProp5x6-41',
        'MemProp5x6-42',
        'MemProp5x6-43',
        'MemProp5x6-44',
        'MemProp5x6-45',
        'MemProp5x6-46',
        'MemProp5x6-47',
        'MemProp5x6-48',
        'MemProp5x6-49',
        'MemProp5x6-4a',
        'MemProp5x6-4b',
        'MemProp5x6-4c',
        'MemProp5x6-4d',
        'MemProp5x6-4e',
        'MemProp5x6-4f',
        'MemProp5x6-50',
        'MemProp5x6-51',
        'MemProp5x6-52',
        'MemProp5x6-53',
        'MemProp5x6-54',
        'MemProp5x6-55',
        'MemProp5x6-56',
        'MemProp5x6-57',
        'MemProp5x6-58',
        'MemProp5x6-59',
        'MemProp5x6-5a',
        'MemProp5x6-5b',
        'MemProp5x6-5c',
        'MemProp5x6-5d',
        'MemProp5x6-5e',
        'MemProp5x6-5f',
        'MemProp5x6-60',
        'MemProp5x6-61',
        'MemProp5x6-62',
        'MemProp5x6-63',
        'MemProp5x6-64',
        'MemProp5x6-65',
        'MemProp5x6-66',
        'MemProp5x6-67',
        'MemProp5x6-68',
        'MemProp5x6-69',
        'MemProp5x6-6a',
        'MemProp5x6-6b',
        'MemProp5x6-6c',
        'MemProp5x6-6d',
        'MemProp5x6-6e',
        'MemProp5x6-6f',
        'MemProp5x6-70',
        'MemProp5x6-71',
        'MemProp5x6-72',
        'MemProp5x6-73',
        'MemProp5x6-74',
        'MemProp5x6-75',
        'MemProp5x6-76',
        'MemProp5x6-77',
        'MemProp5x6-78',
        'MemProp5x6-79',
        'MemProp5x6-7a',
        'MemProp5x6-7b',
        'MemProp5x6-7c',
        'MemProp5x6-7d',
        'MemProp5x6-7e',
        'MemProp5x6-7f',
        'PatienceTheDemonGood',
        'PatienceTheDemonEvil',
        'Tally0',
        'Tally1',
        'Tally2',
        'Tally3',
        'Tally4',
        'Tally5',
        'Tally6',
        'Tally7',
        'Tally8',
        'Tally9',
        'Tally10'
    ]));
})(SublimeFilmID || (SublimeFilmID = {}));
function SaveData(wins) {
    return {
        wins
    };
}
const saveKey = 'save';
var SaveStorage;
(function(SaveStorage) {
    function load(storage) {
        const save = JSONStorage.get(storage, saveKey) ?? SaveData(Uint(0));
        return {
            save,
            storage
        };
    }
    SaveStorage.load = load;
    function save(self) {
        JSONStorage.put(self.storage, saveKey, self.save);
    }
    SaveStorage.save = save;
})(SaveStorage || (SaveStorage = {}));
const PatienceTheDemonSystem = Immutable({
    query: new Set([
        'patienceTheDemon',
        'sprite'
    ]),
    skip (update) {
        if (update.pickHandled) return true;
        if (!update.input.isOffStart('Action')) return true;
        return false;
    },
    updateEnt (set, update) {
        const { sprite  } = set;
        if (sprite.intersectsSprite(update.cursor, update.time)) {
            update.pickHandled = true;
            sprite.animate(update.time, nextFilm(update, sprite));
        } else if (sprite.intersectsBounds(update.cursor.bounds.start)) {
            update.pickHandled = true;
            Solitaire.reset(update.solitaire);
            update.saveStorage.save.wins = update.solitaire.wins;
            SaveStorage.save(update.saveStorage);
        }
    }
});
function nextFilm(update, sprite) {
    const good = sprite.film.id == 'PatienceTheDemonGood';
    const id = `PatienceTheDemon${good ? 'Evil' : 'Good'}`;
    return update.filmByID[id];
}
const TallySystem = Immutable({
    query: new Set([
        'tally',
        'sprite'
    ]),
    updateEnt (set, update) {
        const { sprite , tally  } = set;
        const wins = Math.min(10, Math.max(0, update.solitaire.wins - tally.tens * 10));
        const filmID = `Tally${wins}`;
        if (sprite.film.id != filmID) {
            sprite.animate(update.time, update.filmByID[filmID]);
        }
    }
});
var SublimeLevelParser;
(function(SublimeLevelParser) {
    function parse(factory, json) {
        return json.map((setJSON)=>parseComponentSet(factory, setJSON));
    }
    SublimeLevelParser.parse = parse;
})(SublimeLevelParser || (SublimeLevelParser = {}));
function parseComponentSet(factory, json) {
    const set = {};
    for (const [key, val] of Object.entries(json)){
        const component = LevelParser.parseComponent(factory, key, val);
        if (component != null) {
            set[key] = component;
            continue;
        }
        switch(key){
            case 'patienceTheDemon':
                set[key] = {};
                break;
        }
    }
    return set;
}
const SublimeLayer = Immutable({
    ...Layer,
    Picked: U8(0x02),
    CardUp: U8(0x03),
    CardDown: U8(0x04),
    Patience: U8(0x05),
    Vacancy: U8(0x06),
    Background: U8(0x07)
});
Immutable(Inverse(SublimeLayer));
const boardX = 2 * 8;
const hiddenY = -1024;
function setSpritePositionsForLayout(ecs, filmByID, solitaire, time) {
    for (const [indexX, column] of solitaire.tableau.entries()){
        for (const [indexY, card] of column.entries()){
            const components = ecs.componentsByRef.get(card);
            const xy = getTableauCardXY(filmByID, indexX, indexY);
            components.sprite.moveTo(xy);
            components.sprite.layer = SublimeLayer[card.direction == 'Up' ? 'CardUp' : 'CardDown'];
            components.sprite.animate(time, filmByID[getCardFilmID(card)]);
        }
    }
    for (const pillar of solitaire.foundation){
        for (const [index, card1] of pillar.entries()){
            const components1 = ecs.componentsByRef.get(card1);
            const xy1 = getFoundationCardXY(filmByID, card1.suit);
            components1.sprite.moveTo(xy1);
            const animID = index == pillar.length - 1 ? getCardFilmID(card1) : 'CardDown';
            components1.sprite.animate(time, filmByID[animID]);
            components1.sprite.layer = SublimeLayer[animID == 'CardDown' ? 'CardDown' : 'CardUp'];
        }
    }
    for (const [index1, card2] of solitaire.stock.entries()){
        const components2 = ecs.componentsByRef.get(card2);
        components2.sprite.moveTo(getStockXY(solitaire, index1));
        components2.sprite.layer = SublimeLayer[card2.direction == 'Up' ? 'CardUp' : 'CardDown'];
        components2.sprite.animate(time, filmByID[getCardFilmID(card2)]);
    }
    for (const [index2, card3] of solitaire.waste.entries()){
        const components3 = ecs.componentsByRef.get(card3);
        components3.sprite.moveTo(getWasteXY(solitaire, index2));
        let animID1;
        if (index2 >= solitaire.waste.length - solitaire.drawSize) {
            animID1 = getCardFilmID(card3);
        } else {
            animID1 = 'CardDown';
        }
        components3.sprite.layer = SublimeLayer[animID1 == 'CardDown' ? 'CardDown' : 'CardUp'];
        components3.sprite.animate(time, filmByID[animID1]);
    }
}
class CardSystem {
    query = new Set([
        'card',
        'sprite'
    ]);
    #picked;
    piles = [];
    vacantStock;
    update(sets, update) {
        if (update.pickHandled) return;
        const picked = pickClosest(sets, update);
        const isStockClick = this.vacantStock && picked?.sprite.intersectsSprite(this.vacantStock, update.time);
        if (picked?.card.direction == 'Down' && !isStockClick && update.input.isOffStart('Action') || picked?.card.direction == 'Up' && !isStockClick && update.input.isOnStart('Action') || picked != null && isStockClick && update.input.isOffStart('Action')) {
            update.pickHandled = true;
            this.setPickRange(update, picked.card);
        }
        if (update.input.isOn('Action') && this.#picked != null) {
            moveToPick(update, this.#picked);
        } else {
            setSpritePositionsForLayout(update.ecs, update.filmByID, update.solitaire, update.time);
        }
        if (update.solitaire.selected != null && update.input.isOffStart('Action')) {
            if (this.#picked == null) {
                const picked1 = pickClosest(sets, update);
                if (picked1 != null) {
                    Solitaire.point(update.solitaire, picked1.card);
                } else Solitaire.deselect(update.solitaire);
                setSpritePositionsForLayout(update.ecs, update.filmByID, update.solitaire, update.time);
            } else {
                const bestMatch = this.findbestmatch(update);
                if (bestMatch != null && update.solitaire.selected != null) {
                    Solitaire.build(update.solitaire, bestMatch.pile.pile);
                }
                Solitaire.deselect(update.solitaire);
                setSpritePositionsForLayout(update.ecs, update.filmByID, update.solitaire, update.time);
                this.#picked = undefined;
            }
        }
    }
    setPickRange(update, card) {
        const selected = Solitaire.point(update.solitaire, card);
        if (selected == null) return;
        const ents = selected.cards.map((card)=>{
            const components = NonNull(update.ecs.componentsByRef.get(card));
            return {
                components,
                offset: I16XY.sub(I16XY(update.cursor.bounds.start), components.sprite.bounds.start)
            };
        }, `Card ${card} missing sprite.`);
        this.#picked = {
            ents
        };
        for (const sprite of ents.map((data)=>data.components.sprite)){
            sprite.layer = SublimeLayer.Picked;
        }
    }
    findbestmatch(update) {
        const pointedCard = this.#picked?.ents[0]?.components;
        let bestMatch;
        if (pointedCard != null && pointedCard.sprite != null) {
            for (const pile of this.piles){
                if (pile.sprite == null) continue;
                const intersection = I16Box.intersection(pointedCard.sprite.bounds, pile.sprite.bounds);
                if (I16Box.flipped(intersection) || I16Box.area(intersection) <= 0) {
                    continue;
                }
                if (!Solitaire.isBuildable(update.solitaire, pile.pile)) continue;
                if (bestMatch == null || I16Box.area(intersection) > I16Box.area(bestMatch.intersection)) bestMatch = {
                    intersection,
                    pile
                };
            }
        }
        return bestMatch;
    }
}
function getStockXY(solitaire, indexY) {
    return I16XY(boardX + 160, 16 + (solitaire.stock.length - 1 == indexY ? 0 : hiddenY));
}
function getWasteXY(solitaire, index) {
    const top = solitaire.waste.length - solitaire.drawSize;
    const betterIndex = Math.max(index - top, 0);
    return I16XY(208, 16 + betterIndex * 8);
}
function getFoundationCardXY(filmByID, suit) {
    const film = filmByID[`CardVacant${suit}`];
    const betterIndexX = {
        Clubs: 0,
        Diamonds: 1,
        Hearts: 2,
        Spades: 3
    }[suit];
    const x = boardX + 8 * 4 + betterIndexX * (film.wh.x + 8);
    return I16XY(x, 16);
}
function getTableauCardXY(filmByID, indexX, indexY) {
    const film = filmByID.CardVacantPile;
    const x = boardX + indexX * (film.wh.x + 8);
    return I16XY(x, 72 + indexY * 8);
}
const PileHitboxSystem = Immutable({
    query: new Set([
        'pile',
        'sprite'
    ]),
    updateEnt (set, update) {
        const { pile , sprite  } = set;
        const cardWH = U16XY(24, 32);
        const xy = pile.type == 'Tableau' ? getTableauCardXY(update.filmByID, pile.x, Uint(0)) : getFoundationCardXY(update.filmByID, pile.suit);
        I16Box.moveTo(sprite.bounds, xy.x - 8, xy.y - 8);
        I16Box.sizeTo(sprite.bounds, cardWH.x + 8 * 2, cardWH.y + (pile.type == 'Tableau' ? Math.max(0, update.solitaire.tableau[pile.x].length - 1) * 8 : 0) + 8 * 2);
    }
});
const VacantStockSystem = Immutable({
    query: new Set([
        'vacantStock',
        'sprite'
    ]),
    skip (update) {
        return !!update.pickHandled || !update.input.isOffStart('Action');
    },
    updateEnt (set, update) {
        if (update.pickHandled) return;
        if (!set.sprite.intersectsBounds(update.cursor.bounds.start)) return;
        update.pickHandled = true;
        Solitaire.deal(update.solitaire);
        setSpritePositionsForLayout(update.ecs, update.filmByID, update.solitaire, update.time);
    }
});
function newLevelComponents(factory, solitaire) {
    return [
        ...newTallies(factory),
        ...newFoundation(factory),
        ...newStock(factory, solitaire),
        ...newTableau(solitaire, factory),
        ...newWaste(solitaire, factory),
        ...SublimeLevelParser.parse(factory, __default6)
    ];
}
class SpriteFactory {
    #filmByID;
    layerByID = SublimeLayer;
    get filmByID() {
        return this.#filmByID;
    }
    constructor(filmByID){
        this.#filmByID = filmByID;
    }
    new(filmID, layer, props) {
        return new Sprite(this.#filmByID[filmID], SublimeLayer[layer], props);
    }
}
function SublimeSolitaire(window1, assets) {
    const canvas = window1.document.getElementsByTagName('canvas').item(0);
    assertNonNull(canvas, 'Canvas missing.');
    const random = Random(I32.mod(Date.now()));
    const saveStorage = SaveStorage.load(localStorage);
    const solitaire = Solitaire(undefined, ()=>Random.fraction(random));
    solitaire.wins = saveStorage.save.wins;
    const newRenderer = ()=>Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta);
    const cardSystem = new CardSystem();
    const ecs = ECS(new Set([
        FollowCamSystem,
        CursorSystem,
        FollowPointSystem,
        cardSystem,
        PileHitboxSystem,
        VacantStockSystem,
        PatienceTheDemonSystem,
        TallySystem,
        RenderSystem
    ]));
    ECS.addEnt(ecs, ...newLevelComponents(new SpriteFactory(assets.atlasMeta.filmByID), solitaire));
    ECS.flush(ecs);
    cardSystem.piles = ECS.query(ecs, 'pile', 'sprite');
    cardSystem.vacantStock = ECS.query(ecs, 'vacantStock', 'sprite')?.[0]?.sprite;
    const tick = 1000 / 60;
    const self = {
        assets,
        canvas,
        random,
        instanceBuffer: InstanceBuffer(assets.shaderLayout),
        solitaire,
        ecs,
        input: new Input(),
        rendererStateMachine: new RendererStateMachine({
            window: window1,
            canvas,
            onFrame: (delta)=>SublimeSolitaire.onFrame(self, delta),
            onPause: ()=>{
                self.input.reset();
            },
            newRenderer
        }),
        tick,
        time: 0,
        minViewport: U16XY(256, 214),
        saveStorage,
        cursor: ECS.query(ecs, 'cursor', 'sprite')[0].sprite
    };
    return self;
}
(function(SublimeSolitaire1) {
    async function make(window1) {
        const assets = await Assets.load();
        return SublimeSolitaire(window1, assets);
    }
    SublimeSolitaire1.make = make;
    function start(self) {
        self.input.register('add');
        self.rendererStateMachine.start();
    }
    SublimeSolitaire1.start = start;
    function stop(self) {
        self.input.register('remove');
        self.rendererStateMachine.stop();
    }
    SublimeSolitaire1.stop = stop;
    function onFrame(self, delta) {
        const clientViewportWH = Viewport.clientViewportWH(window);
        const nativeViewportWH = Viewport.nativeViewportWH(window, clientViewportWH);
        const scale = Viewport.scale(nativeViewportWH, self.minViewport, I16(0));
        const camWH = Viewport.camWH(nativeViewportWH, scale);
        const camOffsetX = Math.trunc((camWH.x - self.minViewport.x) / 2);
        const camBounds = I16Box(-(camOffsetX - camOffsetX % 8), 0, camWH.x, camWH.y);
        self.time += delta;
        const update = {
            filmByID: self.assets.atlasMeta.filmByID,
            camBounds,
            nativeViewportWH,
            clientViewportWH,
            ecs: self.ecs,
            delta,
            input: self.input,
            time: self.time,
            scale,
            saveStorage: self.saveStorage,
            instanceBuffer: self.instanceBuffer,
            rendererStateMachine: self.rendererStateMachine,
            solitaire: self.solitaire,
            cursor: self.cursor
        };
        self.input.preupdate();
        processDebugInput(self, update);
        ECS.update(self.ecs, update);
        self.input.postupdate(delta, clientViewportWH, camBounds);
    }
    SublimeSolitaire1.onFrame = onFrame;
})(SublimeSolitaire || (SublimeSolitaire = {}));
function processDebugInput(self, update) {
    if (update.pickHandled) return;
    if (self.input.isComboStart([
        'Up'
    ], [
        'Up'
    ], [
        'Down'
    ], [
        'Down'
    ], [
        'Left'
    ], [
        'Right'
    ], [
        'Left'
    ], [
        'Right'
    ], [
        'Menu'
    ], [
        'Action'
    ])) {
        update.pickHandled = true;
        console.log('combo');
    }
    if (self.input.isOnStart('DebugContextLoss')) {
        if (!self.rendererStateMachine.isContextLost()) {
            update.pickHandled = true;
            self.rendererStateMachine.loseContext();
            setTimeout(()=>self.rendererStateMachine.restoreContext(), 3000);
        }
    }
}
function pickClosest(sets, update) {
    if (update.input == null) return;
    let picked;
    for (const set of sets){
        const { card , sprite  } = set;
        if (!sprite.intersectsSprite(update.cursor, update.time)) {
            continue;
        }
        if (picked == null || sprite.isInFrontOf(picked.sprite)) {
            picked = {
                set,
                card,
                sprite
            };
        }
    }
    return picked;
}
function moveToPick(update, picked) {
    for(let i = 0; i < picked.ents.length; i++){
        I16Box.moveTo(picked.ents[i].components.sprite.bounds, I16XY.sub(I16XY(update.cursor.bounds.start), picked.ents[i].offset));
    }
}
function getCardFilmID(card) {
    return card.direction == 'Up' ? `Card${Card.toASCII(card)}` : 'CardDown';
}
function newCard(factory, card, xy) {
    return {
        card,
        sprite: factory.new(getCardFilmID(card), `Card${card.direction}`, {
            xy
        })
    };
}
function* newFoundation(factory) {
    for (const suit of Suit.values){
        yield {
            sprite: factory.new(`CardVacant${suit}`, 'Vacancy', {
                xy: getFoundationCardXY(factory.filmByID, suit)
            })
        };
        yield {
            pile: {
                type: 'Foundation',
                suit
            },
            sprite: factory.new('PaletteAlpha', 'Vacancy', {
                xy: getFoundationCardXY(factory.filmByID, suit)
            })
        };
    }
}
function newStock(factory, solitaire) {
    const components = [
        {
            vacantStock: {},
            sprite: factory.new('CardVacantStock', 'Vacancy', {
                xy: getStockXY(solitaire, solitaire.stock.length - 1)
            })
        }
    ];
    for (const [index, card] of solitaire.stock.entries()){
        components.push(newCard(factory, card, getStockXY(solitaire, index)));
    }
    return components;
}
function newTableau(solitaire, factory) {
    const components = [];
    for (const [indexX, pile] of solitaire.tableau.entries()){
        const x = indexX;
        components.push({
            pile: {
                type: 'Tableau',
                x: Uint(x)
            },
            sprite: factory.new('PaletteAlpha', 'Vacancy', {
                xy: getTableauCardXY(factory.filmByID, x, 0)
            })
        }, {
            sprite: factory.new('CardVacantPile', 'Vacancy', {
                xy: getTableauCardXY(factory.filmByID, x, 0)
            })
        });
        for (const [indexY, card] of pile.entries()){
            components.push(newCard(factory, card, getTableauCardXY(factory.filmByID, x, indexY)));
        }
    }
    return components;
}
function* newTallies(factory) {
    for(let i = 0; i < 26; i++){
        yield {
            followCam: {
                modulo: I16XY(8, 8),
                orientation: 'Northeast',
                pad: I16XY(8, 8 + i * 8)
            },
            tally: {
                tens: i
            },
            sprite: factory.new('Tally0', 'Patience')
        };
    }
}
function* newWaste(solitaire, factory) {
    for (const [index, card] of solitaire.waste.entries()){
        const xy = getWasteXY(solitaire, index);
        yield newCard(factory, card, xy);
    }
}
console.log(`sublime-solitaire v0.0.0
   ┌>°┐
by │  │idoid
   └──┘`);
const sublime = await SublimeSolitaire.make(window);
SublimeSolitaire.start(sublime);
