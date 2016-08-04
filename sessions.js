/**
 * Created by ska on 8/4/16.
 */
function SomeSessionsManager(){
  var self = this;
  self.sessions = {};
  self.set = function(token, item, val){
    var env = self.sessions[token];
    if (!env) {
      env = {
        data: {}
      };
      self.sessions[token] = env;
    }
    env.data[item] = val;
    env.access = Date.now()
  };
  self.get = function(token){
    var env = self.sessions[token];
    if (env) {
      env.access = Date.now();
    }
    return (env||{}).data;
  };

  //some GC logic here
}

module.exports = SomeSessionsManager;