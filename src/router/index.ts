import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'vue-toastification'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AccountView from '../views/AccountView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import StaffMenuManagementView from '../views/StaffMenuManagementView.vue'
import StaffOrdersView from '../views/StaffOrdersView.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/menu', name: 'Menu', component: DashboardView }, // The dashboard is the menu page
  { path: '/account', name: 'Account', component: AccountView },
  { path: '/orders', name: 'MyOrders', component: MyOrdersView },
  { path: '/checkout', name: 'Checkout', component: CheckoutView },
  { 
    path: '/staff/menu-management', 
    name: 'StaffMenuManagement', 
    component: StaffMenuManagementView,
    meta: { requiresStaff: true }
  },
  { 
    path: '/staff/orders', 
    name: 'StaffOrders', 
    component: StaffOrdersView,
    meta: { requiresStaff: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Global Navigation Guard
 * This function runs before every route navigation.
 */
router.beforeEach(async (to, from, next) => {
  // It's crucial to instantiate the store inside the guard
  // to ensure it's attached to the active Pinia instance.
  const authStore = useAuthStore();

  // Define routes that are publicly accessible (no authentication required)
  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(to.path);

  // Define auth pages that logged-in users shouldn't access
  const authOnlyPages = ['/login', '/register'];
  const isAuthOnlyPage = authOnlyPages.includes(to.path);

  // If the user is authenticated and tries to access login/register pages
  if (isAuthOnlyPage && authStore.isAuthenticated) {
    // redirect them to the dashboard
    return next('/dashboard');
  }

  // If the user is NOT authenticated and tries to access a protected page
  if (!isPublicPage && !authStore.isAuthenticated) {
    // redirect them to the login page
    return next('/login');
  }

  // Check if route requires staff role
  if (to.meta.requiresStaff && authStore.user) {
    const userRole = authStore.user.role;
    if (userRole !== 'staff' && userRole !== 'admin') {
      // redirect non-staff users to dashboard
      const toast = useToast();
      toast.error('Access denied. Only staff members can access this page.');
      return next('/dashboard');
    }
  }

  next() // Proceed with the navigation.
})

export default router