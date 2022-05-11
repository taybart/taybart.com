<script lang="ts">
  import RightArrow from '../components/atoms/RightArrow.svelte'
  import Github from '../assets/github.svg'
  import Twitter from '../assets/twitter.svg'
  import LinkedIn from '../assets/linkedin.svg'
</script>

<div class="resume">
  <div>
    <p class="font-thin">my journey so far</p>
    <div>
      <div class="job">
        <RightArrow /> 2020-now <b>principal engineer & developement manager</b>
        journey
      </div>
      <div class="job">
        <RightArrow /> 2018-2020 <b>lead software engineer</b> journey
        <div class="description">
          Journey is bringing trust, identity and zero-knowledge privacy to the
          contact center & beyond
        </div>
      </div>
    </div>
    <div class="job">
      <RightArrow /> 2017-2018 <b>lead software engineer</b> the spiga group [real
      time index fund]
    </div>
    <div class="job">
      <RightArrow /> 2014-2017 <b>co-founder</b> mfactor engineering [factory optimization]
    </div>
    <div class="job">
      <RightArrow /> 2015 <b>bs</b> electrical and computer engineering, university
      of colorado
    </div>
  </div>
  <div class="links absolute bottom-8 left-8">
    <span>links</span>
    <div class="flex flex-row">
      <a href="https://github.com/taybart" target="_blank" class="pl-3">
        <RightArrow />
        <Github width="15" class="inline fill-white" />
        github
      </a>
      <a href="https://twitter.com/taybart_" target="_blank" class="pl-3">
        <RightArrow />
        <Twitter width="15" class="inline fill-white" />
        twitter
      </a>
      <a
        href="https://linkedin.com/in/taylor-bartlett-3542609a"
        target="_blank"
        class="pl-3"
      >
        <RightArrow />
        <LinkedIn width="15" class="inline fill-white" />
        linkedin
      </a>
      <a href="https://example.com" target="_blank" class="pl-3">
        <RightArrow />
        <LinkedIn width="15" class="inline fill-white" />
        Want your dream app?
      </a>
    </div>
  </div>
</div>

<style lang="postcss">
  .resume {
    @apply mx-1 flex h-full flex-col items-start pt-20 md:mx-32;
  }

  .job {
    @apply pl-3 font-extralight;
  }
  .job .description {
    @apply pl-6 text-sm;
  }
</style>
