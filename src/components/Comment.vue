<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
   props: {
      data: {
         type: [Array, Object],
         required: true
      },
      parrentId: {
         type: Number
      }
   },
   data() {
      return {
         showTextarea: false,
         isEditing: false,
         isVote: false,
         showModal: false
      };
   },
   computed: {
      ...mapState(['comments', 'currentUser']),
      ...mapGetters(['getRepliesLength'])
   },
   methods: {
      ...mapActions([
         'addReply',
         'deleteCommentAction',
         'deleteReplyAction',
         'updateComment',
         'updateReply',
         'controlScoreComment',
         'controlScoreReply'
      ]),

      commentHandle(event) {
         const commentCursorPosition = this.$refs.commentInput.selectionStart;
         const commentText = this.$refs.commentInput.value;
         const firstSpaceIndex = commentText.indexOf(' ');

         if (
            commentCursorPosition === firstSpaceIndex + 1 &&
            event.key == 'Backspace'
         ) {
            event.preventDefault();
         } else if (commentCursorPosition < firstSpaceIndex + 1) {
            event.preventDefault();
         }
      },

      replyHandle(event) {
         const replyCursorPosition = this.$refs.replyInput.selectionStart;
         const commentText = this.$refs.replyInput.value;
         const firstSpaceIndex = commentText.indexOf(' ');

         if (this.data.replyingTo) {
            if (
               replyCursorPosition === firstSpaceIndex + 1 &&
               event.key == 'Backspace'
            ) {
               event.preventDefault();
            } else if (replyCursorPosition < firstSpaceIndex + 1) {
               event.preventDefault();
            }
         }
      },
      addNewReply() {
         // Ambil nilai teks komentar dari textarea
         const commentText = this.$refs.commentInput.value;
         const firstSpaceIndex = commentText.indexOf(' ');

         const trimmedCommentText = commentText
            .substring(firstSpaceIndex + 1)
            .trim();
         if (!trimmedCommentText) {
            return;
         }

         // Buat objek comment baru
         const newComment = {
            id: this.getRepliesLength(this.parrentId) + 1,
            content: trimmedCommentText,
            createdAt: 'just now',
            score: 0,
            replyingTo: this.data.user.username,
            user: this.currentUser,
            username: this.currentUser.username
         };

         let payload = {
            comment: newComment,
            id: null
         };

         if (this.parrentId) {
            payload.id = this.parrentId;
         } else {
            payload.id = this.data.id;
         }

         // Panggil action `addComment` dengan parameter komentar baru
         this.addReply(payload);

         // Reset nilai textarea setelah menambahkan komentar
         this.$refs.commentInput.value = '';
         this.showTextarea = false;
      },
      deleteComment() {
         if (this.parrentId) {
            let payload = {
               commentId: this.parrentId,
               replyId: this.data.id
            };
            this.deleteReplyAction(payload);
         } else {
            this.deleteCommentAction(this.data.id);
         }
         this.showModal = false;
      },
      editComment() {
         const commentText = this.$refs.replyInput.value;
         const firstSpaceIndex = commentText.indexOf(' ');
         const trimmedCommentText = commentText
            .substring(firstSpaceIndex + 1)
            .trim();
         if (!trimmedCommentText) {
            return;
         }

         if (this.parrentId) {
            let payload = {
               newValue: trimmedCommentText,
               commentId: this.parrentId,
               replyId: this.data.id
            };
            this.updateReply(payload);
         } else {
            let payload = {
               newValue: trimmedCommentText,
               id: this.data.id
            };
            this.updateComment(payload);
         }

         this.isEditing = false;
      },
      controlScore(type) {
         let payload = {
            commentId: this.data.id,
            type: type
         };

         if (this.isVote && type === 'increase') {
            return;
         }

         if (!this.isVote && type === 'decrease') {
            return;
         }

         if (this.parrentId) {
            payload.commentId = this.parrentId;
            payload.replyId = this.data.id;
            this.controlScoreReply(payload);
            this.isVote = !this.isVote;
            return;
         }

         this.controlScoreComment(payload);
         this.isVote = !this.isVote;
      }
   }
};
</script>

