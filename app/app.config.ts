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
})
