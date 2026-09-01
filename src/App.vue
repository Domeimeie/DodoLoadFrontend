<script setup>
  import { ref } from 'vue'
  import Files from './Files.vue'

  const menuOpen = ref(false)

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }
</script>

<template>
  <div class="app">
    <header class="navbar">
      <button class="hamburger" @click="toggleMenu">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </button>
      <div class="navbar-center">
        <div class="navbar-content">
          <img src="/logo.png" alt="DodoLOAD" class="logo">
          <div class="navbar-text">
            <h1 class="title">DodoLOAD</h1>
            <p class="tagline">Fast • Slender • File Management</p>
          </div>
        </div>
      </div>
      <div class="navbar-spacer"></div>
    </header>

    <div class="layout">
      <aside class="sidebar" :class="{ open: menuOpen }">
        <nav class="menu">
          <a href="#" class="menu-item">My Files</a>
        </nav>
      </aside>

      <main class="main-content">
        <Files />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  position: relative;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  gap: 0.4rem;
  flex: 0 0 72px;
  height: 44px;
  padding: 0;
}

/* Mirrors the hamburger's width so navbar-center is centred on the page,
   not on the space left over after the button. */
.navbar-spacer {
  flex: 0 0 72px;
}

.hamburger .line {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1rem;
}

.logo {
  height: 80px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.navbar-text {
  color: white;
}

.title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.tagline {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 300;
}

.layout {
  display: flex;
  position: relative;
  min-height: 60vh;
}

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 1rem 0;
  overflow-y: auto;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  z-index: 100;
}

.sidebar.open {
  transform: translateX(0);
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: block;
  padding: 1rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #f0f0f0;
  border-left-color: #667eea;
  color: #667eea;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .navbar-content {
    gap: 1rem;
  }

  .logo {
    height: 60px;
  }

  .title {
    font-size: 1.5rem;
  }

  .tagline {
    font-size: 0.8rem;
  }
}
</style>
