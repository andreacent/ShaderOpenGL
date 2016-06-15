uniform int _calctype;
uniform int _r;

uniform float _freq;
uniform float _hoff;
uniform float _f;

#define PI 3.14159265358

vec4 HSVtoRGB( float h, float gl_TexCoord[0].s, float v ){
   int i;
   float f, p, q;
   vec4 RGB;
   
   h = 360*h;
   /*if( gl_TexCoord[0].s == 0 ) {
      // achromatic (grey)
      RGB = vec3(v,v,v);
      return RGB
   }*/
   
   h /= 60;         // sector 0 to 5
   i = int(floor( h ));
   f = h - i;         // factorial part of h
   p = v * ( 1 - gl_TexCoord[0].s );
   q = v * ( 1 - gl_TexCoord[0].s * f );
   gl_TexCoord[0].t = v * ( 1 - gl_TexCoord[0].s * ( 1 - f ) );
   
   switch( i ) {
      case 0:
         RGB.x = v;
         RGB.y = gl_TexCoord[0].t;
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
         RGB.z = gl_TexCoord[0].t;
         break;
      case 3:
         RGB.x = p;
         RGB.y = q;
         RGB.z = v;
         break;
      case 4:
         RGB.x = gl_TexCoord[0].t;
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

float lcm(float r, float rv){
   float i = 0;
   float cm = 1.0;

   if( (r % rv) == 0) cm =1;
   else{
      i=1;
      while( (r*i % rv) != 0) i +=1;
      cm = i;
   }
   return cm;
}

float calcspiro(float r, float rv, float b, float a){
   float rho ;
   float aux = r-rv;
   rho = sqrt(aux*aux+ b*b + 2*aux*b*cos((1+r/rv)*a));
   return rho;
}

void spirofield(float r, float hoff, float freq, int calctype,float f){
   const float b = 2.5;
   const int rv = 5;
   float i, theta, rho, nrev, a, rsp, ss, tt;
   vec4 ci;

   ss = gl_TexCoord[0].s - 0.5;
   tt = gl_TexCoord[0].t - 0.5;
   theta = atan(tt,ss); //que es atan?
   theta += PI;
   rho = 2*sqrt(ss*ss+tt*tt);
   if( rho > (r-rv+b)/r) || rho < (r-rv-b)/r) ){
      ci = 0.25;
   }else{
      float deltad;
      vec4 ch, cg;

      nrev = lcm(r,rv);
      if(0 == calctype){
         float maxdist = -2;
         for(int i = 0;i < nrev; i +=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            deltad = abs(rsp-rho);
            if(deltad > maxdist) maxdist = deltad;
         }
         maxdist = maxdist * nrev * freq;
         maxdist = (maxdist+hoff) % 1.0;
         ch = HSVtoRGB(maxdist,1.0,1.0);
         cg = {maxdist,maxdist,maxdist,1.0};
      }
      else if{
         float mindist = 2;
         for(int i =0; i < nrev;i+=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            deltad = abs(rsp-rho);
            if(deltad <mindist) mindist = deltad;
         }
         mindist = mindist * nrev * freq;
         mindist = (mindist+ hoff) % 1.0;
         ch = HSVtoRGB(mindist,1.0,1.0);
         cg = {mindist,mindist,mindist,1.0};

      }else{
         float avdist =0;
         for(int i =0; i<nrev ; i+=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            avdist += abs(rsp-rho);
         }
         avdist = avdist * freq;
         avdist = (avdist+hoff) % 1.0;
         ch = HSVtoRGB(avdist,1.0,1.0);
         cg = {avdist,avdist,avdist,1.0};
      }
      ci = mix(cg,ch,f);
   }
}

void main(void) {

   gl_FragColor = spirofield(_r, _hoff, _freq, _calctype, _f);
	//gl_FragColor = HSVtoRGB(0.0,1.0,1.0);
}