import { useEffect, useRef } from "react";
import { SIGNATURE_PULSE_EVENT } from "../lib/signature-field-signal";

/* ============================================================
   SignatureField — the site's one continuous visual identity.

   A single WebGL2 canvas, position:fixed behind every section,
   rendered once in the root layout. It never restarts and never
   loops obviously:

   - A faceted "core" sits at screen-center and unfolds more
     facets the further you scroll (u_scroll), instead of each
     section triggering its own isolated animation.
   - Hovering nav items / pressing primary buttons dispatches a
     SIGNATURE_PULSE_EVENT, which sends a decaying energy ripple
     through the core and its orbit rings — "interaction reacts
     with physically believable motion" from the brief, done
     cheaply as a scalar uniform rather than a literal particle sim.
   - Degrades silently to nothing (CSS gradient takes over) if
     WebGL2 isn't available — no console spam, no crash.
   ============================================================ */

export function SignatureField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
    }) as WebGL2RenderingContext | null;
    if (!gl) return;

    const vertSrc = `#version 300 es
      in vec2 a_pos;
      void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

    const fragSrc = `#version 300 es
      precision highp float;
      out vec4 outColor;
      uniform float u_time;
      uniform vec2  u_res;
      uniform vec2  u_mouse;
      uniform float u_scroll;   // 0..1 across the whole document
      uniform float u_pulse;    // decaying 0..~1.6 energy spike

      float hash13(vec3 p){
        p = fract(p * 0.1031);
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }
      float noise3(vec3 p){
        vec3 i = floor(p); vec3 f = fract(p);
        f = f*f*(3.0-2.0*f);
        float n000 = hash13(i);
        float n100 = hash13(i+vec3(1,0,0));
        float n010 = hash13(i+vec3(0,1,0));
        float n110 = hash13(i+vec3(1,1,0));
        float n001 = hash13(i+vec3(0,0,1));
        float n101 = hash13(i+vec3(1,0,1));
        float n011 = hash13(i+vec3(0,1,1));
        float n111 = hash13(i+vec3(1,1,1));
        return mix(
          mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
          mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y),
          f.z);
      }
      float fbm3(vec3 p){
        float v=0.0, a=0.55;
        mat3 r = mat3(0.8,0.6,0.0, -0.6,0.8,0.0, 0.0,0.0,1.0);
        for(int i=0;i<5;i++){ v += a*noise3(p); p = r*p*2.02 + 11.0; a*=0.5; }
        return v;
      }

      // faint ambient volumetric drift — atmosphere, not the focal point
      vec3 atmosphere(vec2 uv, float t){
        vec3 acc = vec3(0.0);
        float transmit = 1.0;
        for(int i=0;i<7;i++){
          float fi = float(i);
          float z = fi * 0.3 + t*0.12;
          vec3 p = vec3(uv*1.3, z);
          vec3 q = vec3(
            fbm3(p + vec3(0.0,0.0, t*0.6)),
            fbm3(p + vec3(5.2,1.3,-t*0.4)),
            fbm3(p + vec3(-3.4,2.8, t*0.25))
          );
          float d = fbm3(p*1.05 + q*1.7);
          d = smoothstep(0.46, 0.92, d);
          float phase = fi*0.4 + t*0.3;
          vec3 tint = mix(vec3(0.55,0.45,0.35), vec3(1.0,0.62,0.22), 0.6)
                    * (0.5 + 0.5*sin(phase));
          acc += tint * d * 0.35 * transmit;
          transmit *= (1.0 - d*0.5);
          if (transmit < 0.03) break;
        }
        return acc * 0.55;
      }

      // rotated faceted "rose" distance field — the Digital Core
      float rose(vec2 uv, float k, float rot){
        float ang = atan(uv.y, uv.x) + rot;
        float radius = length(uv);
        float petal = 0.30 + 0.045 * cos(ang * k);
        return abs(radius - petal);
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
        vec2 m  = (u_mouse - 0.5*u_res) / u_res.y;
        float t = u_time * 0.35;

        // core drifts very slightly with mouse + gentle independent orbit —
        // a stabilized-rig feel rather than a locked sticker
        vec2 center = m * 0.05 + vec2(sin(t*0.13)*0.035, cos(t*0.1)*0.02);
        vec2 cuv = uv - center;

        vec3 col = vec3(0.028, 0.026, 0.034); // deep ink base
        col += atmosphere(uv, t) * (1.0 - 0.35*u_scroll);

        float pulse = u_pulse;
        float facets = 5.0 + u_scroll * 7.0;              // unfolds while scrolling
        float spin = t * (0.18 + pulse * 0.25);

        // primary core ring
        float d1 = rose(cuv, facets, spin);
        float ring1 = 0.006 + 0.003 * pulse;
        float glow1 = ring1 / (d1 + ring1) ;
        glow1 = pow(glow1, 1.4);

        // secondary counter-rotating ring, denser facet count
        float d2 = rose(cuv * 1.35, facets * 1.6, -spin * 1.4 + 1.7);
        float glow2 = (0.005 / (d2 + 0.005));
        glow2 = pow(glow2, 1.4);

        // inner breathing core disc
        float r = length(cuv);
        float breathe = 0.5 + 0.5*sin(t*0.9);
        float coreR = 0.10 + 0.012*breathe + 0.03*pulse;
        float core = smoothstep(coreR, coreR - 0.09, r);
        core *= (0.55 + 0.45*breathe + pulse*0.5);

        // outer thin orbit rings, count grows subtly with scroll
        float orbits = 0.0;
        for (int i = 1; i <= 3; i++){
          float fi = float(i);
          if (fi > 1.4 + u_scroll*2.2) continue;
          float rad = 0.42 + fi*0.11;
          float dOrbit = abs(r - rad);
          orbits += (0.0016 / (dOrbit + 0.0016)) * 0.5;
        }

        vec3 amber = vec3(1.0, 0.70, 0.30);
        vec3 hot   = vec3(1.0, 0.92, 0.75);

        col += amber * glow1 * (0.55 + pulse*0.9);
        col += mix(amber, hot, 0.4) * glow2 * (0.35 + pulse*0.7);
        col += mix(amber, hot, 0.7) * core;
        col += amber * orbits * (0.5 + pulse*0.8);

        // faint rim energy ring on pulse — the "wave" from hovering nav
        float wave = abs(r - (0.5 + pulse*0.4)) ;
        col += hot * (0.01/(wave+0.01)) * smoothstep(0.0, 1.0, pulse) * 0.5;

        // vignette + tonemap
        float vig = smoothstep(1.5, 0.25, length(uv));
        col *= vig;
        col = col / (1.0 + col);
        col = pow(col, vec3(0.85));

        float grain = (hash13(vec3(gl_FragCoord.xy, u_time)) - 0.5) * 0.035;
        col += grain;

        outColor = vec4(col, 1.0);
      }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uPulse = gl.getUniformLocation(prog, "u_pulse");

    let mouse = [0, 0];
    const onMove = (e: PointerEvent) => {
      mouse = [e.clientX, window.innerHeight - e.clientY];
    };
    window.addEventListener("pointermove", onMove);

    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let pulse = 0;
    const onPulse = (e: Event) => {
      const strength = (e as CustomEvent<number>).detail ?? 1;
      pulse = Math.min(1.6, pulse + strength);
    };
    window.addEventListener(SIGNATURE_PULSE_EVENT, onPulse as EventListener);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    let running = true;
    const loop = () => {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      pulse *= 0.965; // decay — one ripple, never a repeating loop
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse[0] * dpr, mouse[1] * dpr);
      gl.uniform1f(uScroll, scrollProgress);
      gl.uniform1f(uPulse, pulse);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener(SIGNATURE_PULSE_EVENT, onPulse as EventListener);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* CSS fallback if WebGL2 is unavailable — never a blank screen */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.2_0.02_60)_0%,oklch(0.11_0.006_60)_70%)]" />
    </div>
  );
}
