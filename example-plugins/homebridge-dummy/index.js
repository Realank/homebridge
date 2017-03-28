var Service, Characteristic;

//regist accessory
module.exports = function(homebridge){
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-dummy", "Dummy", HttpDummy, true);
}

//create accessory class
function HttpDummy(log, config) {
	this.log = log;
	//realtime polling info
	this.state = false;
	this.currentlevel = 0;
}

HttpDummy.prototype = {

	//status input/output
	setPowerState: function(powerOn, callback) {
		this.state = powerOn;
		callback();
	},

	getPowerState: function(callback) {
		callback(null, this.state);
	},

	getBrightness: function(callback) {
		callback(null, this.currentlevel);
	  },

	setBrightness: function(level, callback) {

		this.currentlevel = level;
		callback();
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	//declare services
	getServices: function() {
		this.log("======get service");
		var that = this;

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
		.setCharacteristic(Characteristic.Manufacturer, "Dummy Manufacturer")
		.setCharacteristic(Characteristic.Model, "Dummy Model")
		.setCharacteristic(Characteristic.SerialNumber, "Dummy Serial Number");

		this.switchService = new Service.Switch(this.name);
		this.log("Create Switch");
		this.switchService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, that.state)})
		.on('set', this.setPowerState.bind(this));

		this.lightbulbService = new Service.Lightbulb(this.name);
		this.log("Create Light");
		this.lightbulbService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, that.state)})
		.on('set', this.setPowerState.bind(this));
		this.lightbulbService
		.addCharacteristic(new Characteristic.Brightness())
		.on('get', function(callback) {callback(null, that.currentlevel)})
		.on('set', this.setBrightness.bind(this));



		return [informationService,this.switchService, this.lightbulbService];
	}
};
