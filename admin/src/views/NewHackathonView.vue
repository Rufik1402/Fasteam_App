<template>
  <div class="new-hackathon-page">
    <a-page-header
        title="Создание хакатона"
        sub-title="Заполните информацию о новом хакатоне"
        @back="$router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/')">Отмена</a-button>
          <a-button
              type="primary"
              @click="handleSubmit"
              :loading="submitting"
          >
            Создать хакатон
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card style="margin-top: 24px">
      <a-form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
          @finish="handleSubmit"
      >
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item label="Название хакатона" name="name" required>
              <a-input
                  v-model:value="form.name"
                  placeholder="Например: ITAM AI Hack 2024"
                  size="large"
              />
            </a-form-item>

            <a-form-item label="Описание" name="description" required>
              <a-textarea
                  v-model:value="form.description"
                  placeholder="Опишите цели, тематику и особенности хакатона..."
                  :rows="4"
                  show-count
                  :maxlength="500"
              />
            </a-form-item>


            <a-form-item label="Даты проведения" name="dates" required>
              <a-range-picker
                  v-model:value="form.dates"
                  :show-time="{ format: 'HH:mm' }"
                  format="DD.MM.YYYY HH:mm"
                  style="width: 100%"
                  :disabled-date="disabledDate"
              />
            </a-form-item>


            <a-form-item label="Место проведения" name="location">
              <a-select
                  v-model:value="form.location"
                  placeholder="Выберите тип"
                  style="width: 100%"
              >
                <a-select-option value="online">Онлайн</a-select-option>
                <a-select-option value="offline">Оффлайн</a-select-option>
                <a-select-option value="hybrid">Гибрид</a-select-option>
              </a-select>
            </a-form-item>


            <a-form-item
                v-if="form.location === 'offline' || form.location === 'hybrid'"
                label="Адрес"
                name="address"
            >
              <a-input
                  v-model:value="form.address"
                  placeholder="Укажите адрес проведения"
              />
            </a-form-item>


            <a-form-item label="Призовой фонд" name="prize">
              <a-input
                  v-model:value="form.prize"
                  placeholder="Например: 500 000 ₽ или MacBook Pro"
                  :maxlength="100"
              />
            </a-form-item>


            <a-form-item label="Треки (направления)" name="tracks" required>
              <a-select
                  v-model:value="form.tracks"
                  mode="tags"
                  placeholder="Добавьте треки, например: AI/ML, Web3, Mobile"
                  style="width: 100%"
                  :options="trackOptions"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-card title="Настройки" size="small">
              <a-form-item label="Макс. размер команды" name="maxTeamSize">
                <a-input-number
                    v-model:value="form.maxTeamSize"
                    :min="2"
                    :max="10"
                    style="width: 100%"
                />
              </a-form-item>

              <a-form-item label="Логотип (URL)" name="image">
                <a-input
                    v-model:value="form.image"
                    placeholder="Ссылка на изображение"
                />
                <div style="margin-top: 8px">
                  <img
                      v-if="form.image"
                      :src="form.image"
                      alt="Preview"
                      style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px"
                  />
                </div>
              </a-form-item>

              <a-form-item label="Статус" name="status">
                <a-select v-model:value="form.status" style="width: 100%">
                  <a-select-option value="upcoming">Предстоящий</a-select-option>
                  <a-select-option value="active">Активный</a-select-option>
                  <a-select-option value="draft">Черновик</a-select-option>
                </a-select>
              </a-form-item>
            </a-card>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useHackathonsStore } from '../stores/hackathons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const router = useRouter()
const hackathonsStore = useHackathonsStore()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  dates: [] as Dayjs[],
  tracks: [] as string[],
  maxTeamSize: 5,
  image: '',
  status: 'upcoming' as 'upcoming' | 'active' | 'finished' | 'draft',
  participants: 0,
  teams: 0,
  location: 'online' as 'online' | 'offline' | 'hybrid',
  address: '',
  prize: ''
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true


    const newHackathon = hackathonsStore.addHackathon({
      name: form.name,
      description: form.description,
      image: form.image,
      status: form.status,
      startDate: form.dates[0].toISOString(),
      endDate: form.dates[1].toISOString(),
      tracks: form.tracks,
      maxTeamSize: form.maxTeamSize,
      location: form.location,
      address: form.address,
      prize: form.prize
    })

    message.success(`Хакатон "${newHackathon.name}" успешно создан!`)
    router.push('/')

  } catch (error) {
    console.error('Ошибка:', error)
    message.error('Ошибка при создании хакатона')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.new-hackathon-page {
  padding: 24px;
}

/* Стили для кнопок в заголовке */
:deep(.ant-page-header .ant-space .ant-btn) {
  border-radius: 12px;
  padding: 0 24px;
  height: 40px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

/* Кнопка "Отмена" */
:deep(.ant-page-header .ant-space .ant-btn:not([type="primary"])) {
  background: #ECE3F2 !important;
  border-color: #ECE3F2 !important;
  color: #291360 !important;
}

:deep(.ant-page-header .ant-space .ant-btn:not([type="primary"]):hover) {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.15);
}

/* Кнопка "Создать хакатон" */
:deep(.ant-page-header .ant-space .ant-btn[type="primary"]) {
  background: #68507E !important;
  border-color: #68507E !important;
  color: white !important;
}

:deep(.ant-page-header .ant-space .ant-btn[type="primary"]:hover) {
  background: #8156FF !important;
  border-color: #8156FF !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(129, 86, 255, 0.2);
}

/* Стили для полей формы */
:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-picker),
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector),
:deep(.ant-input-textarea .ant-input) {
  border-radius: 8px;
  border: 2px solid #D6C6E3 !important;
  transition: all 0.3s ease;
}

/* Ховер для всех полей */
:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-picker:hover),
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector:hover),
:deep(.ant-input-textarea .ant-input:hover) {
  border-color: #8156FF !important;
}

/* Фокус для всех полей */
:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-input-number:focus),
:deep(.ant-input-number-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector),
:deep(.ant-input-textarea .ant-input:focus) {
  border-color: #8156FF !important;
  box-shadow: 0 0 0 2px rgba(129, 86, 255, 0.1) !important;
}

/* Убираем синие тени Ant Design */
:deep(.ant-input-affix-wrapper-focused),
:deep(.ant-picker-focused),
:deep(.ant-select-focused .ant-select-selector) {
  box-shadow: 0 0 0 2px rgba(129, 86, 255, 0.1) !important;
}

/* Цвет текста в полях */
:deep(.ant-input),
:deep(.ant-input::placeholder),
:deep(.ant-input-number-input),
:deep(.ant-picker-input input),
:deep(.ant-select-selection-placeholder) {
  color: #291360;
}

:deep(.ant-input::placeholder),
:deep(.ant-picker-input input::placeholder),
:deep(.ant-select-selection-placeholder) {
  color: #8C7AA4;
}

/* Иконки в полях */
:deep(.ant-input-prefix),
:deep(.ant-picker-suffix),
:deep(.ant-select-arrow) {
  color: #8156FF !important;
}

/* Карточка настроек */
:deep(.ant-card) {
  border-radius: 12px;
  border: 1px solid #D6C6E3;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #D6C6E3;
}

:deep(.ant-card-head-title) {
  color: #291360;
  font-weight: 600;
}

/* Преиму логотипа */
:deep(img[alt="Preview"]) {
  border: 2px solid #D6C6E3;
  border-radius: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .new-hackathon-page {
    padding: 16px;
  }

  :deep(.ant-page-header .ant-space) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  :deep(.ant-page-header .ant-space .ant-btn) {
    width: 100%;
  }
}
</style>