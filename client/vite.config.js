// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react-swc'

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ["jwt-decode"],
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
//   optimizeDeps: {
//     include: ["jwt-decode"],
//   },
//   server: {
//     proxy: {
//       '/api': {
//         // target: 'http://137.184.81.218:5173', // Backend URL
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
