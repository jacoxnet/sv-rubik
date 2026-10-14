<script>
    import { CUBE, CUBE_SLICE, normalizeName, INITIAL_CUBIE_FACE_COLORS,
             TRANSITION, reverseMap } from '../shared/constants';
    import Cube from './Cube.svelte';

    // faceColors is an array of current colors of the cube
    // by cabezas face numbers
    let faceColors = $state(INITIAL_CUBIE_FACE_COLORS.slice());

    // rotate colors of the face by direction, performed after animation
    // to actually rotate the face (direction 1 normal -1 anti)
    function rotateColors(rotFace, direction) {
        // determine transition map direction
        const transMap = (direction === 1)? TRANSITION[rotFace] : reverseMap(TRANSITION[rotFace]);
        // create list of cubie names to rotate
        const toRotate = CUBE_SLICE[rotFace].slice();
        // create list of corresponding new cubie names
        const newCubies = toRotate.map((cubieName) =>
            normalizeName(([...cubieName].map((letter) => transMap[letter])).join("")));
        // create copy of state for new color assignment
        const oldColors = faceColors;
        const newColors = oldColors.slice();
        // move colors
        toRotate.forEach((piece, i) => {
            const oldCubieIndex = CUBE.findIndex((cubie) => piece === cubie.name);
            const newCubieIndex = CUBE.findIndex((cubie) => newCubies[i] === cubie.name);
            // for each (face) letter, assign the old state color to the new face
            [...piece].forEach((letter) => {
                newColors[CUBE[newCubieIndex][transMap[letter]]] =
                    oldColors[CUBE[oldCubieIndex][letter]];
            });
        });
        faceColors = newColors;
    }
</script>

<div>
    <Cube {faceColors} rotateColorFunction={rotateColors} />
    <div class="text-center">
        <h3>Instructions:</h3>
        <p>Press one of these keys to move a slice of the cube:
            l  m  r  u  e  d  f  s  b</p>
        <p>Press one of these keys to rotate the entire cube:
            x  y  z</p>
        <p>hold down SHIFT for reverse movements</p>
    </div>
</div>
