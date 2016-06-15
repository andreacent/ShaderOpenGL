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

void main(void) {

   gl_FragColor = HSVtoRGB(0.0,1.0,1.0);
}