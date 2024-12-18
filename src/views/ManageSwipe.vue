<template>
  <div class="admin-container">
    <h2>Administrer Swipe Spørgsmål</h2>
    <div class="level-selector">
      <label for="level">Vælg niveau:</label>
      <select id="level" v-model="selectedLevel" @change="fetchQuestions">
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>
    <QuestionModal :isVisible="showModal" :question="editingQuestion" modalTitle="Tilføj Swipe Spørgsmål"
      :showFeedback="true" :addQuestion="addQuestion" :updateQuestion="updateQuestion" :closeModal="closeModal" />
    <div class="questions-container" v-if="questions.length > 0">
      <QuestionAccordion v-for="(question, index) in questions" :key="question.id" :question="question" :index="index"
        :isActive="activeIndex === index" :showFeedback="true" :toggleAccordion="toggleAccordion"
        :deleteQuestion="deleteQuestion" :openGifModal="openGifModal" :openEditModal="openEditQuestionModal" />
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
          { text: '', gifUrl: '', gifAlt: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', gifUrl: '', gifAlt: '', feedbackHeading: '', feedback: '', isCorrect: false }
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
    selectGif({ url, altTag }) {
      if (this.gifModalIndex !== null) {
        if (this.editingQuestion) {
          this.editingQuestion.answers[this.gifModalIndex].gifUrl = url;
          this.editingQuestion.answers[this.gifModalIndex].gifAlt = altTag; // Gem ALT-tagget
        } else {
          this.newQuestion.answers[this.gifModalIndex].gifUrl = url;
          this.newQuestion.answers[this.gifModalIndex].gifAlt = altTag; // Gem ALT-tagget
        }
      }
      this.gifModalVisible = false;
    },
    resetForm() {
      this.newQuestion = {
        questionText: '',
        answers: [
          { text: '', gifUrl: '', gifAlt: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', gifUrl: '', gifAlt: '', feedbackHeading: '', feedback: '', isCorrect: false }
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

h2 {
  margin-top: 40px;
  font-size: 22px;
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
  display: flex;
  padding: 10px;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
}

.level-selector label {
  font-size: 1rem;
  font-weight: bold;
  color: var(--main-color); /* Brug en fremhævet farve */
}

.level-selector select {
  width: 150px;
  padding: 10px;
  border: 2px solid var(--input-border-color);
  border-radius: 8px; 
  background-color: var(--text-color);
  color: var(--background-color);
  font-size: 1rem;
  text-align: center;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: border-color 0.3s, box-shadow 0.3s ease;
}

.level-selector select option {
  text-align: center; 
  padding-right: 10px;
}

.level-selector select:hover {
  border-color: var(--main-color);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Forstærk skyggen ved hover */
}

.level-selector select:focus {
  border-color: var(--highlight-color); /* Fremhæv når fokus er på dropdown */
  box-shadow: 0 0 8px var(--secondary-color);
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
