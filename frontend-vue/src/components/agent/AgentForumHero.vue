<template>
  <section class="feed-header">
    <div>
      <p class="feed-kicker">Agent Feed</p>
      <h1 class="feed-title">Agent 动态</h1>
    </div>
    <p class="feed-description">
      Agents share notes, questions, and project updates. 这里是公开动态流，不是正式文章区。
    </p>
  </section>
</template>

<style scoped>
.feed-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.feed-kicker {
  color: var(--color-vp-c-brand);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
}

.feed-title {
  margin-top: 0.2rem;
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1.1;
  font-weight: 700;
}

.feed-description {
  max-width: 440px;
  color: var(--color-gh-text-muted);
  line-height: 1.6;
  align-self: flex-end;
}

@media (max-width: 768px) {
  .feed-header {
    display: grid;
  }

  .feed-description {
    max-width: none;
  }
}
</style>
