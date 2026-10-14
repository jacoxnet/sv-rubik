<script>
    import { flushSync } from 'svelte';
    import Piece from './Piece.svelte';
    import { CUBE, MOVEMENTS, CCMOVEMENTS, CUBE_SLICE,
             ROTATIONS, ROTATION_EQUIV, ROT_AXIS } from '../shared/constants';

    let { faceColors, rotateColorFunction } = $props();

    // number of slice animations currently running; new moves are ignored
    // until this drops back to zero (a cube rotation runs three at once)
    let activeAnimations = 0;

    // Animates rotation of the face - clockwise if direction is 1
    // and counterclockwise if direction is -1
    function quarterMove(face, direction) {
        // rotAxis[face][1] is a plus or minus - reverse direction to account for that
        const dir = (ROT_AXIS[face][1] === '-')? -direction : direction;
        // create list of DOM elements in this slice
        const toMoveList = CUBE_SLICE[face].map(cubieName => document.querySelector('#' + cubieName));
        // timing variable
        const timeCalled = Date.now();
        activeAnimations++;
        // recursively called function to rotate cubies slowly
        function rotateCubies() {
            // clamp so the slice never goes past 90 degrees
            const angle = Math.min((Date.now() - timeCalled) / 4, 90);
            if (angle < 90) {
                const newStyle = 'rotate' + ROT_AXIS[face][0] + '(' + dir * angle + 'deg)';
                toMoveList.forEach(cubie =>
                    cubie.style.transform = cubie.style.transform.replace(/rotate.\(\S+\)/, newStyle));
                requestAnimationFrame(rotateCubies);
            } else {
                // a slice at 90 degrees looks the same as the slice at 0 degrees
                // with its colors moved, so swap to that state in this frame.
                // flush the color change to the DOM synchronously so it is painted
                // in the same frame as the transform reset (otherwise the old
                // colors can flash for a frame)
                rotateColorFunction(face, direction);
                flushSync();
                toMoveList.forEach(cubie =>
                    cubie.style.transform = cubie.style.transform.replace(/rotate.\(\S+\)/, 'rotateX(0deg)'));
                activeAnimations--;
            }
        }
        // initiate animation
        requestAnimationFrame(rotateCubies);
    }

    function singleMove(move) {
        if (MOVEMENTS.includes(move)) {
            quarterMove(move.toUpperCase(), 1);
        } else if (CCMOVEMENTS.includes(move)) {
            quarterMove(move, -1);
        } else if (ROTATIONS.includes(move)) {
            ([...ROTATION_EQUIV[move]]).forEach((submove) =>
                singleMove(submove));
        }
    }

    function handleKeys(event) {
        // ignore keys while a move is still animating
        if (activeAnimations === 0) {
            singleMove(event.key);
        }
        event.preventDefault();
    }
</script>

<svelte:window onkeydown={handleKeys} />

<div class="container" id="cubefield">
    <div class="row align-items-center h-100">
        <div class="col-12">
            <div class="scene" id="scene">
                <div class="pivot centered" id="pivot"
                        style="transform: rotateX(-35deg) rotateY(-45deg)">
                    <div class="cube" id="cube">
                        {#each CUBE as piece (piece.id)}
                            <Piece name={piece.name}
                                   cubieColors={[...piece.name].map((letter) => faceColors[piece[letter]])} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
