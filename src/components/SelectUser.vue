<script>
import { mapActions, mapState } from 'vuex';

export default {
   data() {
      return {
         users: ['amyrobson', 'juliusomo', 'maxblagun', 'ramsesmiron'],
         showOption: false
      };
   },
   computed: {
      ...mapState(['currentUser'])
   },
   methods: {
      ...mapActions(['setCurrentUser', 'setUser']),

      setUserMethod(value) {
         const payload = {
            image: {
               png: `/images/avatars/image-${value}.png`,
               webp: `/images/avatars/image-${value}.webp`
            },
            username: value
         };

         this.setUser(payload);
      },
      toggleOption() {
         this.showOption = !this.showOption;
      }
   }
};
</script>

<template>
   <div class="flex flex-col items-center fixed bottom-0 left-0 w-full p-3">
      <div class="flex items-center gap-3 mb-5">
         <div v-for="value in users" :key="value" v-show="showOption">
            <div
               class="avatar border-2 border-indigo-400 rounded-full cursor-pointer hover:-translate-y-1 hover:border-purple-800 hover:opacity-75 transition-all animate-bounce"
               :class="`${
                  currentUser.username === value
                     ? 'border-purple-800 opacity-75'
                     : ''
               }`"
               @click="setUserMethod(value)"
            >
               <img
                  :src="`/images/avatars/image-${value}.webp`"
                  :alt="value"
                  class="w-10"
               />
            </div>
         </div>
      </div>

      <div
         class="bg-indigo-500 w-4 h-4 rounded-full cursor-pointer"
         :class="{ 'animate-bounce': !showOption }"
         @click="toggleOption"
      ></div>
   </div>
</template>

<style>
.slide-fade-enter-active {
   transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
   transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
   transform: translateX(200px);
   opacity: 0;
}
</style>
