<template>
    <header class="nav-header">
        <div class="logo">
            <img src="@/assets/icons/smart-choice-small.svg" alt="">
        </div>
        <nav>
            <ul :class="{ 'nav-open': isNavOpen }">
                <li><router-link to="/">Startpage</router-link></li>
                <li><router-link to="/vælg-sværhedsgrad">Difficulty Select</router-link></li>
                <li><button @click="signOut">Sign Out</button></li>
            </ul>
            <button class="burger" @click="toggleNav">
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
        async signOut() {
            try {
                await signOut(auth);
                console.log('Signed out');
                this.$router.push('/log-ind'); // Redirect to login page after sign out
            } catch (error) {
                console.error('Error signing out:', error);
            }
        },
    },
};
</script>

<style scoped>
.nav-header {
    position: fixed;
    width: 80vw;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
    color: #fff;
}

.logo h1 {
    margin: 0;
}

nav {
    position: relative;
}

ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
}

ul li {
    margin-left: 1rem;
}

ul li a,
ul li button {
    color: #fff;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
}

.burger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
}

.burger span {
    width: 2rem;
    height: 0.25rem;
    background: #fff;
    border-radius: 10px;
}

@media (max-width: 768px) {
    ul {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #333;
        width: 100%;
    }

    ul.nav-open {
        display: flex;
    }

    .burger {
        display: flex;
    }
}
</style>