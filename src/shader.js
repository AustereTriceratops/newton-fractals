export const FRAGMENT_SHADER = 
`
precision highp float;

// =================
// === CONSTANTS ===
// =================

int MAX_ITERATIONS = 50;
float CUTOFF = 0.0001;

// ==============
// === WINDOW ===
// ==============

uniform vec2 res;
uniform float aspect;
uniform float zoom;
uniform vec2 offset;

// ======================
// === GUI PARAMETERS ===
// ======================

uniform int color_scheme;
uniform float a;
uniform float b;
uniform float c;
uniform float d;
uniform float e;
uniform float f;

// =============================
// === COORDINATE TRANSFORMS ===
// =============================

vec2 to0Pos1( vec2 v )
{
  return vec2(aspect, 1.0) * v / res;
}

vec2 toNeg1Pos1( vec2 v )
{
  vec2 w = to0Pos1(v);
  return vec2(2.0*w.x - aspect, 2.0*w.y - 1.0);
}

// maps p in interval a to interval b
float toInterval( vec2 a, vec2 b, float p )
{
  float n = (p - a.x)/(a.y - a.x);
  float m = n * (b.y - b.x) + b.x;
  return m;
}

// =================================
// === COMPLEX NUMBER OPERATIONS ===
// =================================

vec2 complexConjugation( vec2 a )
{
  return vec2( a.x, -a.y );
}

float complexMagnitudeSq( vec2 a )
{
  return a.x*a.x + a.y*a.y;
}

float complexMagnitude( vec2 a )
{
  return pow( complexMagnitudeSq(a), 0.5 );
}

vec2 complexMultiplication( vec2 a, vec2 b)
{
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

// evaluates a/b = ab*/|b|^2
vec2 complexDivision( vec2 a, vec2 b )
{
  vec2 bConj = complexConjugation( b );
  float bMag = complexMagnitudeSq( b );
  return complexMultiplication( a, bConj ) / bMag;
}

vec2 complexSq( vec2 a )
{
  return vec2( a.x*a.x - a.y*a.y, 2.0*a.x*a.y );
}

// =====================
// === COLOR SCHEMES ===
// =====================

vec4 basic_colormap(float s, vec3 shade) {
  vec3 coord = vec3(s, s, s);

  return vec4(pow(coord, shade), 1.0);
}

vec4 custom_colormap_1(float s) {
  vec3 color_1 = vec3(0.22, 0.07, 0.08);
  vec3 color_2 = vec3(0.29, 0.08, 0.08);
  vec3 color_3 = vec3(0.49, 0.11, 0.09);
  vec3 color_4 = vec3(0.66, 0.26, 0.14);
  vec3 color_5 = vec3(0.78, 0.47, 0.24);
  vec3 color_6 = vec3(0.87, 0.72, 0.39);
  vec3 color_7 = vec3(0.9, 0.87, 0.55);
  vec3 color_8 = vec3(0.85, 0.96, 0.67);

  vec3 color;

  if (s < 0.143) {
    float x = 7.0 * s;
    color = (1.0 - x) * color_1 + x * color_2;
  }
  else if (s < 0.286) {
    float x = 7.0 * (s - 0.143);
    color = (1.0 - x) * color_2 + x * color_3;
  }
  else if (s < 0.423) {
    float x = 7.0 * (s - 0.286);
    color = (1.0 - x) * color_3 + x * color_4;
  }
  else if (s < 0.571) {
    float x = 7.0 * (s - 0.423);
    color = (1.0 - x) * color_4 + x * color_5;
  }
  else if (s < 0.714) {
    float x = 7.0 * (s - 0.571);
    color = (1.0 - x) * color_5 + x * color_6;
  }
  else if (s < 0.857) {
    float x = 7.0 * (s - 0.714);
    color = (1.0 - x) * color_6 + x * color_7;
  }
  else {
    float x = 7.0 * (s - 0.857);
    color = (1.0 - x) * color_7 + x * color_8;
  }

  return vec4(color, 1.0);
}

vec4 custom_colormap_2(float s) {
  vec3 color_1 = vec3(0.04, 0.08, 0.09);
  vec3 color_2 = vec3(0.06, 0.26, 0.33);
  vec3 color_3 = vec3(0.14, 0.35, 0.61);
  vec3 color_4 = vec3(0.30, 0.37, 0.80);
  vec3 color_5 = vec3(0.43, 0.40, 0.86);
  vec3 color_6 = vec3(0.55, 0.44, 0.91);
  vec3 color_7 = vec3(0.78, 0.56, 0.96);
  vec3 color_8 = vec3(0.97, 0.86, 0.98);

  vec3 color;

  if (s < 0.143) {
    float x = 7.0 * s;
    color = (1.0 - x) * color_1 + x * color_2;
  }
  else if (s < 0.286) {
    float x = 7.0 * (s - 0.143);
    color = (1.0 - x) * color_2 + x * color_3;
  }
  else if (s < 0.423) {
    float x = 7.0 * (s - 0.286);
    color = (1.0 - x) * color_3 + x * color_4;
  }
  else if (s < 0.571) {
    float x = 7.0 * (s - 0.423);
    color = (1.0 - x) * color_4 + x * color_5;
  }
  else if (s < 0.714) {
    float x = 7.0 * (s - 0.571);
    color = (1.0 - x) * color_5 + x * color_6;
  }
  else if (s < 0.857) {
    float x = 7.0 * (s - 0.714);
    color = (1.0 - x) * color_6 + x * color_7;
  }
  else {
    float x = 7.0 * (s - 0.857);
    color = (1.0 - x) * color_7 + x * color_8;
  }

  return vec4(color, 1.0);
}

vec4 custom_colormap_3(float s) {
  vec3 color_1 = vec3(0.27, 0.0, 0.19);
  vec3 color_2 = vec3(0.43, 0.02, 0.45);
  vec3 color_3 = vec3(0.55, 0.06, 0.7);
  vec3 color_4 = vec3(0.65, 0.16, 0.93);
  vec3 color_5 = vec3(0.68, 0.42, 0.98);
  vec3 color_6 = vec3(0.73, 0.61, 0.99);
  vec3 color_7 = vec3(0.77, 0.81, 0.96);
  vec3 color_8 = vec3(0.92, 0.91, 1.0);

  vec3 color;

  if (s < 0.143) {
    float x = 7.0 * s;
    color = (1.0 - x) * color_1 + x * color_2;
  }
  else if (s < 0.286) {
    float x = 7.0 * (s - 0.143);
    color = (1.0 - x) * color_2 + x * color_3;
  }
  else if (s < 0.423) {
    float x = 7.0 * (s - 0.286);
    color = (1.0 - x) * color_3 + x * color_4;
  }
  else if (s < 0.571) {
    float x = 7.0 * (s - 0.423);
    color = (1.0 - x) * color_4 + x * color_5;
  }
  else if (s < 0.714) {
    float x = 7.0 * (s - 0.571);
    color = (1.0 - x) * color_5 + x * color_6;
  }
  else if (s < 0.857) {
    float x = 7.0 * (s - 0.714);
    color = (1.0 - x) * color_6 + x * color_7;
  }
  else {
    float x = 7.0 * (s - 0.857);
    color = (1.0 - x) * color_7 + x * color_8;
  }

  return vec4(color, 1.0);
}

// ============
// === MAIN ===
// ============

vec2 newtonsMethodStep(vec2 start, float[6] coeffs )
{
  vec2[6] x_powers;
  x_powers[0] = vec2( 1.0, 0.0 );
  x_powers[1] = start;
  x_powers[2]  = complexSq( x_powers[1] );
  x_powers[3] = complexMultiplication( x_powers[1], x_powers[2] );
  x_powers[4] = complexSq( x_powers[2] );
  x_powers[5] = complexMultiplication( x_powers[1], x_powers[4] );

  // calculate value of polynomial and its gradient at x 
  vec2 f, fGrad;
  for (int i = 0; i < 6; ++i) {
    f += coeffs[i] * x_powers[i];
  }
  for (int i = 1; i < 6; ++i) {
    fGrad += float(i) * coeffs[i] * x_powers[i - 1];
  }

  // calculate the step
  vec2 step = complexDivision(f, fGrad);
  return start - step;
}

vec3 newtonFractal(vec2 start, float[6] coeffs )
{
  float fac = 1.0;
  vec2 point = start;
  vec2 pointPrev;

  for (int i = 0; i < MAX_ITERATIONS; ++i) {
    pointPrev = point;
    point = newtonsMethodStep( point, coeffs );
    float distSq = complexMagnitudeSq(point - pointPrev);

    if ( distSq < CUTOFF ) {
      fac = float(i) / float(MAX_ITERATIONS);
      fac = pow(fac, 1.2);
      break;
    }
  }

  // return the root's coordinates and the time to took to converge
  return vec3( point.xy, fac);
}

// gl_FragCoord in ([0, width], [0, height])
void main(){
  // uv is in [0, aspect][0, 1]
  vec2 uv = to0Pos1(gl_FragCoord.xy);

  // coordinates of pixel on plane
  vec2 pxl = zoom * uv + offset;

  float[] coeffs = float[6](a, b, c, d, e, f);

  vec3 data = newtonFractal( pxl, coeffs );
  float fac = data.z;
  float s = 1.0 - fac;

  if (color_scheme == 0) {
    vec3 shade = vec3(5.38, 6.15, 3.85);
    gl_FragColor = basic_colormap(s, shade);
  }
  else if (color_scheme == 1) {
    vec3 shade = vec3(7.0, 3.0, 2.0);
    gl_FragColor = basic_colormap(s, shade);
  }
  else if (color_scheme == 2) {
    gl_FragColor = custom_colormap_1(pow(s, 6.0));
  }
  else if (color_scheme == 3) {
    gl_FragColor = custom_colormap_2(pow(s, 6.0));
  }
  else {
    gl_FragColor = custom_colormap_3(pow(s, 6.0));
  }
}
`