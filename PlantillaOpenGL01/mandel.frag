#version 130
uniform float _xc;
uniform float _yc;
uniform float _sz;
uniform float _huefreq;
uniform float _escape;
uniform float _maxiter;

vec4 HSVtoRGB( float h, float v ){
   int i;
   float f, p, q, t, s;
   vec4 RGB;

   s = 1.0;
   
   h = 360.0*h;
   /*if( s == 0 ) {
      // achromatic (grey)
      RGB = vec3(v,v,v);
      return RGB
   }*/
   
   h /= 60.0;         // sector 0 to 5
   i = int(floor( h ));
   f = h - i;         // factorial part of h
   p = v * ( 1.0 - s );
   q = v * ( 1.0 - s * f );
   t = v * ( 1.0 - s * ( 1.0 - f ) );
   
   switch( i ) {
      case 0:
         RGB.x = v;
         RGB.y = t;
         RGB.z = p;
         break;
      case 1:
         RGB.x = q;
         RGB.y = v;
         RGB.z = p;
         break;
      case 2:
         RGB.x = p;
         RGB.y = v;
         RGB.z = t;
         break;
      case 3:
         RGB.x = p;
         RGB.y = q;
         RGB.z = v;
         break;
      case 4:
         RGB.x = t;
         RGB.y = p;
         RGB.z = v;
         break;
      default:      // case 5:
         RGB.x = v;
         RGB.y = p;
         RGB.z = q;
         break;
   }
   
   RGB.w = 1.0;
   return RGB;
   
}

vec4 mandel(float xc,float yc,float sz,float escape,float maxiter, float huefreq) {
	
	float xmin,ymin,x,y,a,b,n,aa,bb,twoab,h;
	vec4 Cmandel;

	xmin = xc-0.5*sz;
	ymin = yc-0.5*sz;
	x = xmin+sz*gl_TexCoord[0].s;
	y = ymin+sz*gl_TexCoord[0].t;

	n = 0;
	a = x;
	b = y;

	while (n < maxiter) {
		aa = a*a;
		bb = b*b;
		twoab = 2*a*b;
		if ((aa+bb) > escape) {
			break;
		}
		n = n+1;
		a = aa-bb+x;
		b = twoab+y;
	}

	h = 0.5*(1+sin(huefreq*n/maxiter));
	Cmandel =  HSVtoRGB(h,1.0);
	return Cmandel;
}

void main(void) {
	//gl_FragColor = HSVtoRGB(0.5,1.0,1.0);
	gl_FragColor = mandel(_xc,_yc,_sz,_escape,_maxiter,_huefreq);
}