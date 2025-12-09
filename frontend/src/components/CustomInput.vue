<template>
  <div class="custom-input-wrapper">
    <div class="input-label-container">
      <span class="input-label" v-html="labelText"></span>
    </div>
    <input 
      :placeholder="placeholder" 
      type="text" 
      name="text" 
      class="input"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    placeholder: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    value: {
      type: String,
      default: ''
    },
  },
  emits: ['input'],
  computed: {
    labelText() {
      return this.label || '';
    }
  },
  data() {
    return {
    };
  }
};
</script>

<style scoped>
/* ========== ЕДИНЫЙ РЕЗИНОВЫЙ МАКЕТ ========== */
.custom-input-wrapper {
  align-self: stretch;
  height: auto;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;
}

.input-label-container {
  align-self: stretch;
  height: auto;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  max-width: 328px;
  margin: 0 auto;
}

.input-label {
  color: white;
  font-size: 20px;
  font-family: 'Muller', sans-serif;
  font-weight: 300;
  line-height: 19px;
  letter-spacing: 0.40px;
  word-wrap: break-word;
  text-align: center;
  margin: 0;
  padding: 0;
}

:deep(b),
:deep(strong) {
  font-weight: 600;
}

:deep(i),
:deep(em) {
  font-style: italic;
  font-weight: 500;
}

:deep(u) {
  text-decoration: underline;
}

/* ========== INPUT С ФИКСИРОВАННЫМ MAX-WIDTH ========== */
.input {
  width: 90vw;
  max-width: 328px;
  height: 42px;
  padding: 7px 10px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
  overflow: hidden;
  border-radius: 12px;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Muller', sans-serif;
  font-weight: 250;
  line-height: 16px;
  letter-spacing: 0.40px;
  color: #000;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-sizing: border-box;
  margin: 0 auto;
}

.input::placeholder {
  color: #999999;
  font-size: 16px;
  font-family: 'Muller', sans-serif;
  font-weight: 250;
  line-height: 16px;
  letter-spacing: 0.40px;
}

.input:hover {
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.12);
}

.input:focus {
  outline: 2px solid #00926E;
  outline-offset: 0px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);
}
</style>