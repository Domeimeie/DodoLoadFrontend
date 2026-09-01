<script setup>
    import { ref } from 'vue'

    const email = ref('')
    const password = ref('')
    const rememberMe = ref(true)
    const loading = ref(false)
    const error = ref('')

    const submit = async () => {
        error.value = ''
        loading.value = true
        try {
            // TODO: your auth request goes here.
            // On success, store the token and redirect to /MyFiles.
        } catch (e) {
            error.value = 'Login failed. Please check your credentials.'
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="login-wrapper">
        <div class="login-card">
            <img src="/logo.png" alt="DodoLOAD" class="login-logo">
            <h2 class="login-title">Welcome back</h2>
            <p class="login-subtitle">Sign in to reach your files</p>

            <form @submit.prevent="submit">
                <div v-if="error" class="alert alert-danger py-2" role="alert">
                    {{ error }}
                </div>

                <div class="form-floating mb-3">
                    <input
                        v-model="email"
                        type="email"
                        id="loginEmail"
                        class="form-control"
                        placeholder="name@example.com"
                        autocomplete="email"
                        required
                    />
                    <label for="loginEmail">Email address</label>
                </div>

                <div class="form-floating mb-3">
                    <input
                        v-model="password"
                        type="password"
                        id="loginPassword"
                        class="form-control"
                        placeholder="Password"
                        autocomplete="current-password"
                        required
                    />
                    <label for="loginPassword">Password</label>
                </div>

                <div class="form-row mb-4">
                    <div class="form-check">
                        <input
                            v-model="rememberMe"
                            class="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                        />
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                    </div>
                    <a href="#" class="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" class="btn-signin" :disabled="loading">
                    {{ loading ? 'Signing in…' : 'Sign in' }}
                </button>
            </form>

            <p class="register-line">
                Not a member? <a href="#">Register</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 3rem 1rem;
}

.login-card {
    width: 100%;
    max-width: 400px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    text-align: center;
}

.login-logo {
    height: 90px;
    width: auto;
    margin-bottom: 1rem;
}

.login-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    color: #333;
}

.login-subtitle {
    font-size: 0.9rem;
    color: #888;
    margin: 0.25rem 0 1.75rem 0;
}

form {
    text-align: left;
}

/* Matches the purple the navbar and card headers already use. */
.form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.2);
}

.form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.form-check-input:checked {
    background-color: #667eea;
    border-color: #667eea;
}

.form-check-label,
.forgot-link {
    font-size: 0.875rem;
}

.forgot-link {
    color: #667eea;
    text-decoration: none;
    white-space: nowrap;
}

.forgot-link:hover {
    text-decoration: underline;
}

.btn-signin {
    width: 100%;
    padding: 0.7rem;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.btn-signin:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
}

.btn-signin:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.register-line {
    margin: 1.5rem 0 0 0;
    font-size: 0.875rem;
    color: #666;
}

.register-line a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.register-line a:hover {
    text-decoration: underline;
}
</style>
