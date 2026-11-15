<script setup lang="ts">
definePageMeta({ layout: 'cv' })

const { profile, socials } = useAppConfig()
const site = useSiteConfig()
const cv = useCv()

const { data: pullRequests } = await useFetch('/api/contributions', { key: 'contributions' })

const openSource = computed(() => {
  const all = pullRequests.value ?? []
  if (!all.length) return null
  const counts = new Map<string, number>()
  for (const pr of all) counts.set(pr.repo, (counts.get(pr.repo) ?? 0) + 1)
  // humanlayer/humanlayer reads as "humanlayer"
  const repos = [...counts]
    .sort((a, b) => b[1] - a[1])
    .map(([repo]) => {
      const [owner, name] = repo.split('/')
      return owner === name ? name! : repo
    })
  return {
    total: all.length,
    merged: all.filter(pr => pr.state === 'merged').length,
    open: all.filter(pr => pr.state === 'open').length,
    repos: repos.length > 1 ? `${repos.slice(0, -1).join(', ')} and ${repos.at(-1)}` : repos[0],
    notable: cv.notablePullRequests
      .map(key => all.find(pr => `${pr.repo}#${pr.number}` === key))
      .filter(pr => pr !== undefined),
  }
})

const siteHost = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
const scholar = socials.find(social => social.label === 'Google Scholar')

