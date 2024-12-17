<template>
    <div class="admin-panel">
        <div class="header">
            <h1>Admin Panel</h1>
        </div>
        <div class="buttons">
            <router-link to="/administrer-brugere" class="link">
                <button class="admin-button">Brugere</button>
            </router-link>
            <router-link to="/administrer-swipe" class="link">
                <button class="admin-button">Administrer Swipe</button>
            </router-link>
            <router-link to="/administrer-quiz" class="link">
                <button class="admin-button">Administrer Quiz</button>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminPanel',
};
</script>

<style scoped>
/* Overordnet Admin Panel Styling */
.admin-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    min-height: 100vh; /* Fylder hele vinduet */
}

/* Header Styling */
.header h1 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    color: var(--text-color);
}

/* Buttons Container */
.buttons {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px; /* Begrænser bredden på større skærme */
}

/* Knappers Styling */
.admin-button {
    padding: 15px 30px;
    font-size: 1.2rem;
    color: var(--text-color);
    background: var(--main-color);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Hover Effekt */
.admin-button:hover {
    background: var(--hover-main-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Aktiv Link Effekt */
.link {
    text-decoration: none;
    width: 100%;
}

.router-link-active .admin-button {
    background: linear-gradient(135deg, #f35d0c, #d94e0d);
}

/* Responsivt Design */
@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }

    .admin-button {
        font-size: 1rem;
        padding: 12px 20px;
    }
}
</style>
