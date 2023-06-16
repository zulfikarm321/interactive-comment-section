<script>
import { mapState, mapActions } from 'vuex';
import Comment from './components/Comment.vue';

export default {
   components: {
      Comment
   },
   computed: {
      ...mapState(['comments', 'currentUser'])
   },
   methods: {
      ...mapActions(['addComment', 'changeUser']),

      selectUser(event) {
         this.changeUser(event.target.value);
      },

      addNewComment() {
         // Ambil nilai teks komentar dari textarea
         const commentText = this.$refs.commentInput.value;

         // Buat objek comment baru
         const newComment = {
            id: this.comments.length + 1,
            content: commentText,
            createdAt: 'just now',
            score: 0,
            user: this.currentUser,
            replies: []
         };

         // Panggil action `addComment` dengan parameter komentar baru
         this.addComment(newComment);

         // Reset nilai textarea setelah menambahkan komentar
         this.$refs.commentInput.value = '';
         console.log(this.comments);
      }
   }
};
</script>

<template>
   <div class="container mx-auto flex flex-col min-h-screen justify-center">
      <div class="mb-5">
         <select
            class="py-2 px-4 rounded-lg font-bold cursor-pointer"
            @change="selectUser"
         >
            <option value="juliusomo">juliusomo</option>
            <option value="amyrobson">amyrobson</option>
            <option value="maxblagun">maxblagun</option>
            <option value="ramsesmiron">ramsesmiron</option>
         </select>
      </div>
      <div
         class="comment-section flex items-end flex-col"
         v-for="comment in comments"
      >
         <div class="comment w-full">
            <Comment :data="comment" />
         </div>
         <div class="reply w-[95%] sm:w-[90%] flex items-end flex-col relative">
            <div class="line h-full absolute -left-4 sm:-left-8 pb-5">
               <div class="w-[2px] bg-gray-200 h-full"></div>
            </div>
            <Comment
               v-for="child in comment.replies"
               :data="child"
               :parrentId="comment.id"
            />
         </div>
      </div>
      <form class="form" @submit.prevent="addNewComment">
         <img
            :src="currentUser.image.webp"
            alt="avatar image"
            class="hidden sm:block w-10"
         />
         <textarea
            placeholder="Add a comment..."
            class="py-2 px-4 resize-none w-full h-20 border rounded-md text-gray-500 outline-indigo-500"
            ref="commentInput"
            required
         ></textarea>
         <button
            class="btn hidden sm:block bg-indigo-500 text-white py-2 px-6 rounded-lg"
         >
            SEND
         </button>

         <div
            class="bottom mobile-screen flex justify-between items-center mt-3"
         >
            <img
               :src="currentUser.image.webp"
               alt="avatar image"
               class="sm:hidden w-10"
            /><button
               class="btn sm:hidden bg-indigo-500 text-white py-2 px-6 rounded-lg"
            >
               SEND
            </button>
         </div>
      </form>
   </div>
</template>