// Paper has no hover, so the PDF spells links out; the Scholar URL is too long to print
const printLinks = [
  ...socials.filter(social => social.url.startsWith('mailto:')).map(social => ({ url: social.url, text: social.url.slice('mailto:'.length) })),
  { url: '/', text: siteHost },
  ...socials
    .filter(social => social.url.startsWith('http') && social !== scholar)
    .map(social => ({ url: social.url, text: social.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') })),
]

const educationOpen = ref(false)
const [firstEducation, ...moreEducation] = cv.education

const languages = cv.languages.map(language => `${language.name}, ${language.level}`).join(' · ')

const description = 'CV of Nikita Rusetskii: search, backend, and AI developer tooling. Experience, open source, skills, and education, with a PDF to download.'

useSeoMeta({
  title: 'CV',
  description,
})

defineOgImage({
  title: 'CV',
  description,
})
</script>

<template>
  <article class="cv">
    <header class="hd vt-cv-intro">
      <div class="hd-id">
        <div class="hd-me">
          <img :src="profile.avatar" alt="" width="56" height="56" class="avatar vt-me-avatar screen-only">
          <h1 class="name"><span class="vt-me-name">{{ profile.name }}</span></h1>
        </div>
        <p class="headline">{{ cv.headline }}</p>
        <p class="location screen-only">{{ cv.location }} · {{ cv.workMode }}</p>
        <p class="contacts print-only">
          {{ cv.location }} · {{ cv.workMode }}<template v-for="link in printLinks" :key="link.url"> · <a :href="link.url">{{ link.text }}</a></template>
        </p>
      </div>
      <div class="hd-export screen-only">
        <a class="btn" :href="`/${cv.pdf}`" download>
          <Icon name="ph:download-simple" size="16" />
          Download PDF
        </a>
      </div>
      <div class="hd-status screen-only">
        <StatusPill v-if="profile.status" :label="profile.status.label" />
        <span class="hd-links">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            :target="social.url.startsWith('mailto:') ? undefined : '_blank'"
            rel="noopener noreferrer"
          >{{ social.label }}</a>
        </span>
      </div>
    </header>

    <section class="sec sec-first" aria-labelledby="cv-experience">
      <h2 id="cv-experience" class="label">Experience</h2>
      <ol class="tl">
        <li v-for="company in cv.experience" :key="company.name" class="tl-co">
          <span class="logo tl-logo" aria-hidden="true"><span class="logo-letters">{{ company.monogram }}</span></span>
          <div class="tl-head">
            <div>
              <h3 class="tl-name">
                <a v-if="company.url" :href="company.url" target="_blank" rel="noopener noreferrer">{{ company.name }}</a>
                <template v-else>{{ company.name }}</template>
              </h3>
              <!-- The PDF puts a single role on the company line -->
              <span v-if="company.roles.length === 1" class="tl-only-role print-only"> · {{ company.roles[0]!.title }}</span>
              <p class="tl-loc">{{ company.location }}</p>
            </div>
            <span v-if="company.roles.length === 1" class="row-meta print-only">{{ formatCvRange(company.roles[0]!.start, company.roles[0]!.end) }}</span>
          </div>
          <ol :class="{ 'tl-single': company.roles.length === 1 }">
            <li v-for="role in company.roles" :key="role.title" class="tl-role">
              <span
                v-if="company.roles.length > 1"
                class="tl-dot"
                :class="{ 'tl-dot-now': !role.end }"
                aria-hidden="true"
              />
              <div class="head">
                <p class="role-title">{{ role.title }}</p>
                <span class="row-meta">{{ formatCvRange(role.start, role.end) }}</span>
              </div>
              <ul v-if="role.bullets" class="bullets">
                <li v-for="bullet in role.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
              <p v-if="role.summary" class="summary">{{ role.summary }}</p>
            </li>
          </ol>
        </li>
      </ol>
    </section>

    <section v-if="openSource" class="sec" aria-labelledby="cv-oss">
      <h2 id="cv-oss" class="label">Open source</h2>
      <p>
        <strong>{{ openSource.merged }} merged</strong> pull requests<template v-if="openSource.open"> and {{ openSource.open }} open</template>, to {{ openSource.repos }}.
      </p>
      <ul v-if="openSource.notable.length" class="prs">
        <li v-for="pr in openSource.notable" :key="pr.url" class="pr">
          <Icon v-if="pr.state === 'open'" name="ph:git-pull-request" size="14" class="pr-icon" style="color: var(--open);" />
          <Icon v-else name="ph:git-merge" size="14" class="pr-icon" style="color: var(--merged);" />
          <span><span class="row-meta pr-repo">{{ pr.repo }}</span> <a :href="pr.url" target="_blank" rel="noopener noreferrer">{{ plainPullRequestTitle(pr.title) }}</a></span>
        </li>
      </ul>
      <p class="all screen-only">
        <NuxtLink to="/oss/" class="nowrap">All {{ openSource.total }} pull requests →</NuxtLink>
      </p>
      <p class="all print-only">
        All of them: <a href="/oss/">{{ siteHost }}/oss</a>
      </p>
    </section>

    <section class="sec" aria-labelledby="cv-skills">
      <h2 id="cv-skills" class="label">Skills</h2>
      <dl class="kv">
        <template v-for="skill in cv.skills" :key="skill.group">
          <dt>{{ skill.group }}</dt>
          <dd>{{ skill.items }}</dd>
        </template>
        <dt class="print-only">Languages</dt>
        <dd class="print-only">{{ languages }}</dd>
      </dl>
    </section>

    <section class="sec" aria-labelledby="cv-education">
      <h2 id="cv-education" class="label">Education</h2>
      <ul id="cv-education-list" class="edu" :class="{ open: educationOpen }">
        <li
          v-for="(item, index) in cv.education"
          :key="item.degree"
          class="item"
          :class="{ 'edu-more': index > 0 }"
        >
          <span class="logo" aria-hidden="true">{{ item.monogram }}</span>
          <div class="head">
            <p><span class="item-title">{{ item.degree }}</span><span class="item-place">{{ item.institution }}<template v-if="item.detail"> · {{ item.detail }}</template></span></p>
            <span class="row-meta">{{ formatCvRange(item.start, item.end) }}</span>
          </div>
        </li>
      </ul>
      <button
        v-if="firstEducation && moreEducation.length"
        type="button"
        class="more"
        :aria-expanded="educationOpen"
        aria-controls="cv-education-list"
        @click="educationOpen = !educationOpen"
      >
        <template v-if="educationOpen">Show less</template>
        <template v-else>
          <span class="pile" aria-hidden="true">
            <span v-for="item in moreEducation" :key="item.degree" class="logo logo-sm">{{ item.monogram }}</span>
          </span>
          <span>{{ moreEducation.length }} more: {{ moreEducation.map(item => item.short).join(', ') }}</span>
        </template>
      </button>
    </section>

    <section class="sec" aria-labelledby="cv-research">
      <h2 id="cv-research" class="label">Research and awards</h2>
      <ul class="rows">
        <li class="head">
          <span><a v-if="scholar" :href="scholar.url" target="_blank" rel="noopener noreferrer">{{ cv.papers.count }} papers</a><template v-else>{{ cv.papers.count }} papers</template> on {{ cv.papers.topic }}</span>
          <span class="row-meta">{{ formatCvRange(cv.papers.start, cv.papers.end) }}</span>
        </li>
        <li v-for="award in cv.awards" :key="award.title" class="head">
          <span>{{ award.title }}<span v-if="award.note" class="muted"> · {{ award.note }}</span></span>
          <span class="row-meta">{{ award.years }}</span>
        </li>
      </ul>
    </section>

    <section class="sec screen-only" aria-labelledby="cv-languages">
      <h2 id="cv-languages" class="label">Languages</h2>
      <p>{{ languages }}</p>
    </section>

    <footer class="print-foot print-only">
      <span>Updated {{ cv.updated }}</span>
      <span>Latest version: <a href="/cv/">{{ siteHost }}/cv</a></span>
    </footer>
  </article>
</template>

<style scoped>
.print-only {
  display: none;
}

.hd-me {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--border);
}

.name {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.name span {
  display: inline-block;
}

.headline {
  margin-top: 0.75rem;
  font-size: 17px;
  line-height: 1.45;
  color: var(--heading);
}

.location {
  margin-top: 0.25rem;
  color: var(--text-muted);
}

.hd {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: "id export" "status status";
  gap: 1.5rem;
  padding-top: 4rem;
}

.hd-id {
  grid-area: id;
  min-width: 0;
}

.hd-export {
  grid-area: export;
  padding-top: 10px;
}

.hd-status {
  grid-area: status;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
}

.hd-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.hd-links a {
  color: var(--heading);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 36px;
  padding: 0 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--heading);
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.btn:hover {
  background: var(--surface-hover);
}

.sec {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-strong);
}

.sec-first {
  margin-top: 4rem;
}

.label {
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--heading);
}

.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0 1rem;
}

