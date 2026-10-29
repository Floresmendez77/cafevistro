import React, { useEffect, useRef, useState } from 'react';

interface FerrofluidBackgroundProps {
  theme?: 'dark' | 'light';
  className?: string;
}

const MAX_COLORS = 8;

const VERTEX_SRC = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
varying vec2 vUv;
#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;
  float spd = 200.0 * uSpeed;
  float t = iTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));
  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }
  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);
  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);
  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
  fragColor = vec4(outc, a * uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

function hexToRGB(hex: string): [number, number, number] {
  const c = (hex || '#B89778').replace('#', '').padEnd(6, '0');
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
}

function prepColors(input: string[]) {
  const base = input.slice(0, MAX_COLORS);
  const count = base.length;
  const arr: number[] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const rgb = hexToRGB(base[Math.min(i, base.length - 1)]);
    arr.push(rgb[0], rgb[1], rgb[2]);
  }
  return { arr: new Float32Array(arr), count };
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[Ferrofluid] shader error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export const FerrofluidBackground: React.FC<FerrofluidBackgroundProps> = ({
  theme = 'dark',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  const isDark = theme === 'dark';

  // Coffee palette:
  // Dark: ['#B89778','#D4B99F','#8A6A4E'] on #1C120C
  // Light: darker browns, lower opacity, on #F8F1E9
  const colors = isDark
    ? ['#B89778', '#D4B99F', '#8A6A4E']
    : ['#6B4423', '#8B5A2B', '#4A2E1B'];
  const opacity = isDark ? 0.55 : 0.28;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    container.appendChild(canvas);

    const rawGl =
      canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      (canvas.getContext('experimental-webgl', { alpha: true, antialias: true }) as WebGLRenderingContext | null);

    if (!rawGl) {
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
      setHasWebGL(false);
      return;
    }

    const gl: WebGLRenderingContext = rawGl;
    setHasWebGL(true);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) {
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[Ferrofluid] link error:', gl.getProgramInfoLog(program));
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Full-screen triangle buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    // Uniforms
    const U: Record<string, WebGLUniformLocation | null> = {};
    [
      'iResolution',
      'iMouse',
      'iTime',
      'uColor0',
      'uColor1',
      'uColor2',
      'uColor3',
      'uColor4',
      'uColor5',
      'uColor6',
      'uColor7',
      'uColorCount',
      'uFlow',
      'uSpeed',
      'uScale',
      'uTurbulence',
      'uFluidity',
      'uRimWidth',
      'uSharpness',
      'uShimmer',
      'uGlow',
      'uOpacity',
      'uMouseEnabled',
      'uMouseStrength',
      'uMouseRadius',
    ].forEach((name) => {
      U[name] = gl.getUniformLocation(program, name);
    });

    const colorPrep = prepColors(colors);
    for (let i = 0; i < MAX_COLORS; i++) {
      const idx = i * 3;
      gl.uniform3f(U['uColor' + i], colorPrep.arr[idx], colorPrep.arr[idx + 1], colorPrep.arr[idx + 2]);
    }
    gl.uniform1i(U.uColorCount, colorPrep.count);
    gl.uniform2f(U.uFlow, 0, -1);
    gl.uniform1f(U.uSpeed, 0.35);
    gl.uniform1f(U.uScale, 1.4);
    gl.uniform1f(U.uTurbulence, 0.75);
    gl.uniform1f(U.uFluidity, 0.12);
    gl.uniform1f(U.uRimWidth, 0.18);
    gl.uniform1f(U.uSharpness, 2.6);
    gl.uniform1f(U.uShimmer, 1.2);
    gl.uniform1f(U.uGlow, 1.6);
    gl.uniform1f(U.uOpacity, opacity);
    gl.uniform1f(U.uMouseEnabled, 1.0);
    gl.uniform1f(U.uMouseStrength, 0.8);
    gl.uniform1f(U.uMouseRadius, 0.32);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouseTarget = [0, 0];
    const mouseCurrent = [0, 0];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform3f(U.iResolution, w, h, 1);
      }
    }

    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);
    window.addEventListener('resize', resize);

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr;
      mouseTarget[0] = x;
      mouseTarget[1] = y;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf: number | null = null;
    let lastT = 0;
    let running = true;

    // Fixed leaked visibilitychange listener by using named handler
    function onVisibilityChange() {
      running = document.visibilityState === 'visible';
      if (running && !raf) {
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (!running) return;

      gl.uniform1f(U.iTime, t * 0.001);

      const dampening = 0.18;
      if (!lastT) lastT = t;
      const dt = (t - lastT) / 1000;
      lastT = t;
      const factor = Math.min(1, 1 - Math.exp(-dt / Math.max(1e-4, dampening)));
      mouseCurrent[0] += (mouseTarget[0] - mouseCurrent[0]) * factor;
      mouseCurrent[1] += (mouseTarget[1] - mouseCurrent[1]) * factor;

      gl.uniform2f(U.iMouse, mouseCurrent[0], mouseCurrent[1]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    raf = requestAnimationFrame(loop);

    // Clean up on unmount or theme change
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      if (ro) ro.disconnect();
      if (buf) gl.deleteBuffer(buf);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
    };
  }, [theme, colors, opacity]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-700 ${
        isDark ? 'bg-[#1C120C]' : 'bg-[#F8F1E9]'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Static Fallback for prefers-reduced-motion or unsupported WebGL */}
      {!hasWebGL && (
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-br from-[#1C120C] via-[#2A170E] to-[#120B07]'
              : 'bg-gradient-to-br from-[#F8F1E9] via-[#EFE6DD] to-[#E5D7CA]'
          }`}
        >
          <div
            className={`absolute inset-0 opacity-40 ${
              isDark
                ? 'bg-[radial-gradient(circle_at_30%_30%,#B89778_0%,transparent_60%)]'
                : 'bg-[radial-gradient(circle_at_30%_30%,#8A6A4E_0%,transparent_60%)]'
            }`}
          />
        </div>
      )}
    </div>
  );
};
