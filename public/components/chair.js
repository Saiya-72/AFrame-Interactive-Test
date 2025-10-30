(function(){
  AFRAME.registerComponent('classroom-chair', {
    schema: {
      // seat dimensions (meters)
      seatWidth:  {type: 'number', default: 0.48767998439424054}, // ~1.6 ft
      seatDepth:  {type: 'number', default: 0.48767998439424054}, // ~1.6 ft
      seatHeight: {type: 'number', default: 0.48767998439424054}, // seat top off floor (~1.6 ft ≈ 19 in)

      // how tall the top of the backrest is above the floor
      backHeight: {type: 'number', default: 0.914399970739201},   // ~3.0 ft total height

      color:      {type: 'color',  default: '#3f3f46'},
      frameColor: {type: 'color',  default: '#222'}
    },

    init(){
      const d  = this.data;
      const W  = d.seatWidth;
      const D  = d.seatDepth;
      const SH = d.seatHeight;   // seat top Y
      const BH = d.backHeight;   // absolute backrest top Y

      const root = this.el;

      // --- seat ---
      const seat = document.createElement('a-box');
      seat.setAttribute('width',  W);
      seat.setAttribute('depth',  D);
      seat.setAttribute('height', 0.024383999219712026); // ~0.08 ft thick tabletop-style seat
      seat.setAttribute('position', `0 ${SH} 0`);
      seat.setAttribute(
        'material',
        `color:${d.color}; metalness:0.1; roughness:0.8`
      );
      root.appendChild(seat);

      // --- backrest ---
      // thickness (front-to-back)
      const backDepth = 0.030479999024640034; // ~0.1 ft
      // inset the backrest slightly toward rear of seat
      const backZ = -D/2 + 0.015239999512320017; // ~0.05 ft inset
      // backrest height is from seat top (SH) up to BH
      const backHeightSize = BH - SH;

      const back = document.createElement('a-box');
      back.setAttribute('width',  W);
      back.setAttribute('height', backHeightSize > 0 ? backHeightSize : 0.01);
      back.setAttribute('depth',  backDepth);

      // center of that vertical plank is halfway between SH and BH
      const backY = SH + (backHeightSize / 2);
      back.setAttribute('position', `0 ${backY} ${backZ}`);
      back.setAttribute(
        'material',
        `color:${d.color}; metalness:0.1; roughness:0.8`
      );
      root.appendChild(back);

      // --- legs ---
      function mkLeg(x, z){
        const leg = document.createElement('a-cylinder');
        leg.setAttribute('radius', 0.015239999512320017); // ~0.05 ft tube radius
        leg.setAttribute('height', SH);
        leg.setAttribute('position', `${x} ${SH/2} ${z}`);
        leg.setAttribute(
          'material',
          `color:${d.frameColor}; metalness:0.6; roughness:0.3`
        );
        return leg;
      }

      // pull legs slightly in from corners
      const legInset = 0.030479999024640034; // ~0.1 ft
      const lx = W/2 - legInset;
      const lz = D/2 - legInset;

      root.appendChild(mkLeg( lx,  lz));
      root.appendChild(mkLeg(-lx,  lz));
      root.appendChild(mkLeg( lx, -lz));
      root.appendChild(mkLeg(-lx, -lz));
    }
  });
})();
