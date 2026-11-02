import React, { useEffect, useRef, useState } from 'react';

interface SignalFieldCanvasProps {
  audioLevel?: number;
  className?: string;
  onGpuStateChange?: (state: string) => void;
}

export const SignalFieldCanvas: React.FC<SignalFieldCanvasProps> = ({
  audioLevel = 0,
  className = 'signal-field',
  onGpuStateChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioLevelRef = useRef(audioLevel);
  const [active, setActive] = useState(true);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onGpuStateChange?.('SIGNAL FIELD / STATIC');
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      onGpuStateChange?.('SIGNAL FIELD / CSS FALLBACK');
      return;
    }

    const vs = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
    const fs = `
precision mediump float;
varying vec2 v;uniform vec2 r;uniform vec2 m;uniform float t;uniform float au;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.)),f.x),f.y);}
float line(float x,float w){return 1.-smoothstep(0.,w,abs(x));}
void main(){
 vec2 uv=v;vec2 p=uv-.5;p.x*=r.x/max(r.y,1.);
 float q=n(p*3.8+vec2(t*.025,-t*.018));q+=.5*n(p*8.2-vec2(t*.04,0.));
 float scan=line(sin((uv.y+q*.025)*92.+t*(1.15+au*2.4)),.09+au*.07);
 vec2 g=abs(fract(uv*vec2(22.,14.))-.5);float grid=(1.-smoothstep(.47,.495,max(g.x,g.y)))*.11;
 float d=length(p-vec2(.22+m.x*.08,.02+m.y*.05));float halo=smoothstep(.55,.02,d);
 float rupture=line(p.y-sin(p.x*7.+t*.35)*(.018+au*.045)-q*.018,.012+au*.009);
 float glitch=step(.975,h(vec2(floor(uv.y*90.),floor(t*5.))))*line(fract(uv.x*3.+q)-.5,.12);
 vec3 bone=vec3(.925,.90,.85),red=vec3(.72,.07,.085);
 vec3 col=bone*(grid+scan*.07)+red*(halo*.11+rupture*(.14+au*.32)+glitch*.16);
 float a=clamp(grid+scan*.08+halo*.08+rupture*.18+glitch*.16,0.,.48);
 gl_FragColor=vec4(col,a);
}`;

    function compile(type: number, src: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vShader = compile(gl.VERTEX_SHADER, vs);
    const fShader = compile(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) {
      onGpuStateChange?.('SIGNAL FIELD / SHADER FALLBACK');
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onGpuStateChange?.('SIGNAL FIELD / SHADER ERROR');
      return;
    }

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const ur = gl.getUniformLocation(prog, 'r');
    const um = gl.getUniformLocation(prog, 'm');
    const ut = gl.getUniformLocation(prog, 't');
    const ua = gl.getUniformLocation(prog, 'au');

    let mx = 0;
    let my = 0;
    let isVisible = true;

    const onPointerMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = 0.5 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onVisChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisChange);

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    const start = performance.now();
    let animId: number;

    function render(now: number) {
      resize();
      if (isVisible) {
        gl.uniform2f(ur, canvas.width, canvas.height);
        gl.uniform2f(um, mx, my);
        gl.uniform1f(ut, (now - start) / 1000);
        gl.uniform1f(ua, audioLevelRef.current);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    }

    onGpuStateChange?.('SIGNAL FIELD / WEBGL');
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, [onGpuStateChange]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
