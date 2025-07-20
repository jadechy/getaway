<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const { user, userData } = storeToRefs(userStore);
const router = useRouter();
const handleLogout = async () => {
  await userStore.logout();
  router.push("/");
};
</script>

<template>
  <div class="profile-wrapper">
    <Card v-if="user" class="profile-card">
      <template #title>
        <div class="header">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            class="avatar"
            size="xlarge"
          />
          <div>
            <h2>
              {{ userData?.util_prenom }}
              {{ userData?.util_nom }}
              <br />
              <small>{{ user.email }}</small>
            </h2>
            <p class="uid">ID : {{ user.uid }}</p>
          </div>
        </div>
      </template>

      <template #content>
        <div class="info">
          <p>
            <strong>Email vérifié :</strong>
            {{ user.emailVerified ? "Oui" : "Non" }}
          </p>
          <p><strong>Créé le :</strong> {{ user.metadata?.creationTime }}</p>
          <p>
            <strong>Dernière connexion :</strong>
            {{ user.metadata?.lastSignInTime }}
          </p>
        </div>

        <div class="action-buttons">
          <Button
            label="Éditer le profil"
            icon="pi pi-pencil"
            class="p-button-secondary"
            @click="() => router.push('/profile/edit')"
          />
          <Button
            label="Se déconnecter"
            icon="pi pi-sign-out"
            severity="danger"
            @click="handleLogout"
          />
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

.info {
  margin-top: 1rem;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
