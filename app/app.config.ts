export default defineAppConfig({
  profile: {
    name: 'Nikita Rusetskii',
    role: 'Software engineer',
    location: 'Belgrade',
    avatar: 'https://avatars.githubusercontent.com/u/10103127?s=96&v=4',
  },

  socials: [
    { label: 'GitHub', icon: 'ph:github-logo', url: 'https://github.com/xtenzQ' },
    { label: 'LinkedIn', icon: 'ph:linkedin-logo', url: 'https://www.linkedin.com/in/xtenzq/' },
    { label: 'Google Scholar', icon: 'ph:graduation-cap', url: 'https://scholar.google.com/citations?user=qy3ZD4IAAAAJ&hl=en' },
    { label: 'Email', icon: 'ph:envelope-simple', url: 'mailto:dev4nick@gmail.com' },
  ],

  github: {
    username: 'xtenzQ',
    // Pull requests to repos owned by someone else, newest first. Closed-unmerged PRs are dropped.
    limit: 8,
    // Leave out a whole repo ("owner/repo") or a single pull request ("owner/repo#123")
    hidden: [
      'emmabostian/developer-portfolios',
      'abhisheknaiidu/awesome-github-profile-readme',
      'Exterminant/Article-papers',
      'aptem336/ACO',
    ],
  },

  // Each photo is public/photos/<name>.webp (600×800, the strip) and <name>-large.webp
  // (1200×1600, loaded only in the viewer). Both have metadata stripped.
  photos: [
    { name: 'seoul', caption: 'Seoul, 2025', alt: 'N Seoul Tower above a park on Namsan' },
    { name: 'busan-night', caption: 'Busan, 2025', alt: 'Gwangan Bridge lit up at night under a full moon' },
    { name: 'incheon', caption: 'Inha University, 2025', alt: 'Cherry blossoms on the Inha University campus' },
    { name: 'busan-sunset', caption: 'Busan, 2025', alt: 'Gwangan Bridge at sunset behind green bushes' },
    { name: 'inha-2019', caption: 'Inha University, 2019', alt: 'A traditional pavilion by a pond on the Inha University campus in autumn' },
    { name: 'seoul-2019', caption: 'Seoul, 2019', alt: 'Nikita in front of the Samsung Seoul R&D Campus sign' },
  ],
})
