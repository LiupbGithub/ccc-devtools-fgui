<template>
  <el-dialog v-model="computedShow" title="Cache Content" width="80%" class="cache-panel-dialog">
    <div class="filter-container">
      <el-select v-model="filterType" placeholder="Select filter">
        <el-option label="All" value="all"></el-option>
        <el-option label="Texture" value="texture"></el-option>
      </el-select>
    </div>
    <div class="table-container">
      <el-table 
        :data="filteredCacheData" 
        style="width: 100%" 
        height="calc(100vh - 250px)" 
        :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
      >
        <el-table-column prop="assetBundle" label="Asset Bundle" fixed></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
        <el-table-column prop="format" label="Format"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="size" label="Size"></el-table-column>
      </el-table>
    </div>
    <div class="summary-container">
      <span>总计: {{ filteredCacheData.length }} 项</span>
      <span>总大小: {{ getTotalSize() }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="computedShow = false">Close</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['update:show']);

const computedShow = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  },
});

const cacheData = ref<any[]>([]);
const filterType = ref('all');

watch(() => props.show, (newValue) => {
  if (newValue) {
    // @ts-ignore
    cacheData.value = cc.cache().all;
  }
});

const filteredCacheData = computed(() => {
  if (filterType.value === 'all') {
    return cacheData.value;
  } else if (filterType.value === 'texture') {
    return cacheData.value.filter(item => item.type === 'cc.ImageAsset');
  }
  return [];
});

function getTotalSize() {
  let total = 0;
  let last = cacheData.value[cacheData.value.length-1];
  return last.size;
//   filteredCacheData.value.forEach(item => {
//     if (item.size) {
//       total += parseInt(item.size);
//     }
//   });
  
//   // 转换为更易读的格式 (KB, MB)
//   if (total < 1024) {
//     return total + ' B';
//   } else if (total < 1024 * 1024) {
//     return (total / 1024).toFixed(2) + ' KB';
//   } else {
//     return (total / (1024 * 1024)).toFixed(2) + ' MB';
//   }
}
</script>

<style scoped>
.cache-panel-dialog :deep(.el-dialog__body) {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  height: calc(100vh - 200px);
  overflow: hidden;
}

.filter-container {
  margin-bottom: 10px;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.summary-container {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-weight: bold;
  border-top: 1px solid #EBEEF5;
  margin-top: 10px;
}
</style>