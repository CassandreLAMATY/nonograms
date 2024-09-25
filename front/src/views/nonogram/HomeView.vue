<template>
  <main>
    <section>
      <img src="@/assets/img/games/nonogram/logo.svg" alt="Just Another Nonogram Game" />

      <menu>
        <div>
          <button>
            <router-link to="/nonogram/play">Play</router-link>
          </button>
          <button>
            <router-link to="/nonogram/quests">Quests</router-link>
          </button>
          <button>
            <router-link to="/nonogram/create">My space</router-link>
          </button>
          <button>
            <router-link to="/nonogram/workshop">Workshop</router-link>
          </button>
        </div>

        <div>
          <button aria-label="Settings">
            <font-awesome-icon :icon="['fas', 'gear']" />
          </button>
          <button aria-label="Achievements">
            <router-link to="/nonogram/achievements">
              <font-awesome-icon :icon="['fas', 'medal']" />
            </router-link>
          </button>
          <button aria-label="Exit">
            <router-link to="/">
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
            </router-link>
          </button>
        </div>
      </menu>
    </section>

    <aside>
      <button aria-label="Toggle Music">
        <font-awesome-icon :icon="['fas', 'music']" />
      </button>
      <button aria-label="Toggle Sound">
        <font-awesome-icon :icon="['fas', 'volume']" />
      </button>
      <button aria-label="Informations">
        <font-awesome-icon :icon="['fas', 'info']" />
      </button>
    </aside>
  </main>
</template>
