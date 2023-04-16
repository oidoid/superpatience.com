// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function mapEntries(record, transformer) {
    const ret = {};
    const entries = Object.entries(record);
    for (const entry of entries){
        const [mappedKey, mappedValue] = transformer(entry);
        ret[mappedKey] = mappedValue;
    }
    return ret;
}
function Inverse(obj) {
    return mapEntries(obj, ([key, val])=>[
            val,
            key
        ]);
}
function shuffle(self, random) {
    for(let i = self.length - 1; i >= 0; i--){
        swapIndices(self, i, Math.trunc(random() * (i + 1)));
    }
}
function swapIndices(self, left, right) {
    [self[left], self[right]] = [
        self[right],
        self[left]
    ];
}
function assert(condition, msg) {
    if (!condition) throw Error(msg);
}
function colorIntToFloats(color) {
    return [
        (color >> 24 & 0xff) / 0xff,
        (color >> 16 & 0xff) / 0xff,
        (color >> 8 & 0xff) / 0xff,
        (color >> 0 & 0xff) / 0xff
    ];
}
function capitalize(str) {
    if (str[0] == null) return str;
    return `${str[0].toLocaleUpperCase()}${str.slice(1)}`;
}
function isBlank(str) {
    return str == null || /^\s*$/.test(str);
}
function uncapitalize(str) {
    if (str[0] == null) return str;
    return `${str[0].toLocaleLowerCase()}${str.slice(1)}`;
}
function compareEn(lhs, rhs, options) {
    return lhs.localeCompare(rhs, 'en', options);
}
function wrapNum(num, min, max) {
    if (min === max) return min;
    assert(max > min, `max=${max} < min=${min}.`);
    const range = max - min;
    const x = (num - min) % range;
    const y = x + range;
    const z = y % range;
    return z + min;
}
function round(num) {
    return num < 0 ? -Math.round(-num) : Math.round(num);
}
class XY {
    static fromJSON(json) {
        return new this(json.x ?? 0, json.y ?? 0);
    }
    x;
    y;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    add(xXY, y) {
        this.x += typeof xXY === 'number' ? xXY : xXY.x;
        this.y += typeof xXY === 'number' ? y : xXY.y;
        return this;
    }
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    copy() {
        return new XY(this.x, this.y);
    }
    div(xXY, y) {
        this.x /= typeof xXY === 'number' ? xXY : xXY.x;
        this.y /= typeof xXY === 'number' ? y : xXY.y;
        return this;
    }
    eq(xXY, y) {
        return this.x === (typeof xXY === 'number' ? xXY : xXY.x) && this.y === (typeof xXY === 'number' ? y : xXY.y);
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    max(xXY, y) {
        this.x = Math.max(this.x, typeof xXY === 'number' ? xXY : xXY.x);
        this.y = Math.max(this.y, typeof xXY === 'number' ? y : xXY.y);
        return this;
    }
    min(xXY, y) {
        this.x = Math.min(this.x, typeof xXY === 'number' ? xXY : xXY.x);
        this.y = Math.min(this.y, typeof xXY === 'number' ? y : xXY.y);
        return this;
    }
    mul(xXY, y) {
        this.x *= typeof xXY === 'number' ? xXY : xXY.x;
        this.y *= typeof xXY === 'number' ? y : xXY.y;
        return this;
    }
    round() {
        this.x = round(this.x);
        this.y = round(this.y);
        return this;
    }
    set(xXY, y) {
        this.x = typeof xXY === 'number' ? xXY : xXY.x;
        this.y = typeof xXY === 'number' ? y : xXY.y;
        return this;
    }
    sub(xXY, y) {
        this.x -= typeof xXY === 'number' ? xXY : xXY.x;
        this.y -= typeof xXY === 'number' ? y : xXY.y;
        return this;
    }
    toJSON() {
        return {
            ...this.x === 0 ? undefined : {
                x: this.x
            },
            ...this.y === 0 ? undefined : {
                y: this.y
            }
        };
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    trunc() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        return this;
    }
}
class Box {
    static fromJSON(json) {
        return new this(json.x ?? 0, json.y ?? 0, json.w ?? 0, json.h ?? 0);
    }
    xy;
    wh;
    constructor(xXY, yWH, w, h){
        this.xy = typeof xXY === 'number' ? new XY(xXY, yWH) : xXY;
        this.wh = typeof yWH === 'number' ? new XY(w, h) : yWH;
    }
    get area() {
        return this.wh.x * this.wh.y;
    }
    get center() {
        return this.wh.copy().div(2, 2).add(this.xy);
    }
    contains(xyBox) {
        return this.wh.x !== 0 && this.wh.y !== 0 && this.x <= xyBox.x && this.x + this.w >= xyBox.x + (xyBox.w ?? 0) && this.y <= xyBox.y && this.y + this.h >= xyBox.y + (xyBox.h ?? 0);
    }
    copy() {
        return new Box(this.x, this.y, this.w, this.h);
    }
    get empty() {
        return this.wh.x === 0 || this.wh.y === 0;
    }
    get end() {
        return this.xy.copy().add(this.wh);
    }
    eq(box) {
        return this.xy.x === box.xy.x && this.xy.y === box.xy.y && this.wh.x === box.wh.x && this.wh.y === box.wh.y;
    }
    get flipped() {
        return this.wh.x < 0 || this.wh.y < 0;
    }
    get h() {
        return this.wh.y;
    }
    set h(h) {
        this.wh.y = h;
    }
    intersection(box) {
        const xy = box.min.max(this.min);
        const wh = box.max.min(this.max).sub(xy);
        this.xy.set(xy);
        this.wh.set(wh);
        return this;
    }
    intersects(xyBox) {
        return this.x < xyBox.x + (xyBox.w ?? 0) && this.x + this.w > xyBox.x && this.y < xyBox.y + (xyBox.h ?? 0) && this.y + this.h > xyBox.y;
    }
    get max() {
        return this.xy.copy().add(Math.max(this.w, 0), Math.max(this.h, 0));
    }
    get min() {
        return this.xy.copy().add(Math.min(this.w, 0), Math.min(this.h, 0));
    }
    toJSON() {
        return {
            ...this.x === 0 ? undefined : {
                x: this.x
            },
            ...this.y === 0 ? undefined : {
                y: this.y
            },
            ...this.w === 0 ? undefined : {
                w: this.w
            },
            ...this.h === 0 ? undefined : {
                h: this.h
            }
        };
    }
    toString() {
        return `[${this.xy}, ${this.w}×${this.h}]`;
    }
    union(box) {
        const xy = box.min.min(this.min);
        const wh = box.max.max(this.max).sub(xy);
        this.xy.set(xy);
        this.wh.set(wh);
        return this;
    }
    get w() {
        return this.wh.x;
    }
    set w(w) {
        this.wh.x = w;
    }
    get x() {
        return this.xy.x;
    }
    set x(x) {
        this.xy.x = x;
    }
    get y() {
        return this.xy.y;
    }
    set y(y) {
        this.xy.y = y;
    }
}
function NonNull(val, msg) {
    assertNonNull(val, msg);
    return val;
}
function assertNonNull(val, msg) {
    assert(val != null, msg ?? 'Expected nonnullish value.');
}
new Set([
    'Down',
    'Up'
]);
new Set([
    'Directed',
    'Undirected'
]);
const RankSet = new Set([
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
]);
const rankToOrder = [
    ...RankSet
].reduce((order, value, index)=>({
        ...order,
        [value]: index
    }), {});
const rankToPoint = {
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
};
Inverse(rankToPoint);
const rankToASCII = {
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
};
new Set([
    'Black',
    'Red'
]);
const SuitSet = new Set([
    'Clubs',
    'Diamonds',
    'Hearts',
    'Spades'
]);
const suitToOrder = [
    ...SuitSet
].reduce((order, value, index)=>({
        ...order,
        [value]: index
    }), {});
Inverse(suitToOrder);
const suitToColor = {
    Clubs: 'Black',
    Diamonds: 'Red',
    Hearts: 'Red',
    Spades: 'Black'
};
const suitToASCII = {
    Clubs: 'C',
    Diamonds: 'D',
    Hearts: 'H',
    Spades: 'S'
};
const unicode = {
    rangeStart: 0x1f0a0,
    rankSize: 16,
    suitMax: 3
};
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
function newDeck(direction = 'Down') {
    const deck = [];
    for (const suit of SuitSet){
        for (const rank of RankSet)deck.push({
            suit,
            rank,
            direction
        });
    }
    return deck;
}
const succeeds = (lhs, rhs)=>{
    if (lhs?.direction === 'Down' || rhs?.direction === 'Down') return false;
    if (rhs == null) return lhs != null;
    if (lhs == null) return rhs.rank === 'King';
    return suitToColor[lhs.suit] !== suitToColor[rhs.suit] && rankToOrder[lhs.rank] === rankToOrder[rhs.rank] + 1;
};
function tableauDeal(self, stock) {
    for (const [index, lane] of self.entries()){
        assert(lane.length === 0, 'Tableau must be reset before dealt.');
        const cards = stock.splice(-index - 1);
        for (const card of cards)card.direction = 'Down';
        lane.push(...cards);
    }
}
function Solitaire(random, wins, drawSize, tableauSize) {
    drawSize ??= 3;
    random ??= Math.random;
    tableauSize ??= 7;
    const stock = newDeck();
    shuffle(stock, random);
    const self = {
        drawSize,
        foundation: Foundation(),
        stock,
        tableau: Tableau(tableauSize),
        waste: [],
        random,
        tableauSize,
        wins: wins ?? 0
    };
    tableauDeal(self.tableau, stock);
    return self;
}
function cardSucceeds(succeeds, ...cards) {
    if (cards.length === 0) return succeeds(undefined, undefined);
    for(let index = 0; index <= cards.length - 1; index++){
        if (!succeeds(cards[index], cards[index + 1])) return false;
    }
    return true;
}
function cardToASCII(card) {
    return `${suitToASCII[card.suit]}${rankToASCII[card.rank]}`;
}
function cardToString(visibility, ...cards) {
    return cards.reduce((str, card)=>str + _cardToString(visibility, card), '');
}
function _cardToString(visibility, card) {
    if (visibility === 'Directed' && card.direction === 'Down') return '🂠';
    const point = unicode.rangeStart + (unicode.suitMax - suitToOrder[card.suit]) * unicode.rankSize + rankToPoint[card.rank];
    return String.fromCodePoint(point);
}
const succeeds1 = (lhs, rhs)=>{
    if (lhs?.direction === 'Down' || rhs?.direction === 'Down') return false;
    if (rhs == null) return lhs != null;
    if (lhs == null) return rhs.rank === 'Ace';
    if (lhs.suit !== rhs.suit) return false;
    return rankToOrder[lhs.rank] + 1 === rankToOrder[rhs.rank];
};
const suitToIndex = {
    Clubs: 0,
    Diamonds: 1,
    Hearts: 2,
    Spades: 3
};
function foundationBuild(self, cards) {
    const card = cards[0];
    if (card == null || !foundationIsBuildable(self, cards)) return;
    foundationGetPillar(self, card.suit).push(...cards.splice(0));
}
function foundationGetPillar(self, suit) {
    return self[suitToIndex[suit]];
}
function foundationIsBuildable(self, cards) {
    const card = cards[0];
    if (card == null || !cardSucceeds(succeeds1, ...cards)) return false;
    return succeeds1(foundationGetPillar(self, card.suit).at(-1), card);
}
function foundationSelect(self, card) {
    for (const [index, foundation] of self.entries()){
        const y = foundation.indexOf(card);
        if (y === -1) continue;
        return {
            cards: foundation.splice(y),
            pile: 'Foundation',
            xy: new XY(index, y)
        };
    }
}
function foundationIsBuilt(self) {
    return foundationIsPillarBuilt(...Object.values(self));
}
function foundationIsPillarBuilt(...pillars) {
    return pillars.every((pillar)=>pillar.at(-1)?.rank === 'King');
}
function tableauBuild(lane, cards) {
    if (!tableauIsBuildable(lane, cards)) return;
    lane.push(...cards.splice(0));
}
function tableauSelect(self, card) {
    for (const [x, lane] of self.entries()){
        const y = lane.indexOf(card);
        if (y === -1) continue;
        return {
            cards: lane.splice(y),
            pile: 'Tableau',
            xy: new XY(x, y)
        };
    }
}
function tableauIsBuildable(lane, cards) {
    if (!cardSucceeds(succeeds, ...cards)) return false;
    return succeeds(lane.at(-1), cards[0]);
}
function solitaireReset(self) {
    if (solitaireIsWon(self)) self.wins++;
    for (const pillar of self.foundation)self.stock.push(...pillar.splice(0));
    for (const lane of self.tableau)self.stock.push(...lane.splice(0));
    self.stock.push(...self.waste.splice(0));
    for (const card of self.stock)card.direction = 'Down';
    shuffle(self.stock, self.random);
    tableauDeal(self.tableau, self.stock);
}
function solitairePoint(self, card) {
    solitaireDeselect(self);
    const stockY = self.stock.indexOf(card);
    if (stockY !== -1) {
        if (stockY !== self.stock.length - 1) return;
        const y = Math.max(0, stockY - (self.drawSize - 1));
        const cards = self.stock.splice(y).reverse();
        for (const card of cards)card.direction = 'Up';
        self.waste.push(...cards);
        return;
    }
    const wasteY = self.waste.indexOf(card);
    if (wasteY !== -1) {
        self.selected = {
            cards: self.waste.splice(wasteY),
            pile: 'Waste',
            xy: new XY(0, wasteY)
        };
        return self.selected;
    }
    self.selected = NonNull(foundationSelect(self.foundation, card) ?? tableauSelect(self.tableau, card), `Missing card ${cardToString('Undirected', card)}.`);
    const { cards  } = self.selected;
    if (cards.length === 1 && cards[0]?.direction === 'Down') {
        cards[0].direction = 'Up';
        solitaireDeselect(self);
    }
    return self.selected;
}
function solitaireDeal(self) {
    solitaireDeselect(self);
    if (self.stock.length > 0) return;
    const waste = self.waste.splice(0).reverse();
    for (const card of waste)card.direction = 'Down';
    self.stock.push(...waste);
}
function solitaireIsBuildable(self, at) {
    if (self.selected == null) return false;
    if (at.type === 'Foundation') {
        return foundationIsBuildable(self.foundation, self.selected.cards);
    }
    return tableauIsBuildable(NonNull(self.tableau[at.x]), self.selected.cards);
}
function solitaireIsWon(self) {
    return foundationIsBuilt(self.foundation);
}
function solitaireBuild(self, at) {
    if (self.selected == null) return;
    if (at.type === 'Foundation') {
        foundationBuild(self.foundation, self.selected.cards);
    } else tableauBuild(NonNull(self.tableau[at.x]), self.selected.cards);
    if (self.selected.cards.length !== 0) return;
    delete self.selected;
}
function solitaireDeselect(self) {
    if (self.selected == null) return;
    const pile = self.selected.pile === 'Waste' ? self.waste : self[uncapitalize(self.selected.pile)][self.selected.xy.x];
    pile.push(...self.selected.cards);
    delete self.selected;
}
class Animator {
    #film;
    #start;
    constructor(film, start = 0){
        this.#film = film;
        this.#start = start;
    }
    cel(time) {
        return this.#film.cels[this.index(time)];
    }
    get film() {
        return this.#film;
    }
    index(time) {
        const timeIndex = Math.trunc((time - this.#start) / this.#film.period);
        if (this.played(time)) return endIndex[this.#film.direction](this.#film);
        return period[this.#film.direction](this.#film, timeIndex);
    }
    played(time) {
        const loops = (time - this.#start) / this.#film.duration;
        return loops >= this.#film.loops;
    }
    reset(start, film) {
        this.#film = film ?? this.#film;
        this.#start = start;
    }
}
const period = {
    Forward: (film, timeIndex)=>timeIndex % film.cels.length,
    Reverse (film, timeIndex) {
        return film.cels.length - 1 - timeIndex % film.cels.length;
    },
    PingPong (film, timeIndex) {
        const start = film.cels[0].duration / film.period;
        const end = film.cels[film.cels.length - 1].duration / film.period;
        const wrap = wrapNum(timeIndex, start + end - film.cels.length, film.cels.length);
        return Math.abs(wrap < 0 ? wrap - start + 1 : wrap);
    },
    PingPongReverse (film, timeIndex) {
        return this.PingPong(film, film.cels.length - 1 - timeIndex);
    }
};
const endIndex = {
    Forward: (film)=>film.cels.length - 1,
    Reverse: ()=>0,
    PingPong (film) {
        const start = film.cels[0].duration / film.period;
        return Math.min(start, film.cels.length - 1);
    },
    PingPongReverse (film) {
        const end = film.cels[film.cels.length - 1].duration / film.period;
        return Math.max(film.cels.length - (end + 1), 0);
    }
};
function mapValues(record, transformer) {
    const ret = {};
    const entries = Object.entries(record);
    for (const [key, value] of entries){
        const mappedValue = transformer(value);
        ret[key] = mappedValue;
    }
    return ret;
}
class Atlas {
    version;
    filename;
    format;
    wh;
    filmByID;
    celBoundsByID;
    static fromJSON(json) {
        return new Atlas(json.version, json.filename, json.format, XY.fromJSON(json.wh), mapValues(json.filmByID, parseFilm), json.celBoundsByID.map((bounds)=>Box.fromJSON(bounds)));
    }
    constructor(version, filename, format, wh, filmByID, celBoundsByID){
        this.version = version;
        this.filename = filename;
        this.format = format;
        this.wh = wh;
        this.filmByID = filmByID;
        this.celBoundsByID = celBoundsByID;
    }
}
function parseFilm(json) {
    return {
        id: json.id,
        duration: json.duration,
        wh: XY.fromJSON(json.wh),
        cels: json.cels.map(parseCel),
        sliceBounds: Box.fromJSON(json.sliceBounds),
        period: json.period,
        direction: json.direction,
        loops: json.loops == null ? Number.POSITIVE_INFINITY : json.loops
    };
}
function parseCel(json) {
    return {
        id: json.id,
        bounds: Box.fromJSON(json.bounds),
        duration: json.duration,
        sliceBounds: Box.fromJSON(json.sliceBounds),
        slices: json.slices.map((slice)=>Box.fromJSON(slice))
    };
}
new Set([
    'Forward',
    'Reverse',
    'PingPong',
    'PingPongReverse'
]);
const __default = JSON.parse("{\n  \"//\": \"https://w3c.github.io/gamepad/#remapping\",\n  \"buttons\": {\n    \"14\": \"Left\",\n    \"15\": \"Right\",\n    \"12\": \"Up\",\n    \"13\": \"Down\",\n    \"0\": \"Action\",\n    \"9\": \"Menu\"\n  },\n  \"axes\": {\n    \"0\": \"Left\",\n    \"1\": \"Up\",\n    \"2\": \"Left\",\n    \"3\": \"Up\"\n  }\n}");
const __default1 = JSON.parse("{\n  \"ArrowLeft\": \"Left\",\n  \"a\": \"Left\",\n  \"ArrowRight\": \"Right\",\n  \"d\": \"Right\",\n  \"ArrowUp\": \"Up\",\n  \"w\": \"Up\",\n  \"ArrowDown\": \"Down\",\n  \"s\": \"Down\",\n  \" \": \"Action\",\n  \"Enter\": \"Action\",\n  \"Escape\": \"Menu\",\n  \"Ctrl+Alt+Shift+D\": \"DebugContextLoss\",\n  \"0\": \"ScaleReset\",\n  \"-\": \"ScaleDecrease\",\n  \"+\": \"ScaleIncrease\"\n}");
const __default2 = JSON.parse("{ \"0\": \"Point\", \"1\": \"Action\" }");
const __default3 = JSON.parse("{\n  \"uniforms\": {\n    \"uAtlas\": \"uAtlas\",\n    \"uAtlasSize\": \"uAtlasSize\",\n    \"uProjection\": \"uProjection\",\n    \"uSourceByCelID\": \"uSourceByCelID\"\n  },\n  \"perVertex\": [{ \"name\": \"vUV\", \"type\": \"UNSIGNED_SHORT\", \"len\": 2 }],\n  \"perInstance\": [\n    { \"name\": \"iCelID\", \"type\": \"UNSIGNED_SHORT\", \"len\": 1 },\n    { \"name\": \"iTarget\", \"type\": \"SHORT\", \"len\": 4 },\n    { \"name\": \"iFlipWrapAnchorLayer\", \"type\": \"UNSIGNED_INT\", \"len\": 1 }\n  ]\n}");
class Synth {
    #context = new AudioContext();
    oscillator;
    gain;
    play(type, startFrequency, endFrequency, duration) {
        const oscillator = this.#context.createOscillator();
        const gain = this.#context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(startFrequency, this.#context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, this.#context.currentTime + duration);
        gain.gain.setValueAtTime(1, this.#context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.#context.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(this.#context.destination);
        oscillator.start();
        oscillator.stop(this.#context.currentTime + duration);
        this.oscillator = oscillator;
        this.gain = gain;
    }
}
const FollowCamFillSet = new Set([
    'X',
    'Y',
    'XY'
]);
const FollowCamOrientationSet = new Set([
    'North',
    'Northeast',
    'East',
    'Southeast',
    'South',
    'Southwest',
    'West',
    'Northwest',
    'Center'
]);
function parseQuerySet(query) {
    return query.split(' | ').sort(compareEn).map((and)=>new Set(and.split(' & ').sort(compareEn)));
}
const query = 'followCam & sprites';
class FollowCamSystem {
    query = query;
    runEnt(ent, game) {
        const sprites = ent.sprites.values();
        const sprite = sprites.next().value;
        const xy = sprite.bounds.xy.copy();
        follow(ent.followCam, sprite, game);
        const diff = sprite.bounds.xy.copy().sub(xy);
        for (const sprite of sprites){
            sprite.x += diff.x;
            sprite.y += diff.y;
        }
    }
}
function follow(followCam, sprite, game) {
    const pad = new XY(followCam.pad?.x ?? 0, followCam.pad?.y ?? 0);
    if (followCam.fill === 'X' || followCam.fill === 'XY') {
        sprite.w = game.cam.viewport.w - pad.x * 2;
    }
    if (followCam.fill === 'Y' || followCam.fill === 'XY') {
        sprite.h = game.cam.viewport.h - pad.y * 2;
    }
    sprite.x = computeX(sprite, game.cam, followCam);
    sprite.y = computeY(sprite, game.cam, followCam);
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
            x += padW;
            break;
        case 'Southeast':
        case 'East':
        case 'Northeast':
            x += camW - (spriteW + padW);
            break;
        case 'North':
        case 'South':
        case 'Center':
            x += Math.trunc(camW / 2) - (Math.trunc(spriteW / 2) + padW);
            break;
    }
    const modulo = (component.modulo?.x ?? x) || 1;
    return x - x % modulo;
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
            y += padH;
            break;
        case 'Southeast':
        case 'South':
        case 'Southwest':
            y += camH - (spriteH + padH);
            break;
        case 'East':
        case 'West':
        case 'Center':
            y += Math.trunc(camH / 2) - (Math.trunc(spriteH / 2) + padH);
            break;
    }
    const modulo = (component.modulo?.y ?? y) || 1;
    return y - y % modulo;
}
const query1 = 'followDpad & sprites';
class FollowDpadSystem {
    query = query1;
    runEnt(ent, game) {
        const speed = game.tick / 4;
        if (game.input.isOn('Left')) ent.sprites[0].x -= speed;
        if (game.input.isOn('Right')) ent.sprites[0].x += speed;
        if (game.input.isOn('Up')) ent.sprites[0].y -= speed;
        if (game.input.isOn('Down')) ent.sprites[0].y += speed;
    }
}
const query2 = 'followPoint & sprites';
class FollowPointSystem {
    query = query2;
    runEnt(ent, game) {
        if (game.input.xy != null) ent.sprites[0].setXY(game.input.xy);
    }
}
const ButtonSet = new Set([
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
]);
function* buttonsFromBits(bits) {
    for (const button of ButtonSet){
        if ((bits & ButtonBit[button]) === ButtonBit[button]) yield button;
    }
}
function buttonsToBits(...buttons) {
    return buttons.reduce((sum, button)=>sum | ButtonBit[button], 0);
}
const ButtonBit = {
    Left: 0b000_0000_0001,
    Right: 0b000_0000_0010,
    Up: 0b000_0000_0100,
    Down: 0b000_0000_1000,
    Point: 0b000_0001_0000,
    Action: 0b000_0010_0000,
    Menu: 0b000_0100_0000,
    DebugContextLoss: 0b000_1000_0000,
    ScaleReset: 0b001_0000_0000,
    ScaleIncrease: 0b010_0000_0000,
    ScaleDecrease: 0b100_0000_0000
};
const InvertButtonBit = {
    Left: ButtonBit.Right,
    Right: ButtonBit.Left,
    Up: ButtonBit.Down,
    Down: ButtonBit.Up
};
const PointerTypeSet = new Set([
    'Mouse',
    'Pen',
    'Touch'
]);
function parsePointerType(type) {
    const pointerType = capitalize(type);
    return isPointerType(pointerType) ? pointerType : undefined;
}
function isPointerType(type) {
    return PointerTypeSet.has(type);
}
function loadImage(src) {
    return new Promise((resolve, reject)=>{
        const image = new Image();
        image.onload = ()=>resolve(image);
        image.onerror = ()=>reject(image);
        image.src = src;
    });
}
function initGLAttribute(gl, stride, divisor, buffer, location, attrib) {
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribIPointer(location, attrib.len, gl[attrib.type], stride, attrib.offset);
    gl.vertexAttribDivisor(location, divisor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function loadGLProgram(gl, vertexGLSL, fragmentGLSL) {
    const program = gl.createProgram();
    if (program == null) return null;
    const vertexShader = compileGLShader(gl, gl.VERTEX_SHADER, vertexGLSL);
    const fragmentShader = compileGLShader(gl, gl.FRAGMENT_SHADER, fragmentGLSL);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    const log = gl.getProgramInfoLog(program)?.slice(0, -1);
    if (log) console.warn(log);
    gl.detachShader(program, fragmentShader);
    gl.detachShader(program, vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return program;
}
function compileGLShader(gl, type, source) {
    const shader = gl.createShader(type);
    assertNonNull(shader, 'Shader creation failed.');
    gl.shaderSource(shader, source.trim());
    gl.compileShader(shader);
    const log = gl.getShaderInfoLog(shader)?.slice(0, -1);
    if (log) console.warn(log);
    return shader;
}
function bufferGLData(gl, buffer, data, usage) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function loadGLTexture(gl, textureUnit, image) {
    gl.activeTexture(textureUnit);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
}
function loadGLDataTexture(gl, textureUnit, internalFormat, width, height, format, type, dat) {
    gl.activeTexture(textureUnit);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, dat);
    return texture;
}
function getGLUniformLocations(gl, program) {
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
function getGLUniformLocation(layout, uniforms, name) {
    return NonNull(uniforms[NonNull(layout.uniforms[name])]);
}
function getGLAttributeLocations(gl, program) {
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
function viewportScale(nativeViewportWH, minViewportWH, zoomOut) {
    const x = nativeViewportWH.x / minViewportWH.x;
    const y = nativeViewportWH.y / minViewportWH.y;
    return Math.max(1, Math.floor(Math.min(x, y)) - zoomOut);
}
function clientViewportWH(window1) {
    return new XY(window1.innerWidth, window1.innerHeight);
}
function nativeViewportWH(window1, clientViewportWH) {
    return new XY(clientViewportWH.x * window1.devicePixelRatio, clientViewportWH.y * window1.devicePixelRatio).round();
}
function camWH(nativeViewportWH, scale) {
    return new XY(nativeViewportWH.x / scale, nativeViewportWH.y / scale).floor();
}
function nativeCanvasWH(camWH, scale) {
    return new XY(camWH.x * scale, camWH.y * scale);
}
function clientCanvasWH(window1, nativeCanvasWH) {
    const ratio = window1.devicePixelRatio;
    return new XY(nativeCanvasWH.x / ratio, nativeCanvasWH.y / ratio);
}
function viewportToLevelXY(point, clientViewportWH, cam) {
    return new XY(cam.x + point.x / clientViewportWH.x * cam.w, cam.y + point.y / clientViewportWH.y * cam.h).round();
}
const littleEndian = new Int8Array(new Int16Array([
    1
]).buffer)[0] === 1;
class BitmapBuffer {
    #view;
    #size;
    #layout;
    get buffer() {
        return this.#view;
    }
    get size() {
        return this.#size;
    }
    constructor(layout, len = 0){
        this.#view = new DataView(new ArrayBuffer(layout.perInstance.stride * len));
        this.#layout = layout;
        this.#size = 0;
    }
    set(index, bmp, time) {
        const i = index * this.#layout.perInstance.stride;
        this.#resize(i + this.#layout.perInstance.stride);
        this.#view.setUint16(i + 0, bmp.cel(time).id, littleEndian);
        this.#view.setInt16(i + 2, bmp.x, littleEndian);
        this.#view.setInt16(i + 4, bmp.y, littleEndian);
        this.#view.setInt16(i + 6, bmp.w, littleEndian);
        this.#view.setInt16(i + 8, bmp.h, littleEndian);
        this.#view.setUint32(i + 12, bmp.flipWrapAnchorLayer, littleEndian);
        this.#size = index + 1;
    }
    #resize(minLen) {
        if (minLen <= this.#view.byteLength) return;
        const buffer = new ArrayBuffer(minLen * 2);
        new Uint8Array(buffer).set(new Uint8Array(this.#view.buffer));
        this.#view = new DataView(buffer);
    }
}
const BitmapFlipXShift = 17;
const BitmapFlipYShift = 16;
const BitmapWrapXMask = 0b1111;
const BitmapWrapXShift = 12;
const BitmapWrapYMask = 0b1111;
const BitmapWrapYShift = 8;
const BitmapLayerAnchorEndShift = 7;
const BitmapLayerMask = 0b111_1111;
const BitmapLayerShift = 0;
const GLDataTypeSize = {
    BYTE: 1,
    UNSIGNED_BYTE: 1,
    SHORT: 2,
    UNSIGNED_SHORT: 2,
    INT: 4,
    UNSIGNED_INT: 4,
    FLOAT: 4
};
function parseShaderLayout(config) {
    return {
        uniforms: config.uniforms,
        perVertex: parseAttributes(0, config.perVertex),
        perInstance: parseAttributes(1, config.perInstance)
    };
}
function parseAttributes(divisor, configs) {
    const attribs = configs.reduce(reduceAttribVariable, []);
    const maxDataTypeSize = attribs.reduce((max, attrib)=>Math.max(max, GLDataTypeSize[attrib.type]), 0);
    const lastAttrib = attribs.at(-1);
    const size = lastAttrib == null ? 0 : nextAttribOffset(lastAttrib, lastAttrib.type);
    return {
        len: attribs.reduce((sum, { len  })=>sum + len, 0),
        stride: ceilMultiple(maxDataTypeSize, size),
        divisor,
        attributes: attribs
    };
}
function reduceAttribVariable(attribs, { type , name , len  }, index) {
    const attrib = attribs[index - 1];
    const offset = attrib == null ? 0 : nextAttribOffset(attrib, type);
    assert(isGLDataType(type), `${type} is not a GLDataType.`);
    return attribs.concat({
        type,
        name,
        len,
        offset
    });
}
function nextAttribOffset(attrib, type) {
    return ceilMultiple(GLDataTypeSize[type], attrib.offset + GLDataTypeSize[attrib.type] * attrib.len);
}
function isGLDataType(type) {
    return type in GLDataTypeSize;
}
function ceilMultiple(multiple, val) {
    return multiple === 0 ? 0 : Math.ceil(val / multiple) * multiple;
}
const Layer = {
    Top: 0x01,
    Cursor: 0x01,
    Bottom: 0x40
};
class JSONStorage {
    #storage;
    constructor(storage){
        this.#storage = storage;
    }
    clear() {
        this.#storage.clear();
    }
    get(key) {
        const val = this.#storage.getItem(key);
        return val == null ? undefined : JSON.parse(val);
    }
    put(key, val) {
        if (val == null) this.#storage.removeItem(key);
        else this.#storage.setItem(key, JSON.stringify(val));
    }
}
function fontCharToFilmID(self, __char) {
    let pt = __char.codePointAt(0);
    if (pt == null || pt > 0xff) pt = 63;
    return `${self.id}--${pt.toString(16).padStart(2, '0')}`;
}
function fontKerning(self, lhs, rhs) {
    if (rhs == null) return self.endOfLineKerning;
    if (isBlank(lhs) || isBlank(rhs)) return self.whitespaceKerning;
    return self.kerning[lhs + rhs] ?? self.defaultKerning;
}
function fontCharWidth(self, letter) {
    return self.charWidth[letter] ?? self.defaultCharWidth;
}
function layoutText(font, str, width) {
    const chars = [];
    let cursor = new XY(0, 0);
    for(let i = 0, __char = str[i]; __char != null; __char = str[i]){
        let layout;
        if (__char === '\n') layout = layoutNewline(font, cursor);
        else if (isBlank(__char)) {
            layout = layoutSpace(font, cursor, width, tracking(font, __char, str[i + 1]));
        } else {
            layout = layoutWord(font, cursor, width, str, i);
            if (cursor.x > 0 && layout.cursor.y === nextLine(font, cursor.y).y) {
                const word_width = width - cursor.x + layout.cursor.x;
                if (word_width <= width) {
                    cursor = nextLine(font, cursor.y);
                    layout = layoutWord(font, cursor, width, str, i);
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
const SpriteFlipSet = new Set([
    'X',
    'Y',
    'XY'
]);
class Sprite {
    #animator;
    #bounds;
    #hitbox;
    #flipWrapAnchorLayer;
    constructor(film, layer, props){
        this.#animator = new Animator(film, props?.time);
        const flipX = props?.flip === 'X' || props?.flip === 'XY';
        const flipY = props?.flip === 'Y' || props?.flip === 'XY';
        this.#bounds = new Box(props?.xy?.x ?? props?.x ?? 0, props?.xy?.y ?? props?.y ?? 0, props?.wh?.x ?? props?.w ?? film.wh.x, props?.wh?.y ?? props?.h ?? film.wh.y);
        this.#hitbox = film.sliceBounds.copy();
        this.#hitbox.x = this.#bounds.x + (flipX ? this.#hitbox.w - this.#hitbox.x : this.#hitbox.x);
        this.#hitbox.y = this.#bounds.y + (flipY ? this.#hitbox.h - this.#hitbox.y : this.#hitbox.y);
        this.#flipWrapAnchorLayer = 0;
        this.flipX = flipX;
        this.flipY = flipY;
        this.wrapX = props?.wrap?.x ?? 0;
        this.wrapY = props?.wrap?.y ?? 0;
        this.anchorEnd = props?.anchorEnd ?? false;
        this.layer = layer;
    }
    get anchorEnd() {
        return !!(this.#flipWrapAnchorLayer >> 7 & 0b1);
    }
    set anchorEnd(end) {
        if (end) this.#flipWrapAnchorLayer |= 1 << BitmapLayerAnchorEndShift;
        else this.#flipWrapAnchorLayer &= ~(1 << BitmapLayerAnchorEndShift);
    }
    animate(start, film) {
        this.#animator.reset(start, film);
        if (film == null) return;
        this.flipX = !!this.flipX;
        this.flipY = !!this.flipY;
    }
    get area() {
        return this.#bounds.area;
    }
    get bounds() {
        return this.#bounds;
    }
    cel(time) {
        return this.#animator.cel(time);
    }
    get center() {
        return this.#bounds.center;
    }
    compareDepth(sprite) {
        const lhsAnchorEnd = this.anchorEnd;
        const lhsLayer = this.layer;
        const rhsAnchorEnd = sprite.anchorEnd;
        const rhsLayer = sprite.layer;
        return lhsLayer === rhsLayer ? sprite.bounds[rhsAnchorEnd ? 'xy' : 'end'].y - this.#bounds[lhsAnchorEnd ? 'xy' : 'end'].y : lhsLayer - rhsLayer;
    }
    get end() {
        return this.#bounds.end;
    }
    get film() {
        return this.#animator.film;
    }
    get flipWrapAnchorLayer() {
        return this.#flipWrapAnchorLayer;
    }
    get flipX() {
        return !!(this.#flipWrapAnchorLayer >> 17 & 0b1);
    }
    set flipX(flip) {
        if (flip) this.#flipWrapAnchorLayer |= 1 << BitmapFlipXShift;
        else this.#flipWrapAnchorLayer &= ~(1 << BitmapFlipXShift);
        const hitbox = this.#animator.film.sliceBounds;
        this.#hitbox.x = this.#bounds.x + (flip ? hitbox.w - hitbox.x : hitbox.x);
    }
    get flipY() {
        return !!(this.#flipWrapAnchorLayer >> 16 & 0b1);
    }
    set flipY(flip) {
        if (flip) this.#flipWrapAnchorLayer |= 1 << BitmapFlipYShift;
        else this.#flipWrapAnchorLayer &= ~(1 << BitmapFlipYShift);
        const hitbox = this.#animator.film.sliceBounds;
        this.#hitbox.y = this.#bounds.y + (flip ? hitbox.h - hitbox.y : hitbox.y);
    }
    get h() {
        return this.#bounds.h;
    }
    set h(h) {
        this.#bounds.h = h;
    }
    get hitbox() {
        return this.#hitbox;
    }
    hits(xyBoxSprite) {
        if (xyBoxSprite instanceof Box || xyBoxSprite instanceof XY) {
            return this.#hitbox.intersects(xyBoxSprite);
        }
        const sprite = xyBoxSprite;
        return this.#hitbox.intersects(sprite.hitbox);
    }
    isAbove(sprite) {
        return this.compareDepth(sprite) < 0;
    }
    get layer() {
        return this.#flipWrapAnchorLayer >> 0 & 0b111_1111;
    }
    set layer(layer) {
        this.#flipWrapAnchorLayer &= ~(BitmapLayerMask << BitmapLayerShift);
        this.#flipWrapAnchorLayer |= (layer & BitmapLayerMask) << BitmapLayerShift;
    }
    get max() {
        return this.#bounds.max;
    }
    get min() {
        return this.#bounds.min;
    }
    setXY(xy) {
        this.x = xy.x;
        this.y = xy.y;
    }
    toString() {
        const flip = this.flipX && this.flipY ? 'XY' : this.flipX ? 'X' : this.flipY ? 'Y' : 'no';
        return `Sprite {id=${this.film.id} box=${this.#bounds} flip=${flip} ` + `layer=${this.layer} anchor=${this.anchorEnd ? 'End' : 'Start'} ` + `wrap=${new XY(this.wrapX, this.wrapY)}}`;
    }
    get w() {
        return this.#bounds.w;
    }
    set w(w) {
        this.#bounds.w = w;
    }
    get wh() {
        return this.#bounds.wh;
    }
    get wrapX() {
        return wrapNum(this.#flipWrapAnchorLayer >> 12 & 0b1111, -(2 ** (4 - 1)), 2 ** (4 - 1));
    }
    set wrapX(wrap) {
        this.#flipWrapAnchorLayer &= ~(BitmapWrapXMask << BitmapWrapXShift);
        this.#flipWrapAnchorLayer |= (wrap & BitmapWrapXMask) << BitmapWrapXShift;
    }
    get wrapY() {
        return wrapNum(this.#flipWrapAnchorLayer >> 8 & 0b1111, -(2 ** (4 - 1)), 2 ** (4 - 1));
    }
    set wrapY(wrap) {
        this.#flipWrapAnchorLayer &= ~(BitmapWrapYMask << BitmapWrapYShift);
        this.#flipWrapAnchorLayer |= (wrap & BitmapWrapYMask) << BitmapWrapYShift;
    }
    get x() {
        return this.#bounds.x;
    }
    set x(x) {
        this.#hitbox.x += x - this.#bounds.x;
        this.#bounds.x = x;
    }
    get y() {
        return this.#bounds.y;
    }
    set y(y) {
        this.#hitbox.y += y - this.#bounds.y;
        this.#bounds.y = y;
    }
}
class Text {
    #font;
    #layer;
    #str;
    #rendered;
    #w;
    constructor(font, layer, str, w){
        this.#font = font;
        this.#layer = layer;
        this.#str = str;
        this.#rendered = false;
        this.#w = w;
    }
    get layer() {
        return this.#layer;
    }
    render(xy, filmByID, layer) {
        const str = this.#str.length === 0 ? '\0' : this.#str;
        const layout = layoutText(this.#font, str, this.#w);
        const sprites = [];
        for (const [i, __char] of layout.chars.entries()){
            if (__char == null) continue;
            const filmID = fontCharToFilmID(this.#font, str[i]);
            const sprite = new Sprite(filmByID[filmID], layer, __char.xy.add(xy));
            sprites.push(sprite);
        }
        this.#rendered = true;
        return sprites;
    }
    set str(str) {
        if (this.#str === str) return;
        this.#str = str;
        this.#rendered = false;
    }
    get valid() {
        return this.#rendered;
    }
}
class ECS {
    #systemByOrder = [];
    #ents = new Set();
    #entsByQuery = {};
    #entByComponent = new Map();
    #patchByEnt = new Map();
    #setByQuery = {};
    addEnt(...ents) {
        for (const ent of ents)this.#patchByEnt.set(ent, ent);
        return ents.length === 1 ? ents[0] : ents;
    }
    addSystem(...systems) {
        for (const system of systems)this.insertSystem(-0, system);
        return systems.length === 1 ? systems[0] : systems;
    }
    get entSize() {
        return this.#ents.size;
    }
    get(component) {
        return NonNull(this.#entByComponent.get(component), `Missing ent with component ${JSON.stringify(component)}.`);
    }
    insertSystem(order, system) {
        this.#systemByOrder.splice(Object.is(order, -0) ? this.#systemByOrder.length : order, 0, system);
        if (system.query in this.#entsByQuery) return system;
        this.#setByQuery[system.query] = parseQuerySet(system.query);
        this.#entsByQuery[system.query] = new Set(this.#uncachedQuery(system.query));
        return system;
    }
    patch() {
        for (const [ent, patch] of this.#patchByEnt.entries()){
            if (patch == null) this.#removeEntImmediately(ent);
            else {
                this.#ents.add(ent);
                this.#patchEnt(ent, patch);
                this.#invalidateSystemEnts(ent);
            }
        }
        this.#patchByEnt.clear();
    }
    *query(query) {
        const cache = this.#entsByQuery[query];
        if (cache != null) {
            return yield* cache.values();
        }
        yield* this.#uncachedQuery(query);
    }
    queryOne(query) {
        const ents = [
            ...this.query(query)
        ];
        assert(ents.length === 1, `Expected exactly one ent for "${query}" query, got ${ents.length}.`);
        return ents[0];
    }
    removeKeys(ent, ...keys) {
        const patch = this.#patchByEnt.has(ent) ? this.#patchByEnt.get(ent) : {};
        if (patch == null) return;
        for (const key of keys){
            if (key in ent) patch[key] = undefined;
            else delete patch[key];
        }
        if (Object.keys(patch).length === 0) this.#patchByEnt.delete(ent);
        else this.#patchByEnt.set(ent, patch);
    }
    removeEnt(ent) {
        this.#patchByEnt.set(ent, undefined);
    }
    run(game) {
        for (const system of this.#systemByOrder){
            const ents = this.#systemEnts(system);
            system.run?.(ents, game);
            if (system.runEnt != null) {
                for (const ent of ents)system.runEnt(ent, game);
            }
        }
        this.patch();
    }
    setEnt(ent, patch) {
        const pending = this.#patchByEnt.has(ent) ? this.#patchByEnt.get(ent) : {};
        if (pending == null) return;
        Object.assign(pending, patch);
        if (Object.keys(pending).length === 0) this.#patchByEnt.delete(ent);
        else this.#patchByEnt.set(ent, pending);
    }
    #invalidateSystemEnts(ent) {
        for (const [query, ents] of Object.entries(this.#entsByQuery)){
            if (queryEnt(ent, this.#setByQuery[query])) ents.add(ent);
            else ents.delete(ent);
        }
    }
    #patchEnt(ent1, patch) {
        for(const key in patch){
            if (patch[key] == null) {
                this.#entByComponent.delete(ent1[key]);
                delete ent1[key];
            } else {
                ent1[key] = patch[key];
                this.#entByComponent.set(ent1[key], ent1);
            }
        }
    }
    #removeEntImmediately(ent2) {
        for (const ents of Object.values(this.#entsByQuery))ents.delete(ent2);
        for(const key in ent2)this.#entByComponent.delete(ent2[key]);
        this.#ents.delete(ent2);
    }
    #systemEnts(system) {
        return this.#entsByQuery[system.query];
    }
    *#uncachedQuery(query3) {
        const querySet = parseQuerySet(query3);
        for (const ent of this.#ents){
            if (queryEnt(ent, querySet)) yield ent;
        }
    }
}
const query4 = 'cursor & sprites';
class Cam {
    clientViewportWH = new XY(1, 1);
    nativeViewportWH = new XY(1, 1);
    minViewport;
    viewport = new Box(0, 0, 1, 1);
    #scale = 1;
    #window;
    constructor(minViewport, window1){
        this.minViewport = minViewport;
        this.#window = window1;
    }
    get scale() {
        return this.#scale;
    }
    resize() {
        this.clientViewportWH.set(clientViewportWH(this.#window));
        this.nativeViewportWH.set(nativeViewportWH(this.#window, this.clientViewportWH));
        this.#scale = viewportScale(this.nativeViewportWH, this.minViewport, 0);
        this.viewport.wh = camWH(this.nativeViewportWH, this.scale);
    }
}
class GamepadPoller {
    #buttons = 0;
    #hub;
    #security;
    constructor(hub, security){
        this.#hub = hub;
        this.#security = security;
    }
    preupdate() {
        if (!this.#security.isSecureContext) return;
        const gamepads = this.#hub.getGamepads();
        this.#buttons = gamepads.reduce(reduceGamepads, 0);
    }
    reset() {
        this.#buttons = 0;
    }
    get sample() {
        return this.#buttons;
    }
}
class KeyboardPoller {
    #buttons = 0;
    #pub;
    constructor(pub){
        this.#pub = pub;
    }
    register(op) {
        this.#pub.addEventListener;
        const fn = `${op}EventListener`;
        this.#pub[fn]('blur', this.#onBlurEvent, {
            capture: true,
            passive: true
        });
        for (const type of [
            'keydown',
            'keyup'
        ]){
            const callback = this.#onKeyEvent;
            this.#pub[fn](type, callback, {
                capture: true,
                passive: true
            });
        }
    }
    reset() {
        this.#buttons = 0;
    }
    get sample() {
        return this.#buttons;
    }
    #onBlurEvent = ()=>{
        this.#buttons = 0;
    };
    #onKeyEvent = (ev)=>{
        const on = ev.type === 'keydown';
        for (const key of eventToKeys(ev)){
            this.#buttons = keyToButton(this.#buttons, key, on);
        }
    };
}
class PointerPoller {
    #buttons;
    #cam;
    #clientXY = new XY(0, 0);
    #pub;
    #lock;
    #pointerType;
    #xy;
    constructor(cam, lock, pub){
        this.#buttons = 0;
        this.#cam = cam;
        this.#lock = lock;
        this.#pub = pub;
    }
    get pointerType() {
        return this.#pointerType;
    }
    postupdate() {
        if (this.#buttons === 0 || this.#buttons === ButtonBit.Point) this.reset();
    }
    register(op) {
        const fn = `${op}EventListener`;
        this.#pub[fn]('pointercancel', this.reset, {
            capture: true,
            passive: true
        });
        for (const type of [
            'pointerdown',
            'pointermove',
            'pointerup'
        ]){
            this.#pub[fn](type, this.#onPointEvent, {
                capture: true,
                passive: type !== 'pointerdown'
            });
        }
        this.#pub[fn]('contextmenu', this.#onContextMenuEvent, {
            capture: true
        });
    }
    reset = ()=>{
        this.#buttons = 0;
        this.#pointerType = undefined;
        this.#xy = undefined;
    };
    get sample() {
        return this.#buttons;
    }
    get xy() {
        return this.#xy;
    }
    get #locked() {
        return this.#lock.pointerLockElement === this.#pub;
    }
    #onContextMenuEvent = (ev)=>ev.preventDefault();
    #onPointEvent = (ev)=>{
        if (ev.pointerType === 'mouse' && ev.type === 'pointerdown' && !this.#locked) this.#pub.requestPointerLock();
        else if (ev.pointerType !== 'mouse' && this.#locked) {
            this.#lock.exitPointerLock();
        }
        if (!ev.isPrimary) return;
        if (this.#locked) {
            this.#clientXY.add(ev.movementX, ev.movementY).max(0, 0).min(window.innerWidth, window.innerHeight);
        } else this.#clientXY.set(ev.clientX, ev.clientY);
        this.#buttons = pointerButtonsToButton(ev.buttons);
        this.#pointerType = parsePointerType(ev.pointerType);
        this.#xy = viewportToLevelXY(this.#clientXY, this.#cam.clientViewportWH, this.#cam.viewport);
        const passive = ev.type !== 'pointerdown';
        if (!passive) ev.preventDefault();
    };
}
class InputPoller {
    #gamepad;
    #keyboard;
    #pointer;
    constructor(cam, gamepadHub, globalEventPub, lock, pointerEventPub, security){
        this.#gamepad = new GamepadPoller(gamepadHub, security);
        this.#keyboard = new KeyboardPoller(globalEventPub);
        this.#pointer = new PointerPoller(cam, lock, pointerEventPub);
    }
    get pointerType() {
        return this.#pointer.pointerType;
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
    get sample() {
        return this.#gamepad.sample | this.#keyboard.sample | this.#pointer.sample;
    }
    get xy() {
        return this.#pointer.xy;
    }
}
class Input {
    #duration = 0;
    #poller;
    #prevButtons = 0;
    #combo = [];
    #maxInterval;
    #minHeld;
    constructor(cam, gamepadHub, globalEventPub, lock, pointerEventPub, security, minHeld = 300, maxInterval = 300){
        this.#poller = new InputPoller(cam, gamepadHub, globalEventPub, lock, pointerEventPub, security);
        this.#minHeld = minHeld;
        this.#maxInterval = maxInterval;
    }
    get buttons() {
        return this.#poller.sample;
    }
    isAnyOff(...buttons) {
        return buttons.some((button)=>this.isOff(button));
    }
    isAnyOffStart(...buttons) {
        return buttons.some((button)=>this.isOffStart(button));
    }
    isAnyOffHeld(...buttons) {
        return buttons.some((button)=>this.isOffHeld(button));
    }
    isAnyOn(...buttons) {
        return buttons.some((button)=>this.isOn(button));
    }
    isAnyOnStart(...buttons) {
        return buttons.some((button)=>this.isOnStart(button));
    }
    isAnyOnHeld(...buttons) {
        return buttons.some((button)=>this.isOnHeld(button));
    }
    isCombo(...combo) {
        if (combo.length !== this.#combo.length) return false;
        for (const [i, buttons] of combo.entries()){
            const mask = buttonsToBits(...buttons);
            if (this.#combo[i] !== mask) return false;
            if (i === combo.length - 1 && mask !== this.buttons) return false;
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
        const bits = buttonsToBits(...buttons);
        return (this.buttons & bits) === bits;
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
        const bits = buttonsToBits(...buttons);
        return (this.buttons & bits) !== (this.#prevButtons & bits);
    }
    isHeld() {
        return this.#duration >= this.#minHeld;
    }
    get pointerType() {
        return this.#poller.pointerType;
    }
    preupdate() {
        this.#poller.preupdate();
        if (this.#duration > this.#maxInterval && (this.buttons === 0 || this.buttons !== this.#prevButtons)) {
            this.#duration = 0;
            this.#combo.length = 0;
        } else if (this.buttons !== this.#prevButtons) {
            this.#duration = 0;
            if (this.buttons !== 0) this.#combo.push(this.buttons);
        } else if (this.buttons !== 0 && this.buttons === this.#prevButtons) {
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
        for (const button of ButtonSet){
            if (this.isOn(button)) on.push(button);
            if (this.isStart(button)) start.push(button);
        }
        const combo = [];
        for (const buttons of this.#combo)combo.push([
            ...buttonsFromBits(buttons)
        ]);
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
    get xy() {
        return this.#poller.xy;
    }
}
const __default4 = `#version 300 es
#pragma debug(${true ? 'on' : 'off'})
#pragma optimize(${true ? 'off' : 'on'})

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

in uint iFlipWrapAnchorLayer;

const uint FlipXMask = 1u;
const uint FlipXShift = 17u;
const uint FlipYMask = 1u;
const uint FlipYShift = 16u;
const uint WrapXMask = 0xfu;
const uint WrapXShift = 12u;
const uint WrapYMask = 0xfu;
const uint WrapYShift = 8u;
const uint LayerAnchorEndMask = 1u;
const uint LayerAnchorEndShift = 7u;
const uint LayerMask = 0x7fu;
const uint LayerShift = 0u;

// Only care about layer, height, and y. See
// https://www.patternsgameprog.com/opengl-2d-facade-25-get-the-z-of-a-pixel.
float zDepth() {
  const float maxLayer = 64.;
  const float maxY = 16. * 1024.;
  const float maxDepth = maxLayer * maxY;
  bool anchorEnd =
    ((iFlipWrapAnchorLayer >> LayerAnchorEndShift) & LayerAnchorEndMask) != 0u;
  float depth = float((iFlipWrapAnchorLayer >> LayerShift) & LayerMask) * maxY
    - float(iTarget.y + (anchorEnd ? 0 : iTarget.w));
  return depth / maxDepth;
}

out vec2 vTargetWH;
out vec4 vSourceXYWH;
flat out ivec2 vWrapXY;

void main() {
  uvec4 sourceXYWH = texelFetch(uSourceByCelID, ivec2(0, iCelID), 0);
  bool flipX = ((iFlipWrapAnchorLayer >> FlipXShift) & FlipXMask)!= 0u;
  bool flipY = ((iFlipWrapAnchorLayer >> FlipYShift) & FlipYMask)!= 0u;

  ivec2 targetWH = ivec2(vUV) * iTarget.zw;
  gl_Position = vec4(iTarget.xy + targetWH, zDepth(), 1) * uProjection;
  vTargetWH = vec2(targetWH.x * (flipX ? -1 : 1), targetWH.y * (flipY ? -1 : 1));
  vSourceXYWH = vec4(sourceXYWH);

  vWrapXY= ivec2((iFlipWrapAnchorLayer >> WrapXShift) & WrapXMask, (iFlipWrapAnchorLayer >> WrapYShift)& WrapYMask);
}`;
const __default5 = `#version 300 es
#pragma debug(${true ? 'on' : 'off'})
#pragma optimize(${true ? 'off' : 'on'})

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
const uv = new Uint16Array([
    1,
    1,
    0,
    1,
    1,
    0,
    0,
    0
]);
const uvLen = uv.length / 2;
class Renderer {
    static new(canvas, spritesheet, layout, atlas) {
        const gl = canvas.getContext('webgl2', {
            antialias: false,
            desynchronized: true,
            preserveDrawingBuffer: false
        });
        assertNonNull(gl, 'WebGL 2 unsupported.');
        const [r, g, b, a] = colorIntToFloats(0x0a1a1a_ff);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.depthRange(0, 1);
        gl.depthFunc(gl.LESS);
        gl.clearDepth(1);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false);
        const program = loadGLProgram(gl, __default4, __default5);
        const uniforms = getGLUniformLocations(gl, program);
        gl.uniform1i(getGLUniformLocation(layout, uniforms, 'uAtlas'), 0);
        gl.uniform1i(getGLUniformLocation(layout, uniforms, 'uSourceByCelID'), 1);
        gl.uniform2ui(getGLUniformLocation(layout, uniforms, 'uAtlasSize'), spritesheet.naturalWidth, spritesheet.naturalHeight);
        const attributes = getGLAttributeLocations(gl, program);
        const vertexArray = gl.createVertexArray();
        gl.bindVertexArray(vertexArray);
        const perVertexBuffer = gl.createBuffer();
        for (const attr of layout.perVertex.attributes){
            initGLAttribute(gl, layout.perVertex.stride, layout.perVertex.divisor, perVertexBuffer, NonNull(attributes[attr.name]), attr);
        }
        bufferGLData(gl, perVertexBuffer, uv, gl.STATIC_DRAW);
        const perInstanceBuffer = gl.createBuffer();
        for (const attr of layout.perInstance.attributes){
            initGLAttribute(gl, layout.perInstance.stride, layout.perInstance.divisor, perInstanceBuffer, NonNull(attributes[attr.name]), attr);
        }
        loadGLTexture(gl, gl.TEXTURE0, spritesheet);
        const dat = new Uint16Array(atlas.celBoundsByID.flatMap((box)=>[
                box.x,
                box.y,
                box.w,
                box.h
            ]));
        loadGLDataTexture(gl, gl.TEXTURE1, gl.RGBA16UI, 1, dat.byteLength / (4 * 2), gl.RGBA_INTEGER, gl.UNSIGNED_SHORT, dat);
        return new Renderer(gl, layout, uniforms, new Float32Array(4 * 4), perInstanceBuffer, gl.getExtension('WEBGL_lose_context'));
    }
    #gl;
    #layout;
    #uniforms;
    #projection;
    #perInstanceBuffer;
    #loseContext;
    constructor(gl, layout, uniforms, projection, perInstanceBuffer, loseContext){
        this.#gl = gl;
        this.#layout = layout;
        this.#uniforms = uniforms;
        this.#projection = projection;
        this.#perInstanceBuffer = perInstanceBuffer;
        this.#loseContext = loseContext;
    }
    isContextLost() {
        return this.#gl.isContextLost();
    }
    loseContext() {
        this.#loseContext?.loseContext();
    }
    render(_time, cam, bitmaps) {
        this.#resize(cam);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
        bufferGLData(this.#gl, this.#perInstanceBuffer, bitmaps.buffer, this.#gl.STREAM_DRAW);
        this.#gl.drawArraysInstanced(this.#gl.TRIANGLE_STRIP, 0, uvLen, bitmaps.size);
    }
    restoreContext() {
        this.#loseContext?.restoreContext();
    }
    #resize(cam) {
        const nativeWH = nativeCanvasWH(cam.viewport.wh, cam.scale);
        if (this.#gl.canvas.width !== nativeWH.x || this.#gl.canvas.height !== nativeWH.y) {
            this.#gl.canvas.width = nativeWH.x;
            this.#gl.canvas.height = nativeWH.y;
            this.#gl.viewport(0, 0, nativeWH.x, nativeWH.y);
            console.debug(`Canvas resized to ${nativeWH.x}×${nativeWH.y} native ` + `pixels with ${cam.viewport.w}×${cam.viewport.h} cam (level ` + `pixels) at a ${cam.scale}x scale.`);
        }
        if (this.#gl.canvas instanceof HTMLCanvasElement) {
            const clientWH = clientCanvasWH(window, nativeWH);
            const diffW = Number.parseFloat(this.#gl.canvas.style.width.slice(0, -2)) - clientWH.x;
            const diffH = Number.parseFloat(this.#gl.canvas.style.height.slice(0, -2)) - clientWH.y;
            if (!Number.isFinite(diffW) || Math.abs(diffW) >= .5 || !Number.isFinite(diffH) || Math.abs(diffH) >= .5) {
                this.#gl.canvas.style.width = `${clientWH.x}px`;
                this.#gl.canvas.style.height = `${clientWH.y}px`;
                console.debug(`Canvas styled to ` + `${this.#gl.canvas.style.width}×${this.#gl.canvas.style.height} ` + `for ${devicePixelRatio}× pixel density.`);
            }
        }
        this.#projection.set(project(cam));
        this.#gl.uniformMatrix4fv(getGLUniformLocation(this.#layout, this.#uniforms, 'uProjection'), false, this.#projection);
    }
}
class RendererStateMachine {
    #frameID;
    #renderer;
    #assets;
    #canvas;
    #onFrame;
    #onPause;
    #window;
    constructor(props){
        this.#assets = props.assets;
        this.#canvas = props.canvas;
        this.#frameID = undefined;
        this.#onFrame = props.onFrame;
        this.#onPause = props.onPause;
        this.#renderer = Renderer.new(this.#canvas, this.#assets.spritesheet, this.#assets.shaderLayout, this.#assets.atlas);
        this.#window = props.window;
    }
    isContextLost() {
        return this.#renderer.isContextLost();
    }
    loseContext() {
        this.#renderer.loseContext();
    }
    render(time, cam, bitmaps) {
        this.#renderer.render(time, cam, bitmaps);
    }
    restoreContext() {
        this.#renderer.restoreContext();
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
        return this.#window.document.visibilityState === 'visible';
    }
    #requestAnimationFrame(then) {
        this.#frameID = this.#window.requestAnimationFrame((now)=>this.#loop(now, then));
    }
    #onEvent = (event)=>{
        event.preventDefault();
        if (event.type === 'webglcontextrestored') {
            this.#renderer = Renderer.new(this.#canvas, this.#assets.spritesheet, this.#assets.shaderLayout, this.#assets.atlas);
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
class VoidGame {
    cam;
    ecs = new ECS();
    filmByID;
    input;
    pickHandled = false;
    renderer;
    #bitmaps;
    #random;
    #time = 0;
    #tick = 1;
    constructor(assets, canvas, minViewport, random, window1){
        this.cam = new Cam(minViewport, window1);
        this.input = new Input(this.cam, window1.navigator, window1, window1.document, canvas, window1);
        this.filmByID = assets.atlas.filmByID;
        this.#bitmaps = new BitmapBuffer(assets.shaderLayout);
        this.renderer = new RendererStateMachine({
            assets,
            window: window1,
            canvas,
            onFrame: (delta)=>this.#onFrame(delta),
            onPause: ()=>this.onPause()
        });
        this.#random = random;
    }
    onFrame() {}
    onPause() {
        this.input.reset();
    }
    random() {
        return this.#random();
    }
    start() {
        this.input.register('add');
        this.renderer.start();
    }
    stop() {
        this.input.register('remove');
        this.renderer.stop();
    }
    get tick() {
        return this.#tick;
    }
    get time() {
        return this.#time;
    }
    #onFrame(delta) {
        this.#tick = delta;
        this.#time += delta;
        this.pickHandled = false;
        this.input.preupdate();
        this.cam.resize();
        this.ecs.run(this);
        let index = 0;
        for (const ent of this.ecs.query('sprites')){
            for (const sprite of ent.sprites){
                this.#bitmaps.set(index, sprite, this.time);
                index++;
            }
        }
        this.renderer.render(this.time, this.cam, this.#bitmaps);
        this.onFrame();
        this.input.postupdate(this.tick);
    }
}
function parseComponent(lut, font, key, val) {
    switch(key){
        case 'cursor':
            return parseCursorFilmSet(lut, val);
        case 'followCam':
            return parseFollowCam(val);
        case 'followPoint':
            return {};
        case 'fps':
            return {
                prev: 0,
                next: {
                    created: performance.now(),
                    frames: 0
                }
            };
        case 'sprites':
            return val.map((v)=>parseSprite(lut, v));
        case 'text':
            assertNonNull(font, 'Missing font for text component.');
            return parseText(font, val);
    }
}
function queryEnt(ent, query) {
    return query.some((keys)=>[
            ...keys
        ].every((key)=>key[0] === '!' ? !(key.slice(1) in ent) : key in ent));
}
class CursorSystem {
    query = query4;
    #enableDpad;
    constructor(enableDpad){
        this.#enableDpad = enableDpad;
    }
    runEnt(ent, game) {
        if (game.input.isOnStart('Action')) {
            ent.sprites[0].animate(game.time, ent.cursor.pick);
        } else if (game.input.isOffStart('Action')) {
            ent.sprites[0].animate(game.time, ent.cursor.point);
        }
        if (game.input.xy != null || this.#enableDpad && game.input.isAnyOnStart('Left', 'Right', 'Up', 'Down')) setLayer(ent.sprites[0], game);
    }
}
function setLayer(sprite, game) {
    if (game.input.pointerType == null || game.input.pointerType === 'Mouse') {
        sprite.layer = Layer.Cursor;
    } else if (game.input.pointerType === 'Pen' || game.input.pointerType === 'Touch') sprite.layer = Layer.Bottom;
}
function reduceGamepads(sum, pad) {
    const axes = pad?.axes.reduce(reduceAxes, 0) ?? 0;
    const directionsButtons = pad?.buttons.reduce(reduceButtons, 0) ?? 0;
    return sum | axes | directionsButtons;
}
function reduceButtons(sum, gamepadButton, index) {
    const button = buttonIndexToButton(index);
    return sum | (gamepadButton.pressed ? button : 0);
}
function buttonIndexToButton(index) {
    const fn = __default.buttons[index];
    if (fn == null) return 0;
    return ButtonBit[fn];
}
function reduceAxes(sum, axis, index) {
    const bit = axisIndexToButton(index, Math.sign(axis));
    const on = Math.abs(axis) >= 0.5;
    return sum | bit & (on ? bit : 0);
}
function axisIndexToButton(index, direction) {
    const fn = __default.axes[index];
    if (fn == null) return 0;
    if (direction < 0) return ButtonBit[fn];
    return InvertButtonBit[fn] ?? 0;
}
function eventToKeys(ev) {
    const meta = ev.metaKey ? 'Meta+' : '';
    const ctrl = ev.ctrlKey ? 'Ctrl+' : '';
    const alt = ev.altKey ? 'Alt+' : '';
    const shift = ev.shiftKey ? 'Shift+' : '';
    if (ev.type === 'keydown') {
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
    const bit = ButtonBit[fn];
    return on ? buttons | bit : buttons & ~bit;
}
function pointerButtonsToButton(buttons) {
    let mapped = ButtonBit.Point;
    for(let button = 1; button <= buttons; button <<= 1){
        if ((button & buttons) !== button) continue;
        const fn = __default2[button];
        if (fn == null) continue;
        mapped = mapped | ButtonBit[fn];
    }
    return mapped;
}
function parseText(font, json) {
    return new Text(font, json.layer ?? Layer.Top, json.str ?? '', json.w ?? 0);
}
function parseFollowCam(json) {
    return {
        fill: json.fill == null ? undefined : parseFollowCamFill(json.fill),
        orientation: parseFollowCamOrientation(json.orientation),
        modulo: json.modulo,
        pad: json.pad
    };
}
function parseCursorFilmSet(lut, json) {
    return {
        pick: parseFilm1(lut, json.pick),
        point: parseFilm1(lut, json.point)
    };
}
function parseSprite(lut, json) {
    const film = parseFilm1(lut, json.id);
    const layer = parseLayer(lut, json.layer);
    const props = {
        flip: json.flip == null ? undefined : parseSpriteFlip(json.flip),
        wh: json.wh,
        wrap: json.wrap,
        xy: json.xy,
        x: json.x,
        y: json.y,
        w: json.w,
        h: json.h,
        anchorEnd: json.layerAnchorEnd
    };
    return new Sprite(film, layer, props);
}
function parseFilm1(lut, id) {
    const film = lut.filmByID[id];
    return NonNull(film, `Bad film ID "${id}".`);
}
function parseFollowCamFill(fill) {
    assert(FollowCamFillSet.has(fill), `Bad fill specifier "${fill}".`);
    return fill;
}
function parseFollowCamOrientation(orientation) {
    assert(FollowCamOrientationSet.has(orientation), `Bad orientation "${orientation}".`);
    return orientation;
}
function parseLayer(lut, layer) {
    const code = lut.layerByID[layer];
    return NonNull(code, `Bad layer "${layer}".`);
}
function parseSpriteFlip(flip) {
    assert(SpriteFlipSet.has(flip), `Bad flip specifier "${flip}".`);
    return flip;
}
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
function layoutWord(font, cursor, width, word, index) {
    const chars = [];
    let { x , y  } = cursor;
    for(;;){
        const __char = word[index];
        if (__char == null || isBlank(__char)) break;
        const span = tracking(font, __char, word[index + 1]);
        if (x > 0 && x + span > width) ({ x , y  } = nextLine(font, y));
        const w = fontCharWidth(font, __char);
        const h = font.cellHeight;
        chars.push(new Box(x, y, w, h));
        x += span;
        index++;
    }
    return {
        chars,
        cursor: new XY(x, y)
    };
}
function nextLine(font, y) {
    return new XY(0, y + font.lineHeight);
}
function layoutNewline(font, { y  }) {
    return {
        chars: [
            undefined
        ],
        cursor: nextLine(font, y)
    };
}
function layoutSpace(font, xy, width, span) {
    const cursor = xy.x > 0 && xy.x + span >= width ? nextLine(font, xy.y) : new XY(xy.x + span, xy.y);
    return {
        chars: [
            undefined
        ],
        cursor
    };
}
function tracking(font, lhs, rhs) {
    return fontCharWidth(font, lhs) + fontKerning(font, lhs, rhs);
}
const __default6 = JSON.parse("[\n  {\n    \"name\": \"cursor\",\n    \"cursor\": { \"pick\": \"cursor--Pick\", \"point\": \"cursor--Point\" },\n    \"followPoint\": {},\n    \"sprites\": [{ \"id\": \"cursor--Point\", \"layer\": \"Bottom\" }]\n  },\n\n  {\n    \"name\": \"background border\",\n    \"followCam\": { \"fill\": \"XY\", \"orientation\": \"Northwest\" },\n    \"sprites\": [\n      { \"id\": \"palette--Dark\", \"layer\": \"Background\", \"layerAnchorEnd\": true }\n    ]\n  },\n  {\n    \"name\": \"background corner NW\",\n    \"followCam\": { \"orientation\": \"Northwest\" },\n    \"sprites\": [{ \"id\": \"background--Corner\", \"layer\": \"Background\" }]\n  },\n  {\n    \"name\": \"background corner NE\",\n    \"followCam\": { \"orientation\": \"Northeast\" },\n    \"sprites\": [\n      { \"id\": \"background--Corner\", \"layer\": \"Background\", \"flip\": \"X\" }\n    ]\n  },\n  {\n    \"name\": \"background corner SE\",\n    \"followCam\": { \"orientation\": \"Southeast\" },\n    \"sprites\": [\n      { \"id\": \"background--Corner\", \"layer\": \"Background\", \"flip\": \"XY\" }\n    ]\n  },\n  {\n    \"name\": \"background corner SW\",\n    \"followCam\": { \"orientation\": \"Southwest\" },\n    \"sprites\": [\n      { \"id\": \"background--Corner\", \"layer\": \"Background\", \"flip\": \"Y\" }\n    ]\n  },\n\n  {\n    \"name\": \"background\",\n    \"followCam\": {\n      \"fill\": \"XY\",\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 1, \"y\": 1 }\n    },\n    \"sprites\": [{\n      \"id\": \"background--Grid\",\n      \"layer\": \"Background\",\n      \"layerAnchorEnd\": true,\n      \"wrap\": { \"x\": -1, \"y\": -1 }\n    }]\n  },\n\n  {\n    \"name\": \"stock background\",\n    \"sprites\": [{\n      \"id\": \"palette--Light\",\n      \"layer\": \"Background\",\n      \"x\": 169,\n      \"y\": 9,\n      \"w\": 39,\n      \"h\": 47\n    }]\n  },\n\n  {\n    \"pile\": { \"type\": \"Waste\" },\n    \"sprites\": [{\n      \"id\": \"palette--Light\",\n      \"layer\": \"Background\",\n      \"x\": 201,\n      \"y\": 9\n    }]\n  },\n\n  {\n    \"name\": \"waste vacancy\",\n    \"sprites\": [{\n      \"id\": \"card--VacantPile\",\n      \"layer\": \"Vacancy\",\n      \"x\": 208,\n      \"y\": 16\n    }]\n  },\n\n  {\n    \"name\": \"Patience the Demon\",\n    \"followCam\": {\n      \"modulo\": { \"x\": 8, \"y\": 8 },\n      \"orientation\": \"Northwest\",\n      \"pad\": { \"x\": 16, \"y\": 16 }\n    },\n    \"patienceTheDemon\": {},\n    \"sprites\": [{ \"id\": \"patience-the-demon--Good\", \"layer\": \"Patience\" }]\n  }\n]");
const __default7 = JSON.parse("{\n  \"version\": \"1.3-rc2-x64\",\n  \"filename\": \"atlas.png\",\n  \"format\": \"I8\",\n  \"wh\": {\n    \"x\": 216,\n    \"y\": 248\n  },\n  \"filmByID\": {\n    \"background--Grid\": {\n      \"id\": \"background--Grid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 0,\n          \"bounds\": {\n            \"x\": 112,\n            \"y\": 240,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"background--Corner\": {\n      \"id\": \"background--Corner\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 1,\n          \"bounds\": {\n            \"x\": 104,\n            \"y\": 240,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"background--Checkerboard\": {\n      \"id\": \"background--Checkerboard\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 2,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 240,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--CA\": {\n      \"id\": \"card--CA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 3,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C2\": {\n      \"id\": \"card--C2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 4,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C3\": {\n      \"id\": \"card--C3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 5,\n          \"bounds\": {\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C4\": {\n      \"id\": \"card--C4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 6,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C5\": {\n      \"id\": \"card--C5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 7,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C6\": {\n      \"id\": \"card--C6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 8,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C7\": {\n      \"id\": \"card--C7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 9,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C8\": {\n      \"id\": \"card--C8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 10,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C9\": {\n      \"id\": \"card--C9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 11,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--C10\": {\n      \"id\": \"card--C10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 12,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--CJ\": {\n      \"id\": \"card--CJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 13,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 128,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--CQ\": {\n      \"id\": \"card--CQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 14,\n          \"bounds\": {\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--CK\": {\n      \"id\": \"card--CK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 15,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--DA\": {\n      \"id\": \"card--DA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 16,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D2\": {\n      \"id\": \"card--D2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 17,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D3\": {\n      \"id\": \"card--D3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 18,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D4\": {\n      \"id\": \"card--D4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 19,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D5\": {\n      \"id\": \"card--D5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 20,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D6\": {\n      \"id\": \"card--D6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 21,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D7\": {\n      \"id\": \"card--D7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 22,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 160,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D8\": {\n      \"id\": \"card--D8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 23,\n          \"bounds\": {\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D9\": {\n      \"id\": \"card--D9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 24,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--D10\": {\n      \"id\": \"card--D10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 25,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--DJ\": {\n      \"id\": \"card--DJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 26,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--DQ\": {\n      \"id\": \"card--DQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 27,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--DK\": {\n      \"id\": \"card--DK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 28,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--HA\": {\n      \"id\": \"card--HA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 29,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H2\": {\n      \"id\": \"card--H2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 30,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H3\": {\n      \"id\": \"card--H3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 31,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H4\": {\n      \"id\": \"card--H4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 32,\n          \"bounds\": {\n            \"x\": 24,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H5\": {\n      \"id\": \"card--H5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 33,\n          \"bounds\": {\n            \"x\": 48,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H6\": {\n      \"id\": \"card--H6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 34,\n          \"bounds\": {\n            \"x\": 72,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H7\": {\n      \"id\": \"card--H7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 35,\n          \"bounds\": {\n            \"x\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H8\": {\n      \"id\": \"card--H8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 36,\n          \"bounds\": {\n            \"x\": 120,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H9\": {\n      \"id\": \"card--H9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 37,\n          \"bounds\": {\n            \"x\": 144,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--H10\": {\n      \"id\": \"card--H10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 38,\n          \"bounds\": {\n            \"x\": 168,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--HJ\": {\n      \"id\": \"card--HJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 39,\n          \"bounds\": {\n            \"x\": 192,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--HQ\": {\n      \"id\": \"card--HQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 40,\n          \"bounds\": {\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--HK\": {\n      \"id\": \"card--HK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 41,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--SA\": {\n      \"id\": \"card--SA\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 42,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S2\": {\n      \"id\": \"card--S2\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 43,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S3\": {\n      \"id\": \"card--S3\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 44,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S4\": {\n      \"id\": \"card--S4\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 45,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S5\": {\n      \"id\": \"card--S5\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 46,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S6\": {\n      \"id\": \"card--S6\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 47,\n          \"bounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S7\": {\n      \"id\": \"card--S7\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 48,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 32,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S8\": {\n      \"id\": \"card--S8\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 49,\n          \"bounds\": {\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S9\": {\n      \"id\": \"card--S9\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 50,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--S10\": {\n      \"id\": \"card--S10\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 51,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--SJ\": {\n      \"id\": \"card--SJ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 52,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--SQ\": {\n      \"id\": \"card--SQ\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 53,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--SK\": {\n      \"id\": \"card--SK\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 54,\n          \"bounds\": {\n            \"x\": 120,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--Down\": {\n      \"id\": \"card--Down\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 55,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantPile\": {\n      \"id\": \"card--VacantPile\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 56,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantStock\": {\n      \"id\": \"card--VacantStock\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 57,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 64,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"slices\": [\n            {\n              \"w\": 24,\n              \"h\": 32\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 24,\n        \"h\": 32\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantClubs\": {\n      \"id\": \"card--VacantClubs\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 58,\n          \"bounds\": {\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantDiamonds\": {\n      \"id\": \"card--VacantDiamonds\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 59,\n          \"bounds\": {\n            \"x\": 24,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantHearts\": {\n      \"id\": \"card--VacantHearts\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 60,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--VacantSpades\": {\n      \"id\": \"card--VacantSpades\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 61,\n          \"bounds\": {\n            \"x\": 72,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--OutlineFocus\": {\n      \"id\": \"card--OutlineFocus\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 62,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"card--OutlineChecked\": {\n      \"id\": \"card--OutlineChecked\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 32\n      },\n      \"cels\": [\n        {\n          \"id\": 63,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 96,\n            \"w\": 24,\n            \"h\": 32\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"cursor--Point\": {\n      \"id\": \"cursor--Point\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 64,\n          \"bounds\": {\n            \"x\": 16,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 16\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 3,\n            \"h\": 3\n          },\n          \"slices\": [\n            {\n              \"w\": 3,\n              \"h\": 3\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 3,\n        \"h\": 3\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"cursor--Pick\": {\n      \"id\": \"cursor--Pick\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 16\n      },\n      \"cels\": [\n        {\n          \"id\": 65,\n          \"bounds\": {\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 16\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": 3,\n            \"h\": 3\n          },\n          \"slices\": [\n            {\n              \"w\": 3,\n              \"h\": 3\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 3,\n        \"h\": 3\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"palette--Alpha\": {\n      \"id\": \"palette--Alpha\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 66,\n          \"bounds\": {\n            \"x\": 88,\n            \"y\": 240,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"palette--Dark\": {\n      \"id\": \"palette--Dark\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 67,\n          \"bounds\": {\n            \"x\": 80,\n            \"y\": 240,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"palette--Mid\": {\n      \"id\": \"palette--Mid\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 68,\n          \"bounds\": {\n            \"x\": 160,\n            \"y\": 232,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"palette--Light\": {\n      \"id\": \"palette--Light\",\n      \"wh\": {\n        \"x\": 8,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 69,\n          \"bounds\": {\n            \"x\": 160,\n            \"y\": 224,\n            \"w\": 8,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"patience-the-demon--Good\": {\n      \"id\": \"patience-the-demon--Good\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 70,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 71,\n          \"bounds\": {\n            \"x\": 168,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 7,\n        \"h\": 10\n      },\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"patience-the-demon--Evil\": {\n      \"id\": \"patience-the-demon--Evil\",\n      \"wh\": {\n        \"x\": 24,\n        \"y\": 24\n      },\n      \"cels\": [\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 72,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 216,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 59700,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        },\n        {\n          \"id\": 73,\n          \"bounds\": {\n            \"x\": 192,\n            \"y\": 192,\n            \"w\": 24,\n            \"h\": 24\n          },\n          \"duration\": 300,\n          \"sliceBounds\": {\n            \"w\": 7,\n            \"h\": 10\n          },\n          \"slices\": [\n            {\n              \"w\": 7,\n              \"h\": 10\n            }\n          ]\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": 7,\n        \"h\": 10\n      },\n      \"period\": 300,\n      \"duration\": 60000,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--0\": {\n      \"id\": \"tally--0\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 74,\n          \"bounds\": {\n            \"x\": 64,\n            \"y\": 240,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--1\": {\n      \"id\": \"tally--1\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 75,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 240,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--2\": {\n      \"id\": \"tally--2\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 76,\n          \"bounds\": {\n            \"x\": 32,\n            \"y\": 240,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--3\": {\n      \"id\": \"tally--3\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 77,\n          \"bounds\": {\n            \"x\": 16,\n            \"y\": 240,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--4\": {\n      \"id\": \"tally--4\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 78,\n          \"bounds\": {\n            \"y\": 240,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--5\": {\n      \"id\": \"tally--5\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 79,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--6\": {\n      \"id\": \"tally--6\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 80,\n          \"bounds\": {\n            \"x\": 128,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--7\": {\n      \"id\": \"tally--7\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 81,\n          \"bounds\": {\n            \"x\": 128,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--8\": {\n      \"id\": \"tally--8\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 82,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--9\": {\n      \"id\": \"tally--9\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 83,\n          \"bounds\": {\n            \"x\": 32,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--10\": {\n      \"id\": \"tally--10\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 84,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--11\": {\n      \"id\": \"tally--11\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 85,\n          \"bounds\": {\n            \"x\": 64,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--12\": {\n      \"id\": \"tally--12\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 86,\n          \"bounds\": {\n            \"x\": 80,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--13\": {\n      \"id\": \"tally--13\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 87,\n          \"bounds\": {\n            \"x\": 144,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--14\": {\n      \"id\": \"tally--14\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 88,\n          \"bounds\": {\n            \"x\": 32,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--15\": {\n      \"id\": \"tally--15\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 89,\n          \"bounds\": {\n            \"x\": 48,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--16\": {\n      \"id\": \"tally--16\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 90,\n          \"bounds\": {\n            \"x\": 64,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--17\": {\n      \"id\": \"tally--17\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 91,\n          \"bounds\": {\n            \"x\": 80,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--18\": {\n      \"id\": \"tally--18\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 92,\n          \"bounds\": {\n            \"x\": 96,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--19\": {\n      \"id\": \"tally--19\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 93,\n          \"bounds\": {\n            \"x\": 112,\n            \"y\": 232,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    },\n    \"tally--20\": {\n      \"id\": \"tally--20\",\n      \"wh\": {\n        \"x\": 16,\n        \"y\": 8\n      },\n      \"cels\": [\n        {\n          \"id\": 94,\n          \"bounds\": {\n            \"x\": 112,\n            \"y\": 224,\n            \"w\": 16,\n            \"h\": 8\n          },\n          \"duration\": 1,\n          \"sliceBounds\": {\n            \"w\": -1,\n            \"h\": -1\n          },\n          \"slices\": []\n        }\n      ],\n      \"sliceBounds\": {\n        \"w\": -1,\n        \"h\": -1\n      },\n      \"period\": 1,\n      \"duration\": 1,\n      \"direction\": \"Forward\",\n      \"loops\": null\n    }\n  },\n  \"celBoundsByID\": [\n    {\n      \"x\": 112,\n      \"y\": 240,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 104,\n      \"y\": 240,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 96,\n      \"y\": 240,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 168,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 128,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 160,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 32,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 120,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 168,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 192,\n      \"y\": 64,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 24,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 48,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 72,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 96,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 144,\n      \"y\": 96,\n      \"w\": 24,\n      \"h\": 32\n    },\n    {\n      \"x\": 16,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 16\n    },\n    {\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 16\n    },\n    {\n      \"x\": 88,\n      \"y\": 240,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 80,\n      \"y\": 240,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 160,\n      \"y\": 232,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 160,\n      \"y\": 224,\n      \"w\": 8,\n      \"h\": 8\n    },\n    {\n      \"x\": 168,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 168,\n      \"y\": 216,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 192,\n      \"y\": 216,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 192,\n      \"y\": 192,\n      \"w\": 24,\n      \"h\": 24\n    },\n    {\n      \"x\": 64,\n      \"y\": 240,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 48,\n      \"y\": 240,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 32,\n      \"y\": 240,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 16,\n      \"y\": 240,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"y\": 240,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 144,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 128,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 128,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 96,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 32,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 48,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 64,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 80,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 144,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 32,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 48,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 64,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 80,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 96,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 112,\n      \"y\": 232,\n      \"w\": 16,\n      \"h\": 8\n    },\n    {\n      \"x\": 112,\n      \"y\": 224,\n      \"w\": 16,\n      \"h\": 8\n    }\n  ]\n}");
new Set([
    'background--Corner',
    'background--Checkerboard',
    'background--Grid',
    'cursor--Pick',
    'cursor--Point',
    'card--CA',
    'card--C2',
    'card--C3',
    'card--C4',
    'card--C5',
    'card--C6',
    'card--C7',
    'card--C8',
    'card--C9',
    'card--C10',
    'card--CJ',
    'card--CQ',
    'card--CK',
    'card--DA',
    'card--D2',
    'card--D3',
    'card--D4',
    'card--D5',
    'card--D6',
    'card--D7',
    'card--D8',
    'card--D9',
    'card--D10',
    'card--DJ',
    'card--DQ',
    'card--DK',
    'card--HA',
    'card--H2',
    'card--H3',
    'card--H4',
    'card--H5',
    'card--H6',
    'card--H7',
    'card--H8',
    'card--H9',
    'card--H10',
    'card--HJ',
    'card--HQ',
    'card--HK',
    'card--SA',
    'card--S2',
    'card--S3',
    'card--S4',
    'card--S5',
    'card--S6',
    'card--S7',
    'card--S8',
    'card--S9',
    'card--S10',
    'card--SJ',
    'card--SQ',
    'card--SK',
    'card--Down',
    'card--VacantClubs',
    'card--VacantDiamonds',
    'card--VacantHearts',
    'card--VacantSpades',
    'card--VacantPile',
    'card--VacantStock',
    'card--OutlineChecked',
    'card--OutlineFocus',
    'palette--Alpha',
    'palette--Dark',
    'palette--Light',
    'palette--Mid',
    'patience-the-demon--Good',
    'patience-the-demon--Evil',
    'tally--0',
    'tally--1',
    'tally--2',
    'tally--3',
    'tally--4',
    'tally--5',
    'tally--6',
    'tally--7',
    'tally--8',
    'tally--9',
    'tally--10',
    'tally--11',
    'tally--12',
    'tally--13',
    'tally--14',
    'tally--15',
    'tally--16',
    'tally--17',
    'tally--18',
    'tally--19',
    'tally--20'
]);
const query5 = 'patienceTheDemon & sprites';
class PatienceTheDemonSystem {
    query = query5;
    run(ents, game) {
        if (game.pickHandled || !game.input.isOffStart('Action')) return;
        for (const ent of ents){
            if (game.cursor.hits(ent.sprites[0].hitbox)) {
                game.pickHandled = true;
                ent.sprites[0].animate(game.time, nextFilm(game, ent.sprites[0]));
            } else if (game.cursor.hits(ent.sprites[0].bounds)) {
                game.pickHandled = true;
                solitaireReset(game.solitaire);
                game.saveStorage.data.wins = game.solitaire.wins;
                game.saveStorage.save();
            }
        }
    }
}
function nextFilm(game, sprite) {
    const good = sprite.film.id === 'patience-the-demon--Good';
    return game.filmByID[`patience-the-demon--${good ? 'Evil' : 'Good'}`];
}
function parseLevel(factory, font, json) {
    const ents = [];
    for (const entJSON of json){
        ents.push(parseComponentSet(factory, font, entJSON));
    }
    return ents;
}
function parseComponentSet(factory, font, json) {
    const set = {};
    for (const [key, val] of Object.entries(json)){
        const component = parseComponent(factory, font, key, val);
        if (component != null) {
            set[key] = component;
            continue;
        }
        switch(key){
            case 'pile':
                assert(json.pile?.type === 'Waste', `Unsupported pile type "${json.pile?.type}".`);
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
const SPLayer = {
    ...Layer,
    Picked: 0x02,
    CardUp: 0x03,
    CardDown: 0x04,
    Patience: 0x05,
    Vacancy: 0x06,
    Background: 0x07
};
function SaveData(wins) {
    return {
        wins
    };
}
async function loadAssets() {
    const spritesheet = await loadImage('atlas.png');
    const atlas = Atlas.fromJSON(__default7);
    const shaderLayout = parseShaderLayout(__default3);
    return {
        atlas,
        spritesheet,
        shaderLayout
    };
}
const query6 = 'card & sprites';
const query7 = 'pile & sprites';
const query8 = 'tally & sprites';
const query9 = 'vacantStock & sprites';
function* newLevelComponents(factory, font, solitaire) {
    yield* newTallies(factory);
    yield* newFoundation(factory);
    yield* newStock(factory, solitaire);
    yield* newTableau(solitaire, factory);
    yield* newWaste(solitaire, factory);
    yield* parseLevel(factory, font, __default6);
}
const mod = 8;
class SpriteFactory {
    #filmByID;
    layerByID = SPLayer;
    constructor(filmByID){
        this.#filmByID = filmByID;
    }
    get filmByID() {
        return this.#filmByID;
    }
    new(filmID, layer, props) {
        return new Sprite(this.#filmByID[filmID], SPLayer[layer], props);
    }
}
const saveKey = 'save';
class SaveStorage {
    static load(storage) {
        const jsonStorage = new JSONStorage(storage);
        const save = jsonStorage.get(saveKey) ?? SaveData(0);
        return new SaveStorage(save, jsonStorage);
    }
    #data;
    #storage;
    constructor(data, storage){
        this.#data = data;
        this.#storage = storage;
    }
    get data() {
        return this.#data;
    }
    save() {
        this.#storage.put(saveKey, this.#data);
    }
}
const cardWH = new XY(24, 32);
const boardX = 2 * 8;
const hiddenY = -1024;
function invalidateSolitaireSprites(ecs, filmByID, solitaire, time) {
    for (const [indexX, column] of solitaire.tableau.entries()){
        for (const [indexY, card] of column.entries()){
            const ent = ecs.get(card);
            ent.sprites[0].setXY(getTableauCardXY(filmByID, indexX, indexY));
            ent.sprites[0].layer = SPLayer[card.direction === 'Up' ? 'CardUp' : 'CardDown'];
            ent.sprites[0].animate(time, filmByID[getCardFilmID(card)]);
        }
    }
    for (const pillar of solitaire.foundation){
        for (const [index, card] of pillar.entries()){
            const ent = ecs.get(card);
            ent.sprites[0].setXY(getFoundationCardXY(filmByID, card.suit));
            const animID = index === pillar.length - 1 ? getCardFilmID(card) : 'card--Down';
            ent.sprites[0].animate(time, filmByID[animID]);
            ent.sprites[0].layer = SPLayer[animID === 'card--Down' ? 'CardDown' : 'CardUp'];
        }
    }
    for (const [index, card] of solitaire.stock.entries()){
        const ent = ecs.get(card);
        ent.sprites[0].setXY(getStockXY(solitaire, index));
        ent.sprites[0].layer = SPLayer[card.direction === 'Up' ? 'CardUp' : 'CardDown'];
        ent.sprites[0].animate(time, filmByID[getCardFilmID(card)]);
    }
    for (const [index, card] of solitaire.waste.entries()){
        const ent = ecs.get(card);
        ent.sprites[0].setXY(getWasteXY(solitaire, index));
        let animID;
        if (index >= solitaire.waste.length - solitaire.drawSize) {
            animID = getCardFilmID(card);
        } else animID = 'card--Down';
        ent.sprites[0].layer = SPLayer[animID === 'card--Down' ? 'CardDown' : 'CardUp'];
        ent.sprites[0].animate(time, filmByID[animID]);
    }
}
class CardSystem {
    query = query6;
    #selected = [];
    #piles;
    #vacantStock;
    constructor(piles, vacantStock){
        this.#piles = piles;
        this.#vacantStock = vacantStock;
    }
    run(ents, game) {
        if (game.pickHandled) return;
        const picked = pick(ents, game);
        const isStockPick = picked?.sprites[0].hits(this.#vacantStock);
        if (picked?.card.direction === 'Down' && !isStockPick && game.input.isOffStart('Action') || picked?.card.direction === 'Up' && !isStockPick && game.input.isOnStart('Action') || picked != null && isStockPick && game.input.isOffStart('Action')) {
            game.pickHandled = true;
            this.#setSelected(game, picked.card);
        }
        if (game.input.isOn('Action') && this.#selected.length > 0) {
            game.pickHandled = true;
            moveEntsToCursor(game, this.#selected);
        } else {
            invalidateSolitaireSprites(game.ecs, game.filmByID, game.solitaire, game.time);
        }
        if (game.solitaire.selected != null && game.input.isOffStart('Action')) {
            game.pickHandled = true;
            if (this.#selected.length === 0) {
                const picked = pick(ents, game);
                if (picked == null) solitaireDeselect(game.solitaire);
                else solitairePoint(game.solitaire, picked.card);
            } else {
                const drop = this.#drop(game);
                if (drop != null && game.solitaire.selected != null && drop.pile.type !== 'Waste') solitaireBuild(game.solitaire, drop.pile);
                solitaireDeselect(game.solitaire);
                this.#selected.length = 0;
            }
            invalidateSolitaireSprites(game.ecs, game.filmByID, game.solitaire, game.time);
        }
    }
    #setSelected(game, card) {
        const selection = solitairePoint(game.solitaire, card);
        if (selection == null) return;
        const selected = selection.cards.map((card)=>{
            const ent = game.ecs.get(card);
            return {
                ent,
                offset: game.cursor.bounds.xy.copy().sub(ent.sprites[0].bounds.xy)
            };
        }, `Card ${card} missing sprites[0].`);
        for (const select of selected)select.ent.sprites[0].layer = SPLayer.Picked;
        this.#selected.length = 0;
        this.#selected.push(...selected);
    }
    #drop(update) {
        const pick = this.#selected[0]?.ent;
        if (pick?.sprites == null) return;
        let drop;
        for (const ent of this.#piles){
            const overlap = pick.sprites[0].bounds.copy().intersection(ent.sprites[0].bounds);
            if (overlap.flipped || overlap.empty || ent.pile.type === 'Waste' || !solitaireIsBuildable(update.solitaire, ent.pile)) continue;
            if (drop == null || overlap.area > drop.area) {
                drop = {
                    area: overlap.area,
                    ent
                };
            }
        }
        return drop?.ent;
    }
}
function getStockXY(solitaire, indexY) {
    return new XY(boardX + 160, 16 + (solitaire.stock.length - 1 === indexY ? 0 : hiddenY));
}
function getWasteXY(solitaire, index) {
    const top = solitaire.waste.length - solitaire.drawSize;
    const mul = Math.max(index - top, 0);
    return new XY(208, 16 + mul * 8);
}
function getFoundationCardXY(filmByID, suit) {
    const film = filmByID[`card--Vacant${suit}`];
    const mul = {
        Clubs: 0,
        Diamonds: 1,
        Hearts: 2,
        Spades: 3
    }[suit];
    return new XY(boardX + 8 * 4 + mul * (film.wh.x + 8), 16);
}
function getTableauCardXY(filmByID, indexX, indexY) {
    const film = filmByID['card--VacantPile'];
    return new XY(boardX + indexX * (film.wh.x + 8), 72 + indexY * 8);
}
class PileHitboxSystem {
    query = query7;
    runEnt(ent, game) {
        const { pile , sprites  } = ent;
        const xy = pile.type === 'Waste' ? sprites[0].bounds.xy.copy().add(8 - 1, 8 - 1) : pile.type === 'Tableau' ? getTableauCardXY(game.filmByID, pile.x, 0) : getFoundationCardXY(game.filmByID, pile.suit);
        sprites[0].x = xy.x - mod + 1;
        sprites[0].y = xy.y - mod + 1;
        sprites[0].w = cardWH.x + mod * 2 - 1;
        sprites[0].h = cardWH.y + (pile.type === 'Waste' ? (game.solitaire.waste.length > 0 ? game.solitaire.drawSize - 1 : 0) * mod : pile.type === 'Tableau' ? Math.max(0, game.solitaire.tableau[pile.x].length - 1) * mod : 0) + mod * 2 - 1;
    }
}
class VacantStockSystem {
    query = query9;
    run(ents, game) {
        if (game.pickHandled || !game.input.isOffStart('Action')) return;
        for (const ent of ents){
            if (!ent.sprites[0].hits(game.cursor)) return;
            game.pickHandled = true;
            solitaireDeal(game.solitaire);
            invalidateSolitaireSprites(game.ecs, game.filmByID, game.solitaire, game.time);
            return;
        }
    }
}
function getCardFilmID(card) {
    return card.direction === 'Up' ? `card--${cardToASCII(card)}` : 'card--Down';
}
function newCard(factory, card, xy) {
    return {
        card,
        sprites: [
            factory.new(getCardFilmID(card), `Card${card.direction}`, {
                xy
            })
        ]
    };
}
function* newFoundation(factory) {
    for (const suit of SuitSet){
        yield {
            sprites: [
                factory.new(`card--Vacant${suit}`, 'Vacancy', {
                    xy: getFoundationCardXY(factory.filmByID, suit)
                })
            ]
        };
        yield {
            pile: {
                type: 'Foundation',
                suit
            },
            sprites: [
                factory.new('palette--Light', 'Background', {
                    xy: getFoundationCardXY(factory.filmByID, suit)
                })
            ]
        };
    }
}
function* newStock(factory, solitaire) {
    yield {
        vacantStock: true,
        sprites: [
            factory.new('card--VacantStock', 'Vacancy', {
                xy: getStockXY(solitaire, solitaire.stock.length - 1)
            })
        ]
    };
    for (const [index, card] of solitaire.stock.entries()){
        yield newCard(factory, card, getStockXY(solitaire, index));
    }
}
function* newTableau(solitaire, factory) {
    for (const [indexX, pile] of solitaire.tableau.entries()){
        const x = indexX;
        yield {
            pile: {
                type: 'Tableau',
                x
            },
            sprites: [
                factory.new('palette--Light', 'Background', {
                    xy: getTableauCardXY(factory.filmByID, x, 0)
                })
            ]
        };
        yield {
            sprites: [
                factory.new('card--VacantPile', 'Vacancy', {
                    xy: getTableauCardXY(factory.filmByID, x, 0)
                })
            ]
        };
        for (const [indexY, card] of pile.entries()){
            yield newCard(factory, card, getTableauCardXY(factory.filmByID, x, indexY));
        }
    }
}
class TallySystem {
    query = query8;
    runEnt(ent, game) {
        const max = 26 * 10;
        const wins = Math.min(10, Math.max(0, game.solitaire.wins - ent.tally.tens * 10)) + Math.min(10, Math.max(0, game.solitaire.wins - max - ent.tally.tens * 10));
        const filmID = `tally--${wins}`;
        if (ent.sprites[0].film.id !== filmID) {
            ent.sprites[0].animate(game.time, game.filmByID[filmID]);
        }
    }
}
function SuperPatience(window1, assets) {
    const canvas = window1.document.getElementsByTagName('canvas').item(0);
    assertNonNull(canvas, 'Canvas missing.');
    const random = Math.random;
    const saveStorage = SaveStorage.load(localStorage);
    const solitaire = Solitaire(random, saveStorage.data.wins);
    const ecs = new ECS();
    ecs.addEnt(...newLevelComponents(new SpriteFactory(assets.atlas.filmByID), undefined, solitaire));
    ecs.patch();
    ecs.addSystem(new FollowCamSystem(), new CursorSystem(true), new FollowDpadSystem(), new FollowPointSystem(), new CardSystem([
        ...ecs.query('pile & sprites')
    ], ecs.queryOne('vacantStock & sprites').sprites[0]), new PileHitboxSystem(), new VacantStockSystem(), new PatienceTheDemonSystem(), new TallySystem());
    const cam = new Cam(new XY(256, 214), window1);
    const self = {
        assets,
        bitmaps: new BitmapBuffer(assets.shaderLayout),
        cam,
        canvas,
        random,
        solitaire,
        ecs,
        input: new Input(cam, window1.navigator, window1, window1.document, canvas, window1),
        renderer: new RendererStateMachine({
            assets,
            window: window1,
            canvas,
            onFrame: (delta)=>spOnFrame(self, delta),
            onPause: ()=>self.input.reset()
        }),
        tick: 1,
        time: 0,
        saveStorage,
        cursor: ecs.queryOne('cursor & sprites').sprites[0],
        filmByID: assets.atlas.filmByID,
        window: window1
    };
    return self;
}
function pick(ents, game) {
    if (game.input == null) return;
    let picked;
    for (const ent of ents){
        if (!ent.sprites[0].hits(game.cursor)) continue;
        if (picked == null || ent.sprites[0].isAbove(picked.sprites[0])) {
            picked = ent;
        }
    }
    return picked;
}
function moveEntsToCursor(game, selected) {
    for (const pick of selected){
        pick.ent.sprites?.[0].setXY(game.cursor.bounds.xy.copy().sub(pick.offset));
    }
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
            sprites: [
                factory.new('tally--0', 'Patience')
            ]
        };
    }
}
function* newWaste(solitaire, factory) {
    for (const [index, card] of solitaire.waste.entries()){
        const xy = getWasteXY(solitaire, index);
        yield newCard(factory, card, xy);
    }
}
function spStart(self) {
    self.input.register('add');
    self.renderer.start();
}
function spOnFrame(self, delta) {
    self.tick = delta;
    self.time += delta;
    self.pickHandled = false;
    self.input.preupdate();
    self.cam.resize();
    centerCam(self.cam);
    self.ecs.run(self);
    let index = 0;
    for (const ent of self.ecs.query('sprites')){
        for (const sprite of ent.sprites){
            self.bitmaps.set(index, sprite, self.time);
            index++;
        }
    }
    self.renderer.render(self.time, self.cam, self.bitmaps);
    self.input.postupdate(self.tick);
}
function centerCam(cam) {
    const camOffsetX = Math.trunc((cam.viewport.w - cam.minViewport.x) / 2);
    cam.viewport.x = -camOffsetX + camOffsetX % 8;
}
const __default8 = JSON.parse("{\n  \"compilerOptions\": {\n    \"exactOptionalPropertyTypes\": true,\n    \"noImplicitOverride\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"useUnknownInCatchVariables\": true,\n    \"lib\": [\"dom\", \"deno.ns\"]\n  },\n  \"fmt\": {\n    \"files\": { \"exclude\": [\"dist\"] },\n    \"options\": { \"semiColons\": false, \"singleQuote\": true }\n  },\n  \"imports\": {\n    \"@/atlas-pack\": \"https://deno.land/x/atlas_pack@v8.0.0/mod.ts\",\n    \"@/mem\": \"https://deno.land/x/mem@v9.0.0/mod.ts\",\n    \"@/ooz\": \"https://deno.land/x/ooz@v0.0.17/mod.ts\",\n    \"@/solitaire\": \"https://deno.land/x/solitaire@v0.0.8/mod.ts\",\n    \"@/super-patience\": \"./mod.ts\",\n    \"@/void\": \"https://deno.land/x/oid@v0.0.10/mod.ts\",\n    \"std/\": \"https://deno.land/std@0.179.0/\"\n  },\n  \"lint\": {\n    \"files\": { \"exclude\": [\"dist\"] },\n    \"rules\": { \"exclude\": [\"no-empty-interface\", \"no-misused-new\"] }\n  },\n  \"lock\": false,\n  \"name\": \"super-patience\",\n  \"test\": { \"files\": { \"exclude\": [\"dist\"] } },\n  \"version\": \"1.2.0\"\n}");
console.log(`Super Patience v${__default8.version}
   ┌>°┐
by │  │idoid
   └──┘`);
globalThis.patience = await SuperPatience(window, await loadAssets());
spStart(patience);
