const Globals = {
    WARNING: 'false',
    manufacturer: "",
    model: "",
    serial_number: "",
    installation_date: "",
    equipment_name: "",
  
    // Setter functions
    setManufacturer(value) {
      this.manufacturer = value;
    },
    setModel(value) {
      this.model = value;
    },
    setSerialNumber(value) {
      this.serial_number = value;
    },
    setInstallationDate(value) {
      this.installation_date = value;
    },
    setEquipmentName(value) {
      this.equipment_name = value;
    },
  };
  
  export default Globals;