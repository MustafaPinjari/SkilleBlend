<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Vue Todo App</h1>
      
      <!-- Add Todo Form -->
      <form @submit.prevent="addTodo" class="mb-6">
        <div class="flex gap-2">
          <input
            v-model="newTodo"
            type="text"
            placeholder="Add a new todo..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>
      </form>

      <!-- Filter Buttons -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="filterOption in filters"
          :key="filterOption"
          @click="currentFilter = filterOption"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            currentFilter === filterOption
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ filterOption }}
        </button>
      </div>

      <!-- Todo List -->
      <div class="space-y-2">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <button
            @click="toggleTodo(todo.id)"
            :class="[
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            ]"
          >
            <Check v-if="todo.completed" class="w-3 h-3" />
          </button>
          
          <span
            :class="[
              'flex-1 transition-all',
              todo.completed
                ? 'text-gray-500 line-through'
                : 'text-gray-800'
            ]"
          >
            {{ todo.text }}
          </span>
          
          <button
            @click="deleteTodo(todo.id)"
            class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTodos.length === 0" class="text-center py-8 text-gray-500">
        <CheckCircle class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>{{ emptyStateMessage }}</p>
      </div>

      <!-- Stats -->
      <div class="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
        {{ completedCount }} of {{ todos.length }} tasks completed
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Check, Trash2, CheckCircle } from 'lucide-vue-next'

// Reactive data
const newTodo = ref('')
const currentFilter = ref('All')
const todos = ref([
  { id: 1, text: 'Learn Vue.js', completed: false },
  { id: 2, text: 'Build a todo app', completed: true },
  { id: 3, text: 'Deploy to production', completed: false }
])

// Filter options
const filters = ['All', 'Active', 'Completed']

// Computed properties
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'Active':
      return todos.value.filter(todo => !todo.completed)
    case 'Completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const completedCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

const emptyStateMessage = computed(() => {
  switch (currentFilter.value) {
    case 'Active':
      return 'No active tasks! Great job! 🎉'
    case 'Completed':
      return 'No completed tasks yet'
    default:
      return 'No todos yet. Add one above!'
  }
})

// Methods
const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false
    })
    newTodo.value = ''
  }
}

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const deleteTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}
</script>

<style scoped>
/* Additional custom styles can go here if needed */
</style>
