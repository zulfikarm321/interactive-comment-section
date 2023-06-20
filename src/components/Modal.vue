<template>
   <div
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
               @click="this.$emit('close')"
            >
               NO, CANCEL
            </button>
            <button
               class="bg-red-600 py-3 px-5 text-white rounded-md"
               @click="this.$emit('delete')"
            >
               YES, DELETE
            </button>
         </div>
      </div>
   </div>
</template>
