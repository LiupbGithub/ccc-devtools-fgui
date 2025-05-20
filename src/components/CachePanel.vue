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
        <el-table-column prop="size" label="Size" sortable></el-table-column>
        <el-table-column label="Preview" width="120">
          <template #default="scope">
            <div v-if="isImageAsset(scope.row)" class="image-preview-container">
              <img :src="getImageUrl(scope.row)" class="image-preview" />
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
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
const filterType = ref('texture');

watch(() => props.show, (newValue) => {
  if (newValue) {
    // @ts-ignore
    cacheData.value = cc.cache().all;
  }
});

const filteredCacheData = computed(() => {
  if (filterType.value === 'all') {
    return cacheData.value.filter(item => item.assetBundle !='总计');
  } else if (filterType.value === 'texture') {
    return cacheData.value.filter(item => item.type === 'cc.ImageAsset' && item.assetBundle !='总计');
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

// 判断是否为图片资源
function isImageAsset(item: any) {
  return item && (item.type === 'cc.ImageAsset');
}

// 获取图片URL
function getImageUrl(item: any) {
  try {
    // @ts-ignore
    const cc = window['cc'];
    if (!cc || !item) return '';
    
    // 尝试获取纹理资源
    const texture = item.type === 'cc.ImageAsset' ? 
      cc.assetManager.assets.get(item.id) : 
      item;
      
    if (texture && texture._nativeData) {
      return texture._nativeData.currentSrc;
    }
    return '';
  } catch (e) {
    console.error('获取图片URL失败:', e);
    return '';
  }
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

.image-preview-container {
  width: 100px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>