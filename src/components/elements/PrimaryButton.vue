<template>
    <div class="shadow-parent">
        <button tabindex="-1" class="primary-button" :class="{ 'secondary-bg': secondary }">
            <slot></slot>
        </button>
    </div>
</template>

<script>
export default {
    name: 'PrimaryButton',
    props: {
        secondary: {
            type: Boolean,
            default: false, // Bestemmer, om knappen skal have secondary baggrundsfarve
        },
    },
};
</script>

<style scoped>
.shadow-parent {
    position: relative;
    display: inline-block;
    width: 100%;
    /* Sørger for samme bredde */
    max-width: 300px;
    /* Valgfri maksimal bredde */
    filter: drop-shadow(0 6px 6px rgba(0, 0, 0, 0.3));
}

.primary-button {
    width: 100%;
    /* Gør knapperne lige brede */
    background-color: var(--main-color);
    color: var(--text-color);
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 16px 0;
    /* Juster padding for samme højde */
    clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: Poppins;
}

.primary-button.secondary-bg {
    background-color: var(--secondary-color);
}

.primary-button:hover {
    background-color: var(--hover-main-color);
}
</style>