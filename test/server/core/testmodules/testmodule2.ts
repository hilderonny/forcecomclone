import { Type } from '../../type'
import { Module } from '../../module'

class TestModule2 extends Type {}

export default Module.create((app) => {

    app.registerApi(TestModule2)

})
