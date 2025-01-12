<template>
    <div class="final-score-container" aria-live="polite">
        <p class="final-score">
            Du fik {{ correctAnswers }}/{{ totalQuestions }} spørgsmål rigtige.
        </p>
        <p class="next-step-prompt">
            Har du brug for at prøve igen eller er du klar til en lille quiz i det du har lært?
        </p>
    </div>
</template>

<script>
export default {
    props: {
        correctAnswers: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
    },
};
</script>

<style scoped>
.final-score-container {
    text-align: center;
    margin-top: 20px;
}

.final-score {
    font-size: 1.2rem;
}

.next-step-prompt {
    font-size: 1rem;
    margin: 10px 0 20px 0;
}
</style>
