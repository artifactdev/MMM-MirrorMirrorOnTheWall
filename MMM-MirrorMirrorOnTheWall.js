/* global Module */

/* Magic Mirror
 * Module: MMM-MirrorMirrorOnTheWall
 *
 *
 * MIT Licensed.
 */

Module.register('MMM-MirrorMirrorOnTheWall', {

  defaults: {},

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.clear = false
    this.sendSocketNotification('ALEXA_START', {});
  },

  getStyles: function() {
    return [
      "MMM-MirrorMirrorOnTheWall.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
    ]
  },

  // Override socket notification handler.
  socketNotificationReceived: function(notification, payload) {
    Log.info(this.name + "received a socket notification:\n" + notification);

    if (notification === "RESULT") {
      this.clear = false
      this.result = payload;
      this.updateDom()
      this.show(1000, function() {
        Log.log(this.name + ' is shown.');
      });
    } else if (notification === "MODULE") {
      let self = this
      MM.getModules().enumerate(function(module) {
        if (module.name === payload.moduleName || payload.moduleName === "all_modules") {
          if (payload.turnOn) {
            if (module.name === self.name) {
              self.clear = false
              self.updateDom();
            }
            module.show(1000, function() {
              Log.log(module.name + ' is shown.');
            });
          } else {
            if (module.name === self.name) {
              self.clear = true
              self.updateDom();
            }
            module.hide(1000, function() {
              Log.log(module.name + ' is hidden.');
            });
          }
        }
      });
    }
  },

  getDom: function() {
    wrapper = document.createElement("div");
    wrapper.className = 'thin large bright';

    return wrapper;
  }
});
