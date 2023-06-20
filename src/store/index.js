import { createStore } from 'vuex';

import { getItem, setItem } from '../utills/localStorageUtils';
import { initialUser, initialComments } from '../utills/initialData';

const store = new createStore({
   state: {
      // Definisikan state aplikasi di sini
      currentUser: null,
      comments: []
   },
   mutations: {
      // Definisikan mutations untuk mengubah state
      SET_USER(state, user) {
         state.currentUser = user;
      },
      SET_COMMENTS(state, comments) {
         state.comments = comments;
      },

      ADD_COMMENT(state, comment) {
         state.comments.push(comment);
      },
      ADD_REPLY(state, { comment, commentId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         foundComment.replies.push(comment);
      },
      UPDATE_COMMENT(state, { content, commentId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         foundComment.content = content;
      },
      UPDATE_REPLY(state, { content, commentId, replyId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         const reply = foundComment.replies.find((val) => val.id === replyId);
         reply.content = content;
      },
      DELETE_COMMENT(state, commentId) {
         state.comments = state.comments.filter(
            (comment) => comment.id !== commentId
         );
      },
      DELETE_REPLY(state, { commentId, replyId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         foundComment.replies = foundComment.replies.filter(
            (reply) => reply.id !== replyId
         );
      },
      ADD_COMMENT_SCORE(state, { commentId, userId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         const existingUserId = foundComment.score.find(
            (val) => val === userId
         );

         if (existingUserId) return;

         foundComment.score.push(userId);
      },
      ADD_REPLY_SCORE(state, { commentId, replyId, userId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         const reply = foundComment.replies.find((val) => val.id === replyId);
         const existingUserId = reply.score.find((val) => val === userId);

         if (existingUserId) return;

         reply.score.push(userId);
      },
      DELETE_COMMENT_SCORE(state, { commentId, userId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         foundComment.score = foundComment.score.filter(
            (val) => val !== userId
         );
      },
      DELETE_REPLY_SCORE(state, { commentId, replyId, userId }) {
         const foundComment = state.comments.find(
            (val) => val.id === commentId
         );
         const reply = foundComment.replies.find((val) => val.id === replyId);
         reply.score = reply.score.filter((val) => val !== userId);
      }
   },
   actions: {
      // Definisikan actions untuk melakukan tugas async dan memanggil mutations
      setUser({ commit }, user) {
         commit('SET_USER', user);
         setItem('user', user);
      },
      setComments({ commit }, comments) {
         commit('SET_COMENTS', comments);
         setItem('comments', comments);
      },
      initializeStore({ commit }) {
         const user = getItem('user');
         if (user) {
            commit('SET_USER', user);
         } else {
            commit('SET_USER', initialUser);
            setItem('user', initialUser);
         }

         const comments = getItem('comments');
         if (comments) {
            commit('SET_COMMENTS', comments);
         } else {
            commit('SET_COMMENTS', initialComments);
            setItem('comments', initialComments);
         }
      },
      setCurrentUser({ commit }, user) {
         commit('SET_CURRENTUSER', user);
         setItem('user', this.state.currentUser);
      },
      addComment({ commit }, comment) {
         commit('ADD_COMMENT', comment);
         setItem('comments', this.state.comments);
      },
      addReply({ commit }, { comment, commentId }) {
         commit('ADD_REPLY', { comment, commentId });
         setItem('comments', this.state.comments);
      },
      updateComment({ commit }, { content, commentId }) {
         commit('UPDATE_COMMENT', { content, commentId });
         setItem('comments', this.state.comments);
      },
      updateReply({ commit }, { content, commentId, replyId }) {
         commit('UPDATE_REPLY', { content, commentId, replyId });
         setItem('comments', this.state.comments);
      },
      deleteComment({ commit }, commentId) {
         commit('DELETE_COMMENT', commentId);
         setItem('comments', this.state.comments);
      },
      deleteReply({ commit }, { commentId, replyId }) {
         commit('DELETE_REPLY', { commentId, replyId });
         setItem('comments', this.state.comments);
      },
      addCommentScore({ commit }, { commentId, userId }) {
         commit('ADD_COMMENT_SCORE', { commentId, userId });
         setItem('comments', this.state.comments);
      },
      addReplyScore({ commit }, { commentId, replyId, userId }) {
         commit('ADD_REPLY_SCORE', { commentId, replyId, userId });
         setItem('comments', this.state.comments);
      },
      deleteCommentScore({ commit }, { commentId, userId }) {
         commit('DELETE_COMMENT_SCORE', { commentId, userId });
         setItem('comments', this.state.comments);
      },
      deleteReplyScore({ commit }, { commentId, replyId, userId }) {
         commit('DELETE_REPLY_SCORE', { commentId, replyId, userId });
         setItem('comments', this.state.comments);
      }
   },
   getters: {
      // Definisikan getters untuk mendapatkan state secara terpusat
   }
});

export default store;
