export const initialUser = {
   image: {
      png: '/images/avatars/image-juliusomo.png',
      webp: '/images/avatars/image-juliusomo.webp'
   },
   username: 'juliusomo'
};

export const initialComments = [
   {
      id: 'MbnA2Hl2ww',
      content:
         "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: '2023-06-20T03:31:52.570Z',
      score: [],
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
      id: 'MbnA2elkCG',
      content:
         "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: '2023-06-18T03:31:52.570Z',
      score: [],
      user: {
         image: {
            png: '/images/avatars/image-maxblagun.png',
            webp: '/images/avatars/image-maxblagun.webp'
         },
         username: 'maxblagun'
      },
      replies: [
         {
            id: 'enyhSFiYLo',
            content:
               "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            createdAt: '2023-06-19T03:31:52.570Z',
            score: [],
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
            id: 'Bv7MoCJkNR',
            content:
               "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: '2023-06-19T03:31:52.570Z',
            score: [],
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
];
