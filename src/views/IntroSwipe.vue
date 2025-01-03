<template>
  <div class="leaderboard-container">
    <h2>Leaderboard</h2>
    <table>
      <thead>
        <tr>
          <th>Plads</th>
          <th>Navn</th>
          <th>Niveau</th>
          <th>Point</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.userId">
          <td>{{ index + 1 }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.currentLevel }}</td>
          <td>{{ user.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "IntroSwipe",
  data() {
    return {
      users: [],
    };
  },
  async created() {
    try {
      // Hent alle brugere fra Firebase
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = [];

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();

        // Beregn point baseret på antal rigtige svar (50 point pr. rigtigt svar)
        const correctAnswers = userData.correctAnswers || 0;
        const points = correctAnswers * 50;

        usersData.push({
          userId: userData.userId,
          username: userData.username || "Ukendt",
          currentLevel: userData.currentLevel || 1,
          points,
        });
      }

      // Sortér brugerne efter niveau og derefter point
      this.users = usersData.sort((a, b) => {
        if (b.currentLevel === a.currentLevel) {
          return b.points - a.points;
        }
        return b.currentLevel - a.currentLevel;
      });
    } catch (error) {
      console.error("Fejl ved hentning af leaderboard-data:", error);
    }
  },
};
</script>

<style scoped>
.leaderboard-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  color: #ffffff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #ffffff;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

th, td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

th {
  background-color: #FF6600;
  color: #ffffff;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #0056b3;
}

tr:hover {
  background-color: #004494;
}

tr:first-child th {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

tr:last-child td {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
