import { createStore } from 'vuex';

const store = new createStore({
   state: {
      // Definisikan state aplikasi di sini
      currentUser: {
         image: {
            png: '/images/avatars/image-juliusomo.png',
            webp: '/images/avatars/image-juliusomo.webp'
         },
         username: 'juliusomo'
      },
      comments: [
         {
            id: 1,
            content:
               "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
            createdAt: '1 month ago',
            score: 12,
            user: {
               image: {
                  png: '/images/avatars/image-amyrobson.png',
                  webp: '/images/avatars/image-amyrobson.webp'
               },
               username: 'amyrobson'
            },
            replies: []
         },
         {
            id: 2,
            content:
               "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
            createdAt: '2 weeks ago',
            score: 5,
            user: {
               image: {
                  png: '/images/avatars/image-maxblagun.png',
                  webp: '/images/avatars/image-maxblagun.webp'
               },
               username: 'maxblagun'
            },
            replies: [
               {
                  id: 1,
                  content:
                     "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
                  createdAt: '1 week ago',
                  score: 4,
                  replyingTo: 'maxblagun',
                  user: {
                     image: {
                        png: '/images/avatars/image-ramsesmiron.png',
                        webp: '/images/avatars/image-ramsesmiron.webp'
                     },
                     username: 'ramsesmiron'
                  }
               },
               {
                  id: 2,
                  content:
                     "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
                  createdAt: '2 days ago',
                  score: 2,
                  replyingTo: 'ramsesmiron',
                  user: {
                     image: {
                        png: '/images/avatars/image-juliusomo.png',
                        webp: '/images/avatars/image-juliusomo.webp'
                     },
                     username: 'juliusomo'
                  }
               }
            ]
         }
      ]
   },
   mutations: {
      // Definisikan mutations untuk mengubah state
      ADD_COMMENT(state, comment) {
         if (state.comments.find((val) => val.id === comment.id)) {
            comment.id = comment.id + 1;
         }

         state.comments.push(comment);
      },
      ADD_REPLY(state, { comment, id }) {
         const data = state.comments.find((val) => val.id === id);

         let existingReply = data.replies.find((val) => val.id === comment.id);

         if (existingReply) {
            // Jika ID sudah ada, cari ID yang unik dengan menambahkan angka di belakang ID
            let uniqueId = comment.id;
            let counter = 1;

            while (existingReply) {
               uniqueId = comment.id + counter;
               existingReply = data.replies.find((val) => val.id === uniqueId);
               counter++;
            }

            // Setel ID yang unik
            comment.id = uniqueId;
         }

         data.replies.push(comment);
      },
      UPDATE_COMMENT(state, { newValue, id }) {
         const comment = state.comments.find((val) => val.id === id);

         comment.content = newValue;
      },
      UPDATE_REPLY(state, { newValue, commentId, replyId }) {
         const comment = state.comments.find((val) => val.id === commentId);
         const reply = comment.replies.find((val) => val.id === replyId);

         reply.content = newValue;
      },
      DELETE_COMMENT(state, id) {
         const comment = state.comments.findIndex((val) => val.id === id);

         if (comment !== -1) {
            state.comments.splice(comment, 1);
         }
      },
      DELETE_REPLY(state, { replyId, commentId }) {
         const comment = state.comments.find((val) => val.id === commentId);
         const reply = comment.replies.findIndex((val) => val.id === replyId);

         if (reply !== -1) {
            comment.replies.splice(reply, 1);
         }
      },
      CONTROL_SCORE_COMMENT(state, { commentId, type }) {
         const comment = state.comments.find(
            (comment) => comment.id === commentId
         );

         switch (type) {
            case 'increase':
               comment.score++;
               break;
            case 'decrease':
               comment.score--;
               break;
         }
      },
      CONTROL_SCORE_REPLY(state, { commentId, replyId, type }) {
         const comment = state.comments.find(
            (comment) => comment.id === commentId
         );
         const reply = comment.replies.find((val) => val.id === replyId);

         switch (type) {
            case 'increase':
               reply.score++;
               break;
            case 'decrease':
               reply.score--;
               break;
         }
      }
   },
   actions: {
      // Definisikan actions untuk melakukan tugas async dan memanggil mutations
      addComment({ commit }, comment) {
         commit('ADD_COMMENT', comment);
      },
      addReply({ commit }, { comment, id }) {
         commit('ADD_REPLY', { comment, id });
      },
      updateComment({ commit }, { newValue, id }) {
         commit('UPDATE_COMMENT', { newValue, id });
      },
      updateReply({ commit }, { newValue, commentId, replyId }) {
         commit('UPDATE_REPLY', { newValue, commentId, replyId });
      },
      deleteCommentAction({ commit }, id) {
         commit('DELETE_COMMENT', id);
      },
      deleteReplyAction({ commit }, { replyId, commentId }) {
         commit('DELETE_REPLY', { replyId, commentId });
      },
      controlScoreComment({ commit }, { commentId, type }) {
         commit('CONTROL_SCORE_COMMENT', { commentId, type });
      },
      controlScoreReply({ commit }, { commentId, replyId, type }) {
         commit('CONTROL_SCORE_REPLY', { commentId, replyId, type });
      }
   },
   getters: {
      // Definisikan getters untuk mendapatkan state secara terpusat

      getRepliesLength: (state) => (commentId) => {
         const comment = state.comments.find((val) => val.id === commentId);

         if (comment && comment.replies) {
            return comment.replies.length;
         }
         return 0; // Jika reply tidak ditemukan, mengembalikan panjang 0
      }
   }
});

export default store;
