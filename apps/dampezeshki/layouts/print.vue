<template>
  <div class="print-layout">
    <slot />
  </div>
</template>

<style scoped>
.print-layout {
  background: white;
  min-height: 100vh;
}

@media print {
  .print-layout {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
  }
  
  /* Hide all possible navigation elements */
  nav, header, footer, .navbar, .sidebar, .menu, .navigation {
    display: none !important;
  }
  
  /* Ensure clean print */
  * {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
</style>