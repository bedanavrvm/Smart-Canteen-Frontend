<template>
  <div class="page-container">
    <div class="dashboard-layout">
      <!-- Filter Sidebar -->
      <div :class="['filter-sidebar', { open: showFilters }]">
      <div class="filter-sidebar-content">
        <div class="filter-sidebar-header">
          <h3>Filter Menu</h3>
          <button @click="showFilters = false" class="close-sidebar-btn">
            ✕
          </button>
        </div>
        
        <div v-if="activeFiltersCount > 0" class="active-filters-info">
          <span>{{ activeFiltersCount }} active filter(s)</span>
          <button @click="clearFilters" class="clear-filters-btn">Clear All</button>
        </div>

        <!-- Meal Type Filters -->
        <div v-if="mealTypeTags.length" class="filter-group">
          <h4 class="filter-group-title">Meal Type</h4>
          <div class="filter-chips">
            <button
              v-for="tag in mealTypeTags"
              :key="tag.id"
              @click="toggleFilter(tag.id)"
              :class="['filter-chip', { active: selectedFilters.includes(tag.id) }]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Time of Day Filters -->
        <div v-if="timeOfDayTags.length" class="filter-group">
          <h4 class="filter-group-title">Time of Day</h4>
          <div class="filter-chips">
            <button
              v-for="tag in timeOfDayTags"
              :key="tag.id"
              @click="toggleFilter(tag.id)"
              :class="['filter-chip', { active: selectedFilters.includes(tag.id) }]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Temperature Filters -->
        <div v-if="temperatureTags.length" class="filter-group">
          <h4 class="filter-group-title">Temperature</h4>
          <div class="filter-chips">
            <button
              v-for="tag in temperatureTags"
              :key="tag.id"
              @click="toggleFilter(tag.id)"
              :class="['filter-chip', { active: selectedFilters.includes(tag.id) }]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Dietary Filters -->
        <div v-if="dietaryTags.length" class="filter-group">
          <h4 class="filter-group-title">Dietary</h4>
          <div class="filter-chips">
            <button
              v-for="tag in dietaryTags"
              :key="tag.id"
              @click="toggleFilter(tag.id)"
              :class="['filter-chip', { active: selectedFilters.includes(tag.id) }]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Cuisine Filters -->
        <div v-if="cuisineTags.length" class="filter-group">
          <h4 class="filter-group-title">Cuisine</h4>
          <div class="filter-chips">
            <button
              v-for="tag in cuisineTags"
              :key="tag.id"
              @click="toggleFilter(tag.id)"
              :class="['filter-chip', { active: selectedFilters.includes(tag.id) }]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

      <!-- Main Content Area -->
      <div class="main-content-area">
        <!-- Main dashboard section -->
        <section class="feature-section">
      <h2>Available Menu Items</h2>
      
      <div class="menu-controls">
        <button @click="showFilters = !showFilters" class="filter-toggle-btn">
          <span>🔍</span>
          Filters
          <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
        </button>
        
        <!-- Results Count -->
        <div v-if="activeFiltersCount > 0" class="results-info">
          Showing {{ filteredMenuItems.length }} of {{ menuItems.length }} items
        </div>
      </div>

      <!-- Menu grid -->
      <div v-if="loading" class="loading-text">Loading menu...</div>
      <div v-else-if="filteredMenuItems.length === 0" class="no-results">
        <p>No menu items found matching your filters.</p>
        <button @click="clearFilters" class="secondary-button">Clear Filters</button>
      </div>
      <div v-else class="menu-grid">
        <MenuCard
          v-for="x in filteredMenuItems"
          :key="x.id"
          :foodItem="x"
          class="menu-card"
          @add-to-cart="cartStore.addToCart"
        />
      </div>
    </section>

    <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Footer from '@/components/Footer.vue';
import MenuCard from '@/components/MenuCard.vue';
import { getAllMenuItems } from '@/api/menu';
import { getAllTags } from '@/api/tag';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();
const { items, showCartSidebar, subtotal } = storeToRefs(cartStore);

// State Variables
const menuItems = ref([]);
const allTags = ref([]);
const loading = ref(true);
const showFilters = ref(false);
const selectedFilters = ref([]);

// Computed: Filter tags by type
const mealTypeTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'meal_type')
);

const timeOfDayTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'time_of_day')
);

const temperatureTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'temperature')
);

const dietaryTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'dietary')
);

const cuisineTags = computed(() => 
  allTags.value.filter(tag => tag.tag_type === 'cuisine')
);

// Computed: Active filters count
const activeFiltersCount = computed(() => selectedFilters.value.length);

// Computed: Filtered menu items
const filteredMenuItems = computed(() => {
  if (selectedFilters.value.length === 0) {
    return menuItems.value;
  }

  return menuItems.value.filter(item => {
    // Check if item has any of the selected tags
    const itemTagIds = item.tags.map(tag => tag.id);
    return selectedFilters.value.some(filterId => itemTagIds.includes(filterId));
  });
});

// Toggle filter selection
function toggleFilter(tagId) {
  const index = selectedFilters.value.indexOf(tagId);
  if (index > -1) {
    selectedFilters.value.splice(index, 1);
  } else {
    selectedFilters.value.push(tagId);
  }
}

// Clear all filters
function clearFilters() {
  selectedFilters.value = [];
}

// Fetch menu items and tags after mount
onMounted(async () => {
  try {
    const [menuData, tagsData] = await Promise.all([
      getAllMenuItems(),
      getAllTags()
    ]);
    menuItems.value = menuData;
    allTags.value = tagsData;
  } catch (error) {
    console.error('Error loading menu:', error)
  } finally {
    loading.value = false
  }
})

</script>
