angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Dub letní',
    lastText: 'Quercus robur',
    face: 'img/dub.jpg'
  }, {
    id: 1,
    name: 'Javor klen',
    lastText: 'Acer pseudoplatanus',
    face: 'img/javor.jpg'
  }, {
    id: 2,
    name: 'Olše lepkavá',
    lastText: 'Alnus glutinosa',
    face: 'img/olse.jpg'
  }, {
    id: 3,
    name: 'Jabloň domácí',
    lastText: 'Malus domestica',
    face: 'img/jablon.jpg'
  }, {
    id: 4,
    name: 'Buk lesní',
    lastText: 'Fagus sylvatica',
    face: 'img/buk.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
