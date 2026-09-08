<script setup>
    import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

    const props = defineProps({
        // Every tag the user can pick from.
        allTags: { type: Array, default: () => [] },
        // Ids already on the file, so they can be marked as picked.
        selectedIds: { type: Array, default: () => [] },
    })

    const emit = defineEmits(['select', 'create'])

    const open = ref(false)
    const query = ref('')
    const searchInput = ref(null)
    const root = ref(null)

    const filteredTags = computed(() => {
        const q = query.value.trim().toLowerCase()
        if (!q) return props.allTags
        return props.allTags.filter(tag => tag.name.toLowerCase().includes(q))
    })

    // The create entry is offered only while the typed name isn't an existing
    // tag — an exact match is picked from the list instead.
    const canCreate = computed(() => {
        const q = query.value.trim()
        if (!q) return false
        return !props.allTags.some(tag => tag.name.toLowerCase() === q.toLowerCase())
    })

    const isSelected = (tagId) => props.selectedIds.includes(tagId)

    const toggleOpen = async () => {
        open.value = !open.value
        if (open.value) {
            query.value = ''
            await nextTick()
            searchInput.value?.focus()
        }
    }

    const close = () => {
        open.value = false
    }

    const selectTag = (tag) => {
        emit('select', tag)
        close()
    }

    const createTag = () => {
        emit('create', query.value.trim())
        close()
    }

    const onDocumentClick = (event) => {
        if (open.value && root.value && !root.value.contains(event.target)) close()
    }

    onMounted(() => document.addEventListener('click', onDocumentClick))
    onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
    <div class="tag-picker" ref="root">
        <button
            type="button"
            class="tag-add"
            title="Add tag"
            aria-label="Add tag"
            @click="toggleOpen"
        >
            +
        </button>

        <div v-if="open" class="tag-popover" @keydown.esc="close">
            <input
                ref="searchInput"
                v-model="query"
                type="text"
                class="tag-search"
                placeholder="Search tags…"
            />

            <ul class="tag-options">
                <li v-if="canCreate">
                    <button type="button" class="tag-option create" @click="createTag">
                        <span class="option-name">{{ query.trim() }}</span>
                        <span class="create-hint">(Create new Tag)</span>
                    </button>
                </li>

                <li v-for="tag in filteredTags" :key="tag.id">
                    <button
                        type="button"
                        class="tag-option"
                        :class="{ picked: isSelected(tag.id) }"
                        @click="selectTag(tag)"
                    >
                        <span class="option-name">{{ tag.name }}</span>
                        <span v-if="isSelected(tag.id)" class="option-check">✓</span>
                    </button>
                </li>

                <li v-if="!canCreate && filteredTags.length === 0" class="tag-empty">
                    No tags yet — type a name to create one.
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.tag-picker {
    position: relative;
    display: inline-flex;
}

.tag-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1px dashed #c0c0c0;
    border-radius: 999px;
    background: transparent;
    color: #888;
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tag-add:hover {
    border-color: #667eea;
    border-style: solid;
    color: #667eea;
    background: #f2f3fd;
}

.tag-popover {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 200;
    width: 220px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    padding: 0.5rem;
}

.tag-search {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.8rem;
    outline: none;
}

/* Matches the purple the navbar and card headers already use. */
.tag-search:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.15rem rgba(102, 126, 234, 0.2);
}

.tag-options {
    list-style: none;
    margin: 0.4rem 0 0 0;
    padding: 0;
    max-height: 180px;
    overflow-y: auto;
}

.tag-option {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #333;
    font-size: 0.8rem;
    text-align: left;
    cursor: pointer;
}

.tag-option:hover {
    background: #f2f3fd;
    color: #667eea;
}

.option-name {
    flex: 1;
    word-break: break-word;
}

.option-check {
    color: #667eea;
    font-weight: 700;
}

.tag-option.picked .option-name {
    font-weight: 600;
}

/* The create row always sits first, so it reads as a distinct action. */
.tag-option.create {
    border-bottom: 1px solid #eee;
    border-radius: 6px 6px 0 0;
    margin-bottom: 0.2rem;
}

.create-hint {
    color: #999;
    font-size: 0.72rem;
    font-style: italic;
    white-space: nowrap;
}

.tag-empty {
    padding: 0.5rem;
    color: #999;
    font-size: 0.78rem;
}
</style>
