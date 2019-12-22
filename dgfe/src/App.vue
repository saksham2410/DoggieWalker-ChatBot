<template>
  <v-app id="app" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" color="primary lighten-4">
              <v-toolbar dark color="primary darken-1">
                <v-toolbar-title>Chat</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-list ref="chat" id="logs">
                  <template v-for="(item, index) in logs">
                    <v-subheader v-if="item" :key="index">{{
                      item
                    }}</v-subheader>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-form @submit.prevent="submit">
                  <v-text-field
                    v-model="msg"
                    label="Message"
                    single-line
                    solo-inverted
                  ></v-text-field>
                  <v-btn fab dark small color="primary" type="submit">
                    <v-icon dark>send</v-icon>
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data: () => ({
    baseURl: "http://localhost:3000/",
    logs: [],
    msg: null
  }),
  methods: {
    submit() {
      console.log(this.msg)
      axios.post(this.baseURl + "webhook", this.msg).then((res) => console.log(res));
      this.logs.push(this.msg);
      this.msg = "";
    }
  },
  watch: {
    logs() {
      setTimeout(() => {
        this.$refs.chat.$el.scrollTop = this.$refs.chat.$el.scrollHeight;
      }, 0);
    }
  }
};
</script>
