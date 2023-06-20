<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import CommentCard from './components/CommentCard.vue';
import FormComment from './components/FormComment.vue';
import SelectUser from './components/SelectUser.vue';

export default {
   components: {
      CommentCard,
      FormComment,
      SelectUser
   },
   computed: {
      ...mapState(['comments', 'user'])
   },
   methods: {
      ...mapActions(['setCurrentUser'])
   }
};
</script>

<template>
   <div
      class="container mx-auto flex flex-col min-h-screen justify-center relative"
   >
      <SelectUser />
      <div
         class="comment-section flex flex-col items-end"
         v-for="comment in comments"
      >
         <CommentCard
            :key="comment.id"
            :commentId="comment.id"
            :data="comment"
            :isParrent="true"
         />
         <div class="replies w-[90%]">
            <CommentCard
               v-for="reply in comment.replies"
               :key="reply.id"
               :commentId="comment.id"
               :data="reply"
               :isParrent="false"
            />
         </div>
      </div>
      <FormComment :type="'COMMENT'" />
   </div>
</template>