<template>
   <div
      class="bg-white rounded-xl flex items-start gap-5 p-5 w-full h-auto mb-5"
   >
      <div
         class="comment-score-desktop sm: bg-slate-100 p-3 rounded-xl hidden sm:flex flex-col items-center gap-5"
      >
         <button type="button" @click="controlScore('increase')">
            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                  fill="#C5C6EF"
                  class="hover:fill-indigo-500 transition-all"
                  :class="{ 'fill-indigo-500': isVote }"
               />
            </svg>
         </button>

         <p class="text-indigo-500 font-bold">{{ data.score }}</p>

         <button type="button" @click="controlScore('decrease')">
            <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
               <path
                  d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                  fill="#C5C6EF"
                  class="hover:fill-indigo-500 transition-all"
               />
            </svg>
         </button>
      </div>

      <div class="w-full">
         <div class="comment-header flex justify-between">
            <div class="flex items-center gap-2">
               <img
                  :src="data.user.image.webp"
                  alt="avatar image"
                  class="w-8"
               />
               <p class="text-indigo-950 font-bold">
                  {{ data.user.username }}
               </p>
               <span
                  v-if="data.user.username === currentUser.username"
                  class="text-white font-semibold bg-indigo-500 px-1 rounded-sm mr-2"
                  >you</span
               >
               <div class="text-gray-400 font-semibold">
                  {{ data.createdAt }}
               </div>
            </div>
            <div class="hidden sm:flex items-center gap-2">
               <div
                  v-if="data.user.username === currentUser.username"
                  class="flex items-center gap-4"
               >
                  <div class="btn-delete btn" @click="showModal = !showModal">
                     <img src="/images/icon-delete.svg" alt="delete icon" />
                     <p class="text-indigo-500 font-bold">Delete</p>
                  </div>
                  <div class="btn-edit btn" @click="isEditing = !isEditing">
                     <img src="/images/icon-edit.svg" alt="edit icon" />
                     <p class="text-indigo-500 font-bold">Edit</p>
                  </div>
               </div>
               <div v-else>
                  <button
                     class="btn-reply btn"
                     @click="showTextarea = !showTextarea"
                  >
                     <img src="/images/icon-reply.svg" alt="reply icon" />
                     <p class="text-indigo-500 font-bold">Reply</p>
                  </button>
               </div>
            </div>
         </div>

         <div class="comment-body mt-2">
            <p class="text-gray-600" v-if="!isEditing">
               <span v-if="data.replyingTo" class="text-indigo-500 font-bold"
                  >@{{ data.replyingTo }}</span
               >
               {{ data.content }}
            </p>
            <div class="flex flex-col items-end gap-3" v-else>
               <textarea
                  placeholder="Add a comment..."
                  class="textarea border-2 border-indigo-500"
                  ref="replyInput"
                  @keydown="replyHandle"
                  :value="`${data?.replyingTo ? '@' + data.replyingTo : ''} ${
                     data.content
                  }`"
                  required
               ></textarea>
               <button
                  class="btn bg-indigo-500 text-white py-2 px-6 rounded-lg"
                  @click="editComment"
               >
                  UPDATE
               </button>
            </div>
            <div class="bottom mt-2 flex sm:hidden justify-between">
               <div
                  class="comment-score-mobile bg-slate-100 p-3 rounded-xl flex items-center gap-5 w-max"
               >
                  <button type="button" @click="controlScore('increase')">
                     <svg
                        width="11"
                        height="11"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                           fill="#C5C6EF"
                           class="hover:fill-indigo-500 transition-all"
                           :class="{ 'fill-indigo-500': isVote }"
                        />
                     </svg>
                  </button>

                  <p class="text-indigo-500 font-bold">{{ data.score }}</p>

                  <button type="button" @click="controlScore('decrease')">
                     <svg
                        width="11"
                        height="3"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                           fill="#C5C6EF"
                           class="hover:fill-indigo-500 transition-all"
                        />
                     </svg>
                  </button>
               </div>
               <div class="flex items-center gap-2">
                  <div
                     v-if="data.user.username === currentUser.username"
                     class="flex items-center gap-4"
                  >
                     <div
                        class="btn-delete btn"
                        @click="showModal = !showModal"
                     >
                        <img src="/images/icon-delete.svg" alt="delete icon" />
                        <p class="text-indigo-500 font-bold">Delete</p>
                     </div>
                     <div class="btn-edit btn" @click="isEditing = !isEditing">
                        <img src="/images/icon-edit.svg" alt="edit icon" />
                        <p class="text-indigo-500 font-bold">Edit</p>
                     </div>
                  </div>
                  <div v-else>
                     <button
                        class="btn-reply btn"
                        @click="showTextarea = !showTextarea"
                     >
                        <img src="/images/icon-reply.svg" alt="reply icon" />
                        <p class="text-indigo-500 font-bold">Reply</p>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <form class="form mb-5" @submit.prevent="addNewReply" v-show="showTextarea">
      <img
         :src="currentUser.image.webp"
         alt="avatar image"
         class="hidden sm:block w-10"
      />
      <textarea
         placeholder="Add a comment..."
         class="py-2 px-4 resize-none w-full h-20 border rounded-md text-gray-500 outline-indigo-500"
         ref="commentInput"
         @keydown="commentHandle"
         :value="`@${data.user.username} `"
         required
      ></textarea>
      <button
         class="btn hidden sm:block bg-indigo-500 text-white py-2 px-6 rounded-lg"
      >
         REPLY
      </button>

      <div class="bottom mobile-screen flex justify-between items-center mt-3">
         <img
            :src="currentUser.image.webp"
            alt="avatar image"
            class="sm:hidden w-10"
         /><button
            class="btn sm:hidden bg-indigo-500 text-white py-2 px-6 rounded-lg"
         >
            REPLY
         </button>
      </div>
   </form>

   <div
      v-show="showModal"
      class="modal fixed top-0 left-0 w-full h-full z-20 flex justify-center items-center"
   >
      <div class="backdrop bg-black opacity-40 absolute w-full h-full"></div>
      <div class="modal-card bg-white max-w-lg p-6 rounded-lg absolute mx-4">
         <p class="text-slate-800 font-bold text-xl">Delete comment</p>
         <p class="text-gray-500 font-medium mt-3">
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
         </p>
         <div class="grid grid-cols-2 gap-4 mt-5">
            <button
               class="bg-slate-600 py-3 px-5 text-white rounded-md"
               @click="showModal = !showModal"
            >
               NO, CANCEL
            </button>
            <button
               class="bg-red-600 py-3 px-5 text-white rounded-md"
               @click="deleteComment"
            >
               YES, DELETE
            </button>
         </div>
      </div>
   </div>
</template>
