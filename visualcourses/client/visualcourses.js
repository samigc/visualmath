Template.sidebar.events({
        'click': function(e){
                console.log(e.target.innerHTML);
                divtext = e.target.innerHTML;
                document.getElementById("statebar").innerHTML = divtext;
                Session.set("divselected",divtext);
        }
});

Template.center.helpers({
        linear : function(){
                return Session.get("divselected")=="Linearity";
        },
        vecadd : function(){
                return Session.get("divselected")=="Vector Addition";
        },
        vecsub : function(){
                return Session.get("divselected")=="Vector Substraction";
        },
        matrix : function(){
                return Session.get("divselected")=="Matrix";
        },
        matadd : function(){
                return Session.get("divselected")=="Matrix Addition";
        },
        matmul : function(){
                return Session.get("divselected")=="Matrix Multiplication";
        },
        matpro : function(){
                return Session.get("divselected")=="Matrix Properties";
        },
        matrot : function(){
                return Session.get("divselected")=="Rotation";
        },
        matsca : function(){
                return Session.get("divselected")=="Scaling";
        },
        matref : function(){
                return Session.get("divselected")=="Reflection";
        },
        matshe : function(){
                return Session.get("divselected")=="Shearing";
        },
        mattra : function(){
                return Session.get("divselected")=="Translation";
        },
        matproj : function(){
                return Session.get("divselected")=="Projection";
        }
});
