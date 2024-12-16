<template>
    <div>
        <transition-group
            name="fade"
            tag="div"
            class="results-list"
            @before-enter="onItemEnter"
        >
            <div
                v-for="(question, index) in answeredQuestions"
                :key="index"
                class="result-item"
                :style="{ animationDelay: `${index * 0.2}s` }"
            >
                <div class="result-header">
                    <p class="question-label">Spørgsmål {{ index + 1 }}</p>
                    <span
                        class="result-status"
                        :class="{ correct: question.isCorrect, wrong: !question.isCorrect }"
                    >
                        {{ question.isCorrect ? '✔' : '✖' }}
                    </span>
                </div>
            </div>
        </transition-group>

        <transition name="fade">
            <div
                v-if="allItemsAnimated"
                class="final-score-container"
            >
                <p class="final-score">
                    Du fik {{ correctAnswers }}/{{ totalQuestions }} spørgsmål rigtige.
                </p>
                <p class="next-step-prompt">
                    Har du brug for at prøve igen eller er du klar til en lille quiz i det du har lært?
                </p>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ["answeredQuestions"],
    data() {
        return {
            itemsAnimated: 0,
        };
    },
    computed: {
        correctAnswers() {
            return this.answeredQuestions.filter((q) => q.isCorrect).length;
        },
        totalQuestions() {
            return this.answeredQuestions.length;
        },
        allItemsAnimated() {
            return this.itemsAnimated === this.answeredQuestions.length;
        },
    },
    methods: {
        onItemEnter() {
            this.itemsAnimated += 1;
        },
    },
};
</script>


<style scoped>
.results-list {
    width: 87%;
    max-width: 500px;
    left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0056a6;
    color: white;
    border-radius: 25px;
    margin-bottom: 10px;
    padding: 10px 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: auto;
    opacity: 0; /* Start helt usynlig */
    animation: fade-in 0.5s ease-out forwards; /* Fade-in animation */
}

/* Fade-in animation */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.result-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.question-label {
    font-size: 1rem;
}

.result-status {
    font-size: 1.5rem;
}

.correct {
    color: #28a745;
}

.wrong {
    color: #dc3545;
}

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


