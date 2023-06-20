<script>
import { mapState, mapActions } from 'vuex';
import { generateRandomId } from '../utills/method';

export default {
   props: {
      type: {
         type: String,
         required: true
      },
      commentId: {
         type: String
      },
      replyingTo: {
         type: String
      }
   },
   computed: {
      ...mapState(['comments', 'currentUser'])
   },
   methods: {
      ...mapActions([
         'setUser',
         'setComments',
         'addComment',
         'addReply',
         'updateComment',
         'updateReply',
         'deleteComment',
         'deleteReply'
      ]),

      inputHandle(event) {
         if (this.type === 'REPLY') {
            const cursorPosition = this.$refs.commentInput.selectionStart;
            const nameLength = this.replyingTo.length;
            if (cursorPosition === nameLength + 2 && event.key == 'Backspace') {
               event.preventDefault();
            } else if (cursorPosition < nameLength + 1) {
               event.preventDefault();
            }
         }
      },

      addCommentMethod() {
         const id = generateRandomId();

         if (!this.$refs.commentInput.value) {
            return;
         }

         if (this.type === 'COMMENT') {
            this.addComment({
               id: id,
               content: this.$refs.commentInput.value,
               createdAt: new Date(),
               score: [],
               user: JSON.parse(JSON.stringify(this.currentUser)),
               replies: []
            });
         }

         if (this.type === 'REPLY') {
            const commentText = this.$refs.commentInput.value;
            const firstSpaceIndex = commentText.indexOf(' ');
            const trimmedCommentText = commentText
               .substring(firstSpaceIndex + 1)
               .trim();
            if (!trimmedCommentText) {
               return;
            }

            let payload = {
               comment: {
                  id: id,
                  content: trimmedCommentText,
                  createdAt: new Date(),
                  score: [],
                  replyingTo: this.replyingTo,
                  user: JSON.parse(JSON.stringify(this.currentUser))
               },
               commentId: this.commentId
            };

            this.addReply(payload);
            this.$emit('toggle');
         }

         this.$refs.commentInput.value = '';
      }
   },

   mounted() {
      this.$nextTick(() => {
         this.$refs.commentInput.focus();
      });
   }
};
</script>

<template>
   <form
      class="sm:flex p-5 bg-white items-start gap-5 rounded-xl mb-5"
      @submit.prevent="addCommentMethod"
   >
      <img
         :src="currentUser.image.webp"
         alt="avatar"
         class="hidden sm:block w-10"
      />

      <textarea
         placeholder="Add a comment..."
         class="w-full py-2 px-5 border rounded-lg h-24 text-gray-600 outline-indigo-500"
         ref="commentInput"
         :value="`${this.type === 'REPLY' ? '@' + this.replyingTo + ' ' : ''}`"
         @keydown="inputHandle"
      ></textarea>
      <button
         class="bg-indigo-600 text-white py-2 px-6 rounded-lg hidden sm:block"
      >
         <span v-if="type === 'COMMENT'">SEND</span>
         <span v-else>REPLY</span>
      </button>

      <div
         class="mobile-screen flex items-center justify-between mt-3 sm:hidden"
      >
         <img :src="currentUser.image.webp" alt="avatar" class="w-10" />
         <button class="bg-indigo-600 text-white py-2 px-6 rounded-lg">
            <span v-if="type === 'COMMENT'">SEND</span>
            <span v-else>REPLY</span>
         </button>
      </div>
   </form>
</template>
