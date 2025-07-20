<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const db = useFirestore();
const userStore = useUserStore();
const { user, userData } = storeToRefs(userStore);

const prenom = ref(userData.value?.util_prenom || "");
const nom = ref(userData.value?.util_nom || "");

const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

const handleSave = async () => {
  if (!user.value) return;
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const docRef = doc(db, "users", user.value.uid);
    await updateDoc(docRef, {
      util_prenom: prenom.value,
      util_nom: nom.value,
    });
    success.value = true;
    userStore.init();
  } catch (e: any) {
    error.value = e.message || "Erreur lors de la mise à jour";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="profile-wrapper">
    <Card class="profile-card">
      <template #title>
        <div class="header">
          <Avatar
            icon="pi pi-user-edit"
            shape="circle"
            class="avatar"
            size="xlarge"
          />
          <div>
            <h2>Éditer le profil</h2>
            <p class="uid">ID : {{ user?.uid }}</p>
          </div>
        </div>
      </template>

      <template #content>
        <div class="form">
          <div class="field">
            <label for="prenom">Prénom</label>
            <InputText id="prenom" v-model="prenom" class="input" />
          </div>

          <div class="field">
            <label for="nom">Nom</label>
            <InputText id="nom" v-model="nom" class="input" />
          </div>

          <div class="buttons">
            <Button
              label="Annuler"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="() => router.push('/profile')"
            />
            <Button
              label="Enregistrer"
              icon="pi pi-save"
              :loading="loading"
              class="p-button-primary"
              @click="handleSave"
            />
          </div>

          <p v-if="success" class="success">Profil mis à jour avec succès.</p>
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.profile-wrapper {
  max-width: 600px;
  margin: 4rem auto;
  padding: 1rem;
}

.profile-card {
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  background-color: var(--primary-color);
  color: white;
}

.uid {
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.25rem;
}

.form {
  margin-top: 1rem;
}

.field {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input {
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.success {
  margin-top: 1rem;
  color: green;
}

.error {
  margin-top: 1rem;
  color: red;
}
</style>
