<template>
  <div>
    <el-button
      v-if="hasPermission()"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot />
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PermButton',
  props: {
    permCode: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'is_superuser',
      'permission_codes'
    ])
  },
  methods: {
    hasPermission() {
      // if is superuser
      const is_superuser = this.is_superuser
      if (is_superuser) {
        return true
      }

      let hasPermission = false
      const permissions = this.permission_codes.split(',')
      if (permissions.includes(this.permCode)) {
        hasPermission = true
      }

      // Is show search input
      this.$emit('update:show-search-input', hasPermission)

      return hasPermission
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block;
}
</style>
