<script>
import FormComment from './FormComment.vue';
import Modal from './Modal.vue';

import { mapState, mapActions } from 'vuex';
import { Transition } from 'vue';

export default {
   props: {
      data: {
         type: [Array, Object],
         required: true
      },
      commentId: {
         type: String
      },
      isParrent: {
         type: Boolean
      }
   },
   components: { FormComment, Modal },
   data() {
      return {
         showForm: false,
         isEditing: false,
         showModal: false
      };
   },
   methods: {
      ...mapActions([
         'deleteComment',
         'deleteReply',
         'updateComment',
         'updateReply',
         'addCommentScore',
         'addReplyScore',
         'deleteCommentScore',
         'deleteReplyScore'
      ]),

      toggleForm() {
         this.showForm = !this.showForm;
      },
      toggleModal() {
         this.showModal = !this.showModal;
      },
      toggleEdit() {
         this.isEditing = !this.isEditing;

         if (this.isEditing) {
            this.$nextTick(() => {
               this.$refs.editInput.focus();
            });
         }
      },
      deleteCommentMethod() {
         if (this.isParrent) {
            this.deleteComment(this.commentId);
         } else {
            const payload = {
               commentId: this.commentId,
               replyId: this.data.id
            };
            this.deleteReply(payload);
         }
      },
      updateCommentMethod() {
         const content = this.$refs.editInput.value;

         if (!content) {
            return;
         }

         let payload = {
            content: content,
            commentId: this.commentId
         };

         if (this.isParrent) {
            this.updateComment(payload);
         } else {
            payload.replyId = this.data.id;
            this.updateReply(payload);
         }
         this.toggleEdit();
      },
      addScore() {
         if (this.currentUser.username === this.data.user.username) return;

         let payload = {
            commentId: this.commentId,
            userId: this.currentUser.username
         };

         if (this.isParrent) {
            this.addCommentScore(payload);
         } else {
            payload.replyId = this.data.id;
            this.addReplyScore(payload);
         }
         console.log(this.data.score);
      },
      deleteScore() {
         let payload = {
            commentId: this.commentId,
            userId: this.currentUser.username
         };

         if (this.isParrent) {
            this.deleteCommentScore(payload);
         } else {
            payload.replyId = this.data.id;
            this.deleteReplyScore(payload);
         }
      }
   },
   computed: {
      ...mapState(['comments', 'currentUser']),
      isUser() {
         if (this.data.user.username === this.currentUser.username) {
            return true;
         }
         return false;
      },
      isUserVoteScore() {
         const voteExisted = this.data.score.find(
            (val) => val === this.currentUser.username
         );

         if (voteExisted) {
            return true;
         } else {
            return false;
         }
      },
      formatTimeAgo() {
         const currentTime = new Date();
         const givenTime = new Date(this.data.createdAt);
         const timeDifference = currentTime - givenTime;

         if (timeDifference >= 86400000) {
            const days = Math.floor(timeDifference / 86400000);
            if (days === 1) {
               return '1 day ago';
            } else {
               return `${days} days ago`;
            }
         } else if (timeDifference >= 3600000) {
            const hours = Math.floor(timeDifference / 3600000);
            if (hours === 1) {
               return '1 hour ago';
            } else {
               return `${hours} hours ago`;
            }
         } else if (timeDifference >= 60000) {
            const minutes = Math.floor(timeDifference / 60000);
            if (minutes === 1) {
               return '1 minute ago';
            } else {
               return `${minutes} minutes ago`;
            }
         } else {
            return 'just now';
         }
      }
   }
};
</script>

