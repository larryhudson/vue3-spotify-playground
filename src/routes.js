import Home from './pages/Home.vue'
import Artist from './pages/Artist.vue'
import NotFound from './pages/NotFound.vue'

export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  { 
      path: '/artist/:id',
      component: Artist,
      meta: { title: 'Artist'},
      props: true,
     },
//   {
//     path: '/about',
//     meta: { title: 'About' },
//     component: About,
//     // example of route level code-splitting
//     // this generates a separate chunk (About.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     // component: () => import('./views/About.vue')
//   },
  { path: '/:path(.*)', component: NotFound },
]