// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
class XYNamespaceImpl {
    absCoerce(self, coerce) {
        return this.setCoerce(self, coerce, Math.abs(self.x), Math.abs(self.y));
    }
    addCoerce(self, coerce, ...args) {
        const term = argsToXY(args);
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
        const divisor = argsToXY(args);
        return this.setCoerce(self, coerce, self.x / divisor.x, self.y / divisor.y);
    }
    eq = (self, ...args)=>{
        const xy = argsToXY(args);
        return self.x == xy.x && self.y == xy.y;
    };
    magnitudeCoerce(self, coerce) {
        return coerce(Math.sqrt(self.x * self.x + self.y * self.y));
    }
    maxCoerce(self, coerce, ...args) {
        const xy = argsToXY(args);
        return this.setCoerce(self, coerce, Math.max(self.x, xy.x), Math.max(self.y, xy.y));
    }
    minCoerce(self, coerce, ...args) {
        const xy = argsToXY(args);
        return this.setCoerce(self, coerce, Math.min(self.x, xy.x), Math.min(self.y, xy.y));
    }
    mulCoerce(self, coerce, ...args) {
        const factor = argsToXY(args);
        return this.setCoerce(self, coerce, self.x * factor.x, self.y * factor.y);
    }
    setCoerce(self, coerce, ...args) {
        if (args.length == 2) {
            ({ x: self.x , y: self.y  } = this.construct(coerce, ...args));
        } else ({ x: self.x , y: self.y  } = this.construct(coerce, ...args));
        return self;
    }
    subCoerce(self, coerce, ...args) {
        const term = argsToXY(args);
        return this.setCoerce(self, coerce, self.x - term.x, self.y - term.y);
    }
    toString = (self)=>`(${self.x}, ${self.y})`;
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
        const by = argsToXY1(args);
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
        const to = NumberXY(argsToXY1(args));
        const by = NumberXY.sub(to, this.centerCoerce(self, coerce));
        return this.moveByCoerce(self, coerce, by);
    }
    moveToCoerce(self, coerce, ...args) {
        const to = NumberXY(argsToXY1(args));
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
        const by = argsToXY1(args);
        const end = coerce({
            x: self.end.x + by.x,
            y: self.end.y + by.y
        });
        this.xy.set(self.end, end);
        return self;
    }
    sizeToCoerce(self, coerce, ...args) {
        const to = NumberXY(argsToXY1(args));
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
const Unumber = NumberNumNamespaceImpl.new('Unumber', 'Unsigned', 0, Number.POSITIVE_INFINITY);
const UnumberXY = NumberXYNamespaceImpl.new('UnumberXY', Unumber);
function argsToXY(args) {
    if (args.length == 1) return args[0];
    return {
        x: args[0],
        y: args[1]
    };
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
const __default = JSON.parse("{\n  \"//\": \"https://w3c.github.io/gamepad/#remapping\",\n  \"buttons\": {\n    \"14\": \"Left\",\n    \"15\": \"Right\",\n    \"12\": \"Up\",\n    \"13\": \"Down\",\n    \"0\": \"Action\",\n    \"9\": \"Menu\"\n  },\n  \"axes\": {\n    \"0\": \"Left\",\n    \"1\": \"Up\",\n    \"2\": \"Left\",\n    \"3\": \"Up\"\n  }\n}");
const __default1 = JSON.parse("{\n  \"ArrowLeft\": \"Left\",\n  \"a\": \"Left\",\n  \"ArrowRight\": \"Right\",\n  \"d\": \"Right\",\n  \"ArrowUp\": \"Up\",\n  \"w\": \"Up\",\n  \"ArrowDown\": \"Down\",\n  \"s\": \"Down\",\n  \" \": \"Action\",\n  \"Enter\": \"Action\",\n  \"Escape\": \"Menu\",\n  \"Ctrl+Alt+Shift+D\": \"DebugContextLoss\",\n  \"0\": \"ScaleReset\",\n  \"-\": \"ScaleDecrease\",\n  \"+\": \"ScaleIncrease\"\n}");
const __default2 = JSON.parse("{ \"0\": \"Point\", \"1\": \"Action\" }");
const __default3 = JSON.parse("{\n  \"uniforms\": {\n    \"uAtlas\": \"uAtlas\",\n    \"uAtlasSize\": \"uAtlasSize\",\n    \"uProjection\": \"uProjection\",\n    \"uSourceByCelID\": \"uSourceByCelID\"\n  },\n  \"perVertex\": [{ \"name\": \"vUV\", \"type\": \"UNSIGNED_SHORT\", \"len\": 2 }],\n  \"perInstance\": [\n    { \"name\": \"iCelID\", \"type\": \"UNSIGNED_SHORT\", \"len\": 1 },\n    { \"name\": \"iTarget\", \"type\": \"SHORT\", \"len\": 4 },\n    { \"name\": \"iWrapLayerByHeightLayer\", \"type\": \"UNSIGNED_SHORT\", \"len\": 1 }\n  ]\n}");
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
const CamSystem = Immutable({
    query: new Set([
        'cam'
    ]),
    updateEnt
});
function updateEnt(set) {
    const { cam  } = set;
    ({ x: cam.clientViewportWH.x , y: cam.clientViewportWH.y  } = Viewport.clientViewportWH(window));
    ({ x: cam.nativeViewportWH.x , y: cam.nativeViewportWH.y  } = Viewport.nativeViewportWH(window, cam.clientViewportWH));
    cam.scale = Viewport.scale(cam.nativeViewportWH, cam.minViewport, I16(0));
    ({ x: cam.wh.x , y: cam.wh.y  } = Viewport.camWH(cam.nativeViewportWH, cam.scale));
    const camOffsetX = Math.trunc((cam.wh.x - cam.minViewport.x) / 2);
    cam.xy.x = I16(-camOffsetX + camOffsetX % 8);
}
const FollowCamSystem = Immutable({
    query: new Set([
        'followCam',
        'sprite'
    ]),
    updateEnt: updateEnt1
});
function updateEnt1(set, update) {
    const { followCam , sprite  } = set;
    const pad = I16XY(followCam.pad?.x ?? 0, followCam.pad?.y ?? 0);
    I16Box.sizeTo(sprite.bounds, I16(followCam.fill == 'X' || followCam.fill == 'XY' ? update.cam.wh.x - pad.x * 2 : sprite.w), I16(followCam.fill == 'Y' || followCam.fill == 'XY' ? update.cam.wh.y - pad.y * 2 : sprite.h));
    I16Box.moveTo(sprite.bounds, computeX(sprite, update.cam, followCam), computeY(sprite, update.cam, followCam));
}
function computeX(sprite, cam, component) {
    const camW = cam.wh.x;
    const spriteW = Math.abs(sprite.w);
    const padW = component.pad?.x ?? 0;
    let x = cam.xy.x;
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
    const camH = cam.wh.y;
    const spriteH = Math.abs(sprite.h);
    const padH = component.pad?.y ?? 0;
    let y = cam.xy.y;
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
    updateEnt: updateEnt2
});
function updateEnt2(set, update) {
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
(function(Button1) {
    Button1.values = Immutable(new Set([
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
    function fromBits(bits) {
        return [
            ...Button.values
        ].filter((button)=>(bits & Button.Bit[button]) == Button.Bit[button]);
    }
    Button1.fromBits = fromBits;
    function toBits(...buttons) {
        return buttons.reduce((sum, button)=>sum | Button.Bit[button], 0n);
    }
    Button1.toBits = toBits;
    var Bit = Button1.Bit = Immutable({
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
    Button1.InvertBit = Immutable({
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
    updateEnt: updateEnt3
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
    constructor(cam){
        this.#buttons = 0n;
        this.#cam = cam;
    }
    postupdate() {
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
            this.#xy = Viewport.toLevelXY(clientXY, this.#cam.clientViewportWH, I16Box(this.#cam.xy.x, this.#cam.xy.y, this.#cam.wh.x, this.#cam.wh.y));
        }
        const active = ev.type == 'contextmenu' || ev.type == 'pointerdown';
        if (active) ev.preventDefault();
    };
}
class InputPoller {
    #gamepad = new GamepadPoller();
    #keyboard = new KeyboardPoller();
    #pointer;
    constructor(cam){
        this.#pointer = new PointerPoller(cam);
    }
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
    postupdate() {
        this.#pointer.postupdate();
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
    #poller;
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
    constructor(cam, minHeld = 300, maxInterval = 300){
        this.#poller = new InputPoller(cam);
        this.#minHeld = minHeld;
        this.#maxInterval = maxInterval;
    }
    isCombo(...combo) {
        if (combo.length != this.#combo.length) return false;
        for (const [i, buttons] of combo.entries()){
            const mask = Button.toBits(...buttons);
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
        const bits = Button.toBits(...buttons);
        return (this.buttons & bits) == bits;
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
        const bits = Button.toBits(...buttons);
        return (this.buttons & bits) != (this.#prevButtons & bits);
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
    postupdate(delta) {
        this.#poller.postupdate();
        this.#duration += delta;
        this.#prevButtons = this.buttons;
    }
    register(op) {
        this.#poller.register(op);
    }
    reset() {
        this.#poller.reset();
    }
    toString() {
        const on = [];
        const start = [];
        for (const button of Button.values){
            if (this.isOn(button)) on.push(button);
            if (this.isStart(button)) start.push(button);
        }
        const combo = [];
        for (const buttons of this.#combo)combo.push(Button.fromBits(buttons));
        const last = combo.at(-1);
        const comboStart = last == null ? false : this.isOnStart(...last);
        return [
            `on: ${on.join(', ')}`,
            `start: ${start.join(', ')}`,
            `held: ${this.isHeld()}`,
            `combo: ${combo.map((buttons)=>buttons.join('+')).join(', ')}`,
            `combo start: ${comboStart}`
        ].join('\n');
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
    render(time, cam, instanceBuffer) {
        Renderer.render(this.#renderer, time, cam, instanceBuffer);
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
function updateEnt3(set, update) {
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
    update.rendererStateMachine.render(update.time, update.cam, update.instanceBuffer);
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
            case 'cam':
                return parseCam(val);
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
    function parseCam(json) {
        return {
            xy: I16XY(json.xy?.x ?? 0, json.xy?.y ?? 0),
            wh: I16XY(1, 1),
            clientViewportWH: NumberXY(1, 1),
            nativeViewportWH: U16XY(1, 1),
            minViewport: U16XY(json.minViewport.x ?? 1, json.minViewport?.y ?? 1),
            scale: I16(1)
        };
    }
    LevelParser.parseCam = parseCam;
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
    function render(self, _time, cam, instanceBuffer) {
        resize(self, cam);
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
        const perInstanceBuffer = self.perInstanceBuffer;
        GL.bufferData(self.gl, perInstanceBuffer, instanceBuffer.buffer, self.gl.DYNAMIC_READ);
        self.gl.drawArraysInstanced(self.gl.TRIANGLE_STRIP, 0, uvLen, instanceBuffer.size);
    }
    Renderer.render = render;
    function resize(self, cam) {
        const nativeCanvasWH = Viewport.nativeCanvasWH(cam.wh, cam.scale);
        if (self.gl.canvas.width != nativeCanvasWH.x || self.gl.canvas.height != nativeCanvasWH.y) {
            self.gl.canvas.width = nativeCanvasWH.x;
            self.gl.canvas.height = nativeCanvasWH.y;
            self.gl.viewport(0, 0, nativeCanvasWH.x, nativeCanvasWH.y);
            console.debug(`Canvas resized to ${nativeCanvasWH.x}×${nativeCanvasWH.y} native pixels with ${cam.wh.x}×${cam.wh.y} cam (level pixels) at a ${cam.scale}x scale.`);
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
            w: 2 / cam.wh.x,
            h: 2 / cam.wh.y
        };
        return [
            w,
            0,
            0,
            -1 - cam.xy.x * w,
            0,
            -h,
            0,
            1 + cam.xy.y * h,
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
const __default6 = JSON.parse("[\n  {\n    \"//\": \"y = 2 (border) + 71 (offset) + 8 * 7 (initial stack with a king on top) + 11 * 7 (Q-2) + (A) 32 - (dont care) 24 = 214\",\n    \"name\": \"cam\",\n    \"cam\": { \"minViewport\": { \"x\": 256, \"y\": 214 } }\n  },\n\n  {\n    \"name\": \"cursor\",\n    \"cursor\": { \"pick\": \"CursorPick\", \"point\": \"CursorPoint\" },\n    \"followPoint\": {},\n    \"sprite\": { \"id\": \"CursorPoint\", \"layer\": \"Cursor\" }\n  },\n\n  {\n    \"name\": \"background border\",\n    \"followCam\": { \"fill\": \"XY\", \"orientation\": \"Northwest\" },\n    \"sprite\": {\n      \"id\": \"PaletteDark\",\n      \"layer\": \"Background\",\n      \"layerByHeight\": true\n    }\n  },\n  {\n    \"name\": \"background corner NW\",\n    \"followCam\": { \"orientation\": \"Northwest\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\" }\n  },\n  {\n    \"name\": \"background corner NE\",\n    \"followCam\": { \"orientation\": \"Northeast\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"X\" }\n  },\n  {\n    \"name\": \"background corner SE\",\n    \"followCam\": { \"orientation\": \"Southeast\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"XY\" }\n  },\n  {\n    \"name\": \"background corner SW\",\n    \"followCam\": { \"orientation\": \"Southwest\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"Y\" }\n  },\n\n  {\n    \"name\": \"background\",\n    \"followCam\": {\n      \"fill\": \"XY\",\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 1, \"y\": 1 }\n    },\n    \"sprite\": {\n      \"id\": \"Grid\",\n      \"layer\": \"Background\",\n      \"layerByHeight\": true,\n      \"wrap\": { \"x\": -1, \"y\": -1 }\n    }\n  },\n\n  {\n    \"name\": \"stock background\",\n    \"sprite\": {\n      \"id\": \"PaletteLight\",\n      \"layer\": \"Background\",\n      \"xy\": { \"x\": 169, \"y\": 9 },\n      \"wh\": { \"x\": 39, \"y\": 47 }\n    }\n  },\n\n  {\n    \"pile\": { \"type\": \"Waste\" },\n    \"sprite\": {\n      \"id\": \"PaletteLight\",\n      \"layer\": \"Background\",\n      \"xy\": { \"x\": 201, \"y\": 9 }\n    }\n  },\n\n  {\n    \"name\": \"waste vacancy\",\n    \"sprite\": {\n      \"id\": \"CardVacantPile\",\n      \"layer\": \"Vacancy\",\n      \"xy\": { \"x\": 208, \"y\": 16 }\n    }\n  },\n\n  {\n    \"name\": \"Patience the Demon\",\n    \"followCam\": {\n      \"modulo\": { \"x\": 8, \"y\": 8 },\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 16, \"y\": 16 }\n    },\n    \"patienceTheDemon\": {},\n    \"sprite\": { \"id\": \"PatienceTheDemonGood\", \"layer\": \"Patience\" }\n  }\n]");
const __default7 = JSON.parse("{\n  \"version\": \"1.3-beta21-x64\",\n  \"filename\": \"atlas.png\",\n  \"format\": \"I8\",\n  \"wh\": {\n    \"x\": 216,\n    \"y\": 256\n  },\n  \"filmByID\": {\n    \"Checkerboard\": {\n      \"id\": \"Checkerboard\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 0,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 112,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Grid\": {\n      \"id\": \"Grid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 1,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 160,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Corner\": {\n      \"id\": \"Corner\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 2,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 128,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCA\": {\n      \"id\": \"CardCA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 3,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC2\": {\n      \"id\": \"CardC2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 4,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC3\": {\n      \"id\": \"CardC3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 5,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC4\": {\n      \"id\": \"CardC4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 6,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC5\": {\n      \"id\": \"CardC5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 7,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC6\": {\n      \"id\": \"CardC6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 8,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC7\": {\n      \"id\": \"CardC7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 9,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC8\": {\n      \"id\": \"CardC8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 10,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC9\": {\n      \"id\": \"CardC9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 11,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC10\": {\n      \"id\": \"CardC10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 12,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCJ\": {\n      \"id\": \"CardCJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 13,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCQ\": {\n      \"id\": \"CardCQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 14,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 128\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 160\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCK\": {\n      \"id\": \"CardCK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 15,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDA\": {\n      \"id\": \"CardDA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 16,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD2\": {\n      \"id\": \"CardD2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 17,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD3\": {\n      \"id\": \"CardD3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 18,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD4\": {\n      \"id\": \"CardD4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 19,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD5\": {\n      \"id\": \"CardD5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 20,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD6\": {\n      \"id\": \"CardD6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 21,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD7\": {\n      \"id\": \"CardD7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 22,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD8\": {\n      \"id\": \"CardD8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 23,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD9\": {\n      \"id\": \"CardD9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 24,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 224\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD10\": {\n      \"id\": \"CardD10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 25,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDJ\": {\n      \"id\": \"CardDJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 26,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDQ\": {\n      \"id\": \"CardDQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 27,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDK\": {\n      \"id\": \"CardDK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 28,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHA\": {\n      \"id\": \"CardHA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 29,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH2\": {\n      \"id\": \"CardH2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 30,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 160\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 192\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH3\": {\n      \"id\": \"CardH3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 31,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH4\": {\n      \"id\": \"CardH4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 32,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH5\": {\n      \"id\": \"CardH5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 33,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH6\": {\n      \"id\": \"CardH6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 34,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH7\": {\n      \"id\": \"CardH7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 35,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH8\": {\n      \"id\": \"CardH8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 36,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH9\": {\n      \"id\": \"CardH9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 37,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH10\": {\n      \"id\": \"CardH10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 38,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHJ\": {\n      \"id\": \"CardHJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 39,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHQ\": {\n      \"id\": \"CardHQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 40,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHK\": {\n      \"id\": \"CardHK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 41,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSA\": {\n      \"id\": \"CardSA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 42,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS2\": {\n      \"id\": \"CardS2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 43,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS3\": {\n      \"id\": \"CardS3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 44,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS4\": {\n      \"id\": \"CardS4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 45,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS5\": {\n      \"id\": \"CardS5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 46,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS6\": {\n      \"id\": \"CardS6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 47,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS7\": {\n      \"id\": \"CardS7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 48,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 32\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS8\": {\n      \"id\": \"CardS8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 49,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 32\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 64\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS9\": {\n      \"id\": \"CardS9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 50,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS10\": {\n      \"id\": \"CardS10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 51,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSJ\": {\n      \"id\": \"CardSJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 52,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSQ\": {\n      \"id\": \"CardSQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 53,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSK\": {\n      \"id\": \"CardSK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 54,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDown\": {\n      \"id\": \"CardDown\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 55,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantPile\": {\n      \"id\": \"CardVacantPile\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 56,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantStock\": {\n      \"id\": \"CardVacantStock\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 57,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantClubs\": {\n      \"id\": \"CardVacantClubs\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 58,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 64\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 96\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantDiamonds\": {\n      \"id\": \"CardVacantDiamonds\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 59,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 24,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantHearts\": {\n      \"id\": \"CardVacantHearts\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 60,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 24,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantSpades\": {\n      \"id\": \"CardVacantSpades\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 61,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 72,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardOutlineFocus\": {\n      \"id\": \"CardOutlineFocus\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 62,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 72,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardOutlineChecked\": {\n      \"id\": \"CardOutlineChecked\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 63,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 96\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 128\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CursorPoint\": {\n      \"id\": \"CursorPoint\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 64,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 16,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 3,\n              \"y\": 3\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 3,\n                \"y\": 3\n              }\n            }\n          ]\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CursorPick\": {\n      \"id\": \"CursorPick\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 65,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 16,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 32,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 3,\n              \"y\": 3\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 3,\n                \"y\": 3\n              }\n            }\n          ]\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-00\": {\n      \"id\": \"MemProp5x6-00\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 66,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-01\": {\n      \"id\": \"MemProp5x6-01\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 67,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-02\": {\n      \"id\": \"MemProp5x6-02\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 68,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-03\": {\n      \"id\": \"MemProp5x6-03\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-04\": {\n      \"id\": \"MemProp5x6-04\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-05\": {\n      \"id\": \"MemProp5x6-05\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-06\": {\n      \"id\": \"MemProp5x6-06\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-07\": {\n      \"id\": \"MemProp5x6-07\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 73,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-08\": {\n      \"id\": \"MemProp5x6-08\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 74,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-09\": {\n      \"id\": \"MemProp5x6-09\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 75,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0a\": {\n      \"id\": \"MemProp5x6-0a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 76,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0b\": {\n      \"id\": \"MemProp5x6-0b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 77,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0c\": {\n      \"id\": \"MemProp5x6-0c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 78,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0d\": {\n      \"id\": \"MemProp5x6-0d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 79,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0e\": {\n      \"id\": \"MemProp5x6-0e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 80,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-0f\": {\n      \"id\": \"MemProp5x6-0f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 81,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-10\": {\n      \"id\": \"MemProp5x6-10\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 82,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-11\": {\n      \"id\": \"MemProp5x6-11\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 83,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-12\": {\n      \"id\": \"MemProp5x6-12\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 84,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-13\": {\n      \"id\": \"MemProp5x6-13\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 85,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-14\": {\n      \"id\": \"MemProp5x6-14\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 86,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-15\": {\n      \"id\": \"MemProp5x6-15\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 87,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-16\": {\n      \"id\": \"MemProp5x6-16\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 88,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-17\": {\n      \"id\": \"MemProp5x6-17\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 89,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-18\": {\n      \"id\": \"MemProp5x6-18\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 90,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-19\": {\n      \"id\": \"MemProp5x6-19\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 91,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1a\": {\n      \"id\": \"MemProp5x6-1a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 92,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1b\": {\n      \"id\": \"MemProp5x6-1b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 93,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1c\": {\n      \"id\": \"MemProp5x6-1c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 94,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1d\": {\n      \"id\": \"MemProp5x6-1d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 95,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1e\": {\n      \"id\": \"MemProp5x6-1e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 96,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-1f\": {\n      \"id\": \"MemProp5x6-1f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 97,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-20\": {\n      \"id\": \"MemProp5x6-20\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 98,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-21\": {\n      \"id\": \"MemProp5x6-21\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 99,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 50,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 55,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-22\": {\n      \"id\": \"MemProp5x6-22\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 100,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 55,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 60,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-23\": {\n      \"id\": \"MemProp5x6-23\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 101,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 60,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 65,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-24\": {\n      \"id\": \"MemProp5x6-24\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 102,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 65,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 70,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-25\": {\n      \"id\": \"MemProp5x6-25\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 103,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 70,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 75,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-26\": {\n      \"id\": \"MemProp5x6-26\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 104,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 75,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 80,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-27\": {\n      \"id\": \"MemProp5x6-27\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 105,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 80,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 85,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-28\": {\n      \"id\": \"MemProp5x6-28\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 106,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 85,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 90,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-29\": {\n      \"id\": \"MemProp5x6-29\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 107,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 90,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 95,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2a\": {\n      \"id\": \"MemProp5x6-2a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 108,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 95,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 100,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2b\": {\n      \"id\": \"MemProp5x6-2b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 109,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 40,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 45,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2c\": {\n      \"id\": \"MemProp5x6-2c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 110,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 105,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 110,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2d\": {\n      \"id\": \"MemProp5x6-2d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 111,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 110,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 115,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2e\": {\n      \"id\": \"MemProp5x6-2e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 112,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 115,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-2f\": {\n      \"id\": \"MemProp5x6-2f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 113,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 125,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-30\": {\n      \"id\": \"MemProp5x6-30\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 114,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 173,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-31\": {\n      \"id\": \"MemProp5x6-31\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 115,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 165,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 170,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-32\": {\n      \"id\": \"MemProp5x6-32\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 116,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 60,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 65,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-33\": {\n      \"id\": \"MemProp5x6-33\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 117,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 55,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 60,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-34\": {\n      \"id\": \"MemProp5x6-34\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 118,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 50,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 55,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-35\": {\n      \"id\": \"MemProp5x6-35\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 119,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-36\": {\n      \"id\": \"MemProp5x6-36\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 120,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 40,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 45,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-37\": {\n      \"id\": \"MemProp5x6-37\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 121,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 35,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 40,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-38\": {\n      \"id\": \"MemProp5x6-38\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 122,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 30,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 35,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-39\": {\n      \"id\": \"MemProp5x6-39\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 123,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 25,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 30,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3a\": {\n      \"id\": \"MemProp5x6-3a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 124,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 20,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 25,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3b\": {\n      \"id\": \"MemProp5x6-3b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 125,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 15,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 20,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3c\": {\n      \"id\": \"MemProp5x6-3c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 126,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 10,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 15,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3d\": {\n      \"id\": \"MemProp5x6-3d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 127,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 198,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 203,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3e\": {\n      \"id\": \"MemProp5x6-3e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 128,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 5,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-3f\": {\n      \"id\": \"MemProp5x6-3f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 129,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 160,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 165,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-40\": {\n      \"id\": \"MemProp5x6-40\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 130,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 155,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 160,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-41\": {\n      \"id\": \"MemProp5x6-41\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 131,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 150,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 155,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-42\": {\n      \"id\": \"MemProp5x6-42\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 132,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 145,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 150,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-43\": {\n      \"id\": \"MemProp5x6-43\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 133,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 140,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 145,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-44\": {\n      \"id\": \"MemProp5x6-44\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 134,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 135,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 140,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-45\": {\n      \"id\": \"MemProp5x6-45\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 135,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 130,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 135,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-46\": {\n      \"id\": \"MemProp5x6-46\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 136,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 125,\n              \"y\": 244\n            },\n            \"end\": {\n              \"x\": 130,\n              \"y\": 250\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-47\": {\n      \"id\": \"MemProp5x6-47\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 137,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 208,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 213,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-48\": {\n      \"id\": \"MemProp5x6-48\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 138,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 203,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 208,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-49\": {\n      \"id\": \"MemProp5x6-49\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 139,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 5,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 10,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4a\": {\n      \"id\": \"MemProp5x6-4a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 140,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 130,\n              \"y\": 250\n            },\n            \"end\": {\n              \"x\": 135,\n              \"y\": 256\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4b\": {\n      \"id\": \"MemProp5x6-4b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 141,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 125,\n              \"y\": 250\n            },\n            \"end\": {\n              \"x\": 130,\n              \"y\": 256\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4c\": {\n      \"id\": \"MemProp5x6-4c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 142,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 210,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 215,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4d\": {\n      \"id\": \"MemProp5x6-4d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 143,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 205,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 210,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4e\": {\n      \"id\": \"MemProp5x6-4e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 144,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 200,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 205,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-4f\": {\n      \"id\": \"MemProp5x6-4f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 145,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 195,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 200,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-50\": {\n      \"id\": \"MemProp5x6-50\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 146,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 190,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 195,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-51\": {\n      \"id\": \"MemProp5x6-51\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 147,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 185,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 190,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-52\": {\n      \"id\": \"MemProp5x6-52\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 148,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 180,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 185,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-53\": {\n      \"id\": \"MemProp5x6-53\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 149,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 175,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 180,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-54\": {\n      \"id\": \"MemProp5x6-54\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 150,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 170,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 175,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-55\": {\n      \"id\": \"MemProp5x6-55\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 151,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 65,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 70,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-56\": {\n      \"id\": \"MemProp5x6-56\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 152,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 120,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 125,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-57\": {\n      \"id\": \"MemProp5x6-57\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 153,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 115,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 120,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-58\": {\n      \"id\": \"MemProp5x6-58\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 154,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 110,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 115,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-59\": {\n      \"id\": \"MemProp5x6-59\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 155,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 105,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 110,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5a\": {\n      \"id\": \"MemProp5x6-5a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 156,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 100,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 105,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5b\": {\n      \"id\": \"MemProp5x6-5b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 157,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 95,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 100,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5c\": {\n      \"id\": \"MemProp5x6-5c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 158,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 90,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 95,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5d\": {\n      \"id\": \"MemProp5x6-5d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 159,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 85,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 90,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5e\": {\n      \"id\": \"MemProp5x6-5e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 160,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 80,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 85,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-5f\": {\n      \"id\": \"MemProp5x6-5f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 161,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 75,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 80,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-60\": {\n      \"id\": \"MemProp5x6-60\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 162,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 70,\n              \"y\": 246\n            },\n            \"end\": {\n              \"x\": 75,\n              \"y\": 252\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-61\": {\n      \"id\": \"MemProp5x6-61\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 163,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 35,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 40,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-62\": {\n      \"id\": \"MemProp5x6-62\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 164,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 133,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 138,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-63\": {\n      \"id\": \"MemProp5x6-63\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 165,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 30,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 35,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-64\": {\n      \"id\": \"MemProp5x6-64\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 166,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 25,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 30,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-65\": {\n      \"id\": \"MemProp5x6-65\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 167,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 20,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 25,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-66\": {\n      \"id\": \"MemProp5x6-66\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 168,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 15,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 20,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-67\": {\n      \"id\": \"MemProp5x6-67\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 169,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 10,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 15,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-68\": {\n      \"id\": \"MemProp5x6-68\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 170,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 5,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 10,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-69\": {\n      \"id\": \"MemProp5x6-69\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 171,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 5,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6a\": {\n      \"id\": \"MemProp5x6-6a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 172,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 163,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6b\": {\n      \"id\": \"MemProp5x6-6b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 173,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 158,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 163,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6c\": {\n      \"id\": \"MemProp5x6-6c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 174,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 153,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 158,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6d\": {\n      \"id\": \"MemProp5x6-6d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 175,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 148,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 153,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6e\": {\n      \"id\": \"MemProp5x6-6e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 176,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 143,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 148,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-6f\": {\n      \"id\": \"MemProp5x6-6f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 177,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 138,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 143,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-70\": {\n      \"id\": \"MemProp5x6-70\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 178,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 133,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 138,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-71\": {\n      \"id\": \"MemProp5x6-71\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 179,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 128,\n              \"y\": 238\n            },\n            \"end\": {\n              \"x\": 133,\n              \"y\": 244\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-72\": {\n      \"id\": \"MemProp5x6-72\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 180,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 163,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 168,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-73\": {\n      \"id\": \"MemProp5x6-73\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 181,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 158,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 163,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-74\": {\n      \"id\": \"MemProp5x6-74\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 182,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 153,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 158,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-75\": {\n      \"id\": \"MemProp5x6-75\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 183,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 148,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 153,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-76\": {\n      \"id\": \"MemProp5x6-76\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 184,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 143,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 148,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-77\": {\n      \"id\": \"MemProp5x6-77\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 185,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 138,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 143,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-78\": {\n      \"id\": \"MemProp5x6-78\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 186,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 128,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 133,\n              \"y\": 238\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-79\": {\n      \"id\": \"MemProp5x6-79\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 187,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 100,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 105,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7a\": {\n      \"id\": \"MemProp5x6-7a\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 188,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 193,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 198,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7b\": {\n      \"id\": \"MemProp5x6-7b\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 189,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 188,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 193,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7c\": {\n      \"id\": \"MemProp5x6-7c\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 190,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 183,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 188,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7d\": {\n      \"id\": \"MemProp5x6-7d\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 191,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 178,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 183,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7e\": {\n      \"id\": \"MemProp5x6-7e\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 192,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 173,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 178,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"MemProp5x6-7f\": {\n      \"id\": \"MemProp5x6-7f\",\n      \"wh\": {\n        \"x\": 5,\n        \"y\": 6\n      },\n      \"cels\": [\n        {\n          \"id\": 193,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 45,\n              \"y\": 240\n            },\n            \"end\": {\n              \"x\": 50,\n              \"y\": 246\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteAlpha\": {\n      \"id\": \"PaletteAlpha\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 194,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 104,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 112,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteDark\": {\n      \"id\": \"PaletteDark\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 195,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 104,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteMid\": {\n      \"id\": \"PaletteMid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 196,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 88,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteLight\": {\n      \"id\": \"PaletteLight\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 197,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 80,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 88,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PatienceTheDemonGood\": {\n      \"id\": \"PatienceTheDemonGood\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 198,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 199,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 216\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 240\n            }\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        }\n      ],\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\"\n    },\n    \"PatienceTheDemonEvil\": {\n      \"id\": \"PatienceTheDemonEvil\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 200,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 192,\n              \"y\": 192\n            },\n            \"end\": {\n              \"x\": 216,\n              \"y\": 216\n            }\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 201,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 168,\n              \"y\": 216\n            },\n            \"end\": {\n              \"x\": 192,\n              \"y\": 240\n            }\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 0,\n              \"y\": 0\n            },\n            \"end\": {\n              \"x\": 7,\n              \"y\": 10\n            }\n          },\n          \"slices\": [\n            {\n              \"start\": {\n                \"x\": 0,\n                \"y\": 0\n              },\n              \"end\": {\n                \"x\": 7,\n                \"y\": 10\n              }\n            }\n          ]\n        }\n      ],\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\"\n    },\n    \"Tally0\": {\n      \"id\": \"Tally0\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 202,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 64,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally1\": {\n      \"id\": \"Tally1\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 203,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 64,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 80,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally2\": {\n      \"id\": \"Tally2\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 204,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 80,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 96,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally3\": {\n      \"id\": \"Tally3\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 205,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 96,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 112,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally4\": {\n      \"id\": \"Tally4\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 206,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 112,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 128,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally5\": {\n      \"id\": \"Tally5\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 207,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 128,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 144,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally6\": {\n      \"id\": \"Tally6\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 208,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 144,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 160,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally7\": {\n      \"id\": \"Tally7\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 209,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 32,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally8\": {\n      \"id\": \"Tally8\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 210,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 48,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 64,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally9\": {\n      \"id\": \"Tally9\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 211,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 64,\n              \"y\": 232\n            },\n            \"end\": {\n              \"x\": 80,\n              \"y\": 240\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally10\": {\n      \"id\": \"Tally10\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 212,\n          \"bounds\": {\n            \"start\": {\n              \"x\": 32,\n              \"y\": 224\n            },\n            \"end\": {\n              \"x\": 48,\n              \"y\": 232\n            }\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"start\": {\n              \"x\": 1,\n              \"y\": 1\n            },\n            \"end\": {\n              \"x\": 0,\n              \"y\": 0\n            }\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    }\n  },\n  \"celBoundsByID\": [\n    {\n      \"start\": {\n        \"x\": 112,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 160,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 128,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 128\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 160\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 224\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 160\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 192\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 0\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 32\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 32\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 64\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 64\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 96\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 24,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 24,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 72,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 72,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 96\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 128\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 16,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 16,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 32,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 50,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 55,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 55,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 60,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 60,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 65,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 65,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 70,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 70,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 75,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 75,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 80,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 80,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 85,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 85,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 90,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 90,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 95,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 95,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 100,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 40,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 45,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 105,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 110,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 110,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 115,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 115,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 125,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 173,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 165,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 170,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 60,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 65,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 55,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 60,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 50,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 55,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 40,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 45,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 35,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 40,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 30,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 35,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 25,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 30,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 20,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 25,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 15,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 20,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 10,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 15,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 198,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 203,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 5,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 160,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 165,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 155,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 160,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 150,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 155,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 145,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 150,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 140,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 145,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 135,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 140,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 130,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 135,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 125,\n        \"y\": 244\n      },\n      \"end\": {\n        \"x\": 130,\n        \"y\": 250\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 208,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 213,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 203,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 208,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 5,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 10,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 130,\n        \"y\": 250\n      },\n      \"end\": {\n        \"x\": 135,\n        \"y\": 256\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 125,\n        \"y\": 250\n      },\n      \"end\": {\n        \"x\": 130,\n        \"y\": 256\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 210,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 215,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 205,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 210,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 200,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 205,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 195,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 200,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 190,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 195,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 185,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 190,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 180,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 185,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 175,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 180,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 170,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 175,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 65,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 70,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 120,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 125,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 115,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 120,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 110,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 115,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 105,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 110,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 100,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 105,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 95,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 100,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 90,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 95,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 85,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 90,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 80,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 85,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 75,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 80,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 70,\n        \"y\": 246\n      },\n      \"end\": {\n        \"x\": 75,\n        \"y\": 252\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 35,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 40,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 133,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 138,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 30,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 35,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 25,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 30,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 20,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 25,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 15,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 20,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 10,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 15,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 5,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 10,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 0,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 5,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 163,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 158,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 163,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 153,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 158,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 148,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 153,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 143,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 148,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 138,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 143,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 133,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 138,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 128,\n        \"y\": 238\n      },\n      \"end\": {\n        \"x\": 133,\n        \"y\": 244\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 163,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 168,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 158,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 163,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 153,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 158,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 148,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 153,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 143,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 148,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 138,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 143,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 128,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 133,\n        \"y\": 238\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 100,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 105,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 193,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 198,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 188,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 193,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 183,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 188,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 178,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 183,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 173,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 178,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 45,\n        \"y\": 240\n      },\n      \"end\": {\n        \"x\": 50,\n        \"y\": 246\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 104,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 112,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 104,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 88,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 80,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 88,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 216\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 216\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 192,\n        \"y\": 192\n      },\n      \"end\": {\n        \"x\": 216,\n        \"y\": 216\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 168,\n        \"y\": 216\n      },\n      \"end\": {\n        \"x\": 192,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 64,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 64,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 80,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 80,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 96,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 96,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 112,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 112,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 128,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 128,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 144,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 144,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 160,\n        \"y\": 232\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 32,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 48,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 64,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 64,\n        \"y\": 232\n      },\n      \"end\": {\n        \"x\": 80,\n        \"y\": 240\n      }\n    },\n    {\n      \"start\": {\n        \"x\": 32,\n        \"y\": 224\n      },\n      \"end\": {\n        \"x\": 48,\n        \"y\": 232\n      }\n    }\n  ]\n}");
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
var SPFilmID;
(function(SPFilmID) {
    SPFilmID.values = Immutable(new Set([
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
})(SPFilmID || (SPFilmID = {}));
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
var SPLevelParser;
(function(SPLevelParser) {
    function parse(factory, json) {
        return json.map((setJSON)=>parseComponentSet(factory, setJSON));
    }
    SPLevelParser.parse = parse;
})(SPLevelParser || (SPLevelParser = {}));
function parseComponentSet(factory, json) {
    const set = {};
    for (const [key, val] of Object.entries(json)){
        const component = LevelParser.parseComponent(factory, key, val);
        if (component != null) {
            set[key] = component;
            continue;
        }
        switch(key){
            case 'pile':
                assert(json.pile?.type == 'Waste', `Unsupported pile type "${json.pile?.type}".`);
                set[key] = {
                    type: 'Waste'
                };
                break;
            case 'patienceTheDemon':
                set[key] = {};
                break;
            case '//':
            case 'name':
                break;
            default:
                throw Error(`Unsupported level config type "${key}".`);
        }
    }
    return set;
}
const SPLayer = Immutable({
    ...Layer,
    Picked: U8(0x02),
    CardUp: U8(0x03),
    CardDown: U8(0x04),
    Patience: U8(0x05),
    Vacancy: U8(0x06),
    Background: U8(0x07)
});
Immutable(Inverse(SPLayer));
function SaveData(wins) {
    return {
        wins
    };
}
const boardX = 2 * 8;
const hiddenY = -1024;
function setSpritePositionsForLayout(ecs, filmByID, solitaire, time) {
    for (const [indexX, column] of solitaire.tableau.entries()){
        for (const [indexY, card] of column.entries()){
            const components = ecs.componentsByRef.get(card);
            const xy = getTableauCardXY(filmByID, indexX, indexY);
            components.sprite.moveTo(xy);
            components.sprite.layer = SPLayer[card.direction == 'Up' ? 'CardUp' : 'CardDown'];
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
            components1.sprite.layer = SPLayer[animID == 'CardDown' ? 'CardDown' : 'CardUp'];
        }
    }
    for (const [index1, card2] of solitaire.stock.entries()){
        const components2 = ecs.componentsByRef.get(card2);
        components2.sprite.moveTo(getStockXY(solitaire, index1));
        components2.sprite.layer = SPLayer[card2.direction == 'Up' ? 'CardUp' : 'CardDown'];
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
        components3.sprite.layer = SPLayer[animID1 == 'CardDown' ? 'CardDown' : 'CardUp'];
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
                if (bestMatch != null && update.solitaire.selected != null && bestMatch.pile.pile.type != 'Waste') {
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
            sprite.layer = SPLayer.Picked;
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
                if (pile.pile.type == 'Waste' || !Solitaire.isBuildable(update.solitaire, pile.pile)) continue;
                if (bestMatch == null || I16Box.area(intersection) > I16Box.area(bestMatch.intersection)) bestMatch = {
                    intersection,
                    pile
                };
            }
        }
        return bestMatch;
    }
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
        const xy = pile.type == 'Waste' ? I16XY.add(I16XY(sprite.bounds.start), 8 - 1, 8 - 1) : pile.type == 'Tableau' ? getTableauCardXY(update.filmByID, pile.x, Uint(0)) : getFoundationCardXY(update.filmByID, pile.suit);
        I16Box.moveTo(sprite.bounds, xy.x - 8 + 1, xy.y - 8 + 1);
        I16Box.sizeTo(sprite.bounds, cardWH.x + 8 * 2 - 1, cardWH.y + (pile.type == 'Waste' ? (update.solitaire.waste.length > 0 ? update.solitaire.drawSize - 1 : 0) * 8 : pile.type == 'Tableau' ? Math.max(0, update.solitaire.tableau[pile.x].length - 1) * 8 : 0) + 8 * 2 - 1);
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
        ...SPLevelParser.parse(factory, __default6)
    ];
}
class SpriteFactory {
    #filmByID;
    layerByID = SPLayer;
    get filmByID() {
        return this.#filmByID;
    }
    constructor(filmByID){
        this.#filmByID = filmByID;
    }
    new(filmID, layer, props) {
        return new Sprite(this.#filmByID[filmID], SPLayer[layer], props);
    }
}
function SuperPatience(window1, assets) {
    const canvas = window1.document.getElementsByTagName('canvas').item(0);
    assertNonNull(canvas, 'Canvas missing.');
    const random = Random(I32.mod(Date.now()));
    const saveStorage = SaveStorage.load(localStorage);
    const solitaire = Solitaire(undefined, ()=>Random.fraction(random));
    solitaire.wins = saveStorage.save.wins;
    const newRenderer = ()=>Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta);
    const cardSystem = new CardSystem();
    const ecs = ECS(new Set([
        CamSystem,
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
    const cam = NonNull(ECS.query(ecs, 'cam')[0], 'Missing cam entity.').cam;
    const self = {
        assets,
        cam,
        canvas,
        random,
        instanceBuffer: InstanceBuffer(assets.shaderLayout),
        solitaire,
        ecs,
        input: new Input(cam),
        rendererStateMachine: new RendererStateMachine({
            window: window1,
            canvas,
            onFrame: (delta)=>SuperPatience.onFrame(self, delta),
            onPause: ()=>{
                self.input.reset();
            },
            newRenderer
        }),
        tick,
        ticks: 0,
        delta: 0,
        get age () {
            return this.tick * this.ticks;
        },
        saveStorage,
        cursor: ECS.query(ecs, 'cursor', 'sprite')[0].sprite
    };
    return self;
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
function nextFilm(update, sprite) {
    const good = sprite.film.id == 'PatienceTheDemonGood';
    const id = `PatienceTheDemon${good ? 'Evil' : 'Good'}`;
    return update.filmByID[id];
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
            sprite: factory.new('PaletteLight', 'Background', {
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
            sprite: factory.new('PaletteLight', 'Background', {
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
                pad: I16XY(0, 8 + i * 8)
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
(function(SuperPatience1) {
    async function make(window1) {
        const assets = await Assets.load();
        return SuperPatience(window1, assets);
    }
    SuperPatience1.make = make;
    function start(self) {
        self.input.register('add');
        self.rendererStateMachine.start();
    }
    SuperPatience1.start = start;
    function stop(self) {
        self.input.register('remove');
        self.rendererStateMachine.stop();
    }
    SuperPatience1.stop = stop;
    function onFrame(self, delta) {
        self.delta += delta;
        while(self.delta >= self.tick){
            self.delta -= self.tick;
            const update = {
                filmByID: self.assets.atlasMeta.filmByID,
                cam: self.cam,
                ecs: self.ecs,
                delta,
                input: self.input,
                time: self.age,
                saveStorage: self.saveStorage,
                instanceBuffer: self.instanceBuffer,
                rendererStateMachine: self.rendererStateMachine,
                solitaire: self.solitaire,
                cursor: self.cursor
            };
            self.input.preupdate();
            processDebugInput(self, update);
            ECS.update(self.ecs, update);
            self.input.postupdate(self.tick);
            self.ticks++;
        }
    }
    SuperPatience1.onFrame = onFrame;
})(SuperPatience || (SuperPatience = {}));
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
const __default8 = JSON.parse("{ \"name\": \"super-patience\", \"version\": \"1.0.0\" }");
console.log(`Super Patience v${__default8.version}
   ┌>°┐
by │  │idoid
   └──┘`);
const patience = await SuperPatience.make(window);
SuperPatience.start(patience);
