/**
 * Created by abenaicha on 04/11/15.
 */

services
  .factory('UserService', function($cookieStore) {

      var user = {
        getUserInfos : function() {
            return $cookieStore.get('connexion');
          },

        isAuthenticated : function() {
          var cnx = this.getUserInfos();
          if (cnx && cnx.etat) {
            return true;
          }
          return false;
        }
      };

    return user;
  });
