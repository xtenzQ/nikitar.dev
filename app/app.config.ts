export default defineAppConfig({
  profile: {
    name: 'Nikita Rusetskii',
    avatar: 'https://avatars.githubusercontent.com/u/10103127?s=168&v=4',
    // The GitHub profile README repeats this status, so a change goes to both
    status: {
      label: 'Open to new roles',
      note: 'Looking for search and backend engineering or AI developer tooling work, remote or in Belgrade.',
    },
  },

  socials: [
    { label: 'Email', url: 'mailto:dev4nick@gmail.com' },
    { label: 'GitHub', url: 'https://github.com/xtenzQ' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/xtenzq/' },
    { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=qy3ZD4IAAAAJ&hl=en' },
  ],

  github: {
    username: 'xtenzQ',
    hidden: [
      'emmabostian/developer-portfolios',
      'abhisheknaiidu/awesome-github-profile-readme',
      'Exterminant/Article-papers',
      'aptem336/ACO',
    ],
  },
})
