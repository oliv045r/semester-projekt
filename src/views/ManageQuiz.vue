<template>
  <div class="admin-container">
    <h2>Administrer Quiz Spørgsmål</h2>
    <div class="level-selector">
      <label for="level">Vælg niveau:</label>
      <select id="level" v-model="selectedLevel" @change="fetchQuestions">
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>
    <QuestionModal
    :isVisible="showModal"
    :question="editingQuestion"
    modalTitle="Tilføj Quiz Spørgsmål"
    :showFeedback="false"
    :addQuestion="addQuestion"
    :updateQuestion="updateQuestion"
    :closeModal="closeModal"
    />
    <div class="questions-container" v-if="questions.length > 0">
      <QuestionAccordion
      v-for="(question, index) in questions"
      :key="question.id"
      :question="question"
      :index="index"
      :isActive="activeIndex === index"
      :showFeedback="false"
      :toggleAccordion="toggleAccordion"
      :deleteQuestion="deleteQuestion"
      :openGifModal="openGifModal"
      :openEditModal="openEditQuestionModal"
      />
    </div>
    <div v-else>
      <p>Ingen spørgsmål fundet for dette niveau.</p>
    </div>
    <button @click="openAddQuestionModal" class="add-button">
      <i class="fas fa-plus"></i>
    </button>    
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
  name: 'ManageQuiz',
  components: { QuestionAccordion, QuestionModal, GifModal },
  data() {
    return {
      selectedLevel: 1,
      levels: [1, 2, 3, 4, 5], // Define the levels
      showModal: false,
      gifModalVisible: false,
      questions: [],
      activeIndex: null,
      newQuestion: {
        questionText: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      editingQuestion: null // Track the question being edited
    };
  },
  methods: {
    async fetchQuestions() {
      try {
        const q = query(collection(db, "QuizQuestions"), where("QuizLevel", "==", this.selectedLevel.toString()));
        const querySnapshot = await getDocs(q);
        this.questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async addQuestion(newQuestion) {
      try {
        const questionId = `q${Date.now()}`;
        await setDoc(doc(db, "QuizQuestions", questionId), {
          questionId,
          QuizLevel: this.selectedLevel.toString(),
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
          await updateDoc(doc(db, "QuizQuestions", updatedQuestion.id), question);
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
        await deleteDoc(doc(db, "QuizQuestions", questionId));
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
    openEditQuestionModal(question) {
      this.editingQuestion = question;
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
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
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

.level-selector {
  margin-bottom: 20px;
}

select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--input-border-color);
  font-size: 16px;
  margin-left: 10px;
}

select:focus {
  border-color: var(--input-focus-color);
  outline: none;
}

.add-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fa-plus {
  margin-top: 3px;
  font-size: 25px;
  color: black;
}
</style>