<template>
   <div class="comment-section w-full" @click="outsideClick">
      <div class="comment-card">
         <div class="score-control hidden sm:flex flex-col">
            <button class="cursor-pointer" @click="addScore">
               <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                     fill="#C5C6EF"
                     class="hover:fill-indigo-500 transition-all"
                     :class="{ 'fill-indigo-500': isUserVoteScore }"
                  />
               </svg>
            </button>
            <p class="text-indigo-500 font-bold">{{ data.score.length }}</p>
            <button class="cursor-pointer" @click="deleteScore">
               <svg
                  width="11"
                  height="3"
                  xmlns="http://www.w3.org/2000/svg"
                  class="cursor-pointer"
               >
                  <path
                     d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                     fill="#C5C6EF"
                     class="hover:fill-indigo-500 transition-all"
                  />
               </svg>
            </button>
         </div>
         <div class="comment-body w-full">
            <div
               class="comment-header w-full flex items-center justify-between"
            >
               <div class="flex items-center gap-3">
                  <img :src="data.user.image.webp" alt="avatar" class="w-9" />
                  <p class="text-blue-950 font-bold text-md sm:text-lg">
                     {{ data.user.username }}
                  </p>
                  <p class="text-gray-500 font-medium">{{ formatTimeAgo }}</p>
               </div>
               <div v-if="!isUser" class="hidden sm:flex items-center gap-3">
                  <button class="btn text-indigo-500" @click="toggleForm">
                     <img src="/images/icon-reply.svg" alt="reply icon" />
                     <p>Reply</p>
                  </button>
               </div>
               <div v-else class="hidden sm:flex items-center gap-3">
                  <button class="btn text-indigo-500" @click="toggleModal">
                     <img src="/images/icon-delete.svg" alt="reply icon" />
                     <p>Delete</p>
                  </button>
                  <button class="btn text-indigo-500" @click="toggleEdit">
                     <img src="/images/icon-edit.svg" alt="reply icon" />
                     <p>Edit</p>
                  </button>
               </div>
            </div>
            <div class="comment-main mt-3">
               <p class="text-slate-500 font-medium" v-show="!isEditing">
                  <span v-if="!isParrent" class="text-indigo-500 font-bold mr-1"
                     >@{{ data?.replyingTo }}</span
                  >{{ data.content }}
               </p>
               <div
                  class="comment-content flex flex-col items-end gap-3"
                  v-show="isEditing"
               >
                  <textarea
                     class="w-full py-2 px-5 border rounded-lg h-24 text-gray-600 outline-indigo-500"
                     ref="editInput"
                     :value="this.data.content"
                  ></textarea>
                  <button
                     class="bg-indigo-600 text-white py-2 px-6 rounded-lg"
                     @click="updateCommentMethod"
                  >
                     <span>UPDATE</span>
                  </button>
               </div>

               <div
                  class="mobile-screen flex items-center justify-between mt-3"
               >
                  <div class="score-control flex p-2 sm:hidden w-max">
                     <button class="cursor-pointer" @click="addScore">
                        <svg
                           width="11"
                           height="11"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                              fill="#C5C6EF"
                              class="hover:fill-indigo-500 transition-all"
                              :class="{ 'fill-indigo-500': isUserVoteScore }"
                           />
                        </svg>
                     </button>
                     <p class="text-indigo-500 font-bold">
                        {{ data.score.length }}
                     </p>
                     <button class="cursor-pointer" @click="deleteScore">
                        <svg
                           width="11"
                           height="3"
                           xmlns="http://www.w3.org/2000/svg"
                           class="cursor-pointer"
                        >
                           <path
                              d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                              fill="#C5C6EF"
                              class="hover:fill-indigo-500 transition-all"
                           />
                        </svg>
                     </button>
                  </div>

                  <div v-if="!isUser" class="flex sm:hidden items-center gap-3">
                     <button class="btn text-indigo-500" @click="toggleForm">
                        <img src="/images/icon-reply.svg" alt="reply icon" />
                        <p>Reply</p>
                     </button>
                  </div>
                  <div v-else class="flex sm:hidden items-center gap-3">
                     <button class="btn text-indigo-500" @click="toggleModal">
                        <img src="/images/icon-delete.svg" alt="reply icon" />
                        <p>Delete</p>
                     </button>
                     <button class="btn text-indigo-500" @click="toggleEdit">
                        <img src="/images/icon-edit.svg" alt="reply icon" />
                        <p>Edit</p>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <Transition name="slide-fade">
         <FormComment
            :type="'REPLY'"
            :commentId="commentId"
            :replyingTo="this.data.user.username"
            @toggle="toggleForm"
            v-if="showForm"
         />
      </Transition>
   </div>
   <Modal
      v-show="showModal"
      @close="toggleModal"
      @delete="deleteCommentMethod"
   />
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
