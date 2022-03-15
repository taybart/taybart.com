<script lang="ts">
  import RightArrow from '../components/atoms/right-arrow.svelte'
  import Github from '../assets/github.svg'
  import Twitter from '../assets/twitter.svg'
  import LinkedIn from '../assets/linkedin.svg'
</script>

<div class="resume">
  <div>
    <p class="font-thin">my journey so far</p>
    <!-- <ul class="jobs"> -->
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
    <!-- </ul> -->
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
    </div>
  </div>
  <!--
    <b>things i know well</b>
    <ul>
      <li>language</li>
      <ul>
        <li>go</li>
        <li>js/node</li>
        <li>c</li>
        <li>kotlin</li>
      </ul>
      <li>web frameworks</li>
      <ul>
        <li>react</li>
        <li>svelte</li>
      </ul>
      <li>ops</li>
      <ul>
        <li>linux</li>
        <li>docker</li>
        <li>k8s</li>
        <li>aws</li>
        <li>gcp</li>
      </ul>
    </ul>

    <b>things i made</b>
    <ul>
      <li>
        <a href="https://github.com/taybart/fm">fm</a>
      </li>
      <li>
        <a href="https://github.com/taybart/rest">rest</a>
      </li>
      <li>
        <a href="https://github.com/taybart/log">log</a>
      </li>
      <li>
        <a href="/hn">my hacker news</a>
      </li>
    </ul>
    <b>things i used professionally/know that i think are sub-par</b>
    <ul>
      <li>python</li>
      <li>opc-ua</li>
      <li>jquery</li>
      <li />
    </ul>
 -->
</div>

<style lang="postcss">
  .resume {
    @apply mx-1 flex h-full flex-col items-start pt-20 md:mx-32;
  }
  /* .resume li { */
  /*   @apply pl-3; */
  /* } */

  .job {
    @apply pl-3 font-extralight;
    /* @apply list-none; */
  }
  .job .description {
    @apply pl-6 text-sm;
  }
</style>
