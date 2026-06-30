<template>
  <div class="py-10">
    <h2 class="text-2xl font-bold mb-4">{{ data.title }}</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
      />
    </div>
  </div>
</template>

<script setup>
import {usePostStore} from "~/stores/post"
defineProps({ data: Object })

const postStore = usePostStore()
const posts = computed(() =>
    postStore.posts
)

/*onMounted(async () => {
  await postStore.fetchPosts()
})*/
</script>
