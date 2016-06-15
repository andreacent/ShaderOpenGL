#version 130
uniform float _calctype;
uniform float _r;
uniform float _freq;
uniform float _hoff;
uniform float _f;

#define PI 3.14159265358

vec4 HSVtoRGB( float h, float v ){
   int i;
   float f, p, q, t, s;
   vec4 RGB;
   
   s = gl_TexCoord[0].s;

   h = 360*h;
   /*if( gl_TexCoord[0].s == 0 ) {
      // achromatic (grey)
      RGB = vec3(v,v,v);
      return RGB
   }*/
   
   h /= 60;         // sector 0 to 5
   i = int(floor( h ));
   f = h - i;         // factorial part of h
   p = v * ( 1 - s );
   q = v * ( 1 - s * f );
   //t = gl_TexCoord[0].t;
   t = v * ( 1 - s * ( 1 - f ) );
   
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


float calcspiro(float r, float rv, float b, float a){
   float rho ;
   float aux = r-rv;
   rho = sqrt(aux*aux+ b*b + 2*aux*b*cos((1+r/rv)*a));
   return rho;
}

float lcm(float r, float rv){
   float i = 1;
   float cm = 1.0;

   if( mod(r,rv) == 0) cm = 1.0;
   else{
      while( mod(r*i,rv) != 0) i +=1;
      cm = i;
   }
   return cm;
}

vec4 spirofield(float r, float hoff, float freq, float calctype,float f){
   const float b = 2.5;
   const int rv = 5;
   float i, theta, rho, nrev, a, rsp, ss, tt;
   vec4 ci;

   float deltad;
   vec4 ch, cg;

   ss = gl_TexCoord[0].s - 0.5;
   tt = gl_TexCoord[0].t - 0.5;
   theta = atan(tt,ss); //que es atan?
   theta += PI;
   rho = 2*sqrt(ss*ss+tt*tt);
   if( rho > (r-rv+b)/r || rho < (r-rv-b)/r ){
      //ci = 0.25;
   }else{
      nrev = lcm(r,rv);
      cg.w = 1.0;
      if(0 == calctype){
         float maxdist = -2;
         for(int i = 0;i < nrev; i +=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            deltad = abs(rsp-rho);
            if(deltad > maxdist) maxdist = deltad;
         }
         maxdist = maxdist * nrev * freq;
         maxdist = mod(maxdist+hoff,1.0);
         ch = HSVtoRGB(maxdist,1.0);
         cg.x = maxdist;
         cg.y = maxdist;
         cg.z = maxdist;
      }
      else if(1 == calctype){
         float mindist = 2;
         for(int i =0; i < nrev;i+=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            deltad = abs(rsp-rho);
            if(deltad < mindist) mindist = deltad;
         }
         mindist = mindist * nrev * freq;
         mindist = mod(mindist+ hoff,1.0);
         ch = HSVtoRGB(mindist,1.0);
         cg.x = mindist;
         cg.y = mindist;
         cg.z = mindist;
      }
      else{
         float avdist =0;
         for(int i =0; i<nrev ; i+=1){
            a = theta + i*2*PI;
            rsp = calcspiro(r,rv,b,a)/r;
            avdist += abs(rsp-rho);
         }
         avdist = avdist * freq;
         avdist = mod(avdist+hoff,1.0);
         ch = HSVtoRGB(avdist,1.0);
         cg.x = avdist;
         cg.y = avdist;
         cg.z = avdist;
      }
      ci = mix(cg,ch,f);
   }
   return ci;
}

void main(void) {

   gl_FragColor = spirofield(_r, _hoff, _freq, _calctype, _f);
	//gl_FragColor = HSVtoRGB(0.0,1.0);
}