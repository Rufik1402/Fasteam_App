<template>
  <div class="edit-hackathon-page">
    <a-page-header
        :title="`Редактирование: ${form.name || 'Хакатон'}`"
        sub-title="Измените информацию о хакатоне"
        @back="$router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="cancel">Отмена</a-button>
          <a-button
              type="dashed"
              danger
              @click="showDeleteConfirm"
              style="background-color: blueviolet"
          >
            Удалить
          </a-button>
          <a-button
              type="primary"
              @click="handleSubmit"
              :loading="submitting"
          >
            Сохранить изменения
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

            <a-form-item label="Треки (направления)" name="tracks" :required="true">
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
                  <a-select-option value="draft">Черновик</a-select-option>
                  <a-select-option value="upcoming">Предстоящий</a-select-option>
                  <a-select-option value="active">Идет сейчас</a-select-option>
                  <a-select-option value="finished">Завершен</a-select-option>
                </a-select>
              </a-form-item>


              <a-divider />
              <div style="color: #666; font-size: 12px">
                <p><strong>ID:</strong> {{ hackathonId }}</p>
                <p><strong>Создан:</strong> {{ formatDate(createdAt) }}</p>
                <p><strong>Участников:</strong> {{ form.participants || 0 }}</p>
                <p><strong>Команд:</strong> {{ form.teams || 0 }}</p>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useHackathonsStore } from '../stores/hackathons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const hackathonsStore = useHackathonsStore()
const formRef = ref()
const submitting = ref(false)


const hackathonId = route.params.id as string


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


onMounted(() => {
  loadHackathonData()
})

const loadHackathonData = async () => {
  try {
    const hackathon = await hackathonsStore.fetchHackathon(hackathonId)

    if (!hackathon) {
      message.error('Хакатон не найден')
      router.push('/')
      return
    }

    form.name = hackathon.name
    form.description = hackathon.description
    form.image = hackathon.image || ''
    form.status = hackathon.status
    form.maxTeamSize = hackathon.maxTeamSize || 5
    form.tracks = [...hackathon.tracks]
    form.participants = hackathon.participants
    form.teams = hackathon.teams
    form.location = hackathon.location || 'online'
    form.address = hackathon.address || ''
    form.prize = hackathon.prize || ''

    if (hackathon.startDate && hackathon.endDate) {
      form.dates = [
        dayjs(hackathon.startDate),
        dayjs(hackathon.endDate)
      ]
    }
  } catch (error) {
    message.error('Ошибка при загрузке хакатона')
    router.push('/')
  }
}


const rules = {
  name: [
    { required: true, message: 'Введите название хакатона' },
    { min: 3, message: 'Минимум 3 символа' }
  ],
  description: [
    { required: true, message: 'Введите описание хакатона' },
    { min: 50, message: 'Минимум 50 символов' }
  ],
  dates: [
    { required: true, message: 'Выберите даты проведения' }
  ],
  tracks: [
    { required: true, message: 'Добавьте хотя бы один трек' }
  ]
}

const trackOptions = [
  { label: 'AI/ML', value: 'AI/ML' },
  { label: 'Web3/Blockchain', value: 'Web3/Blockchain' },
  { label: 'Mobile', value: 'Mobile' },
  { label: 'Web', value: 'Web' },
  { label: 'DevOps', value: 'DevOps' },
  { label: 'UI/UX Design', value: 'UI/UX Design' }
]

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU')
}


const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true

    if (!form.dates || form.dates.length !== 2) {
      throw new Error('Выберите даты проведения')
    }

    await hackathonsStore.updateHackathon(hackathonId, {
      name: form.name,
      description: form.description,
      image: form.image,
      status: form.status,
      startDate: form.dates[0].toISOString(),
      endDate: form.dates[1].toISOString(),
      tracks: form.tracks,
      maxTeamSize: form.maxTeamSize,
      participants: form.participants,
      teams: form.teams,
      location: form.location,
      address: form.address,
      prize: form.prize
    })

    message.success('Хакатон успешно обновлен!')
    router.push('/')

  } catch (error) {
    console.error('Ошибка:', error)
    message.error('Ошибка при обновлении хакатона')
  } finally {
    submitting.value = false
  }
}


const showDeleteConfirm = () => {
  Modal.confirm({
    title: 'Удалить хакатон?',
    content: `Вы уверены, что хотите удалить "${form.name}"? Это действие нельзя отменить.`,
    okText: 'Удалить',
    okType: 'danger',
    cancelText: 'Отмена',
    onOk: deleteHackathon
  })
}

const deleteHackathon = async () => {
  try {
    await hackathonsStore.deleteHackathon(hackathonId)
    message.success('Хакатон удален')
    router.push('/')
  } catch (error) {
    message.error('Ошибка при удалении')
  }
}

const cancel = () => {
  router.push('/')
}
</script>

<style scoped>
.edit-hackathon-page {
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
:deep(.ant-page-header .ant-space .ant-btn:not([type="primary"]):not([type="dashed"])) {
  background: #ECE3F2 !important;
  border-color: #ECE3F2 !important;
  color: #291360 !important;
}

:deep(.ant-page-header .ant-space .ant-btn:not([type="primary"]):not([type="dashed"]):hover) {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 19, 96, 0.15);
}

/* Кнопка "Удалить" */
:deep(.ant-page-header .ant-space .ant-btn[type="dashed"]) {
  background: rgba(255, 77, 79, 0.1) !important;
  border-color: rgba(255, 77, 79, 0.3) !important;
  color: #ff4d4f !important;
  border-style: solid !important;
}

:deep(.ant-page-header .ant-space .ant-btn[type="dashed"]:hover) {
  background: rgba(255, 77, 79, 0.2) !important;
  border-color: #ff4d4f !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);
}

/* Кнопка "Сохранить изменения" */
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

/* Стили для полей формы (те же что в создании) */
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

/* Разделитель */
:deep(.ant-divider) {
  border-color: #D6C6E3;
}

/* Статистика внизу */
div[style*="color: #666"] {
  color: #666;
  font-size: 12px;
  line-height: 1.5;
}

div[style*="color: #666"] p {
  margin: 4px 0;
}

/* Преиму логотипа */
:deep(img[alt="Preview"]) {
  border: 2px solid #D6C6E3;
  border-radius: 8px;
}

/* Модальное окно подтверждения удаления */
:deep(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn) {
  border-radius: 8px;
  border: 2px solid transparent;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn:first-child) {
  background: #ECE3F2 !important;
  border-color: #ECE3F2 !important;
  color: #291360 !important;
}

:deep(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn:first-child:hover) {
  background: #D6C6E3 !important;
  border-color: #D6C6E3 !important;
}

:deep(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-danger) {
  background: rgba(255, 77, 79, 0.1) !important;
  border-color: rgba(255, 77, 79, 0.3) !important;
  color: #ff4d4f !important;
}

:deep(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-danger:hover) {
  background: rgba(255, 77, 79, 0.2) !important;
  border-color: #ff4d4f !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .edit-hackathon-page {
    padding: 16px;
  }

  :deep(.ant-page-header .ant-space) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  :deep(.ant-page-header .ant-space .ant-btn) {
    width: 100%;
    margin-top: 8px;
  }

  :deep(.ant-col) {
    width: 100%;
  }
}
</style>