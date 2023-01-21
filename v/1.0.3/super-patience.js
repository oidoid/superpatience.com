// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function Immutable(val) {
    if (val == null || typeof val != 'object') return val;
    for (const subVal of Object.values(val))Immutable(subVal);
    return Object.freeze(val);
}
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
var NumUtil;
class NumNamespaceImpl {
    #name;
    signedness;
    constructor(name, signedness){
        this.#name = name;
        this.signedness = signedness;
    }
    cast = (num)=>{
        assert(this.is(num), `${num} is not a ${this.#name}.`);
        return num;
    };
}
class IntNumNamespaceImpl extends NumNamespaceImpl {
    min;
    max;
    width;
    static new(name, width, signedness) {
        const base = new IntNumNamespaceImpl(name, width, signedness);
        const constructor = base.cast.bind(base);
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
            return this.cast(NumUtil.wrap(__int, this.min, this.max + 1));
        }
        if (this.width == 53) return this.cast(NumUtil.modUint(__int));
        return this.cast(NumUtil.modInt(__int));
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
        const constructor = base.cast.bind(base);
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
IntNumNamespaceImpl.new('U4', 4, 'Unsigned');
IntNumNamespaceImpl.new('I8', 8, 'Signed');
const U8 = IntNumNamespaceImpl.new('U8', 8, 'Unsigned');
const I16 = IntNumNamespaceImpl.new('I16', 16, 'Signed');
const U16 = IntNumNamespaceImpl.new('U16', 16, 'Unsigned');
const I32 = IntNumNamespaceImpl.new('I32', 32, 'Signed');
const U32 = IntNumNamespaceImpl.new('U32', 32, 'Unsigned');
const Int = IntNumNamespaceImpl.new('Int', 54, 'Signed');
const Uint = IntNumNamespaceImpl.new('Uint', 53, 'Unsigned');
const Num = NumberNumNamespaceImpl.new('Num', 'Signed', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
class BaseNumericalXY {
    #x;
    #y;
    get x() {
        return this.#x;
    }
    set x(x) {
        this.#x = x;
    }
    get y() {
        return this.#y;
    }
    set y(y) {
        this.#y = y;
    }
    constructor(...args){
        const xy = argsToXY(args);
        this.#x = this.coerce('cast', xy.x);
        this.#y = this.coerce('cast', xy.y);
    }
    abs() {
        return this.absCoerce('cast');
    }
    absClamp() {
        return this.absCoerce('clamp');
    }
    absCoerce(coerce) {
        return this.setCoerce(coerce, Math.abs(this.x), Math.abs(this.y));
    }
    add(...args) {
        return this.addCoerce('cast', args);
    }
    addCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, this.x + xy.x, this.y + xy.y);
    }
    get area() {
        return this.coerce('cast', this.areaNum);
    }
    get areaNum() {
        return this.x * this.y;
    }
    get areaClamp() {
        return this.coerce('clamp', this.areaNum);
    }
    copy() {
        return new this.constructor(this.x, this.y);
    }
    div(...args) {
        return this.divCoerce('cast', args);
    }
    divCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, this.x / xy.x, this.y / xy.y);
    }
    eq(...args) {
        const xy = argsToXY(args);
        return this.x == xy.x && this.y == xy.y;
    }
    lerp(...args) {
        return this.lerpCoerce('cast', args);
    }
    get magnitude() {
        return this.coerce('cast', this.magnitudeNum);
    }
    get magnitudeNum() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    get magnitudeClamp() {
        return this.coerce('clamp', this.magnitudeNum);
    }
    max(...args) {
        return this.maxCoerce('cast', args);
    }
    maxCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, Math.max(this.x, xy.x), Math.max(this.y, xy.y));
    }
    min(...args) {
        return this.minCoerce('cast', args);
    }
    minCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, Math.min(this.x, xy.x), Math.min(this.y, xy.y));
    }
    mul(...args) {
        return this.mulCoerce('cast', args);
    }
    mulCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, this.x * xy.x, this.y * xy.y);
    }
    set(...args) {
        return this.setCoerce('cast', ...args);
    }
    setCoerce(coerce, ...args) {
        const xy = argsToXY(args);
        this.#x = this.coerce(coerce, xy.x);
        this.#y = this.coerce(coerce, xy.y);
        return this;
    }
    sub(...args) {
        return this.subCoerce('cast', args);
    }
    subCoerce(coerce, args) {
        const xy = argsToXY(args);
        return this.setCoerce(coerce, this.x - xy.x, this.y - xy.y);
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
    toNumXY() {
        return new NumXY(this.x, this.y);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
class BaseIntegralXY extends BaseNumericalXY {
    static cast(...args) {
        return new this(...args);
    }
    static ceil(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('ceil', xy.x), this.coerce('ceil', xy.y));
    }
    static floor(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('floor', xy.x), this.coerce('floor', xy.y));
    }
    static mod(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('mod', xy.x), this.coerce('mod', xy.y));
    }
    static round(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('round', xy.x), this.coerce('round', xy.y));
    }
    static trunc(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('trunc', xy.x), this.coerce('trunc', xy.y));
    }
    static coerce(_coerce, _num) {
        throw Error(`Missing ${this.name}.${this.coerce.name}() subclass implementation.`);
    }
    addCeil(...args) {
        return this.addCoerce('ceil', args);
    }
    addFloor(...args) {
        return this.addCoerce('floor', args);
    }
    addMod(...args) {
        return this.addCoerce('mod', args);
    }
    addRound(...args) {
        return this.addCoerce('round', args);
    }
    addTrunc(...args) {
        return this.addCoerce('trunc', args);
    }
    coerce(_coerce, _num) {
        throw Error(`Missing ${this.constructor.name}.${this.coerce.name}() subclass implementation.`);
    }
    divCeil(...args) {
        return this.divCoerce('ceil', args);
    }
    divFloor(...args) {
        return this.divCoerce('floor', args);
    }
    divMod(...args) {
        return this.divCoerce('mod', args);
    }
    divRound(...args) {
        return this.divCoerce('round', args);
    }
    divTrunc(...args) {
        return this.divCoerce('trunc', args);
    }
    lerpCeil(...args) {
        return this.lerpCoerce('ceil', args);
    }
    lerpCoerce(coerce, args) {
        if (args.length == 3) {
            return this.setCoerce(coerce, NumUtil.lerpInt(this.x, args[0], args[2]), NumUtil.lerpInt(this.y, args[1], args[2]));
        }
        return this.setCoerce(coerce, NumUtil.lerpInt(this.x, args[0].x, args[1]), NumUtil.lerpInt(this.y, args[0].y, args[1]));
    }
    lerpFloor(...args) {
        return this.lerpCoerce('floor', args);
    }
    lerpMod(...args) {
        return this.lerpCoerce('mod', args);
    }
    lerpRound(...args) {
        return this.lerpCoerce('round', args);
    }
    lerpTrunc(...args) {
        return this.lerpCoerce('trunc', args);
    }
    maxCeil(...args) {
        return this.maxCoerce('ceil', args);
    }
    maxFloor(...args) {
        return this.maxCoerce('floor', args);
    }
    maxMod(...args) {
        return this.maxCoerce('mod', args);
    }
    maxRound(...args) {
        return this.maxCoerce('round', args);
    }
    maxTrunc(...args) {
        return this.maxCoerce('trunc', args);
    }
    minCeil(...args) {
        return this.minCoerce('ceil', args);
    }
    minFloor(...args) {
        return this.minCoerce('floor', args);
    }
    minMod(...args) {
        return this.minCoerce('mod', args);
    }
    minRound(...args) {
        return this.minCoerce('round', args);
    }
    minTrunc(...args) {
        return this.minCoerce('trunc', args);
    }
    mulCeil(...args) {
        return this.mulCoerce('ceil', args);
    }
    mulFloor(...args) {
        return this.mulCoerce('floor', args);
    }
    mulMod(...args) {
        return this.mulCoerce('mod', args);
    }
    mulRound(...args) {
        return this.mulCoerce('round', args);
    }
    mulTrunc(...args) {
        return this.mulCoerce('trunc', args);
    }
    setCeil(...args) {
        return this.setCoerce('ceil', ...args);
    }
    setFloor(...args) {
        return this.setCoerce('floor', ...args);
    }
    setMod(...args) {
        return this.setCoerce('mod', ...args);
    }
    setRound(...args) {
        return this.setCoerce('round', ...args);
    }
    setTrunc(...args) {
        return this.setCoerce('trunc', ...args);
    }
    subCeil(...args) {
        return this.subCoerce('ceil', args);
    }
    subFloor(...args) {
        return this.subCoerce('floor', args);
    }
    subMod(...args) {
        return this.subCoerce('mod', args);
    }
    subRound(...args) {
        return this.subCoerce('round', args);
    }
    subTrunc(...args) {
        return this.subCoerce('trunc', args);
    }
}
class BaseFractionalXY extends BaseNumericalXY {
    static cast(...args) {
        return new this(...args);
    }
    static clamp(...args) {
        const xy = argsToXY(args);
        return new this(this.coerce('clamp', xy.x), this.coerce('clamp', xy.y));
    }
    static coerce(_coerce, _num) {
        throw Error(`Missing ${this.name}.${this.coerce.name}() subclass implementation.`);
    }
    addClamp(...args) {
        return this.addCoerce('clamp', args);
    }
    coerce(_coerce, _num) {
        throw Error(`Missing ${this.constructor.name}.${this.coerce.name}() subclass implementation.`);
    }
    divClamp(...args) {
        return this.divCoerce('clamp', args);
    }
    lerpClamp(...args) {
        return this.lerpCoerce('clamp', args);
    }
    lerpCoerce(coerce, args) {
        if (args.length == 3) {
            return this.setCoerce(coerce, NumUtil.lerp(this.x, args[0], args[2]), NumUtil.lerp(this.y, args[1], args[2]));
        }
        return this.setCoerce(coerce, NumUtil.lerp(this.x, args[0].x, args[1]), NumUtil.lerp(this.y, args[0].y, args[1]));
    }
    maxClamp(...args) {
        return this.maxCoerce('clamp', args);
    }
    minClamp(...args) {
        return this.minCoerce('clamp', args);
    }
    mulClamp(...args) {
        return this.mulCoerce('clamp', args);
    }
    setClamp(...args) {
        return this.setCoerce('clamp', ...args);
    }
    subClamp(...args) {
        return this.subCoerce('clamp', args);
    }
}
class I4XY extends BaseIntegralXY {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, num) {
        return I4[coerce == 'clamp' ? 'trunc' : coerce](num);
    }
    coerce(coerce, num) {
        return I4XY.coerce(coerce, num);
    }
}
class I16XY extends BaseIntegralXY {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, num) {
        return I16[coerce == 'clamp' ? 'trunc' : coerce](num);
    }
    coerce(coerce, num) {
        return I16XY.coerce(coerce, num);
    }
}
class U16XY extends BaseIntegralXY {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, num) {
        return U16[coerce == 'clamp' ? 'trunc' : coerce](num);
    }
    coerce(coerce, num) {
        return U16XY.coerce(coerce, num);
    }
}
class UintXY extends BaseIntegralXY {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, num) {
        return Uint[coerce == 'clamp' ? 'trunc' : coerce](num);
    }
    coerce(coerce, num) {
        return UintXY.coerce(coerce, num);
    }
}
class NumXY extends BaseFractionalXY {
    static cast(...args) {
        return super.cast(...args);
    }
    static clamp(...args) {
        return super.clamp(...args);
    }
    static coerce(coerce, num) {
        return Num[coerce](num);
    }
    coerce(coerce, num) {
        return NumXY.coerce(coerce, num);
    }
}
NumberNumNamespaceImpl.new('Unum', 'Unsigned', 0, Number.POSITIVE_INFINITY);
function argsToXY(args) {
    if (args.length == 1) return args[0];
    return {
        x: args[0],
        y: args[1]
    };
}
class BaseNumericalBox {
    #xy;
    #wh;
    get area() {
        return this.#wh.area;
    }
    get areaClamp() {
        return this.#wh.areaClamp;
    }
    get areaNum() {
        return this.#wh.areaNum;
    }
    get center() {
        return this.centerCoerce('cast');
    }
    get centerNum() {
        return this.wh.toNumXY().div(2, 2).add(this.xy);
    }
    get x() {
        return this.#xy.x;
    }
    set x(x) {
        this.#xy.x = x;
    }
    get y() {
        return this.#xy.y;
    }
    set y(y) {
        this.#xy.y = y;
    }
    get xy() {
        return this.#xy;
    }
    get w() {
        return this.#wh.x;
    }
    set w(w) {
        this.#wh.x = w;
    }
    get h() {
        return this.#wh.y;
    }
    set h(h) {
        this.#wh.y = h;
    }
    get wh() {
        return this.#wh;
    }
    set wh(wh) {
        this.w = wh.x;
        this.h = wh.y;
    }
    constructor(...args){
        const box = argsToBox(args);
        this.#xy = this.coerce('cast', box.x, box.y);
        this.#wh = this.coerce('cast', box.w, box.h);
    }
    centerCoerce(coerce) {
        return this.coerce(coerce, this.centerNum);
    }
    contains(...args) {
        if (this.empty) return false;
        const box = argsToBox(args);
        return this.x <= box.x && this.x + this.w >= box.x + box.w && this.y <= box.y && this.y + this.h >= box.y + box.h;
    }
    copy() {
        return new this.constructor(this.x, this.y, this.w, this.h);
    }
    get empty() {
        return this.areaNum == 0;
    }
    get end() {
        return this.coerce('cast', this.endNum);
    }
    get endClamp() {
        return this.coerce('clamp', this.endNum);
    }
    get endNum() {
        return this.xy.toNumXY().add(this.wh);
    }
    eq(...args) {
        const box = argsToBox(args);
        return this.x == box.x && this.y == box.y && this.w == box.w && this.h == box.h;
    }
    get flipped() {
        return this.w < 0 || this.h < 0;
    }
    intersection(...args) {
        return this.intersectionCoerce('cast', args);
    }
    intersectionCoerce(coerce, args) {
        const box = new NumBox(argsToBox(args));
        const xy = box.min.max(this.min);
        const wh = box.max.min(this.max).sub(xy);
        this.xy.set(this.coerce(coerce, xy));
        this.wh.set(this.coerce(coerce, wh));
        return this;
    }
    intersects(...args) {
        const box = argsToBox(args);
        return this.x < box.x + box.w && this.x + this.w > box.x && this.y < box.y + box.h && this.y + this.h > box.y;
    }
    get max() {
        return this.coerce('cast', this.maxNum);
    }
    get maxClamp() {
        return this.coerce('clamp', this.maxNum);
    }
    get maxNum() {
        return this.xy.toNumXY().add(this.w > 0 ? this.w : 0, this.h > 0 ? this.h : 0);
    }
    get min() {
        return this.coerce('cast', this.minNum);
    }
    get minClamp() {
        return this.coerce('clamp', this.minNum);
    }
    get minNum() {
        return this.xy.toNumXY().add(this.w < 0 ? this.w : 0, this.h < 0 ? this.h : 0);
    }
    moveBy(...args) {
        return this.moveByCoerce('cast', args);
    }
    moveByCoerce(coerce, args) {
        const xy = new NumXY(argsToXY(args));
        this.xy.set(this.coerce(coerce, xy.add(this.xy)));
        return this;
    }
    moveCenterTo(...args) {
        return this.moveCenterToCoerce('cast', args);
    }
    moveCenterToCoerce(coerce, args) {
        const xy = argsToXY(args);
        this.xy.set(this.coerce(coerce, this.wh.toNumXY().div(2, 2).mul(-1, -1).add(xy)));
        return this;
    }
    moveTo(...args) {
        return this.moveToCoerce('cast', args);
    }
    moveToCoerce(coerce, args) {
        const xy = argsToXY(args);
        this.xy.set(this.coerce(coerce, xy));
        return this;
    }
    order() {
        return this.orderCoerce('cast');
    }
    orderClamp() {
        return this.orderCoerce('clamp');
    }
    orderCoerce(coerce) {
        const min = this.minNum;
        this.xy.set(this.coerce(coerce, min));
        this.wh.set(this.coerce(coerce, this.maxNum.sub(min)));
        return this;
    }
    set(...args) {
        return this.setCoerce('cast', args);
    }
    setCoerce(coerce, args) {
        const box = argsToBox(args);
        this.xy.set(this.coerce(coerce, box.x, box.y));
        this.wh.set(this.coerce(coerce, box.w, box.h));
        return this;
    }
    sizeBy(...args) {
        return this.sizeByCoerce('cast', args);
    }
    sizeByCoerce(coerce, args) {
        const xy = new NumXY(argsToXY(args));
        this.wh.set(this.coerce(coerce, xy.add(this.xy)));
        return this;
    }
    sizeTo(...args) {
        return this.sizeToCoerce('cast', args);
    }
    sizeToCoerce(coerce, args) {
        const xy = argsToXY(args);
        this.wh.set(this.coerce(coerce, xy));
        return this;
    }
    union(...args) {
        return this.unionCoerce('cast', args);
    }
    unionCoerce(coerce, args) {
        const box = new NumBox(argsToBox(args));
        const xy = box.min.min(this.min);
        const wh = box.max.max(this.max).sub(xy);
        this.xy.set(this.coerce(coerce, xy));
        this.wh.set(this.coerce(coerce, wh));
        return this;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }
    toNumBox() {
        return new NumBox(this.x, this.y, this.w, this.h);
    }
    toString() {
        return `[${this.xy.toString()}, ${this.w}×${this.h}]`;
    }
}
class Random {
    #seed;
    get seed() {
        return this.#seed;
    }
    constructor(seed){
        this.#seed = I32(seed * 16_807 % 0x7fff_ffff);
        if (this.#seed <= 0) {
            this.#seed = I32((this.#seed + 0x7fff_fffe) % 0x7fff_fffe + 1);
        }
    }
    get fraction() {
        return (this.i32 - 1) / 0x7fff_fffe;
    }
    get i32() {
        this.#seed = I32(this.#seed * 16_807 % 0x7fff_ffff);
        return this.#seed;
    }
}
function NonNull(val, msg) {
    assertNonNull(val, msg);
    return val;
}
class BaseIntegralBox extends BaseNumericalBox {
    static cast(...args) {
        return new this(...args);
    }
    static ceil(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('ceil', box.x, box.y), this.coerce('ceil', box.w, box.h));
    }
    static floor(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('floor', box.x, box.y), this.coerce('floor', box.w, box.h));
    }
    static mod(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('mod', box.x, box.y), this.coerce('mod', box.w, box.h));
    }
    static round(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('round', box.x, box.y), this.coerce('round', box.w, box.h));
    }
    static trunc(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('trunc', box.x, box.y), this.coerce('trunc', box.w, box.h));
    }
    static coerce(_coerce, ..._args) {
        throw Error(`Missing ${this.name}.${this.coerce.name}() subclass implementation.`);
    }
    get centerCeil() {
        return this.centerCoerce('ceil');
    }
    get centerFloor() {
        return this.centerCoerce('floor');
    }
    get centerMod() {
        return this.centerCoerce('mod');
    }
    get centerRound() {
        return this.centerCoerce('round');
    }
    get centerTrunc() {
        return this.centerCoerce('trunc');
    }
    coerce(_coerce, ..._args) {
        throw Error(`Missing ${this.constructor.name}.${this.coerce.name}() subclass implementation.`);
    }
    intersectionCeil(...args) {
        return this.intersectionCoerce('ceil', args);
    }
    intersectionFloor(...args) {
        return this.intersectionCoerce('floor', args);
    }
    intersectionMod(...args) {
        return this.intersectionCoerce('mod', args);
    }
    intersectionRound(...args) {
        return this.intersectionCoerce('round', args);
    }
    intersectionTrunc(...args) {
        return this.intersectionCoerce('trunc', args);
    }
    moveByCeil(...args) {
        return this.moveByCoerce('ceil', args);
    }
    moveByFloor(...args) {
        return this.moveByCoerce('floor', args);
    }
    moveByMod(...args) {
        return this.moveByCoerce('mod', args);
    }
    moveByRound(...args) {
        return this.moveByCoerce('round', args);
    }
    moveByTrunc(...args) {
        return this.moveByCoerce('trunc', args);
    }
    moveCenterToCeil(...args) {
        return this.moveCenterToCoerce('ceil', args);
    }
    moveCenterToFloor(...args) {
        return this.moveCenterToCoerce('floor', args);
    }
    moveCenterToMod(...args) {
        return this.moveCenterToCoerce('mod', args);
    }
    moveCenterToRound(...args) {
        return this.moveCenterToCoerce('round', args);
    }
    moveCenterToTrunc(...args) {
        return this.moveCenterToCoerce('trunc', args);
    }
    moveToCeil(...args) {
        return this.moveToCoerce('ceil', args);
    }
    moveToFloor(...args) {
        return this.moveToCoerce('floor', args);
    }
    moveToMod(...args) {
        return this.moveToCoerce('mod', args);
    }
    moveToRound(...args) {
        return this.moveToCoerce('round', args);
    }
    moveToTrunc(...args) {
        return this.moveToCoerce('trunc', args);
    }
    setCeil(...args) {
        return this.setCoerce('ceil', args);
    }
    setFloor(...args) {
        return this.setCoerce('floor', args);
    }
    setMod(...args) {
        return this.setCoerce('mod', args);
    }
    setRound(...args) {
        return this.setCoerce('round', args);
    }
    setTrunc(...args) {
        return this.setCoerce('trunc', args);
    }
    sizeByCeil(...args) {
        return this.sizeByCoerce('ceil', args);
    }
    sizeByFloor(...args) {
        return this.sizeByCoerce('floor', args);
    }
    sizeByMod(...args) {
        return this.sizeByCoerce('mod', args);
    }
    sizeByRound(...args) {
        return this.sizeByCoerce('round', args);
    }
    sizeByTrunc(...args) {
        return this.sizeByCoerce('trunc', args);
    }
    sizeToCeil(...args) {
        return this.sizeToCoerce('ceil', args);
    }
    sizeToFloor(...args) {
        return this.sizeToCoerce('floor', args);
    }
    sizeToMod(...args) {
        return this.sizeToCoerce('mod', args);
    }
    sizeToRound(...args) {
        return this.sizeToCoerce('round', args);
    }
    sizeToTrunc(...args) {
        return this.sizeToCoerce('trunc', args);
    }
    unionCeil(...args) {
        return this.unionCoerce('ceil', args);
    }
    unionFloor(...args) {
        return this.unionCoerce('floor', args);
    }
    unionMod(...args) {
        return this.unionCoerce('mod', args);
    }
    unionRound(...args) {
        return this.unionCoerce('round', args);
    }
    unionTrunc(...args) {
        return this.unionCoerce('trunc', args);
    }
}
class BaseFractionalBox extends BaseNumericalBox {
    static cast(...args) {
        return new this(...args);
    }
    static clamp(...args) {
        const box = argsToBox(args);
        return new this(this.coerce('clamp', box.x, box.y), this.coerce('clamp', box.w, box.h));
    }
    get centerClamp() {
        return this.centerCoerce('clamp');
    }
    static coerce(_coerce, ..._args) {
        throw Error(`Missing ${this.name}.${this.coerce.name}() subclass implementation.`);
    }
    coerce(_coerce, ..._args) {
        throw Error(`Missing ${this.constructor.name}.${this.coerce.name}() subclass implementation.`);
    }
    intersectionClamp(...args) {
        return this.intersectionCoerce('clamp', args);
    }
    moveByClamp(...args) {
        return this.moveByCoerce('clamp', args);
    }
    moveCenterToClamp(...args) {
        return this.moveCenterToCoerce('clamp', args);
    }
    moveToClamp(...args) {
        return this.moveToCoerce('clamp', args);
    }
    setClamp(...args) {
        return this.setCoerce('clamp', args);
    }
    sizeByClamp(...args) {
        return this.sizeByCoerce('clamp', args);
    }
    sizeToClamp(...args) {
        return this.sizeToCoerce('clamp', args);
    }
    unionClamp(...args) {
        return this.unionCoerce('clamp', args);
    }
}
class I16Box extends BaseIntegralBox {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, ...args) {
        return I16XY[coerce == 'clamp' ? 'trunc' : coerce](...args);
    }
    coerce(coerce, ...args) {
        return I16Box.coerce(coerce, ...args);
    }
}
class U16Box extends BaseIntegralBox {
    static cast(...args) {
        return super.cast(...args);
    }
    static ceil(...args) {
        return super.ceil(...args);
    }
    static floor(...args) {
        return super.floor(...args);
    }
    static mod(...args) {
        return super.mod(...args);
    }
    static round(...args) {
        return super.round(...args);
    }
    static trunc(...args) {
        return super.trunc(...args);
    }
    static coerce(coerce, ...args) {
        return U16XY[coerce == 'clamp' ? 'trunc' : coerce](...args);
    }
    coerce(coerce, ...args) {
        return U16Box.coerce(coerce, ...args);
    }
}
class NumBox extends BaseFractionalBox {
    static cast(...args) {
        return super.cast(...args);
    }
    static clamp(...args) {
        return super.clamp(...args);
    }
    static coerce(coerce, ...args) {
        return NumXY[coerce](...args);
    }
    coerce(coerce, ...args) {
        return NumBox.coerce(coerce, ...args);
    }
}
function argsToBox(args) {
    if (args.length == 1) {
        if ('w' in args[0]) return args[0];
        return {
            x: args[0].x,
            y: args[0].y,
            w: 0,
            h: 0
        };
    }
    if (args.length == 2) {
        if (typeof args[0] == 'number') {
            return {
                x: args[0],
                y: args[1],
                w: 0,
                h: 0
            };
        }
        const { x: w , y: h  } = args[1];
        return {
            x: args[0].x,
            y: args[0].y,
            w,
            h
        };
    }
    return {
        x: args[0],
        y: args[1],
        w: args[2],
        h: args[3]
    };
}
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
function Solitaire(drawSize, random, wins, tableauSize) {
    drawSize ??= Uint(3);
    if (random == null) {
        const rnd = new Random(I32.mod(Date.now()));
        random = ()=>rnd.fraction;
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
        wins: wins ?? Uint(0)
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
                xy: new UintXY(index, y)
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
                xy: new UintXY(x, y)
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
                xy: new UintXY(0, wasteY)
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
        const selected = self.selected == null ? '' : Card.toString(visibility, ...self.selected.cards) + ` from ${self.selected.pile} ${self.selected.xy.toString()}`;
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
function mapValues(record, transformer) {
    const ret = {};
    const entries = Object.entries(record);
    for (const [key, value] of entries){
        const mappedValue = transformer(value);
        ret[key] = mappedValue;
    }
    return ret;
}
var AtlasMeta;
(function(AtlasMeta) {
    function fromJSON(json) {
        return Immutable({
            version: json.version,
            filename: json.filename,
            format: json.format,
            wh: new U16XY(json.wh),
            filmByID: mapValues(json.filmByID, parseFilm),
            celBoundsByID: json.celBoundsByID.map((bounds)=>new U16Box(bounds))
        });
    }
    AtlasMeta.fromJSON = fromJSON;
})(AtlasMeta || (AtlasMeta = {}));
function parseFilm(json) {
    return {
        id: json.id,
        duration: json.duration,
        wh: new U16XY(json.wh),
        cels: json.cels.map(parseCel),
        period: json.period,
        direction: json.direction
    };
}
function parseCel(json) {
    return {
        id: json.id,
        bounds: new U16Box(json.bounds),
        duration: json.duration,
        sliceBounds: new I16Box(json.sliceBounds),
        slices: json.slices.map((slice)=>new I16Box(slice))
    };
}
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
        assert(cels.every(({ bounds  })=>bounds.areaNum == area), `Cel sizes for "${frameTag.name}" film vary.`);
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
        const sliceBounds = sliceBoxes.length < 1 ? new I16Box(1, 1, -1, -1) : sliceBoxes.reduce((sum, slice)=>sum.union(slice));
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
        return new U16Box(frame.frame.x + padding.x / 2, frame.frame.y + padding.y / 2, frame.sourceSize.w, frame.sourceSize.h);
    }
    AtlasMetaParser.parseBounds = parseBounds;
    function parsePadding(frame) {
        const w = frame.frame.w - frame.sourceSize.w;
        const h = frame.frame.h - frame.sourceSize.h;
        assert(isEven(w) && isEven(h), 'Cel padding is not evenly divisible.');
        return new U16XY(w, h);
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
            if (key != null) bounds.push(new I16Box(key.bounds));
        }
        return bounds;
    }
    AtlasMetaParser.parseSlices = parseSlices;
    function parseU16XY(wh) {
        return new U16XY(wh.w, wh.h);
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
class CursorSystem {
    query = new Set([
        'cursor',
        'sprite'
    ]);
    updateEnt(set, update) {
        const { cursor , sprite  } = set;
        if (update.input.isOnStart('Action')) {
            sprite.animate(update.time, cursor.pick);
        } else if (update.input.isOffStart('Action')) {
            sprite.animate(update.time, cursor.point);
        }
    }
}
const FollowCamSystem = Immutable({
    query: new Set([
        'followCam',
        'sprite'
    ]),
    updateEnt
});
function updateEnt(set, update) {
    const { followCam , sprite  } = set;
    const pad = new I16XY(followCam.pad?.x ?? 0, followCam.pad?.y ?? 0);
    sprite.bounds.sizeTo(I16(followCam.fill == 'X' || followCam.fill == 'XY' ? update.cam.viewport.w - pad.x * 2 : sprite.w), I16(followCam.fill == 'Y' || followCam.fill == 'XY' ? update.cam.viewport.h - pad.y * 2 : sprite.h));
    sprite.bounds.moveTo(computeX(sprite, update.cam, followCam), computeY(sprite, update.cam, followCam));
}
function computeX(sprite, cam, component) {
    const camW = cam.viewport.w;
    const spriteW = Math.abs(sprite.w);
    const padW = component.pad?.x ?? 0;
    let x = cam.viewport.x;
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
    const camH = cam.viewport.h;
    const spriteH = Math.abs(sprite.h);
    const padH = component.pad?.y ?? 0;
    let y = cam.viewport.y;
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
const RenderSystem = Immutable({
    type: 'Render',
    query: new Set([
        'sprite'
    ]),
    update
});
function update(sets, update) {
    let index = 0;
    for (const set of sets.values()){
        update.instanceBuffer.set(index, set.sprite, update.time);
        index++;
    }
    update.rendererStateMachine.render(update.time, update.cam, update.instanceBuffer);
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
        return new NumXY(width, height);
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
        return new I16XY(camWH.x * scale, camWH.y * scale);
    }
    Viewport.nativeCanvasWH = nativeCanvasWH;
    function clientCanvasWH(window1, nativeCanvasWH) {
        const ratio = window1.devicePixelRatio;
        return new NumXY(nativeCanvasWH.x / ratio, nativeCanvasWH.y / ratio);
    }
    Viewport.clientCanvasWH = clientCanvasWH;
    function toLevelXY(point, clientViewportWH, cam) {
        return I16XY.trunc(cam.x + point.x / clientViewportWH.x * cam.w, cam.y + point.y / clientViewportWH.y * cam.h);
    }
    Viewport.toLevelXY = toLevelXY;
})(Viewport || (Viewport = {}));
const littleEndian = new Int8Array(new Int16Array([
    1
]).buffer)[0] == 1;
class InstanceBuffer {
    #buffer;
    #size;
    #layout;
    get buffer() {
        return this.#buffer;
    }
    get size() {
        return this.#size;
    }
    constructor(layout, len = Uint(0)){
        this.#buffer = new DataView(new ArrayBuffer(layout.perInstance.stride * len));
        this.#layout = layout;
        this.#size = 0;
    }
    resize(len) {
        this.#buffer = new DataView(new ArrayBuffer(this.#layout.perInstance.stride * len));
    }
    set(index, sprite, time) {
        const i = index * this.#layout.perInstance.stride;
        if (this.#buffer.byteLength < i + this.#layout.perInstance.stride) {
            this.resize(Uint(Math.max(1, index) * 2));
        }
        this.#buffer.setUint16(i + 0, sprite.cel(time).id, littleEndian);
        this.#buffer.setInt16(i + 2, sprite.x, littleEndian);
        this.#buffer.setInt16(i + 4, sprite.y, littleEndian);
        this.#buffer.setInt16(i + 6, sprite.w, littleEndian);
        this.#buffer.setInt16(i + 8, sprite.h, littleEndian);
        this.#buffer.setUint16(i + 10, sprite.wrapLayerByHeightLayer, littleEndian);
        this.#size = index + 1;
    }
}
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
const CamSystem = Immutable({
    query: new Set([
        'cam'
    ]),
    updateEnt: updateEnt1
});
const FollowPointSystem = Immutable({
    query: new Set([
        'followPoint',
        'sprite'
    ]),
    updateEnt: updateEnt2
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
            const clientXY = new NumXY(pointer.clientX, pointer.clientY);
            this.#xy = Viewport.toLevelXY(clientXY, this.#cam.clientViewportWH, this.#cam.viewport);
        }
        const active = ev.type == 'contextmenu' || ev.type == 'pointerdown';
        if (active) ev.preventDefault();
    };
}
class InputPoller {
    #gamepad = new GamepadPoller();
    #keyboard = new KeyboardPoller();
    #pointer;
    get pointerType() {
        return this.#pointer.pointerType;
    }
    get sample() {
        return this.#gamepad.sample | this.#keyboard.sample | this.#pointer.sample;
    }
    get xy() {
        return this.#pointer.xy;
    }
    constructor(cam){
        this.#pointer = new PointerPoller(cam);
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
    isAnyOn(...buttons) {
        return buttons.some((button)=>this.isOn(button));
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
            box.x,
            box.y,
            box.w,
            box.h
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
function updateEnt1(set) {
    const { cam  } = set;
    cam.clientViewportWH.set(Viewport.clientViewportWH(window));
    cam.nativeViewportWH.set(Viewport.nativeViewportWH(window, cam.clientViewportWH));
    cam.scale = Viewport.scale(cam.nativeViewportWH, cam.minViewport, I16(0));
    cam.viewport.wh = Viewport.camWH(cam.nativeViewportWH, cam.scale);
    const camOffsetX = Math.trunc((cam.viewport.w - cam.minViewport.x) / 2);
    cam.viewport.x = I16(-camOffsetX + camOffsetX % 8);
}
function updateEnt2(set, update) {
    const { sprite  } = set;
    if (update.input.xy != null) {
        sprite.moveTo(update.input.xy);
        setCursorLayer(sprite, update);
    } else {
        const speed = I16.trunc(Math.max(1, update.tick / 4));
        if (update.input.isOn('Left')) sprite.moveBy(new I16XY(-speed, 0));
        if (update.input.isOn('Right')) sprite.moveBy(new I16XY(speed, 0));
        if (update.input.isOn('Up')) sprite.moveBy(new I16XY(0, -speed));
        if (update.input.isOn('Down')) sprite.moveBy(new I16XY(0, speed));
        if (update.input.isAnyOn('Left', 'Right', 'Up', 'Down')) {
            setCursorLayer(sprite, update);
        }
    }
}
function setCursorLayer(sprite, update) {
    if (update.input.pointerType == null || update.input.pointerType == 'Mouse') {
        sprite.layer = Layer.Cursor;
    } else if (update.input.pointerType == 'Pen' || update.input.pointerType == 'Touch') sprite.layer = Layer.Bottom;
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
        return this.#bounds.h;
    }
    set layer(layer) {
        const { wrap , layerByHeight  } = parseWrapLayerByHeightLayer(this.#wrapLayerByHeightLayer);
        this.#wrapLayerByHeightLayer = serializeWrapLayerByHeightLayer(wrap, layerByHeight, layer);
    }
    get w() {
        return this.#bounds.w;
    }
    get wrapLayerByHeightLayer() {
        return this.#wrapLayerByHeightLayer;
    }
    get x() {
        return this.#bounds.x;
    }
    get y() {
        return this.#bounds.y;
    }
    constructor(film, layer, props){
        this.#animator = new Animator(film);
        const flip = new I16XY(props?.flip == 'X' || props?.flip == 'XY' ? -1 : 1, props?.flip == 'Y' || props?.flip == 'XY' ? -1 : 1);
        this.#bounds = new I16Box(props?.xy?.x ?? props?.x ?? 0, props?.xy?.y ?? props?.y ?? 0, (props?.wh?.x ?? props?.w ?? film.wh.x) * flip.x, (props?.wh?.y ?? props?.h ?? film.wh.y) * flip.y);
        this.#wrapLayerByHeightLayer = serializeWrapLayerByHeightLayer(new I4XY(props?.wrap?.x ?? 0, props?.wrap?.y ?? 0), props?.layerByHeight ?? false, layer);
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
        return lhsLayer == rhsLayer ? sprite.bounds[rhsLayerByHeight ? 'xy' : 'endNum'].y - this.bounds[lhsLayerByHeight ? 'xy' : 'endNum'].y : lhsLayer - rhsLayer;
    }
    isInFrontOf(sprite) {
        return this.compareDepth(sprite) < 0;
    }
    intersects(xyOrBox, time) {
        if (!this.intersectsBounds(xyOrBox)) return false;
        const cel = this.cel(time);
        if (cel.slices.length == 0) return true;
        const box = 'x' in xyOrBox ? I16Box.round(xyOrBox.x, xyOrBox.y, 0, 0) : I16Box.round(xyOrBox);
        box.moveBy(-this.x, -this.y);
        if (!cel.sliceBounds.intersects(box)) return false;
        for (const slice of cel.slices){
            if (slice.intersects(box)) return true;
        }
        return false;
    }
    intersectsBounds(xyOrBoxOrSprite) {
        if ('bounds' in xyOrBoxOrSprite) {
            return this.bounds.intersects(xyOrBoxOrSprite.bounds);
        }
        return this.bounds.intersects(xyOrBoxOrSprite);
    }
    intersectsSprite(sprite, time) {
        if (!this.intersectsBounds(sprite)) return false;
        const cel = sprite.cel(time);
        if (cel.slices.length == 0) {
            return this.intersects(sprite.bounds, time);
        }
        const box = new I16Box(cel.sliceBounds).moveBy(sprite.bounds.xy);
        if (!this.intersects(box, time)) return false;
        for (const slice of cel.slices){
            const box1 = new I16Box(slice).moveBy(sprite.bounds.xy);
            if (this.intersects(box1, time)) return true;
        }
        return false;
    }
    moveTo(xy) {
        this.bounds.moveTo(xy);
        return this;
    }
    moveBy(xy) {
        this.bounds.moveBy(xy);
        return this;
    }
    toString() {
        const wlbhl = parseWrapLayerByHeightLayer(this.#wrapLayerByHeightLayer);
        return `Sprite {id=${this.film.id} box=${this.bounds.toString()} ` + `layer=${wlbhl.layer} layerByHeight=${wlbhl.layerByHeight} ` + `wrap=${wlbhl.wrap.toString()}}`;
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
            viewport: new I16Box(json.xy?.x ?? 0, json.xy?.y ?? 0, 1, 1),
            clientViewportWH: new NumXY(1, 1),
            nativeViewportWH: new U16XY(1, 1),
            minViewport: new U16XY(json.minViewport.x ?? 1, json.minViewport?.y ?? 1),
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
            pick: parseFilm1(lut, json.pick),
            point: parseFilm1(lut, json.point)
        };
    }
    LevelParser.parseCursorFilmSet = parseCursorFilmSet;
    function parseSprite(lut, json) {
        const film = parseFilm1(lut, json.id);
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
function parseFilm1(lut, id) {
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
        const nativeCanvasWH = Viewport.nativeCanvasWH(cam.viewport.wh, cam.scale);
        if (self.gl.canvas.width != nativeCanvasWH.x || self.gl.canvas.height != nativeCanvasWH.y) {
            self.gl.canvas.width = nativeCanvasWH.x;
            self.gl.canvas.height = nativeCanvasWH.y;
            self.gl.viewport(0, 0, nativeCanvasWH.x, nativeCanvasWH.y);
            console.debug(`Canvas resized to ${nativeCanvasWH.x}×${nativeCanvasWH.y} native pixels with ${cam.viewport.w}×${cam.viewport.h} cam (level pixels) at a ${cam.scale}x scale.`);
        }
        if (self.gl.canvas instanceof HTMLCanvasElement) {
            const clientWH = Viewport.clientCanvasWH(window, nativeCanvasWH);
            const diffW = Number.parseFloat(self.gl.canvas.style.width.slice(0, -2)) - clientWH.x;
            const diffH = Number.parseFloat(self.gl.canvas.style.height.slice(0, -2)) - clientWH.y;
            if (!Number.isFinite(diffW) || Math.abs(diffW) >= .5 || !Number.isFinite(diffH) || Math.abs(diffH) >= .5) {
                self.gl.canvas.style.width = `${clientWH.x}px`;
                self.gl.canvas.style.height = `${clientWH.y}px`;
                console.debug(`Canvas styled to ${self.gl.canvas.style.width}×${self.gl.canvas.style.height} ` + `for ${devicePixelRatio}× pixel ratio.`);
            }
        }
        self.projection.set(project(cam));
        self.gl.uniformMatrix4fv(GL.uniformLocation(self.layout, self.uniforms, 'uProjection'), false, self.projection);
    }
    Renderer.resize = resize;
    function project(cam) {
        const { w , h  } = {
            w: 2 / cam.viewport.w,
            h: 2 / cam.viewport.h
        };
        return [
            w,
            0,
            0,
            -1 - cam.viewport.x * w,
            0,
            -h,
            0,
            1 + cam.viewport.y * h,
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
        wrap: new I4XY(wrapX, wrapY),
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
        let cursor = new I16XY(0, 0);
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
            cursor: new I16XY(x, y)
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
const __default6 = JSON.parse("[\n  {\n    \"//\": \"y = 2 (border) + 71 (offset) + 8 * 7 (initial stack with a king on top) + 11 * 7 (Q-2) + (A) 32 - (dont care) 24 = 214\",\n    \"name\": \"cam\",\n    \"cam\": { \"minViewport\": { \"x\": 256, \"y\": 214 } }\n  },\n\n  {\n    \"name\": \"cursor\",\n    \"cursor\": { \"pick\": \"CursorPick\", \"point\": \"CursorPoint\" },\n    \"followPoint\": {},\n    \"sprite\": { \"id\": \"CursorPoint\", \"layer\": \"Bottom\" }\n  },\n\n  {\n    \"name\": \"background border\",\n    \"followCam\": { \"fill\": \"XY\", \"orientation\": \"Northwest\" },\n    \"sprite\": {\n      \"id\": \"PaletteDark\",\n      \"layer\": \"Background\",\n      \"layerByHeight\": true\n    }\n  },\n  {\n    \"name\": \"background corner NW\",\n    \"followCam\": { \"orientation\": \"Northwest\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\" }\n  },\n  {\n    \"name\": \"background corner NE\",\n    \"followCam\": { \"orientation\": \"Northeast\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"X\" }\n  },\n  {\n    \"name\": \"background corner SE\",\n    \"followCam\": { \"orientation\": \"Southeast\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"XY\" }\n  },\n  {\n    \"name\": \"background corner SW\",\n    \"followCam\": { \"orientation\": \"Southwest\" },\n    \"sprite\": { \"id\": \"Corner\", \"layer\": \"Background\", \"flip\": \"Y\" }\n  },\n\n  {\n    \"name\": \"background\",\n    \"followCam\": {\n      \"fill\": \"XY\",\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 1, \"y\": 1 }\n    },\n    \"sprite\": {\n      \"id\": \"Grid\",\n      \"layer\": \"Background\",\n      \"layerByHeight\": true,\n      \"wrap\": { \"x\": -1, \"y\": -1 }\n    }\n  },\n\n  {\n    \"name\": \"stock background\",\n    \"sprite\": {\n      \"id\": \"PaletteLight\",\n      \"layer\": \"Background\",\n      \"xy\": { \"x\": 169, \"y\": 9 },\n      \"wh\": { \"x\": 39, \"y\": 47 }\n    }\n  },\n\n  {\n    \"pile\": { \"type\": \"Waste\" },\n    \"sprite\": {\n      \"id\": \"PaletteLight\",\n      \"layer\": \"Background\",\n      \"xy\": { \"x\": 201, \"y\": 9 }\n    }\n  },\n\n  {\n    \"name\": \"waste vacancy\",\n    \"sprite\": {\n      \"id\": \"CardVacantPile\",\n      \"layer\": \"Vacancy\",\n      \"xy\": { \"x\": 208, \"y\": 16 }\n    }\n  },\n\n  {\n    \"name\": \"Patience the Demon\",\n    \"followCam\": {\n      \"modulo\": { \"x\": 8, \"y\": 8 },\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 16, \"y\": 16 }\n    },\n    \"patienceTheDemon\": {},\n    \"sprite\": { \"id\": \"PatienceTheDemonGood\", \"layer\": \"Patience\" }\n  }\n]");
const __default7 = JSON.parse("{\n  \"version\": \"1.3-beta21-x64\",\n  \"filename\": \"atlas.png\",\n  \"format\": \"I8\",\n  \"wh\": {\n    \"x\": 216,\n    \"y\": 240\n  },\n  \"filmByID\": {\n    \"Grid\": {\n      \"id\": \"Grid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 0,\n          \"bounds\": {\n            \"x\": 112,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Corner\": {\n      \"id\": \"Corner\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 1,\n          \"bounds\": {\n            \"x\": 104,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCA\": {\n      \"id\": \"CardCA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 2,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC2\": {\n      \"id\": \"CardC2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 3,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC3\": {\n      \"id\": \"CardC3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 4,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC4\": {\n      \"id\": \"CardC4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 5,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC5\": {\n      \"id\": \"CardC5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 6,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC6\": {\n      \"id\": \"CardC6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 7,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC7\": {\n      \"id\": \"CardC7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 8,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC8\": {\n      \"id\": \"CardC8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 9,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC9\": {\n      \"id\": \"CardC9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 10,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardC10\": {\n      \"id\": \"CardC10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 11,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCJ\": {\n      \"id\": \"CardCJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 12,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCQ\": {\n      \"id\": \"CardCQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 13,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardCK\": {\n      \"id\": \"CardCK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 14,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDA\": {\n      \"id\": \"CardDA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 15,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD2\": {\n      \"id\": \"CardD2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 16,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD3\": {\n      \"id\": \"CardD3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 17,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD4\": {\n      \"id\": \"CardD4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 18,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD5\": {\n      \"id\": \"CardD5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 19,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD6\": {\n      \"id\": \"CardD6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 20,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD7\": {\n      \"id\": \"CardD7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 21,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD8\": {\n      \"id\": \"CardD8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 22,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD9\": {\n      \"id\": \"CardD9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 23,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardD10\": {\n      \"id\": \"CardD10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 24,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDJ\": {\n      \"id\": \"CardDJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 25,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDQ\": {\n      \"id\": \"CardDQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 26,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDK\": {\n      \"id\": \"CardDK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 27,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHA\": {\n      \"id\": \"CardHA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 28,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH2\": {\n      \"id\": \"CardH2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 29,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH3\": {\n      \"id\": \"CardH3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 30,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH4\": {\n      \"id\": \"CardH4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 31,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH5\": {\n      \"id\": \"CardH5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 32,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH6\": {\n      \"id\": \"CardH6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 33,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH7\": {\n      \"id\": \"CardH7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 34,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH8\": {\n      \"id\": \"CardH8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 35,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH9\": {\n      \"id\": \"CardH9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 36,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardH10\": {\n      \"id\": \"CardH10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 37,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHJ\": {\n      \"id\": \"CardHJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 38,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHQ\": {\n      \"id\": \"CardHQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 39,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardHK\": {\n      \"id\": \"CardHK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 40,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSA\": {\n      \"id\": \"CardSA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 41,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS2\": {\n      \"id\": \"CardS2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 42,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS3\": {\n      \"id\": \"CardS3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 43,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS4\": {\n      \"id\": \"CardS4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 44,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS5\": {\n      \"id\": \"CardS5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 45,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS6\": {\n      \"id\": \"CardS6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 46,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS7\": {\n      \"id\": \"CardS7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 47,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS8\": {\n      \"id\": \"CardS8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 48,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS9\": {\n      \"id\": \"CardS9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 49,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardS10\": {\n      \"id\": \"CardS10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 50,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSJ\": {\n      \"id\": \"CardSJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 51,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSQ\": {\n      \"id\": \"CardSQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 52,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardSK\": {\n      \"id\": \"CardSK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 53,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardDown\": {\n      \"id\": \"CardDown\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 54,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantPile\": {\n      \"id\": \"CardVacantPile\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 55,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantStock\": {\n      \"id\": \"CardVacantStock\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 56,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantClubs\": {\n      \"id\": \"CardVacantClubs\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 57,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantDiamonds\": {\n      \"id\": \"CardVacantDiamonds\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 58,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantHearts\": {\n      \"id\": \"CardVacantHearts\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 59,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardVacantSpades\": {\n      \"id\": \"CardVacantSpades\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 60,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardOutlineFocus\": {\n      \"id\": \"CardOutlineFocus\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 61,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CardOutlineChecked\": {\n      \"id\": \"CardOutlineChecked\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 62,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CursorPoint\": {\n      \"id\": \"CursorPoint\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 63,\n          \"bounds\": {\n            \"x\": 16,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 16\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 3,\n            \"h\": 3\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 3,\n              \"h\": 3\n            }\n          ]\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"CursorPick\": {\n      \"id\": \"CursorPick\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 64,\n          \"bounds\": {\n            \"x\": 0,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 16\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 3,\n            \"h\": 3\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 3,\n              \"h\": 3\n            }\n          ]\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteAlpha\": {\n      \"id\": \"PaletteAlpha\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 65,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteDark\": {\n      \"id\": \"PaletteDark\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 66,\n          \"bounds\": {\n            \"x\": 88,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteMid\": {\n      \"id\": \"PaletteMid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 67,\n          \"bounds\": {\n            \"x\": 80,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PaletteLight\": {\n      \"id\": \"PaletteLight\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 68,\n          \"bounds\": {\n            \"x\": 160,\n            \"y\": 224,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"PatienceTheDemonGood\": {\n      \"id\": \"PatienceTheDemonGood\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        }\n      ],\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\"\n    },\n    \"PatienceTheDemonEvil\": {\n      \"id\": \"PatienceTheDemonEvil\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"x\": 0,\n              \"y\": 0,\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        }\n      ],\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\"\n    },\n    \"Tally0\": {\n      \"id\": \"Tally0\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 73,\n          \"bounds\": {\n            \"x\": 64,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally1\": {\n      \"id\": \"Tally1\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 74,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally2\": {\n      \"id\": \"Tally2\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 75,\n          \"bounds\": {\n            \"x\": 32,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally3\": {\n      \"id\": \"Tally3\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 76,\n          \"bounds\": {\n            \"x\": 64,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally4\": {\n      \"id\": \"Tally4\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 77,\n          \"bounds\": {\n            \"x\": 32,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally5\": {\n      \"id\": \"Tally5\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 78,\n          \"bounds\": {\n            \"x\": 80,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally6\": {\n      \"id\": \"Tally6\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 79,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally7\": {\n      \"id\": \"Tally7\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 80,\n          \"bounds\": {\n            \"x\": 112,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally8\": {\n      \"id\": \"Tally8\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 81,\n          \"bounds\": {\n            \"x\": 128,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally9\": {\n      \"id\": \"Tally9\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 82,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    },\n    \"Tally10\": {\n      \"id\": \"Tally10\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 83,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 4294967295,\n          \"sliceBounds\": {\n            \"x\": 1,\n            \"y\": 1,\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"period\": 4294967295,\n      \"duration\": 4294967295,\n      \"direction\": \"Forward\"\n    }\n  },\n  \"celBoundsByID\": [\n    {\n      \"x\": 112,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 104,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 144,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 0,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 0,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 16,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 16\n    },\n    {\n      \"x\": 0,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 16\n    },\n    {\n      \"x\": 96,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 88,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 80,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 160,\n      \"y\": 224,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 192,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 192,\n      \"y\": 216,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 168,\n      \"y\": 216,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 168,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 64,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 48,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 32,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 64,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 32,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 80,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 96,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 112,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 128,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 144,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 48,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    }\n  ]\n}");
var Assets;
(function(Assets) {
    async function load() {
        const atlas = await ImageLoader.load('atlas.png');
        const atlasMeta = AtlasMeta.fromJSON(__default7);
        const shaderLayout = ShaderLayoutParser.parse(__default3);
        return {
            atlas,
            atlasMeta,
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
        'Corner',
        'CursorPick',
        'CursorPoint',
        'Grid',
        'PaletteAlpha',
        'PaletteDark',
        'PaletteLight',
        'PaletteMid',
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
                offset: update.cursor.bounds.xy.copy().sub(components.sprite.bounds.xy)
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
                const intersection = pointedCard.sprite.bounds.copy().intersection(pile.sprite.bounds);
                if (intersection.flipped || intersection.areaNum <= 0) continue;
                if (pile.pile.type == 'Waste' || !Solitaire.isBuildable(update.solitaire, pile.pile)) continue;
                if (bestMatch == null || intersection.areaNum > bestMatch.intersection.areaNum) bestMatch = {
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
        } else if (sprite.intersectsBounds(update.cursor.bounds.xy)) {
            update.pickHandled = true;
            Solitaire.reset(update.solitaire);
            update.saveStorage.save.wins = update.solitaire.wins;
            SaveStorage.save(update.saveStorage);
        }
    }
});
function getStockXY(solitaire, indexY) {
    return new I16XY(boardX + 160, 16 + (solitaire.stock.length - 1 == indexY ? 0 : hiddenY));
}
function getWasteXY(solitaire, index) {
    const top = solitaire.waste.length - solitaire.drawSize;
    const betterIndex = Math.max(index - top, 0);
    return new I16XY(208, 16 + betterIndex * 8);
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
    return new I16XY(x, 16);
}
function getTableauCardXY(filmByID, indexX, indexY) {
    const film = filmByID.CardVacantPile;
    const x = boardX + indexX * (film.wh.x + 8);
    return new I16XY(x, 72 + indexY * 8);
}
const PileHitboxSystem = Immutable({
    query: new Set([
        'pile',
        'sprite'
    ]),
    updateEnt (set, update) {
        const { pile , sprite  } = set;
        const cardWH = new U16XY(24, 32);
        const xy = pile.type == 'Waste' ? sprite.bounds.xy.copy().addTrunc(8 - 1, 8 - 1) : pile.type == 'Tableau' ? getTableauCardXY(update.filmByID, pile.x, Uint(0)) : getFoundationCardXY(update.filmByID, pile.suit);
        sprite.bounds.moveToTrunc(xy.x - 8 + 1, xy.y - 8 + 1);
        sprite.bounds.sizeToTrunc(cardWH.x + 8 * 2 - 1, cardWH.y + (pile.type == 'Waste' ? (update.solitaire.waste.length > 0 ? update.solitaire.drawSize - 1 : 0) * 8 : pile.type == 'Tableau' ? Math.max(0, update.solitaire.tableau[pile.x].length - 1) * 8 : 0) + 8 * 2 - 1);
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
        if (!set.sprite.intersectsBounds(update.cursor.bounds.xy)) return;
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
    const random = new Random(I32.mod(Date.now()));
    const saveStorage = SaveStorage.load(localStorage);
    const solitaire = Solitaire(undefined, ()=>random.fraction, saveStorage.save.wins);
    const newRenderer = ()=>Renderer(canvas, assets.atlas, assets.shaderLayout, assets.atlasMeta);
    const cardSystem = new CardSystem();
    const ecs = ECS(new Set([
        CamSystem,
        FollowCamSystem,
        new CursorSystem(),
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
        instanceBuffer: new InstanceBuffer(assets.shaderLayout),
        solitaire,
        ecs,
        input: new Input(cam),
        rendererStateMachine: new RendererStateMachine({
            window: window1,
            canvas,
            onFrame: (delta)=>SuperPatience.onFrame(self, delta),
            onPause: ()=>self.input.reset(),
            newRenderer
        }),
        tick,
        ticks: 0,
        delta: 0,
        get time () {
            return this.tick * this.ticks;
        },
        saveStorage,
        cursor: ECS.query(ecs, 'cursor', 'sprite')[0].sprite,
        filmByID: assets.atlasMeta.filmByID
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
    for (const ent of picked.ents){
        ent.components.sprite.bounds.moveToTrunc(update.cursor.bounds.xy.copy().sub(ent.offset));
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
                modulo: {
                    x: 8,
                    y: 8
                },
                orientation: 'Northeast',
                pad: {
                    x: 0,
                    y: 8 + i * 8
                }
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
            self.pickHandled = false;
            self.input.preupdate();
            ECS.update(self.ecs, self);
            self.input.postupdate(self.tick);
            self.ticks++;
        }
    }
    SuperPatience1.onFrame = onFrame;
})(SuperPatience || (SuperPatience = {}));
const __default8 = JSON.parse("{ \"name\": \"super-patience\", \"version\": \"1.0.3\" }");
console.log(`Super Patience v${__default8.version}
   ┌>°┐
by │  │idoid
   └──┘`);
const patience = await SuperPatience.make(window);
SuperPatience.start(patience);
