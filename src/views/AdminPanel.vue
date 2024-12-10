<template>
    <div class="admin-panel">
        <h1>Admin Panel</h1>
        <div class="buttons">
            <router-link to="/user-management">
                <button>Brugere</button>
            </router-link>
            <router-link to="/swipe-management">
                <button>Administrer Swipe</button>
            </router-link>
            <router-link to="/order-management">
                <button>Administrer Quiz</button>
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
.admin-panel {
    text-align: center;
    margin-top: 50px;
}

.buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>