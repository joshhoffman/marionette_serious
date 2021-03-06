ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
    Entities.Contact = Entities.BaseModel.extend({
        urlRoot: "contacts",

        defaults: {
            firstName: "",
            lastName: "",
            phoneNumber: ""
        },

        validate: function(attrs, options) {
            var errors = {}
            if (! attrs.firstName) {
                errors.firstName = "can't be blank";
            }
            if (! attrs.lastName) {
                errors.lastName = "can't be blank";
            }
            else{
                if (attrs.lastName.length < 2) {
                    errors.lastName = "is too short";
                }
            }
            if( ! _.isEmpty(errors)){
                return errors;
            }
        },

        sync: function (method, model, options) {
            console.log('contact sync called');

            return Entities.BaseModel.prototype.sync.call(this, method, model, options);
        },

        parse: function(response) {
            var data = response;
            if(response && response.contact) {
                data = data.contact;
            }
            data.fullName = data.firstName + " " + data.lastName;
            return data;
        }
    });

    Entities.ContactCollection = Backbone.Collection.extend({
        url: "contacts",
        model: Entities.Contact,
        comparator: "firstName"
    });

    var API = {
        getContactEntities: function() {
            var contacts = new Entities.ContactCollection();
            var defer = $.Deferred();
            contacts.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        },

        getContactEntity: function(contactId){
            var contact = new Entities.Contact({id: contactId});
            var defer = $.Deferred();
            contact.fetch({
                success: function(data){
                    defer.resolve(data);
                },
                error: function(data){
                    defer.resolve(undefined);
                }
            });
            return defer.promise();
        }
    };

    ContactManager.reqres.setHandler("contact:entities", function(){
        return API.getContactEntities();
    });

    ContactManager.reqres.setHandler("contact:entity", function(id){
        return API.getContactEntity(id);
    });
});
