/** @type {import('tailwindcss').Config} */
export default {
   content: ['./src/**/*.{html,vue}', './components/**/*.{html,vue}'],
   theme: {
      extend: {},
      container: {
         // you can configure the container to be centered
         center: true,

         // or have default horizontal padding
         padding: '1rem',

         // default breakpoints but with 40px removed
         screens: {
            xl: '700px'
         }
      }
   },
   plugins: []
};
