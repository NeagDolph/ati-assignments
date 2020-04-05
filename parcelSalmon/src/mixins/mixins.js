import axios from 'axios';
import Vue from "vue";
import { apiurl } from "../js/globals.js";
import { app } from '../main.js';

Vue.mixin({
    methods: {
      userEditEnrolled(userid, userclasses, idx, userindex) {
        // Flip selected class index
        let flippedclasses = userclasses.split("")
        flippedclasses[idx] = flippedclasses[idx] == "1" ? "0" : "1"
        flippedclasses = flippedclasses.join("")
        
        // Create a temp sharedData, modify it and set the app.sharedData as the temp one
        let tempShared = app.sharedData
        tempShared.adminusers[userindex].studentclasses = flippedclasses
        app.sharedData = tempShared

        // Send class change to server
        axios
          .post(apiurl.enrolledClasses, { class: idx, userid: userid, new: flippedclasses[idx] })
          .then(() => {
            axios.post(apiurl.data);
          })
          .catch(error => {
            let tempShared = app.sharedData
            tempShared.adminusers[userindex].studentclasses = userclasses
            app.sharedData = tempShared
          });
      },
      addTeacher(email, classes, update, callback) {
        axios
        .post(apiurl.addTeacher, { email: email, classes: classes, update: update })
        .then(res => {
          callback(res)
        })
      },
      usereditmodal(state, user=false) {
        app.editState = state;
        if (user) app.editSelect = user
      },
      editUserClasses(user, idx, userindex) {
      //User = object with userid and classes
      //Idx = index of class to be changed
      //User = Index of user in userlist

        // Flip selected class index
        let classes = user.classes.split("")
        classes[idx] = classes[idx] == "1" ? "0" : "1"
        classes = classes.join("")
        
        // Create a temp sharedData, modify it and set the app.sharedData as the temp one
        let tempShared = app.sharedData
        tempShared.userlist[userindex].classes = classes
        app.sharedData = tempShared

        // Send class change to server
        axios
          .post(apiurl.classes, { class: idx, userid: user.userid, new: classes[idx] })
          .then(() => {
            axios.post(apiurl.data);
          })
          .catch(error => {
            console.log("EY", user.classes, userindex)
            let classes = user.classes.split("")
            classes[idx] = classes[idx] == "1" ? "0" : "1"
            classes = classes.join("")

            let userlist = app.sharedData.userlist
            userlist[userindex].classes = classes
            app.$set(app.sharedData, 'userlist', userlist)
          });
      },
      addComment(user, idx, usercomment) {
        let tempShared = app.sharedData
        let oldcomment = tempShared.userlist[user.index].comments[idx]
        tempShared.userlist[user.index].comments[idx] = usercomment
        app.sharedData = tempShared

        axios.post(apiurl.comment, { class: idx, userid: user.userid, comment: usercomment})
        .catch(e => {
          let tempShared = app.sharedData
          tempShared.userlist[user.index].comments[idx] = oldcomment
          app.sharedData = tempShared
        })
      },
      requestComment(user, idx) {
        axios
          .post(apiurl.getcomment, { class: idx, userid: user.userid })
          .then((data) => {
            return "PEE"
            // return data
          })
          .catch((e) => {
            console.log("Error requesting comment", e)
          })
      },
      setGlobal(area, val) {
        app.$set(app.global, area, val)
      }
    }
})