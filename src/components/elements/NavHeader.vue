<template>
    <header class="nav-header">
        <div class="logo">
            <router-link to="/">
                <img src="@/assets/icons/smart-choice-small.svg" alt="Smart Choice Logo">
            </router-link>
        </div>
        <nav>
            <ul :class="{ 'nav-open': isNavOpen }" class="nav-links" @click="closeNav">
                <li><router-link to="/">Forside</router-link></li>
                <li><router-link to="/vælg-sværhedsgrad">Vælg niveau</router-link></li>
                <li><router-link to="/admin">Admin</router-link></li>
                <li><button class="signOutButton" @click="signOut">Log ud</button></li>
            </ul>
            <button 
                class="burger" 
                @click="toggleNav" 
                :aria-expanded="isNavOpen.toString()" 
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>
</template>


<script>
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default {
    data() {
        return {
            isNavOpen: false,
        };
    },
    methods: {
        toggleNav() {
            this.isNavOpen = !this.isNavOpen;
        },
        closeNav() {
            this.isNavOpen = false;
        },
        async signOut() {
            try {
                await signOut(auth);
                console.log('Signed out');
                this.$router.push('/log-ind'); // Redirect to login page after sign out
                window.location.reload(); // Ensure the page reloads to update the UI
            } catch (error) {
                console.error('Error signing out:', error);
            }
        },
        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.closeNav();
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }
};
</script>

<style scoped>
/* Header styling */
.nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #222;
    color: #fff;
    width: 95%; /* Fylder hele skærmens bredde */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: fixed; /* Fastgjort øverst */
    top: 0;
    left: 0;
    z-index: 1000;
}

/* Logo styling */
.logo img {
    height: 20px;
    width: auto;
    margin: 0;
    padding: 0;
    display: block;
}

/* Burger menu styling */
.burger {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 30px;
    position: relative;
    z-index: 2000; /* Ovenpå andre elementer */
}

.burger span {
    display: block;
    width: 100%;
    height: 3px;
    background-color: #fff;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
}

/* Animation når burgermenu er åben */
.burger[aria-expanded="true"] span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.burger[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
}

.burger[aria-expanded="true"] span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile navigation menu */
.nav-links {
    position: absolute;
    top: 100%; /* Placeret lige under headeren */
    right: 0;
    left: 0; /* Sørger for, at menuen strækker sig fra kant til kant */
    background-color: #222;
    flex-direction: column;
    width: 100%; /* Fylder hele skærmens bredde */
    max-width: 400px; /* Begrænset bredde på små skærme */
    margin: 0 auto; /* Center menuen */
    height: 0;
    list-style: none;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

/* Når menuen er åben */
.nav-links.nav-open {
    height: auto;
    opacity: 1;
    transform: translateY(0);
    padding: 1rem;
}

/* Navigation links styling */
.nav-links li {
    margin: 0.5rem 0;
    text-align: center;
}

.nav-links a, .nav-links button {
    text-decoration: none;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    transition: background-color 0.2s ease-in-out;
}

.nav-links a:hover, .nav-links button:hover {
    background-color: #444;
    color: #fff;
}

.signOutButton {
    background-color: var(--secondary-color);
}

/* Responsiv styling */
@media (min-width: 768px) {
    .nav-links {
        position: static;
        flex-direction: row;
        justify-content: flex-end;
        height: auto;
        opacity: 1;
        transform: none;
        width: 100%; /* Fylder hele bredden */
        max-width: none;
        background-color: transparent;
        overflow: visible;
        box-shadow: none;
    }

    .nav-links li {
        margin: 0;
    }

    .burger {
        display: none;
    }
}

</style>