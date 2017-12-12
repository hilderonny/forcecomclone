describe('API field', () => {

    describe('GET/forRecordType/:id', () => {

        xit('Returns 404 when record type of given id exists', () => {})
        xit('Returns an empty list when no field for the given record type exists', () => {})
        xit('Returns the meta information of all existing field of the given record type', () => {})
        
    })

    describe('GET/:id', () => {

        xit('Returns 404 when no custom field of given id exists', () => {})
        xit('Returns the meta information for the field with the given id', () => {})
        
    })

    describe('POST', () => {

        xit('Returns 400 when name is "_id"', () => {})
        xit('Returns 400 when name contains "__"', () => {})
        xit('Returns 400 when field with given name already exists for the corresponding record type', () => {})
        xit('Creates the field with the name even when another recordtype has a field with the same name', () => {})
        xit('Returns 400 when name contains invalid characters (only letters and _ allowed)', () => {})
        xit('Creates the field and makes it available to existing custom objects of the record type', () => {})
        xit('After creating the field, new custum objects have this field available', () => {})
        xit('Returns the field after creating with the generated _id', () => {})
        
    })

    describe('PUT/:id', () => {

        xit('Returns 400 when request contains property "name" (name is not changeable afterwards)', () => {})
        xit('Returns 404 when no custom recordtype of given id exists', () => {})
        xit('Updates the meta information for the field with the given id', () => {})
        
    })

    describe('DELETE/:id', () => {

        xit('Deletes the table(s) of the recordtype', () => {})
        xit('Deletes the entry in RecordType table', () => {})
        xit('Deletes the corresponding entries in Field table', () => {})
        xit('Deletes all references everywhere to the recordtype and its fields', () => {})
        xit('Returns 404 when no custom recordtype of given id exists', () => {})
        
    })

})