.muted {
  color: var(--text-muted);
}

.nowrap {
  white-space: nowrap;
}

strong {
  font-weight: 600;
  color: var(--heading);
}

.logo {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--border-strong);
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1;
  color: var(--heading);
}

.logo-sm {
  width: 22px;
  height: 22px;
  font-size: 8.5px;
  box-shadow: 0 0 0 2px var(--bg), inset 0 0 0 1px var(--border-strong);
}

.pile {
  display: inline-flex;
}

.pile .logo-sm + .logo-sm {
  margin-left: -6px;
}

.tl {
  padding-top: 0.5rem;
}

.tl-co {
  position: relative;
  padding-left: 56px;
}

.tl-co + .tl-co {
  margin-top: 2rem;
}

.tl-co:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 17.5px;
  top: 36px;
  bottom: -2rem;
  width: 1px;
  background: var(--border-strong);
}

.tl-logo {
  position: absolute;
  left: 0;
  top: -6px;
  width: 36px;
  height: 36px;
  font-size: 12px;
}

.tl-name {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
}

.tl-name a {
  text-decoration: none;
}

.tl-loc {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.tl-role {
  position: relative;
  margin-top: 1rem;
}

.tl-dot {
  position: absolute;
  left: -43px;
  top: 7px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bg);
  box-shadow: 0 0 0 1.5px var(--text-tertiary);
}

.tl-dot-now {
  background: var(--heading);
  box-shadow: 0 0 0 3px var(--bg);
}

.role-title {
  font-weight: 500;
  line-height: 1.55;
  color: var(--heading);
}

.bullets {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bullets li {
  position: relative;
  padding-left: 1rem;
}

.bullets li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0.68em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-tertiary);
}

.summary {
  margin-top: 0.5rem;
}

.prs {
  margin-top: 0.75rem;
}

