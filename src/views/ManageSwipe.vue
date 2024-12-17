<template>
  <div class="admin-container">
    <h2>Administrer Swipe Spørgsmål</h2>
    <div class="level-selector">
      <label for="level">Vælg niveau:</label>
      <select id="level" v-model="selectedLevel" @change="fetchQuestions">
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>
    <button @click="openAddQuestionModal" class="add-button">Tilføj Swipe Spørgsmål</button>
    <QuestionModal
      :isVisible="showModal"
      :question="editingQuestion"
      modalTitle="Tilføj Swipe Spørgsmål"
      :showFeedback="true"
      :addQuestion="addQuestion"
      :closeModal="closeModal"
    />
    <div class="questions-container" v-if="questions.length > 0">
      <QuestionAccordion
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        :isActive="activeIndex === index"
        :showFeedback="true"
        :toggleAccordion="toggleAccordion"
        :updateQuestion="updateQuestion"
        :deleteQuestion="deleteQuestion"
        :openGifModal="openGifModal"
      />
    </div>
    <div v-else>
      <p>Ingen spørgsmål fundet for dette niveau.</p>
    </div>
    <GifModal :isVisible="gifModalVisible" @close="closeGifModal" @select="selectGif" />
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import QuestionAccordion from '@/components/admin/QuestionAccordion.vue';
import QuestionModal from '@/components/admin/QuestionModal.vue';
import GifModal from '@/components/elements/GifModal.vue';

export default {
  name: 'ManageSwipe',
  components: { QuestionAccordion, QuestionModal, GifModal },
  data() {
    return {
      selectedLevel: 1,
      levels: [1, 2, 3, 4, 5], // Define the levels
      showModal: false,
      gifModalVisible: false,
      gifModalIndex: null, // Track which answer's GIF URL is being set
      questions: [],
      activeIndex: null,
      newQuestion: {
        questionText: '',
        answers: [
          { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false }
        ]
      },
      editingQuestion: null // Track the question being edited
    };
  },
  methods: {
    async fetchQuestions() {
      try {
        const q = query(collection(db, "SwipeQuestions"), where("SwipeLevel", "==", this.selectedLevel.toString()));
        const querySnapshot = await getDocs(q);
        this.questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async addQuestion(newQuestion) {
      try {
        const questionId = `q${Date.now()}`;
        await setDoc(doc(db, "SwipeQuestions", questionId), {
          questionId,
          SwipeLevel: this.selectedLevel.toString(),
          ...newQuestion
        });
        this.fetchQuestions();
        this.resetForm();
        this.showModal = false;
      } catch (error) {
        console.error("Error adding question:", error);
      }
    },
    async updateQuestion(updatedQuestion) {
      try {
        const question = this.questions.find(q => q.id === updatedQuestion.id);
        if (question) {
          Object.assign(question, updatedQuestion);
          await updateDoc(doc(db, "SwipeQuestions", updatedQuestion.id), question);
          this.fetchQuestions();
        } else {
          console.error("Question not found:", updatedQuestion.id);
        }
      } catch (error) {
        console.error("Error updating question:", error);
      }
    },
    async deleteQuestion(questionId) {
      try {
        await deleteDoc(doc(db, "SwipeQuestions", questionId));
        this.fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    },
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    openAddQuestionModal() {
      this.editingQuestion = null;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingQuestion = null;
    },
    openGifModal(index, question) {
      this.gifModalIndex = index;
      this.editingQuestion = question;
      this.gifModalVisible = true;
    },
    closeGifModal() {
      this.gifModalVisible = false;
    },
    selectGif(url) {
      if (this.gifModalIndex !== null) {
        if (this.editingQuestion) {
          this.editingQuestion.answers[this.gifModalIndex].gifUrl = url;
        } else {
          this.newQuestion.answers[this.gifModalIndex].gifUrl = url;
        }
      }
      this.gifModalVisible = false;
    },
    resetForm() {
      this.newQuestion = {
        questionText: '',
        answers: [
          { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false }
        ]
      };
    }
  },
  async created() {
    this.fetchQuestions();
  }
};
</script>

<style scoped>
/* General Styles */
:root {
  --main-color: #2D8BD9;
  --secondary-color: #1A6CAB;
  --accent-color: #FFFFFF;
  --highlight-color: #F35D0C;
  --text-color: #323232;
  --background-color: #000000;
  --input-border-color: #CCCCCC;
  --input-focus-color: #2D8BD9;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 90%;
}

.level-selector {
  margin-bottom: 20px;
}

.questions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 33.8rem;
  overflow-x: hidden;
}
</style>
