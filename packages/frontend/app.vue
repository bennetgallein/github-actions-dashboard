<template>
  <div>
    <div class="header pt-15 bg-[#081a4a]">
      <div class="container mx-auto">
        <h1 class="text-4xl pb-15 font-black text-white text-dark">
          GH-Actions Overview
        </h1>
      </div>
    </div>
    <div class="container mx-auto grid grid-cols-1 -mt-10">
      <div v-for="(k, i) in workflows" :key="i">
        <div
          class="border-2 border-gray-100 border-b-12 shadow-2xl rounded-xl p-3 my-3 bg-gray-50"
          :class="{
            'border-b-green-500':
              k.status == 'completed' && k.conclusion == 'success',
            'border-b-sky-500': k.status == 'in_progress',
            'border-b-red-500':
              k.status == 'completed' && k.conclusion == 'failure',
          }"
        >
          <div class="row">
            <div class="inline">
              <Checkmark
                class="text-green-500 -mb-1.5"
                v-if="k.status == 'completed' && k.conclusion == 'success'"
              />
              <Spinner
                class="text-sky-500 animate-spin -mb-1.5"
                v-if="k.status == 'in_progress'"
              />
              <Cross
                class="text-red-500 -mb-1.5"
                v-if="k.status == 'completed' && k.conclusion == 'failure'"
              />
            </div>

            <NuxtLink class="ml-2 hover:underline cursor-pointer" :to="k.url">
              <span class="font-bold">{{ k.repo }}</span> - {{ k.job }}
            </NuxtLink>
            <small class="float-right text-sm">
              {{ k.createdAt.toLocaleString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto mt-10 text-sm">
      <p class="">Legend:</p>
      <p><Checkmark class="text-green-500 -mb-1" /> Successfully finished</p>
      <p><Cross class="text-red-500 -mb-1" /> Finished with Errors</p>
      <p>
        <Spinner class="text-sky-500 animate-spin -mb-1" /> Still running or
        queued
      </p>
      <p>Hint: click on the name to open the run in a new tab.</p>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";

import Checkmark from "~icons/ant-design/check-circle-outlined";
import Spinner from "~icons/icomoon-free/spinner10";
import Cross from "~icons/charm/circle-cross";

const runtimeConfig = useRuntimeConfig();
const events = ref([]);

const workflows = computed(() => {
  // resort events based on the following rules:
  // events that finished with errors should be at the top
  // events that are still running should appear below that
  // events that are finished without errors can go to the bottom
  let failed = events.value.filter(
    (e) => e.conclusion == "failure" && e.status == "completed"
  );
  let running = events.value.filter((e) => e.status == "in_progress");
  let success = events.value.filter(
    (e) => e.conclusion == "success" && e.status == "completed"
  );

  failed = failed.sort((a, b) => {
    console.log(new Date(a.createdAt));
    return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime();
  });
  running = running.sort((a, b) => {
    return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime();
  });
  success = success.sort((a, b) => {
    return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime();
  });

  return [...failed, ...running, ...success];
});

const socket = io(runtimeConfig.public.BACKEND_HOST, {
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("connected");
});

socket.on("message", (payloadArray) => {
  // find if we have this id alread in events, if not - add it, otherwise update
  if (Array.isArray(payloadArray)) {
    payloadArray.map((payload) => {
      const ent = events.value.filter((e) => e.id == payload.id);
      if (ent.length == 0) {
        events.value.push(payload);
      } else {
        ent[0].status = payload.status;
      }
    });
  }
});
</script>
