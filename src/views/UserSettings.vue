<template>
    <div class="user-settings">
        <h1>Brugerindstillinger</h1>
        <div v-if="userData">
            <p><strong>Brugernavn:</strong> {{ userData.username }}</p>
            <p><strong>Nuværende Niveau:</strong> {{ userData.currentLevel }}</p>
        </div>
        <div v-else>
            <p>Indlæser dine indstillinger...</p>
        </div>
        <button @click="signOut">Log ud</button>

        <!-- Toggle Switch -->
        <div class="toggle-container">
            <span>Farveblind-venligt tema</span>
            <label class="switch">
                <input type="checkbox" v-model="isColorblindTheme" @change="toggleTheme" />
                <span class="slider"></span>
            </label>
        </div>
    </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default {
    name: "UserSettings",
    data() {
        return {
            userData: null, // Brugerdata fra Firestore
            isColorblindTheme: false, // Standard tema
        };
    },
    methods: {
        async fetchUserData() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(userDocRef);

                    if (docSnap.exists()) {
                        this.userData = docSnap.data();
                    } else {
                        console.error("Ingen brugerdata fundet i Firestore.");
                    }
                } catch (error) {
                    console.error("Fejl ved hentning af brugerdata:", error);
                }
            }
        },
        async signOut() {
            const auth = getAuth();
            try {
                await signOut(auth);
                this.$router.push("/log-ind");
            } catch (error) {
                console.error("Fejl ved log ud:", error);
            }
        },
        toggleTheme() {
            const theme = this.isColorblindTheme ? "colorblind" : "default";
            document.documentElement.setAttribute("data-theme", theme);
        },
    },
    mounted() {
        this.fetchUserData();
        document.documentElement.setAttribute("data-theme", "default");
    },
};
</script>

<style scoped>
.user-settings {
    padding: 1.5rem;
    background-color: var(--background-color);
    color: var(--text-color);
    border-radius: 8px;
    text-align: left;
}

/* Standard knap */
button {
    background-color: var(--main-color);
    color: var(--text-color);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
}

button:hover {
    background-color: var(--hover-main-color);
}

/* Toggle Switch Container */
.toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    font-size: 1rem;
}

/* The switch */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc; /* Standard baggrund */
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--main-color); /* Blå når den er aktiveret */
}

input:checked + .slider:before {
    transform: translateX(26px);
}
</style>
