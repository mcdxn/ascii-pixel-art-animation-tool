'use strict';

export class Shape {
    
    static circle(screen, pixel, color, radius, x, y){
        let balance, xoff, yoff;

        xoff    = 0;
        yoff    = radius;
        balance = -radius;

        do {
            screen.writePixel(x+xoff, y+yoff, pixel, color);
            screen.writePixel(x-xoff, y+yoff, pixel, color);
            screen.writePixel(x-xoff, y-yoff, pixel, color);
            screen.writePixel(x+xoff, y-yoff, pixel, color);
            screen.writePixel(x+yoff, y+xoff, pixel, color);
            screen.writePixel(x-yoff, y+xoff, pixel, color);
            screen.writePixel(x-yoff, y-xoff, pixel, color);
            screen.writePixel(x+yoff, y-xoff, pixel, color);

            if ((balance += (xoff++) + xoff) >= 0){
                balance -= --yoff + yoff;
            }

        } while (xoff <= yoff);
    }
}