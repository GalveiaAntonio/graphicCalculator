(function () {
    const FUNCS = ['asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'cbrt', 'abs'];

    function balanceParens(str) {
        const opens = (str.match(/\(/g) || []).length;
        const closes = (str.match(/\)/g) || []).length;
        if (opens > closes) str += ')'.repeat(opens - closes);
        return str;
    }

    function tokenize(str) {
        const tokens = [];
        let i = 0;
        while (i < str.length) {
            const c = str[i];
            if (/\s/.test(c)) {
                i++;
                continue;
            }
            if (/[0-9.]/.test(c)) {
                let j = i;
                let dots = 0;

                while (j < str.length && /[0-9.]/.test(str[j])) {
                    if (str[j] === '.') dots++;
                    j++;
                }

                const numberText = str.slice(i, j);

                if (dots > 1 || numberText === '.') {
                    throw new Error('Error');
                }

                tokens.push({
                    t: 'num',
                    v: parseFloat(numberText)
                });

                i = j;
                continue;
            }
            if (/[a-zA-Z]/.test(c)) {
                let j = i;
                while (j < str.length && /[a-zA-Z]/.test(str[j])) j++;
                const word = str.slice(i, j).toLowerCase();
                i = j;
                if (FUNCS.includes(word)) {
                    tokens.push({ t: 'func', v: word });
                    continue;
                }
                if (word === 'pi') {
                    tokens.push({ t: 'const', v: 'pi' });
                    continue;
                }
                if (word === 'e') {
                    tokens.push({ t: 'const', v: 'e' });
                    continue;
                }
                if (word === 'x') {
                    tokens.push({ t: 'var' });
                    continue;
                }
                throw new Error('Error');
            }
            if (c === '×') {
                tokens.push({ t: 'op', v: '*' });
                i++;
                continue;
            }
            if (c === '÷') {
                tokens.push({ t: 'op', v: '/' });
                i++;
                continue;
            }
            if (c === '−') {
                tokens.push({ t: 'op', v: '-' });
                i++;
                continue;
            }
            if (c === '√') {
                tokens.push({ t: 'func', v: 'sqrt' });
                i++;
                continue;
            }
            if (c === '∛') {
                tokens.push({ t: 'func', v: 'cbrt' });
                i++;
                continue;
            }
            if (c === 'π') {
                tokens.push({ t: 'const', v: 'pi' });
                i++;
                continue;
            }
            if (c === '(') {
                tokens.push({ t: 'lparen' });
                i++;
                continue;
            }
            if (c === ')') {
                tokens.push({ t: 'rparen' });
                i++;
                continue;
            }
            if (c === '!') {
                tokens.push({ t: 'fact' });
                i++;
                continue;
            }
            if (c === '%') {
                tokens.push({ t: 'pct' });
                i++;
                continue;
            }
            if ('+-*/^'.includes(c)) {
                tokens.push({ t: 'op', v: c });
                i++;
                continue;
            }
            throw new Error('Error');
        }
        return tokens;
    }

    function factorial(n) {
        if (!isFinite(n) || n < 0 || !Number.isInteger(n)) return NaN;

        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;

        return r;
    }

    function applyFunc(name, arg, ctx) {
        const deg = ctx.angleMode === 'DEG';
        const toRad = v => deg ? v * Math.PI / 180 : v;
        const fromRad = v => deg ? v * 180 / Math.PI : v;
        switch (name) {
            case 'sin': return Math.sin(toRad(arg));
            case 'cos': return Math.cos(toRad(arg));
            case 'tan': return Math.tan(toRad(arg));
            case 'asin': return fromRad(Math.asin(arg));
            case 'acos': return fromRad(Math.acos(arg));
            case 'atan': return fromRad(Math.atan(arg));
            case 'ln': return Math.log(arg);
            case 'log': return Math.log10(arg);
            case 'sqrt': return Math.sqrt(arg);
            case 'cbrt': return Math.cbrt(arg);
            case 'abs': return Math.abs(arg);
        }
        throw new Error('Error');
    }

    function evaluateExpr(raw, ctx) {
        const str = balanceParens((raw || '').trim() === '' ? '0' : raw);
        const tokens = tokenize(str);
        let pos = 0;
        const peek = () => tokens[pos];
        const next = () => tokens[pos++];

        function canStartFactor(tok) {
            if (!tok) return false;
            return tok.t === 'num' || tok.t === 'const' || tok.t === 'var' || tok.t === 'func' || tok.t === 'lparen';
        }

        function parseExpression() {
            let value = parseTerm();
            while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) {
                const op = next().v;
                const rhs = parseTerm();
                value = op === '+' ? value + rhs : value - rhs;
            }
            return value;
        }

        function parseTerm() {
            let value = parseUnary();
            while (true) {
                const tok = peek();
                if (tok && tok.t === 'op' && (tok.v === '*' || tok.v === '/')) {
                    next();
                    const rhs = parseUnary();
                    value = tok.v === '*' ? value * rhs : value / rhs;
                } else if (canStartFactor(tok)) {
                    const rhs = parseUnary();
                    value = value * rhs;
                } else break;
            }
            return value;
        }

        function parseUnary() {
            const tok = peek();
            if (tok && tok.t === 'op' && tok.v === '-') {
                next();
                return -parseUnary();
            }
            if (tok && tok.t === 'op' && tok.v === '+') {
                next();
                return parseUnary();
            }
            return parsePower();
        }

        function parsePower() {
            let base = parsePostfix();
            const tok = peek();
            if (tok && tok.t === 'op' && tok.v === '^') {
                next();
                const exp = parseUnary();
                base = Math.pow(base, exp);
            }
            return base;
        }

        function parsePostfix() {
            let value = parsePrimary();
            while (true) {
                const tok = peek();
                if (tok && tok.t === 'fact') {
                    next();
                    value = factorial(value);
                }
                else if (tok && tok.t === 'pct') {
                    next();
                    value = value / 100;
                }
                else break;
            }
            return value;
        }

        function parsePrimary() {
            const tok = peek();
            if (!tok) throw new Error('Error');
            if (tok.t === 'num') {
                next();
                return tok.v;
            }
            if (tok.t === 'const') {
                next();
                return tok.v === 'pi' ? Math.PI : Math.E;
            }
            if (tok.t === 'var') {
                next();
                return ctx.x ?? 0;
            }
            if (tok.t === 'lparen') {
                next();
                const v = parseExpression();
                if (peek() && peek().t === 'rparen') next();
                return v;
            }
            if (tok.t === 'func') {
                next();
                if (peek() && peek().t === 'lparen') next(); else throw new Error('Error');
                const arg = parseExpression();
                if (peek() && peek().t === 'rparen') next();
                return applyFunc(tok.v, arg, ctx);
            }
            throw new Error('Error');
        }

        const result = parseExpression();

        if (pos < tokens.length) {
            throw new Error('Error');
        }

        return result;
    }








    function trimResult(n) {
        if (!isFinite(n)) return 'Error';
        if (Object.is(n, -0)) n = 0;

        const abs = Math.abs(n);

        if ((abs !== 0 && abs < 1e-10) || abs >= 1e14) {
            return n.toExponential(10)
                .replace(/\.?0+e/, 'e');
        }

        let s = n.toFixed(10);
        s = s.replace(/0+$/, '').replace(/\.$/, '');

        return s;
    }
    function formatNumber(numStr) {
        if (numStr === 'Error' || numStr === 'Error') return numStr;

        if (/[eE]/.test(numStr)) {
            return numStr.replace('.', ',');
        }

        let [intPart, decPart] = numStr.split('.');
        const neg = intPart.startsWith('-');

        if (neg) intPart = intPart.slice(1);

        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        let out = (neg ? '-' : '') + intPart;

        if (decPart !== undefined) {
            out += ',' + decPart;
        }

        return out;
    }








    const state = {
        expr: '',
        mode: 'sci',
        angleMode: 'DEG',
        memory: 0,
        second: false,
        rangeHalf: 10
    };

    const exprEl = document.getElementById('expr');
    const previewEl = document.getElementById('preview');
    const exprLabelEl = document.getElementById('exprLabel');
    const historyEl = document.getElementById('history');
    const memDot = document.getElementById('memDot');
    const footMode = document.getElementById('footMode');
    const btnDeg = document.getElementById('btnDeg');
    const btn2nd = document.getElementById('btn2nd');

    function fitExpr() {
        const len = state.expr.length || 1;
        let size;
        if (len <= 10) size = 34;
        else if (len <= 16) size = 26;
        else if (len <= 22) size = 20;
        else size = 16;
        exprEl.style.fontSize = size + 'px';
    }

    function refresh() {
        exprEl.textContent = state.expr;
        fitExpr();
        exprLabelEl.textContent = state.mode === 'graph' ? 'f(x) =' : '';

        try {
            const val = evaluateExpr(state.expr, { x: 0, angleMode: state.angleMode });
            if (isFinite(val) && state.expr.trim() !== '') {
                previewEl.textContent = '= ' + formatNumber(trimResult(val));
            } else {
                previewEl.innerHTML = '&nbsp;';
            }
        } catch (e) {
            previewEl.innerHTML = '&nbsp;';
        }

        memDot.classList.toggle('on', state.memory !== 0);
    }

    function insertToExpr(text) {
        if (state.expr.length > 60) return;
        state.expr += text;
        refresh();
    }

    function clearAll() {
        state.expr = '';
        refresh();
    }
    function backspace() {
        state.expr = state.expr.slice(0, -1);
        refresh();
    }

    function toggleSign() {
        let e = state.expr;
        if (e.startsWith('-(') && e.endsWith(')')) e = e.slice(2, -1);
        else if (e === '') e = '-';
        else e = '-(' + e + ')';
        state.expr = e;
        refresh();
    }

    function addHistory(exprLabel, resultLabel, rawResult) {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.innerHTML = `${exprLabel}<span class="r">= ${resultLabel}</span>`;
        chip.addEventListener('click', () => {
            state.expr = rawResult;
            refresh();
        });
        historyEl.insertBefore(chip, historyEl.firstChild);
        while (historyEl.children.length > 8) historyEl.removeChild(historyEl.lastChild);
    }

    function doEquals() {
        const exprToShow = state.expr || '0';
        let result;
        try {
            result = evaluateExpr(exprToShow, {
                x: 0,
                angleMode: state.angleMode
            });
            if (!isFinite(result)) throw new Error('Error');
        } catch (e) {
            previewEl.textContent = 'r';
            return;
        }
        const resultStr = trimResult(result);
        addHistory(exprToShow, formatNumber(resultStr), resultStr);
        state.expr = resultStr;
        refresh();
    }









    /**2ND/DEG */
    function updateSecondButtons() {
        document.querySelectorAll('[data-action="func"]').forEach(btn => {
            const primary = btn.dataset.insert;
            const alt = btn.dataset.alt;
            btn.textContent = state.second ? labelFor(alt) : labelFor(primary);
        });
        btn2nd.classList.toggle('toggle-on', state.second);
    }
    function labelFor(insertText) {
        const map = {
            'sin(': 'sin', 'asin(': 'sin⁻¹',
            'cos(': 'cos', 'acos(': 'cos⁻¹',
            'tan(': 'tan', 'atan(': 'tan⁻¹',
            'ln(': 'ln', 'e^': 'eˣ',
            'log(': 'log', '10^': '10ˣ',
            '√(': '√', '∛(': '∛'
        };
        return map[insertText] || insertText;
    }
    updateSecondButtons();





    /**GRAPHIC */
    const canvas = document.getElementById('graphCanvas');
    const graphWrap = document.getElementById('graphWrap');
    const rangeLabel = document.getElementById('rangeLabel');
    let redrawTimer = null;
    let hoverX = null;

    function scheduleGraphRedraw() {
        clearTimeout(redrawTimer);
        redrawTimer = setTimeout(drawGraph, 90);
    }

    function setupCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w: rect.width, h: rect.height };
    }

    function sample(exprStr, xMin, xMax, n) {
        const pts = [];
        const step = (xMax - xMin) / n;
        for (let i = 0; i <= n; i++) {
            const x = xMin + i * step;
            let y;
            try {
                y = evaluateExpr(exprStr, { x, angleMode: state.angleMode });
                if (!isFinite(y)) y = null;
            } catch (e) { y = null; }
            pts.push({ x, y });
        }
        return pts;
    }

    function drawGraph() {
        if (state.mode !== 'graph') return;
        const { ctx, w, h } = setupCanvas();
        ctx.clearRect(0, 0, w, h);

        const rh = state.rangeHalf;
        const xMin = -rh, xMax = rh;
        const exprStr = state.expr || '0';
        const pts = sample(exprStr, xMin, xMax, 300);

        let finiteYs = pts.map(p => p.y).filter(y => y !== null && isFinite(y));
        let yMin, yMax;
        if (finiteYs.length) {
            yMin = Math.min(...finiteYs);
            yMax = Math.max(...finiteYs);
            if (yMin === yMax) { yMin -= 1; yMax += 1; }
            const pad = (yMax - yMin) * 0.12;
            yMin -= pad; yMax += pad;
            const cap = rh * 4;
            if (yMax - yMin > cap * 2) { yMin = -cap; yMax = cap; }
        } else { yMin = -rh; yMax = rh; }

        const toPx = (x) => (x - xMin) / (xMax - xMin) * w;
        const toPy = (y) => h - (y - yMin) / (yMax - yMin) * h;

        // minor grid
        ctx.strokeStyle = 'rgba(32,52,92,0.10)';
        ctx.lineWidth = 1;
        const stepX = niceStep(xMax - xMin);
        for (let gx = Math.ceil(xMin / stepX) * stepX; gx <= xMax; gx += stepX) {
            const px = toPx(gx);
            ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        }
        const stepY = niceStep(yMax - yMin);
        for (let gy = Math.ceil(yMin / stepY) * stepY; gy <= yMax; gy += stepY) {
            const py = toPy(gy);
            ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        }

        // axes
        ctx.strokeStyle = 'rgba(24,23,29,0.5)';
        ctx.lineWidth = 1.4;
        if (xMin <= 0 && xMax >= 0) {
            const px = toPx(0);
            ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        }
        if (yMin <= 0 && yMax >= 0) {
            const py = toPy(0);
            ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        }

        // curve
        ctx.strokeStyle = '#b5311f';
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        let drawing = false;
        let lastY = null;
        for (const p of pts) {
            if (p.y === null) { drawing = false; lastY = null; continue; }
            const py = toPy(p.y);
            if (lastY !== null && Math.abs(py - lastY) > h * 0.9) { drawing = false; }
            const px = toPx(p.x);
            if (!drawing) { ctx.beginPath(); ctx.moveTo(px, py); drawing = true; }
            else ctx.lineTo(px, py);
            lastY = py;
        }
        ctx.stroke();

        // hover crosshair
        if (hoverX !== null) {
            let hy;
            try { hy = evaluateExpr(exprStr, { x: hoverX, angleMode: state.angleMode }); } catch (e) { hy = null; }
            if (hy !== null && isFinite(hy)) {
                const px = toPx(hoverX), py = toPy(hy);
                ctx.strokeStyle = 'rgba(24,23,29,0.3)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#b5311f';
                ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#18171d';
                ctx.font = '600 11px JetBrains Mono, monospace';
                ctx.textBaseline = 'top';
                const label = `x=${hoverX.toFixed(2)}  y=${hy.toFixed(2)}`;
                const tw = ctx.measureText(label).width;
                const lx = Math.min(Math.max(px + 8, 4), w - tw - 8);
                ctx.fillText(label, lx, 6);
            }
        }

        rangeLabel.textContent = `x ∈ [${(-rh).toFixed(rh < 1 ? 2 : 0)}, ${rh.toFixed(rh < 1 ? 2 : 0)}]`;
    }

    function niceStep(range) {
        const raw = range / 8;
        const mag = Math.pow(10, Math.floor(Math.log10(raw)));
        const norm = raw / mag;
        let step;
        if (norm < 1.5) step = 1;
        else if (norm < 3.5) step = 2;
        else if (norm < 7.5) step = 5;
        else step = 10;
        return step * mag;
    }

    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const rh = state.rangeHalf;
        hoverX = -rh + (px / rect.width) * (rh * 2);
        drawGraph();
    });
    canvas.addEventListener('pointerleave', () => { hoverX = null; drawGraph(); });

    document.getElementById('zoomIn').addEventListener('click', () => {
        state.rangeHalf = Math.max(0.5, state.rangeHalf * 0.7);
        drawGraph();
    });
    document.getElementById('zoomOut').addEventListener('click', () => {
        state.rangeHalf = Math.min(1000, state.rangeHalf * 1.4286);
        drawGraph();
    });
    document.getElementById('zoomReset').addEventListener('click', () => {
        state.rangeHalf = 10;
        drawGraph();
    });

    window.addEventListener('resize', () => { if (state.mode === 'graph') scheduleGraphRedraw(); });







    /**TABS */
    const tabSimple = document.getElementById('tabSimple');
    const tabSci = document.getElementById('tabSci');
    const tabGraph = document.getElementById('tabGraph');
    const panelEl = document.querySelector('.panel');

    function setView(view) {
        state.mode = view;
        [tabSimple, tabSci, tabGraph].forEach(t => t.classList.remove('active'));
        ({ simple: tabSimple, sci: tabSci, graph: tabGraph })[view].classList.add('active');
        panelEl.classList.remove('mode-simple', 'mode-sci', 'mode-graph');
        panelEl.classList.add('mode-' + view);
        if (view === 'graph') {
            graphWrap.classList.add('show');
            requestAnimationFrame(() => { requestAnimationFrame(drawGraph); });
        } else {
            graphWrap.classList.remove('show');
        }
        refresh();
    }

    tabSimple.addEventListener('click', () => setView('simple'));
    tabSci.addEventListener('click', () => setView('sci'));
    tabGraph.addEventListener('click', () => setView('graph'));








    /**BUTTONS */
    document.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'insert') insertToExpr(btn.dataset.insert);
            else if (action === 'func') {
                insertToExpr(state.second ? btn.dataset.alt : btn.dataset.insert);
                state.second = false;
                updateSecondButtons();
            }
            else if (action === 'clear') clearAll();
            else if (action === 'back') backspace();
            else if (action === 'equals') { if (state.mode === 'graph') drawGraph(); else doEquals(); }
            else if (action === 'sign') toggleSign();
            else if (action === 'second') { state.second = !state.second; updateSecondButtons(); }
            else if (action === 'deg') {
                state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
                btnDeg.textContent = state.angleMode;
                footMode.textContent = state.angleMode;
                refresh();
            }
            else if (action === 'mc') { state.memory = 0; refresh(); }
            else if (action === 'mr') { insertToExpr(trimResult(state.memory)); }
            else if (action === 'mplus') {
                try {
                    const val = evaluateExpr(state.expr || '0', {
                        x: 0,
                        angleMode: state.angleMode
                    });

                    if (isFinite(val)) {
                        state.memory += val;
                    }
                } catch (e) { }

                refresh();
            }
            btn.blur();
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') { insertToExpr(e.key); return; }
        if (e.key === '.' || e.key === ',') { insertToExpr('.'); return; }
        if (e.key === '+') { insertToExpr('+'); return; }
        if (e.key === '-') { insertToExpr('−'); return; }
        if (e.key === '*') { insertToExpr('×'); return; }
        if (e.key === '/') { e.preventDefault(); insertToExpr('÷'); return; }
        if (e.key === '(') { insertToExpr('('); return; }
        if (e.key === ')') { insertToExpr(')'); return; }
        if (e.key === '^') { insertToExpr('^'); return; }
        if (e.key === '!') { insertToExpr('!'); return; }
        if (e.key === '%') { insertToExpr('%'); return; }
        if (e.key === 'x' || e.key === 'X') { insertToExpr('x'); return; }
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            if (state.mode === 'graph') drawGraph(); else doEquals();
            return;
        }
        if (e.key === 'Escape') { clearAll(); return; }
        if (e.key === 'Backspace') { e.preventDefault(); backspace(); return; }
    });

    refresh();
})();