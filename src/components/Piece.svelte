<script>
    import { ROT_AXIS } from '../shared/constants';

    let { name, cubieColors } = $props();

    // the animation edits this element's transform directly, so the style
    // must only depend on name (which never changes) to avoid being reset
    const transphrase = $derived(name.split("").map((face) =>
        "translate" + ROT_AXIS[face][0] + "(" + ROT_AXIS[face][1] + "3em) "));
</script>

<div class="piece" id={name} style="transform: rotateX(0deg) {transphrase.join(' ')}">
    {#each name.split("") as face, index}
        <div class="element {face}">
            <div class="sticker {cubieColors[index]}"></div>
        </div>
    {/each}
</div>
