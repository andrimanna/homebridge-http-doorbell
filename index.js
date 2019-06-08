var Service;
var Characteristic;
var http = require('http');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerPlatform("homebridge-http-doorbell", "http-doorbell", HTTPDoorbell);
};

function HTTPDoorbell(log, config) {
    this.log = log;
    this.port = config.port;
    this.bells = config.doorbells;
    this.bellsAccessories = [];
    this.bellsLastRang = [];
    var self = this;
    this.server = http.createServer(function(request, response) {
        self.httpHandler(self, request.url.substring(1));
        response.end('Handled');
    });
    this.server.listen(this.port, function(){
        self.log("Doorbell server listening on: http://<your ip goes here>:%s/<doorbellId>", self.port);
    });
}

HTTPDoorbell.prototype.accessories = function (callback) {
    var foundAccessories = [];
    var count = this.bells.length;
    for (index = 0; index < count; index++) {
        var accessory = new DoorbellAccessory(this.bells[index]);
        if (accessory.doorbellId == 0) {
            accessory.doorbellId = index+1;
        }
        this.bellsAccessories[accessory.doorbellId] = accessory;
        foundAccessories.push(accessory);
    }
    callback(foundAccessories);
}

HTTPDoorbell.prototype.httpHandler = function(that, doorbellId) {
    if (that.bellsLastRang[doorbellId]) {
        var diff = new Date().getTime() - that.bellsLastRang[doorbellId];
        if (diff/1000 < 10) {
            return;
        }
    }
    that.bellsLastRang[doorbellId] = new Date().getTime();
    that.bellsAccessories[doorbellId].ring();
};

function DoorbellAccessory(config) {
    this.name = config["name"];
    this.doorbellId = config["id"] || 0;
    this.binaryState = 0;
    this.service = null;
    this.timeout = null;
}

DoorbellAccessory.prototype.getServices = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Manna Corporation")
        .setCharacteristic(Characteristic.Model, "HTTP Doorbell")
        .setCharacteristic(Characteristic.SerialNumber, this.doorbellId);
    this.service = new Service.Doorbell(this.name);
    this.service
        .getCharacteristic(Characteristic.ProgrammableSwitchEvent)
        .on('get', this.getState.bind(this));
    return [informationService, this.service];
}

DoorbellAccessory.prototype.getState = function(callback) {
    callback(null, this.binaryState > 0);
}

DoorbellAccessory.prototype.ring = function() {
    this.binaryState = !this.binaryState;
    this.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(this.binaryState == 1);
}