.pr {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.pr + .pr {
  margin-top: 0.5rem;
}

.pr-icon {
  flex: none;
  transform: translateY(2px);
}

.pr-repo {
  margin-right: 0.25rem;
}

.pr a {
  color: var(--text);
}

.all {
  margin-top: 0.75rem;
}

.kv {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 0.5rem 1rem;
}

.kv dt {
  font-size: 0.8125rem;
  line-height: 1.85;
  color: var(--text-muted);
}

.item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.item + .item {
  margin-top: 1rem;
}

.item .head {
  flex: 1;
  min-width: 0;
}

.item-title {
  color: var(--heading);
}

.item-place {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.edu:not(.open) .edu-more {
  display: none;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0 0 -0.5rem;
  min-height: 36px;
  padding: 0.25rem 0.75rem 0.25rem 0.5rem;
  border: 0;
  border-radius: 999px;
  background: none;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: left;
  cursor: pointer;
}

.more:hover {
  background: var(--hover);
  color: var(--heading);
}

.rows li + li {
  margin-top: 0.25rem;
}

@media (max-width: 35rem) {
  .hd {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "id" "status" "export";
    padding-top: 3rem;
  }

  .hd-export {
    padding-top: 0;
  }

  .hd-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .kv {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .kv dd {
    margin-bottom: 0.5rem;
  }

  .tl-co {
    padding-left: 40px;
  }

  .tl-co:not(:last-child)::before {
    left: 13.5px;
    top: 28px;
  }

  .tl-logo {
    top: -2px;
    width: 28px;
    height: 28px;
    font-size: 10.5px;
  }

  .tl-dot {
    left: -31px;
  }
}

@media print {
  .cv {
    font-size: 12px;
    line-height: 1.4;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .screen-only {
    display: none;
  }

  .print-only {
    display: revert;
  }

  .cv a {
    text-decoration: none;
  }

  .hd {
    display: block;
    padding: 0 0 14px;
    border-bottom: 1px solid var(--border-strong);
  }

  .name {
    font-size: 26px;
  }

  .headline {
    margin-top: 4px;
    font-size: 14px;
  }

  .contacts {
    margin-top: 4px;
    font-size: 11.5px;
    color: var(--text-muted);
  }

  .contacts a {
    color: var(--text);
  }

  .sec,
  .sec-first {
    margin-top: 16px;
    padding-top: 0;
    border-top: 0;
  }

  .label {
    margin-bottom: 5px;
    font-size: 10px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    break-after: avoid;
  }

  .row-meta {
    font-family: var(--font-sans);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .tl {
    padding-top: 2px;
  }

  .tl-co {
    padding-left: 30px;
  }

  .tl-co + .tl-co {
    margin-top: 9px;
  }

  .tl-co:not(:last-child)::before {
    left: 9.5px;
    top: 19px;
    bottom: -9px;
  }

  .tl-logo {
    top: 1px;
    width: 18px;
    height: 18px;
  }

  .logo-letters {
    display: none;
  }

  .tl-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }

  .tl-name {
    display: inline;
    font-size: 13.5px;
  }

  .tl-only-role {
    font-weight: 500;
    color: var(--heading);
  }

  .tl-loc {
    display: inline;
    font-size: 12px;
    color: var(--text-muted);
  }

  .tl-loc::before {
    content: ' · ';
  }

  .tl-single .head {
    display: none;
  }

  .tl-single .tl-role {
    margin-top: 1px;
  }

  .tl-role {
    margin-top: 3px;
    break-inside: avoid;
  }

  .tl-role + .tl-role {
    margin-top: 7px;
  }

  .tl-dot {
    left: -23px;
    top: 6px;
    width: 6px;
    height: 6px;
  }

  .tl-dot-now {
    box-shadow: 0 0 0 2px var(--bg);
  }

  .role-title {
    font-weight: 600;
  }

  .bullets {
    margin-top: 1px;
    gap: 1px;
  }

  .bullets li {
    padding-left: 12px;
  }

  .bullets li::before {
    top: 0.62em;
    width: 3.5px;
    height: 3.5px;
  }

  .summary {
    margin-top: 1px;
  }

  .prs {
    margin-top: 2px;
  }

  .pr + .pr {
    margin-top: 0;
  }

  .pr-icon {
    display: none;
  }

  .all {
    margin-top: 0;
  }

  .kv {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 0 12px;
  }

  .kv dt {
    font-size: 12px;
    line-height: inherit;
  }

  .item .logo,
  .more {
    display: none;
  }

  .edu:not(.open) .edu-more {
    display: flex;
  }

  .item + .item {
    margin-top: 2px;
  }

  .item-title {
    font-weight: 500;
  }

  .item-place {
    display: inline;
    font-size: inherit;
    line-height: inherit;
    color: var(--text);
  }

  .item-place::before {
    content: ', ';
  }

  .rows li + li {
    margin-top: 2px;
  }

  .sec {
    break-inside: avoid;
  }

  .sec-first {
    break-inside: auto;
  }

  .print-foot {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 10.5px;
    color: var(--text-muted);
  }
}
</style>
