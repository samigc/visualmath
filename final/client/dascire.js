Template.navbarlogin.events({
  "click .logout": function(event) {
    AccountsTemplates.logout();
    return false;
  }
});
Template.navbarlogin.helpers({
  email : function(){
    var mails = this.emails;
    var first = mails[0].address;
    return first;
  }
});

Meteor.startup(function () {
  T9n.setLanguage('es_ES');
});

Template.sitemenu.rendered = function(){
        setTimeout(function(){
                var vmlogo = $('#vmsvg').get(0).contentDocument.querySelectorAll("path")
                $(vmlogo).css("fill","white")
}, 300);



}
